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

// ═════════════════════════════════════════════════════════════════════════════
// KEYCAP CONFIG — one entry per tech-stack key
// ═════════════════════════════════════════════════════════════════════════════
interface KeycapConfig { tex: string; color: number; flipY: boolean; }

const KEYCAP_TEXTURE_MAP: Record<string, KeycapConfig> = {
  // Row 0: Languages & Frameworks
  Keycap_R0C0:  { tex: 'assets/textures/java-logo.png',         color: 0xff6c37, flipY: true  },
  Keycap_R0C1:  { tex: 'assets/textures/springboot-logo.png',   color: 0xd1d5db, flipY: true  },
  Keycap_R0C2:  { tex: 'assets/textures/angular-logo.png',      color: 0xdd0031, flipY: true  },
  Keycap_R0C3:  { tex: 'assets/textures/html-logo.png',         color: 0xe34f26, flipY: true  },
  Keycap_R0C4:  { tex: 'assets/textures/css-logo.png',          color: 0x1572b6, flipY: true  },
  Keycap_R0C5:  { tex: 'assets/textures/javascript-logo.png',   color: 0xf7df1e, flipY: true  },
  Keycap_R0C6:  { tex: 'assets/textures/json-logo.png',         color: 0xffffff, flipY: true  },
  Keycap_R0C7:  { tex: 'assets/textures/bash-logo.png',         color: 0x2b303b, flipY: true  },
  Keycap_R0C8:  { tex: 'assets/textures/c-logo.png',            color: 0xffffff, flipY: true  },
  Keycap_R0C9:  { tex: 'assets/textures/c++-logo.png',          color: 0x00599c, flipY: true  },
  Keycap_R0C10: { tex: 'assets/textures/csharp-logo.png',       color: 0x68217a, flipY: true  },
  Keycap_R0C11: { tex: 'assets/textures/go-logo.png',           color: 0x00add8, flipY: true  },
  Keycap_R0C12: { tex: 'assets/textures/python-logo.png',       color: 0xffffff, flipY: true  },
  // Row 1: DevOps & OS
  Keycap_R1C0:  { tex: 'assets/textures/docker-logo.png',       color: 0xf3f4f6, flipY: true  },
  Keycap_R1C1:  { tex: 'assets/textures/git-logo.png',          color: 0xf05032, flipY: true  },
  Keycap_R1C2:  { tex: 'assets/textures/linux-logo.png',        color: 0xfcc624, flipY: true  },
  Keycap_R1C3:  { tex: 'assets/textures/fedora-logo.png',       color: 0x51a2da, flipY: true  },
  Keycap_R1C4:  { tex: 'assets/textures/ubuntu-logo.png',       color: 0xdd4814, flipY: true  },
  Keycap_R1C5:  { tex: 'assets/textures/kubernetes-logo.png',   color: 0x326ce5, flipY: true  },
  Keycap_R1C6:  { tex: 'assets/textures/AWS-logo.png',          color: 0xff9900, flipY: true  },
  Keycap_R1C7:  { tex: 'assets/textures/rust-logo.png',         color: 0xffffff, flipY: true  },
  Keycap_R1C8:  { tex: 'assets/textures/Jenkins-logo.png',      color: 0xffffff, flipY: true  },
  Keycap_R1C9:  { tex: 'assets/textures/azure-logo.png',        color: 0x007fff, flipY: true  },
  Keycap_R1C10: { tex: 'assets/textures/kafka-logo.png',        color: 0xffffff, flipY: true  },
  Keycap_R1C11: { tex: 'assets/textures/mariadb-logo.png',      color: 0x003545, flipY: true  },
  Keycap_R1C12: { tex: 'assets/textures/mysql-logo.png',        color: 0xe48e00, flipY: true  },
  // Row 2: IDEs & Tools
  Keycap_R2C0:  { tex: 'assets/textures/intellij-logo.png',     color: 0xfe2857, flipY: true  },
  Keycap_R2C1:  { tex: 'assets/textures/visualstudio-logo.png', color: 0x93c5fd, flipY: true  },
  Keycap_R2C2:  { tex: 'assets/textures/postman-logo.png',      color: 0xff6c37, flipY: true  },
  Keycap_R2C3:  { tex: 'assets/textures/jira-logo.png',         color: 0x0052cc, flipY: true  },
  Keycap_R2C4:  { tex: 'assets/textures/postgreSQL-logo.png',   color: 0x336791, flipY: true  },
  Keycap_R2C5:  { tex: 'assets/textures/mongodb-logo.png',      color: 0x47a248, flipY: true  },
  Keycap_R2C6:  { tex: 'assets/textures/DBeaver-logo.png',      color: 0x382923, flipY: true  },
  Keycap_R2C7:  { tex: 'assets/textures/nestjs-logo.png',       color: 0xe0234e, flipY: true  },
  Keycap_R2C8:  { tex: 'assets/textures/rabbitmq-logo.png',     color: 0xffffff, flipY: true  },
  Keycap_R2C9:  { tex: 'assets/textures/tensorflow-logo.png',   color: 0xff6f00, flipY: true  },
  Keycap_R2C10: { tex: 'assets/textures/react-logo.png',        color: 0x282c34, flipY: true  },
  Keycap_R2C11: { tex: 'assets/textures/vue.js-logo.png',       color: 0x41b883, flipY: true  },
  Keycap_R2C12: { tex: 'assets/textures/tailwindCSS-logo.png',  color: 0x38bdf8, flipY: true  },
  // Row 3: AI & Platform
  Keycap_R3C0:  { tex: 'assets/textures/github-logo.png',       color: 0xd1d5db, flipY: true  },
  Keycap_R3C1:  { tex: 'assets/textures/ollama-logo.png',       color: 0xeeeeee, flipY: true  },
  Keycap_R3C2:  { tex: 'assets/textures/antigravity-logo.png',  color: 0x7c6aff, flipY: true  },
  Keycap_R3C3:  { tex: 'assets/textures/chatgpt-logo.png',      color: 0x10a37f, flipY: true  },
  Keycap_R3C4:  { tex: 'assets/textures/claude-logo.png',       color: 0xffffff, flipY: true  },
  Keycap_R3C5:  { tex: 'assets/textures/figma-logo.png',        color: 0x2c2c2c, flipY: true  },
  Keycap_R3C6:  { tex: 'assets/textures/redis-logo.png',        color: 0xdc382d, flipY: true  },
  Keycap_R3C7:  { tex: 'assets/textures/archlinux-logo.png',    color: 0x1793d1, flipY: true  },
  Keycap_R3C8:  { tex: 'assets/textures/claudecode-logo.png',   color: 0x000000, flipY: true  },
};

