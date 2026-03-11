import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ─────────────────────────────────────────────────────────────────────────────
// KEYCAP → TEXTURE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────
// KEYCAP CONFIG — one entry per tech-stack key in your .glb
//
//  tex   — PNG path relative to /src/assets
//  color — hex colour of the keycap body (sides + face). 0xffffff = white.
//  flipY — true  if the logo appears upside-down (common in Blender exports)
//
// To find mesh names: model.traverse(c => console.log(c.name))
// ─────────────────────────────────────────────────────────────────────────────
interface KeycapConfig { tex: string; color: number; flipY: boolean; }

const KEYCAP_TEXTURE_MAP: Record<string, KeycapConfig> = {
  // ── Row 0: Languages & Frameworks ──────────────────────────────────────────
  Keycap_R0C0:  { tex: 'assets/textures/java-logo.png',         color: 0xffffff, flipY: true  },
  Keycap_R0C1:  { tex: 'assets/textures/springboot-logo.png',   color: 0xffffff, flipY: true  },
  Keycap_R0C2:  { tex: 'assets/textures/angular-logo.png',      color: 0xffffff, flipY: true  },
  Keycap_R0C3:  { tex: 'assets/textures/html-logo.png',         color: 0xffffff, flipY: true  },
  Keycap_R0C4:  { tex: 'assets/textures/css-logo.png',          color: 0xffffff, flipY: true  },
  Keycap_R0C5:  { tex: 'assets/textures/javascript-logo.png',   color: 0xffffff, flipY: true  },

  // ── Row 1: DevOps & OS ────────────────────────────────────────────────────
  Keycap_R1C0:  { tex: 'assets/textures/docker-logo.png',       color: 0xffffff, flipY: true  },
  Keycap_R1C1:  { tex: 'assets/textures/git-logo.png',          color: 0xffffff, flipY: true  },
  Keycap_R1C2:  { tex: 'assets/textures/linux-logo.png',        color: 0xffffff, flipY: true  },
  Keycap_R1C3:  { tex: 'assets/textures/fedora-logo.png',       color: 0xffffff, flipY: true  },
  Keycap_R1C4:  { tex: 'assets/textures/ubuntu-logo.png',       color: 0xffffff, flipY: true  },

  // ── Row 2: IDEs & Tools ───────────────────────────────────────────────────
  Keycap_R2C0:  { tex: 'assets/textures/intellij-logo.png',     color: 0xffffff, flipY: true  },
  Keycap_R2C1:  { tex: 'assets/textures/visualstudio-logo.png', color: 0xffffff, flipY: true  },
  Keycap_R2C2:  { tex: 'assets/textures/postman-logo.png',      color: 0xffffff, flipY: true  },
  Keycap_R2C3:  { tex: 'assets/textures/jira-logo.png',         color: 0xffffff, flipY: true  },

  // ── Row 3: AI & Platform ──────────────────────────────────────────────────
  Keycap_R3C0:  { tex: 'assets/textures/github-logo.png',       color: 0xffffff, flipY: true  },
  Keycap_R3C1:  { tex: 'assets/textures/ollama-logo.png',       color: 0xffffff, flipY: true  },
  Keycap_R3C2:  { tex: 'assets/textures/antigravity-logo.png',  color: 0xffffff, flipY: true  },
};

