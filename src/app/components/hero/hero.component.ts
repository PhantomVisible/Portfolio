import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeSceneComponent } from '../three-scene/three-scene.component';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ThreeSceneComponent],
  template: `
    <!-- ══════════════════════════════════════════
         FULL-SCREEN THREE.JS CANVAS (z-index: 0)
         The ThreeSceneComponent mounts a position:fixed
         canvas that covers the entire viewport behind
         all other page content.
    ══════════════════════════════════════════════ -->
    <app-three-scene></app-three-scene>

    <!-- ══════════════════════════════════════════
         HERO SECTION — overlaid above the canvas
    ══════════════════════════════════════════════ -->
    <section id="home" class="hero-section" #heroSection>

      <!-- Gradient vignette — fades edges so the 3D model
           appears to float inside a darkened stage -->
      <div class="vignette" aria-hidden="true"></div>

      <!-- ── Left column: identity ── -->
      <div class="hero-overlay container" #heroOverlay>
        <div class="hero-left">

          <!-- Status badge -->
          <div class="status-badge" #statusBadge>
            <span class="status-dot"></span>
            <span class="status-text font-mono">Available for opportunities</span>
          </div>

          <!-- Terminal init line -->
          <div class="terminal-init" #terminalInit>
            <span class="prompt font-mono">$</span>
            <span class="cmd font-mono" #cmdText></span>
            <span class="cursor font-mono" #cursor>▋</span>
          </div>

          <!-- Main headline -->
          <h1 class="hero-headline" #headline>
            <span class="line line-1" #line1>Amine</span>
            <span class="line line-2" #line2>
              El <em class="gradient-text">Haouat</em>
            </span>
          </h1>

          <!-- Role tags -->
          <div class="role-tags" #roleTags>
            <span class="role-tag">Java · Spring Boot</span>
            <span class="role-divider">×</span>
            <span class="role-tag">Angular</span>
            <span class="role-divider">×</span>
            <span class="role-tag accent-tag">AI-Native</span>
          </div>

          <!-- Sub-caption -->
          <p class="hero-caption" #caption>
            Senior Full-Stack Engineer who builds systems that give users
            <strong>Main Character</strong> energy — architecture first, aesthetics always.
          </p>

          <!-- CTAs -->
          <div class="cta-row" #ctaRow>
            <a href="#projects" class="cta-primary">
              <span>View Systems</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#contact" class="cta-secondary">Get In Touch</a>
          </div>

          <!-- Scroll hint -->
          <div class="scroll-hint" #scrollHint>
            <div class="scroll-line"></div>
            <span class="scroll-label font-mono">scroll to explore</span>
          </div>
        </div>
      </div>

      <!-- Corner decoration -->
      <div class="corner-label font-mono" aria-hidden="true">
        <span>v2.0 — 2026</span>
      </div>
    </section>
  `,
  styles: [`
    /* ── Section ──────────────────────────────────────────── */
    .hero-section {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      /* Transparent: the Three.js canvas shines through */
      background: transparent;
    }

    /* ── Vignette overlay ─────────────────────────────────── */
    .vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 80% at 30% 50%, transparent 0%, rgba(10,12,15,0.65) 100%),
        linear-gradient(to right, rgba(10,12,15,0.9) 0%, rgba(10,12,15,0.15) 55%, rgba(10,12,15,0.05) 100%);
      pointer-events: none;
    }

    /* ── Outer grid ───────────────────────────────────────── */
    .hero-overlay {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      padding-top: 7rem;
      padding-bottom: 4rem;
      min-height: 100vh;
      pointer-events: none;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
      pointer-events: auto;
    }

    /* ── Status badge ─────────────────────────────────────── */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border: 1px solid rgba(74, 222, 128, 0.25);
      border-radius: 100px;
      background: rgba(74, 222, 128, 0.07);
      width: fit-content;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse 2s ease infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
      50%       { opacity: 0.7; box-shadow: 0 0 0 5px rgba(74, 222, 128, 0); }
    }

    .status-text {
      font-size: 0.72rem;
      color: #4ade80;
      letter-spacing: 0.06em;
    }

    /* ── Terminal line ─────────────────────────────────────── */
    .terminal-init {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
    }

    .prompt { color: #4ade80; font-weight: 500; }
    .cmd    { color: #e2e8f0; }

    .cursor {
      color: #4ade80;
      animation: blink 1s step-end infinite;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    /* ── Headline ──────────────────────────────────────────── */
    .hero-headline {
      font-size: clamp(3.5rem, 7vw, 6.5rem);
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -0.03em;
      margin: 0;
      display: flex;
      flex-direction: column;
    }

    .line {
      display: block;
      overflow: hidden;
    }

    .gradient-text {
      font-style: normal;
      background: linear-gradient(125deg, #7c6aff 0%, #22d3ee 60%, #4ade80 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Role tags ─────────────────────────────────────────── */
    .role-tags {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .role-tag {
      font-family: 'Source Code Pro', monospace;
      font-size: 0.75rem;
      color: #94a3b8;
      letter-spacing: 0.04em;
    }

    .accent-tag { color: #7c6aff; }

    .role-divider {
      color: #1e2330;
      font-size: 0.9rem;
    }

    /* ── Caption ───────────────────────────────────────────── */
    .hero-caption {
      font-size: 1rem;
      color: #64748b;
      line-height: 1.75;
      max-width: 460px;
    }

    .hero-caption strong {
      color: #e2e8f0;
      font-weight: 600;
    }

    /* ── CTAs ──────────────────────────────────────────────── */
    .cta-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.25rem;
    }

    .cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.8rem;
      background: #7c6aff;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .cta-primary:hover {
      background: #9380ff;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(124, 106, 255, 0.38);
    }

    .cta-primary svg {
      transition: transform 0.2s ease;
    }

    .cta-primary:hover svg {
      transform: translateX(4px);
    }

    .cta-secondary {
      display: inline-flex;
      align-items: center;
      padding: 0.8rem 1.6rem;
      border: 1px solid #1e2330;
      color: #94a3b8;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .cta-secondary:hover {
      border-color: #7c6aff;
      color: #7c6aff;
    }

    /* ── Scroll hint ───────────────────────────────────────── */
    .scroll-hint {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .scroll-line {
      width: 40px;
      height: 1px;
      background: linear-gradient(to right, #7c6aff, transparent);
      animation: expand 2s ease infinite;
    }

    @keyframes expand {
      0%, 100% { width: 40px; opacity: 0.5; }
      50%       { width: 60px; opacity: 1; }
    }

    .scroll-label {
      font-size: 0.65rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #64748b;
    }

    /* ── Right stat cards ──────────────────────────────────── */
    .hero-right {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      pointer-events: auto;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(22, 25, 32, 0.75);
      border: 1px solid rgba(30, 35, 48, 0.8);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      min-width: 200px;
      transition: border-color 0.25s ease, transform 0.25s ease;
    }

    .stat-card:hover {
      border-color: rgba(124, 106, 255, 0.3);
      transform: translateX(-4px);
    }

    .stat-icon { font-size: 1.4rem; flex-shrink: 0; }

    .stat-val {
      display: block;
      font-size: 0.95rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .stat-desc {
      display: block;
      font-size: 0.72rem;
      color: #64748b;
      margin-top: 1px;
    }

    /* ── Corner label ──────────────────────────────────────── */
    .corner-label {
      position: absolute;
      bottom: 1.5rem;
      right: 1.5rem;
      font-size: 0.65rem;
      color: #1e2330;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    /* ── Responsive ────────────────────────────────────────── */
    @media (max-width: 900px) {
      .hero-overlay {
        padding-top: 5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-headline { font-size: clamp(2.8rem, 10vw, 4rem); }
      .cta-row { flex-direction: column; }
    }

    /*
      REDUCED MOTION — hero still shows text, animations disabled.
      The Three.js reduced-motion branch also cuts the RAF operations.
    */
    @media (prefers-reduced-motion: reduce) {
      .status-dot,
      .cursor,
      .scroll-line { animation: none; }
    }
  `],
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroSection')  heroSection!:  ElementRef;
  @ViewChild('heroOverlay')  heroOverlay!:  ElementRef;
  @ViewChild('statusBadge')  statusBadge!:  ElementRef;
  @ViewChild('terminalInit') terminalInit!: ElementRef;
  @ViewChild('cmdText')      cmdText!:      ElementRef;
  @ViewChild('cursor')       cursor!:       ElementRef;
  @ViewChild('headline')     headline!:     ElementRef;
  @ViewChild('line1')        line1!:        ElementRef;
  @ViewChild('line2')        line2!:        ElementRef;
  @ViewChild('roleTags')     roleTags!:     ElementRef;
  @ViewChild('caption')      caption!:      ElementRef;
  @ViewChild('ctaRow')       ctaRow!:       ElementRef;
  @ViewChild('scrollHint')   scrollHint!:   ElementRef;



  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.reducedMotion) {
      this.showAllImmediate();
    } else {
      this.runLoadTimeline();
    }
  }

  // ── Full visibility instantly (reduced-motion / a11y) ──────────
  private showAllImmediate(): void {
    const els = [
      this.statusBadge, this.terminalInit, this.line1, this.line2,
      this.roleTags, this.caption, this.ctaRow, this.scrollHint,
    ];
    gsap.set(els.map(e => e.nativeElement), { opacity: 1, y: 0 });
    this.cmdText.nativeElement.textContent = './init portfolio.sh';
    this.cursor.nativeElement.style.display = 'none';
  }

  // ── Load animation timeline ─────────────────────────────────────
  private runLoadTimeline(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Start invisible
    gsap.set([
      this.statusBadge.nativeElement,
      this.terminalInit.nativeElement,
      this.line1.nativeElement,
      this.line2.nativeElement,
      this.roleTags.nativeElement,
      this.caption.nativeElement,
      this.ctaRow.nativeElement,
      this.scrollHint.nativeElement,
    ], { opacity: 0, y: 22 });

    tl
      // Status badge fades in first
      .to(this.statusBadge.nativeElement, { opacity: 1, y: 0, duration: 0.5 }, 0.2)

      // Terminal typewriter
      .to(this.terminalInit.nativeElement, { opacity: 1, y: 0, duration: 0.4 }, 0.5)
      .to(this.cmdText.nativeElement, {
        duration: 1.4,
        text: { value: './init portfolio.sh', delimiter: '' },
        ease: 'none',
      }, 0.8)
      .to(this.cursor.nativeElement, { opacity: 0, duration: 0.15 }, '+=0.2')

      // Headline lines stagger up
      .to(this.line1.nativeElement, { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
      .to(this.line2.nativeElement, { opacity: 1, y: 0, duration: 0.65 }, '-=0.4')

      // Remaining elements cascade
      .to(this.roleTags.nativeElement, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
      .to(this.caption.nativeElement,  { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .to(this.ctaRow.nativeElement,   { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
      .to(this.scrollHint.nativeElement, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
  }
}