// ═════════════════════════════════════════════════════════════════════════════
// MATERIAL CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════
const BLANK_KEY_COLOR  = 0x1a1a1a;   // Dark charcoal — blank keys recede
const ACCENT_KEY_COLOR = 0x8b5cf6;   // Purple accent (matches CTA)
const BODY_COLOR       = 0x0d0d12;   // Near-black keyboard body

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

  private scene!:    THREE.Scene;
  private camera!:   THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock =    new THREE.Clock();
  private rafId =    0;

  private modelGroup: THREE.Group | null = null;

  private mouse = { x: 0, y: 0 };
  private floatTarget  = { rotX: 0, rotY: 0 };
  private floatCurrent = { rotX: 0, rotY: 0 };

  private reducedMotion = false;

  constructor(private ngZone: NgZone) {}

  // ══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initScene();
    this.addLighting();
    this.createStudioEnvironment();
    this.loadModel();
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

    this.camera = new THREE.PerspectiveCamera(
      35, window.innerWidth / window.innerHeight, 0.1, 100,
    );
    // Pulled back on Z for telephoto/isometric feel, raised Y slightly
    this.camera.position.set(-2, 1.8, 10);
    this.camera.lookAt(-2, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── PREMIUM RENDERER UPGRADES ──────────────────────────────────────────
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadow edges
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // cinematic grading
    this.renderer.toneMappingExposure = 1.0;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STUDIO ENVIRONMENT — procedural HDRI for realistic reflections
  // ══════════════════════════════════════════════════════════════════════════
  private createStudioEnvironment(): void {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileCubemapShader();

    const envScene = new THREE.Scene();

    const topGeo = new THREE.SphereGeometry(50, 16, 16);
    const topMat = new THREE.MeshBasicMaterial({
      color: 0x2a2a3e,
      side: THREE.BackSide,
    });
    envScene.add(new THREE.Mesh(topGeo, topMat));

    const accentLight = new THREE.PointLight(0x7c6aff, 8, 50);
    accentLight.position.set(-20, 5, -10);
    envScene.add(accentLight);

    const warmLight = new THREE.PointLight(0xfff4e0, 5, 50);
    warmLight.position.set(15, 10, 15);
    envScene.add(warmLight);

    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    this.scene.environment = envMap;

    pmrem.dispose();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LIGHTING — Professional 3-Point Studio Setup
  // ══════════════════════════════════════════════════════════════════════════
  private addLighting(): void {
    // 1. Ambient Light (very low, just to prevent pitch-black shadows)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // 2. Key Light (Main illumination, produces crisp shadows)
    // Positioned high and to the right, cool/blue tint (#e2e8f0) for terminal vibe
    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 3.0);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048); // High-res shadows
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0008;          // Prevent shadow acne
    this.scene.add(keyLight);

    // 3. Fill Light (Softens harsh shadows from the key light)
    // Positioned lower and to the left, lower intensity
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, 5);
    this.scene.add(fillLight);

    // 4. Rim Light (Adds 3D depth and separation from background)
    // SpotLight positioned behind, pointing at the keyboard
    const rimLight = new THREE.SpotLight(0xffffff, 4.0);
    rimLight.position.set(0, 5, -10);
    rimLight.lookAt(0, 0, 0);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.5;
    this.scene.add(rimLight);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Shared helper — configure a logo texture for crisp rendering
  //
  // WHITE base color (0xffffff) means:
  //   final pixel = texture_RGB × white = texture_RGB (true colors!)
  //
  // If base were dark (#1e1e1e), the multiplication would darken the logo.
  // White = 1.0 multiplier = logos render at full vibrancy.
  //
  // alphaTest: 0.5 = any pixel below 50% opacity is completely discarded.
  // This kills compression artifacts around logo edges that would otherwise
  // render as dirty semi-transparent fuzz.
  // ══════════════════════════════════════════════════════════════════════════
  private configureLogoTexture(tex: THREE.Texture, flipY: boolean): void {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY      = flipY;

    // Use a 1:1 mapped texture since we now scale the Plane geometry itself 
    // to avoid UV stretching and color bleeding along the edges.
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  }

  private createLogoMaterial(tex: THREE.Texture): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      map:             tex,
      color:           0xffffff,     // WHITE base = true logo colors (no darkening)
      roughness:       0.35,
      metalness:       0.15,
      transparent:     true,
      alphaTest:       0.5,          // strict — kills artifact fuzz around edges
      envMapIntensity: 0.8,
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GLTF MODEL LOADING + KEYCAP TEXTURING
  // ══════════════════════════════════════════════════════════════════════════
  private loadModel(): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const texLoader = new THREE.TextureLoader();

    loader.load(
      'assets/models/keyboard.glb',

      (gltf) => {
        const root = gltf.scene;

        const box    = new THREE.Box3().setFromObject(root);
        const centre = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const scale  = 3.2 / Math.max(size.x, size.y, size.z);
        root.scale.setScalar(scale);
        root.position.sub(centre.multiplyScalar(scale));

        root.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;

          // Enable shadows for EVERY mesh in the model (keys + base)
          mesh.castShadow    = true;
          mesh.receiveShadow = true;

          const config = KEYCAP_TEXTURE_MAP[mesh.name];
          if (config) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: config.color,
              roughness: 0.25,
              metalness: 0.3,
              envMapIntensity: 1.2,
            });

            const tex = texLoader.load(config.tex);
            this.configureLogoTexture(tex, config.flipY);
            const logoMat = this.createLogoMaterial(tex);

            mesh.geometry.computeBoundingBox();
            const bbox = mesh.geometry.boundingBox!;
            const keyW = bbox.max.x - bbox.min.x;
            const keyD = bbox.max.z - bbox.min.z;
            
            const LOGO_SCALE = 0.6;
            const planeGeo = new THREE.PlaneGeometry(keyW * LOGO_SCALE, keyD * LOGO_SCALE);
            const logoPlane = new THREE.Mesh(planeGeo, logoMat);
            
            logoPlane.rotation.x = -Math.PI / 2;
            logoPlane.position.x = (bbox.max.x + bbox.min.x) / 2;
            logoPlane.position.z = (bbox.max.z + bbox.min.z) / 2;
            logoPlane.position.y = bbox.max.y + 0.001;
            logoPlane.receiveShadow = true;
            mesh.add(logoPlane);
          }
        });

        this.scene.add(root);
        this.modelGroup = root;
      },

      (progress) => {
        const pct = Math.round((progress.loaded / (progress.total || 1)) * 100);
        console.debug(`[ThreeScene] Loading model: ${pct}%`);
      },

      (error) => {
        console.warn('[ThreeScene] keyboard.glb not found — using procedural placeholder.', error);
        this.addPlaceholderKeyboard();
      },
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION LOOP — direct renderer (no post-processing)
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

    const FLOAT_AMPLITUDE = 0.22;
    const FLOAT_FREQ      = 1.60;
    const targetY = Math.sin(t * FLOAT_FREQ) * FLOAT_AMPLITUDE;

    const PITCH_AMPLITUDE = 0.08;
    const PITCH_FREQ      = 2.00;
    const autoRotX = Math.sin(t * PITCH_FREQ) * PITCH_AMPLITUDE;

    const ROLL_AMPLITUDE = 0.05;
    const ROLL_FREQ      = 1.70;
    const autoRotZ = Math.cos(t * ROLL_FREQ) * ROLL_AMPLITUDE;

    const TWO_PI = Math.PI * 2;
    const MOUSE_INFLUENCE_Y = TWO_PI;
    const MOUSE_INFLUENCE_X = Math.PI * 0.5;

    this.floatTarget.rotY = this.mouse.x * MOUSE_INFLUENCE_Y;
    this.floatTarget.rotX = autoRotX - this.mouse.y * MOUSE_INFLUENCE_X;

    const LERP_FACTOR = 0.12;
    this.floatCurrent.rotX += (this.floatTarget.rotX - this.floatCurrent.rotX) * LERP_FACTOR;
    this.floatCurrent.rotY += (this.floatTarget.rotY - this.floatCurrent.rotY) * LERP_FACTOR;

    this.modelGroup.position.y = targetY;
    this.modelGroup.rotation.x = this.floatCurrent.rotX;
    this.modelGroup.rotation.y = this.floatCurrent.rotY;
    this.modelGroup.rotation.z = autoRotZ;

    this.renderer.render(this.scene, this.camera);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
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
  // PLACEHOLDER — procedural keyboard
  //
  //  ✓ Multi-material array → texture ONLY on top face (index 2)
  //  ✓ Dark charcoal blank keys (recede behind logos)
  //  ✓ Purple accent Enter key
  //  ✓ White base color on logo keys = true vibrant colors
  //  ✓ Strict alphaTest 0.5 = kills artifact fuzz
  //  ✓ ClampToEdge + repeat = no bleed, crisp logos
  // ══════════════════════════════════════════════════════════════════════════
  private addPlaceholderKeyboard(): void {
    const group = new THREE.Group();
    group.name = 'placeholder';

    // Keyboard body
    const bodyGeo = new THREE.BoxGeometry(4.4, 0.2, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: BODY_COLOR,
      roughness: 0.15,
      metalness: 0.85,
      envMapIntensity: 1.5,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = body.receiveShadow = true;
    group.add(body);

    const cols = 13, rows = 4;
    const kw = 0.27, kh = 0.09, kd = 0.27, gap = 0.04;

    const iconSlots: Array<{ texturePath: string; row: number; col: number }> = [
      { texturePath: 'assets/textures/java-logo.png',         row: 0, col: 0 },
      { texturePath: 'assets/textures/springboot-logo.png',   row: 0, col: 1 },
      { texturePath: 'assets/textures/angular-logo.png',      row: 0, col: 2 },
      { texturePath: 'assets/textures/html-logo.png',         row: 0, col: 3 },
      { texturePath: 'assets/textures/css-logo.png',          row: 0, col: 4 },
      { texturePath: 'assets/textures/javascript-logo.png',   row: 0, col: 5 },
      { texturePath: 'assets/textures/json-logo.png',         row: 0, col: 6 },
      { texturePath: 'assets/textures/bash-logo.png',         row: 0, col: 7 },
      { texturePath: 'assets/textures/c-logo.png',            row: 0, col: 8 },
      { texturePath: 'assets/textures/c++-logo.png',          row: 0, col: 9 },
      { texturePath: 'assets/textures/csharp-logo.png',       row: 0, col: 10 },
      { texturePath: 'assets/textures/go-logo.png',           row: 0, col: 11 },
      { texturePath: 'assets/textures/python-logo.png',       row: 0, col: 12 },
      { texturePath: 'assets/textures/docker-logo.png',       row: 1, col: 0 },
      { texturePath: 'assets/textures/git-logo.png',          row: 1, col: 1 },
      { texturePath: 'assets/textures/linux-logo.png',        row: 1, col: 2 },
      { texturePath: 'assets/textures/fedora-logo.png',       row: 1, col: 3 },
      { texturePath: 'assets/textures/ubuntu-logo.png',       row: 1, col: 4 },
      { texturePath: 'assets/textures/kubernetes-logo.png',   row: 1, col: 5 },
      { texturePath: 'assets/textures/AWS-logo.png',          row: 1, col: 6 },
      { texturePath: 'assets/textures/rust-logo.png',         row: 1, col: 7 },
      { texturePath: 'assets/textures/Jenkins-logo.png',      row: 1, col: 8 },
      { texturePath: 'assets/textures/azure-logo.png',        row: 1, col: 9 },
      { texturePath: 'assets/textures/kafka-logo.png',        row: 1, col: 10 },
      { texturePath: 'assets/textures/mariadb-logo.png',      row: 1, col: 11 },
      { texturePath: 'assets/textures/mysql-logo.png',        row: 1, col: 12 },
      { texturePath: 'assets/textures/intellij-logo.png',     row: 2, col: 0 },
      { texturePath: 'assets/textures/visualstudio-logo.png', row: 2, col: 1 },
      { texturePath: 'assets/textures/postman-logo.png',      row: 2, col: 2 },
      { texturePath: 'assets/textures/jira-logo.png',         row: 2, col: 3 },
      { texturePath: 'assets/textures/postgreSQL-logo.png',   row: 2, col: 4 },
      { texturePath: 'assets/textures/mongodb-logo.png',      row: 2, col: 5 },
      { texturePath: 'assets/textures/DBeaver-logo.png',      row: 2, col: 6 },
      { texturePath: 'assets/textures/nestjs-logo.png',       row: 2, col: 7 },
      { texturePath: 'assets/textures/rabbitmq-logo.png',     row: 2, col: 8 },
      { texturePath: 'assets/textures/tensorflow-logo.png',   row: 2, col: 9 },
      { texturePath: 'assets/textures/react-logo.png',        row: 2, col: 10 },
      { texturePath: 'assets/textures/vue.js-logo.png',       row: 2, col: 11 },
      { texturePath: 'assets/textures/tailwindCSS-logo.png',  row: 2, col: 12 },
      { texturePath: 'assets/textures/github-logo.png',       row: 3, col: 0 },
      { texturePath: 'assets/textures/ollama-logo.png',       row: 3, col: 1 },
      { texturePath: 'assets/textures/antigravity-logo.png',  row: 3, col: 2 },
      { texturePath: 'assets/textures/chatgpt-logo.png',      row: 3, col: 3 },
      { texturePath: 'assets/textures/claude-logo.png',       row: 3, col: 4 },
      { texturePath: 'assets/textures/figma-logo.png',        row: 3, col: 5 },
      { texturePath: 'assets/textures/redis-logo.png',        row: 3, col: 6 },
      { texturePath: 'assets/textures/archlinux-logo.png',    row: 3, col: 7 },
      { texturePath: 'assets/textures/claudecode-logo.png',   row: 3, col: 8 },
    ];

    const iconMap = new Map<string, string>();
    iconSlots.forEach(s => iconMap.set(`${s.row},${s.col}`, s.texturePath));

    const texLoader = new THREE.TextureLoader();

    // Blank keys — dark charcoal
    const blankMat = new THREE.MeshStandardMaterial({
      color: BLANK_KEY_COLOR, roughness: 0.30, metalness: 0.20, envMapIntensity: 1.0,
    });

    // Purple accent enter key
    const accentMat = new THREE.MeshStandardMaterial({
      color: ACCENT_KEY_COLOR, roughness: 0.25, metalness: 0.3, envMapIntensity: 1.4,
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const texPath  = iconMap.get(`${r},${c}`);
        const isIcon   = texPath !== undefined;
        const isAccent = (r === rows - 1 && c === cols - 1);

        const w = isIcon ? kw * 1.2 : kw;
        const d = isIcon ? kd * 1.2 : kd;
        const h = isIcon ? kh * 1.2 : kh;

        const keyGeo = new THREE.BoxGeometry(w, h, d);

        let mat: THREE.Material | THREE.Material[];

        const keyConfig = Object.values(KEYCAP_TEXTURE_MAP).find(cfg => cfg.tex === texPath);
        const iconColor = keyConfig ? keyConfig.color : 0x222233;

        if (isIcon) {
          mat = new THREE.MeshStandardMaterial({
            color: iconColor, roughness: 0.25, metalness: 0.3, envMapIntensity: 1.2,
          });
        } else if (isAccent) {
          mat = accentMat;
        } else {
          mat = blankMat;
        }

        const key = new THREE.Mesh(keyGeo, mat);
        key.position.set(
          -((cols - 1) * (kw + gap)) / 2 + c * (kw + gap),
          isIcon ? 0.145 : 0.14,
          -((rows - 1) * (kd + gap)) / 2 + r * (kd + gap),
        );
        key.castShadow = key.receiveShadow = true;
        group.add(key);

        if (isIcon) {
          const logoTex = texLoader.load(texPath!);
          this.configureLogoTexture(logoTex, true);
          const logoMat = this.createLogoMaterial(logoTex);
          
          const LOGO_SCALE = 0.6;
          const planeGeo = new THREE.PlaneGeometry(w * LOGO_SCALE, d * LOGO_SCALE);
          const logoPlane = new THREE.Mesh(planeGeo, logoMat);
          logoPlane.rotation.x = -Math.PI / 2;
          logoPlane.position.copy(key.position);
          logoPlane.position.y += (h / 2) + 0.002;
          logoPlane.receiveShadow = true;
          group.add(logoPlane);
        }
      }
    }

    this.scene.add(group);
    this.modelGroup = group;
  }
}