@Component({
  selector: 'app-three-scene',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #threeCanvas class="three-canvas"></canvas>`,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .three-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `],
})
export class ThreeSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // ── Three.js core ──────────────────────────────────────────────────────────
  private scene!:    THREE.Scene;
  private camera!:   THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock =    new THREE.Clock();
  private rafId =    0;

  // ── Model root group ───────────────────────────────────────────────────────
  private modelGroup: THREE.Group | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  // MOUSE STATE
  // Raw values updated on every mousemove (-1 → +1 normalised)
  // Float targets are lerped toward these each frame
  // ─────────────────────────────────────────────────────────────────────────
  private mouse = { x: 0, y: 0 };

  private floatTarget = { rotX: 0, rotY: 0 };
  private floatCurrent = { rotX: 0, rotY: 0 };

  // ── Accessibility ──────────────────────────────────────────────────────────
  private reducedMotion = false;

  constructor(private ngZone: NgZone) {}

  // ══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initScene();
    this.addLighting();
    this.loadModel();
    // Keep RAF loop outside Angular zone → zero change-detection overhead
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if ((m as THREE.MeshStandardMaterial).map) {
            (m as THREE.MeshStandardMaterial).map!.dispose();
          }
          m.dispose();
        });
      }
    });
    this.renderer.dispose();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SCENE INIT
  // ══════════════════════════════════════════════════════════════════════════
  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0c0f, 10, 25);

    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(-2, 1.2, 7);   // negative X = keyboard appears on the RIGHT
    this.camera.lookAt(-2, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LIGHTING  — five-light rig tuned for colourful keycaps
  // ══════════════════════════════════════════════════════════════════════════
  private addLighting(): void {
    // ── Soft global fill ──────────────────────────────────────────────────
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    // ── Key light: warm, top-right, casts shadows (rakes across keys) ──────
    const key = new THREE.DirectionalLight(0xfff4e0, 2.4);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0008;
    this.scene.add(key);

    // ── Rim light: cool purple from back-left (matches --accent colour) ────
    const rim = new THREE.DirectionalLight(0x7c6aff, 1.6);
    rim.position.set(-5, 3, -5);
    this.scene.add(rim);

    // ── Under-glow: green point (matches --accent-green) ──────────────────
    const glow = new THREE.PointLight(0x4ade80, 0.7, 12);
    glow.position.set(0, -2.5, 1);
    this.scene.add(glow);

    // ── Hemisphere: sky / ground global gradient ───────────────────────────
    this.scene.add(new THREE.HemisphereLight(0x1a1a40, 0x0a0c0f, 0.6));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GLTF MODEL LOADING + KEYCAP TEXTURING
  // ══════════════════════════════════════════════════════════════════════════
  private loadModel(): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Shared texture loader — reused for every keycap
    const texLoader = new THREE.TextureLoader();

    loader.load(
      'assets/models/keyboard.glb',

      // ── ON LOAD ──────────────────────────────────────────────────────────
      (gltf) => {
        const root = gltf.scene;

        // ── 1. Auto-scale & centre ─────────────────────────────────────────
        const box    = new THREE.Box3().setFromObject(root);
        const centre = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const scale  = 3.2 / Math.max(size.x, size.y, size.z);
        root.scale.setScalar(scale);
        root.position.sub(centre.multiplyScalar(scale));

        // ── 2. MESH TRAVERSAL — apply shadows + icon textures ──────────────
        //
        // HOW IT WORKS:
        //   We walk every node in the loaded scene tree.
        //   If the node is a Mesh AND its .name matches a key in
        //   KEYCAP_TEXTURE_MAP (defined at the top of this file),
        //   we load the corresponding PNG and apply it as the material map.
        //
        //   TextureLoader.load() is async — but Three.js handles it gracefully:
        //   the mesh renders with the base colour immediately and swaps to the
        //   texture once it arrives (usually < 1 frame at localhost).
        //
        root.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;

          // Always enable shadows on every mesh in the model
          mesh.castShadow    = true;
          mesh.receiveShadow = true;

          // ── Icon texture matching ────────────────────────────────────────
          //
          // Check if this mesh's name appears in our manifest.
          // The lookup is O(1) — no loops, no regex overhead per frame.
          //
          const config = KEYCAP_TEXTURE_MAP[mesh.name];

          if (config) {
            // console.log('[ThreeScene] Texturing keycap:', mesh.name, '→', config.tex);

            const tex = texLoader.load(config.tex);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.flipY      = config.flipY;   // per-key orientation from manifest

            mesh.material = new THREE.MeshStandardMaterial({
              map:         tex,
              color:       config.color,     // keycap body colour from manifest
              roughness:   0.22,
              metalness:   0.35,
              transparent: true,   // honour PNG alpha channel
              alphaTest:   0.05,   // discard near-invisible pixels
            });
          }
        });

        this.scene.add(root);
        this.modelGroup = root;
      },

      // ── ON PROGRESS ──────────────────────────────────────────────────────
      (progress) => {
        const pct = Math.round((progress.loaded / (progress.total || 1)) * 100);
        console.debug(`[ThreeScene] Loading model: ${pct}%`);
      },

      // ── ON ERROR — fall back to procedural placeholder ────────────────────
      (error) => {
        console.warn('[ThreeScene] keyboard.glb not found — using procedural placeholder.', error);
        this.addPlaceholderKeyboard();
      },
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION LOOP  — physics-based floating + mouse parallax
  //
  // The "floaty" feel comes from layering THREE independent trigonometric
  // waves, each at a different frequency, on different axes:
  //
  //   Y position  — PRIMARY buoyancy (slow sin, like a ship on water)
  //   X rotation  — PITCH (slightly faster sin — nose dips and rises)
  //   Z rotation  — ROLL  (cosine so it's phase-offset from pitch)
  //   Mouse lerp  — adds a FOURTH dimension of motion based on input
  //
  // Linear interpolation (lerp) is applied to the mouse influence so
  // sudden cursor movements never cause jarring snaps.
  // ══════════════════════════════════════════════════════════════════════════
  private animate(): void {
    this.rafId = requestAnimationFrame(() => this.animate());

    if (!this.modelGroup) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    if (this.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const t = this.clock.getElapsedTime();

    // ── BUOYANCY — primary Y float ─────────────────────────────────────────
    // Fast, energetic bob
    const FLOAT_AMPLITUDE = 0.22;
    const FLOAT_FREQ      = 1.60;
    const targetY = Math.sin(t * FLOAT_FREQ) * FLOAT_AMPLITUDE;

    // ── PITCH — X-axis tilt (keyboard nose up/down) ────────────────────────
    const PITCH_AMPLITUDE  = 0.08;   // ~4.5° nose dip
    const PITCH_FREQ       = 2.00;
    const autoRotX = Math.sin(t * PITCH_FREQ) * PITCH_AMPLITUDE;

    // ── ROLL — Z-axis tilt (keyboard tips left/right) ─────────────────────
    // Cosine keeps roll & pitch 90° out of phase for an organic feel.
    const ROLL_AMPLITUDE = 0.05;   // ~2.9° side tip
    const ROLL_FREQ      = 1.70;
    const autoRotZ  = Math.cos(t * ROLL_FREQ) * ROLL_AMPLITUDE;

    // ── MOUSE TARGET — 360° full rotation mode ────────────────────────────
    // mouseX/Y are -1 → +1. Multiplying by 2π = one full rotation per
    // complete cursor sweep from one screen edge to the other.
    const TWO_PI = Math.PI * 2;
    const MOUSE_INFLUENCE_Y = TWO_PI;         // 360° on horizontal sweep
    const MOUSE_INFLUENCE_X = Math.PI * 0.5;  // ±90° tilt on vertical sweep

    this.floatTarget.rotY = this.mouse.x * MOUSE_INFLUENCE_Y;
    this.floatTarget.rotX = autoRotX - this.mouse.y * MOUSE_INFLUENCE_X;

    // ── LERP — smooth everything out ──────────────────────────────────────
    // 0.12 = snappy tracking; keyboard reaches ~95% of target in 12 frames.
    const LERP_FACTOR = 0.12;
    this.floatCurrent.rotX += (this.floatTarget.rotX - this.floatCurrent.rotX) * LERP_FACTOR;
    this.floatCurrent.rotY += (this.floatTarget.rotY - this.floatCurrent.rotY) * LERP_FACTOR;

    // ── APPLY to model ────────────────────────────────────────────────────
    this.modelGroup.position.y  = targetY;
    this.modelGroup.rotation.x  = this.floatCurrent.rotX;
    this.modelGroup.rotation.y  = this.floatCurrent.rotY;
    this.modelGroup.rotation.z  = autoRotZ;

    this.renderer.render(this.scene, this.camera);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    // Normalise to -1 → +1  (centre of screen = 0, 0)
    this.mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  @HostListener('window:resize')
  onResize(): void {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PLACEHOLDER — procedural keyboard rendered when no .glb is present
  // Also demonstrates the icon-key system on the placeholder mesh
  // ══════════════════════════════════════════════════════════════════════════
  private addPlaceholderKeyboard(): void {
    const group = new THREE.Group();
    group.name  = 'placeholder';

    // ── Body ──────────────────────────────────────────────────────────────
    const bodyGeo = new THREE.BoxGeometry(4.4, 0.2, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x12141f, roughness: 0.2, metalness: 0.9 });
    const body    = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = body.receiveShadow = true;
    group.add(body);

    // ── Key grid constants ────────────────────────────────────────────────
    const cols = 13, rows = 4;
    const kw = 0.27, kh = 0.09, kd = 0.27, gap = 0.04;

    // Icon keys for the placeholder — all 18 logos spread across 4 rows
    const iconSlots: Array<{ texturePath: string; row: number; col: number }> = [
      // Row 0: Languages & Frameworks
      { texturePath: 'assets/textures/java-logo.png',         row: 0, col: 0 },
      { texturePath: 'assets/textures/springboot-logo.png',   row: 0, col: 1 },
      { texturePath: 'assets/textures/angular-logo.png',      row: 0, col: 2 },
      { texturePath: 'assets/textures/html-logo.png',         row: 0, col: 3 },
      { texturePath: 'assets/textures/css-logo.png',          row: 0, col: 4 },
      { texturePath: 'assets/textures/javascript-logo.png',   row: 0, col: 5 },
      // Row 1: DevOps & OS
      { texturePath: 'assets/textures/docker-logo.png',       row: 1, col: 0 },
      { texturePath: 'assets/textures/git-logo.png',          row: 1, col: 1 },
      { texturePath: 'assets/textures/linux-logo.png',        row: 1, col: 2 },
      { texturePath: 'assets/textures/fedora-logo.png',       row: 1, col: 3 },
      { texturePath: 'assets/textures/ubuntu-logo.png',       row: 1, col: 4 },
      // Row 2: IDEs & Tools
      { texturePath: 'assets/textures/intellij-logo.png',     row: 2, col: 0 },
      { texturePath: 'assets/textures/visualstudio-logo.png', row: 2, col: 1 },
      { texturePath: 'assets/textures/postman-logo.png',      row: 2, col: 2 },
      { texturePath: 'assets/textures/jira-logo.png',         row: 2, col: 3 },
      // Row 3: AI & Platform
      { texturePath: 'assets/textures/github-logo.png',       row: 3, col: 0 },
      { texturePath: 'assets/textures/ollama-logo.png',       row: 3, col: 1 },
      { texturePath: 'assets/textures/antigravity-logo.png',  row: 3, col: 2 },
    ];

    const iconMap = new Map<string, string>();
    iconSlots.forEach(s => iconMap.set(`${s.row},${s.col}`, s.texturePath));

    const texLoader  = new THREE.TextureLoader();
    // White sides for all icon keys — logos pop on a clean surface.
    // To give individual icons different body colours, move this into the iconSlots array.
    const iconSideMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, metalness: 0.05 });
    const plainMat    = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.05 });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const texPath  = iconMap.get(`${r},${c}`);
        const isIcon   = texPath !== undefined;
        const keyGeo   = new THREE.BoxGeometry(
          isIcon ? kw * 1.2 : kw,
          isIcon ? kh * 1.2 : kh,
          isIcon ? kd * 1.2 : kd,
        );

        let mat: THREE.Material | THREE.Material[];
        if (isIcon) {
          const logoTex = texLoader.load(texPath!);
          logoTex.colorSpace = THREE.SRGBColorSpace;
          logoTex.flipY = true;

          // Shrink the logo to ~65% of the face — adds visual padding
          const LOGO_SCALE = 0.65;
          const pad = (1 - LOGO_SCALE) / 2;   // centering offset
          logoTex.repeat.set(LOGO_SCALE, LOGO_SCALE);
          logoTex.offset.set(pad, pad);

          const topMat = new THREE.MeshStandardMaterial({
            map: logoTex, color: 0xffffff,
            roughness: 0.10, metalness: 0.05, transparent: true, alphaTest: 0.05,
          });
          // 6-slot array — all faces white, index 2 (+Y top) also gets the logo
          mat = [iconSideMat, iconSideMat, topMat, iconSideMat, iconSideMat, iconSideMat];
        } else {
          mat = plainMat;
        }

        const key = new THREE.Mesh(keyGeo, mat);
        key.position.set(
          -((cols - 1) * (kw + gap)) / 2 + c * (kw + gap),
          isIcon ? 0.145 : 0.14,
          -((rows - 1) * (kd + gap)) / 2 + r * (kd + gap),
        );
        key.castShadow = key.receiveShadow = true;
        group.add(key);
      }
    }

    this.scene.add(group);
    this.modelGroup = group;
  }
}
