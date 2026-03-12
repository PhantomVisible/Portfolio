import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="projects-section" #projectsSection>
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-label" #label>Systems Over Screenshots</span>
          <h2 class="section-title" #title>Featured Work</h2>
          <p class="section-subtitle" #subtitle>
            Scroll to flip through the deck. Each card details the architectural decisions, not just the outcome.
          </p>
        </div>

        <div class="deck-container-wrapper" #deckWrapper>
          <div class="deck-container" #deckContainer>
            <div class="deck" #deck>
              <!-- The Cards -->
              <article class="project-card" *ngFor="let project of projects; let i = index" #cardEl [attr.data-index]="i">
                
                <!-- The Face of the Card (Project Details) -->
                <div class="card-front card">
                  <div class="project-header">
                    <div class="project-icon">{{ project.icon }}</div>
                    <div>
                      <h3 class="project-title">{{ project.title }}</h3>
                      <p class="project-tagline font-mono">{{ project.tagline }}</p>
                    </div>
                    <a *ngIf="project.github" [href]="project.github" target="_blank" rel="noopener"
                       class="project-link" aria-label="View on GitHub">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  </div>

                  <p class="project-desc">{{ project.desc }}</p>

                  <div class="project-tags">
                    <span class="tag" *ngFor="let tag of project.tags">{{ tag }}</span>
                  </div>

                  <!-- Expanded Architecture Details directly on the card -->
                  <div class="arch-content">
                    <div class="arch-header font-mono">Architecture Topology</div>
                    <div class="arch-item" *ngFor="let detail of project.architecture">
                      <span class="arch-label font-mono">{{ detail.layer }}</span>
                      <span class="arch-value">{{ detail.detail }}</span>
                    </div>
                  </div>
                </div>

                <!-- The Back of the Card (Pattern) -->
                <div class="card-back">
                  <div class="card-back-pattern"></div>
                  <div class="card-back-logo">AE</div>
                </div>
              </article>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      background: var(--bg-secondary);
      position: relative;
      padding-top: 5rem;
      padding-bottom: 2rem;
      overflow-x: hidden;
    }

    .projects-section::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
    }

    .section-header { margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; }

    /* ── 3D DECK STAGE ────────────────────────────────────────── */
    .deck-container-wrapper {
      width: 100%;
      height: 95vh; /* Provides the vertical viewport for scrolling */
      margin: 0;
      position: relative;
    }

    .deck-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      perspective: 2500px;
      -webkit-perspective: 2500px;
    }

    .deck {
      position: relative;
      width: 100%;
      max-width: 650px;
      height: 600px; /* Base card height */
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      /* Noticeable downward 3D pitch so user can see stack depth */
      transform: rotateX(8deg); 
    }

    /* ── CARDS ────────────────────────────────────────────────── */
    .project-card {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -325px; /* Half of max-width */
      width: 100%;
      max-width: 650px;
      height: 100%;
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      /* Default initial state set by GSAP: rotateY(180deg) translateZ(-index * 30px) */
      will-change: transform;
    }

    /* Face/Back surfaces */
    .card-front, .card-back {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
    }

    /* Front content */
    .card-front {
      background: #0B0C10; /* Solid opaque dark to prevent Z-index bleeding */
      border: 1px solid rgba(124, 106, 255, 0.2);
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      /* Important: the front of the card does not have rotateY initially. 
         When the parent is rotated 180deg by gsap, this front side faces away. */
    }

    /* Back of the card (pattern side) */
    .card-back {
      /* Rotated 180deg so when the parent is 180deg, this faces the camera */
      transform: rotateY(180deg);
      background: #0B0C10; /* Solid opaque back */
      border: 2px solid rgba(124, 106, 255, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .card-back-pattern {
      position: absolute; inset: 0;
      background-image: 
        repeating-linear-gradient(45deg, 
          rgba(124, 106, 255, 0.05) 0%, rgba(124, 106, 255, 0.05) 2%, 
          transparent 2%, transparent 4%),
        repeating-linear-gradient(-45deg, 
          rgba(0, 240, 255, 0.03) 0%, rgba(0, 240, 255, 0.03) 2%, 
          transparent 2%, transparent 4%);
      background-size: 40px 40px;
      opacity: 0.8;
    }

    .card-back-logo {
      font-size: 5rem;
      font-weight: 900;
      font-family: var(--font-mono);
      color: rgba(255,255,255,0.05); /* Stealthy watermark */
      letter-spacing: -5px;
      position: relative;
      z-index: 2;
      text-shadow: 0px 4px 10px rgba(0,0,0,0.5);
    }
    
    .card-back-logo::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 150px; height: 150px;
      border: 1px solid rgba(124, 106, 255, 0.2);
      border-radius: 50%;
    }

    /* Front Card Contents Styling */
    .project-header { display: flex; align-items: flex-start; gap: 1.25rem; }
    .project-icon { font-size: 2.5rem; flex-shrink: 0; line-height: 1; }
    .project-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.2rem; color: #fff; }
    .project-tagline { font-size: 0.85rem; color: var(--accent); }
    
    .project-link {
      margin-left: auto; color: var(--text-muted); padding: 0.5rem;
      transition: color 0.2s ease, transform 0.2s ease;
      background: rgba(255,255,255,0.05); border-radius: 50%;
    }
    .project-link:hover { color: var(--accent); transform: scale(1.1); background: rgba(124, 106, 255, 0.15); }

    .project-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.7; }
    .project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }

    /* Fixed open architecture details for the 3D card */
    .arch-content {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      flex: 1;
    }
    
    .arch-header {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-dim);
      margin-bottom: 0.25rem;
    }

    .arch-item {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 1rem;
      font-size: 0.85rem;
      align-items: start;
    }
    .arch-label { color: var(--accent-green); font-size: 0.75rem; text-transform: uppercase; }
    .arch-value { color: var(--text-dim); line-height: 1.5; }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .deck { max-width: 90%; margin: 0 auto; height: 680px; }
      .project-card { left: 0; margin-left: 0; max-width: 100%; }
      .card-front { padding: 1.5rem; }
      .project-title { font-size: 1.2rem; }
      .arch-item { grid-template-columns: 1fr; gap: 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.02); }
      .arch-header { display: none; }
    }
  `]
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  
  // 3D Deck refs
  @ViewChild('deckWrapper') deckWrapper!: ElementRef;
  @ViewChild('deckContainer') deckContainer!: ElementRef;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef>;

  projects = [
    {
      icon: '🌿',
      title: 'Plant Social',
      tagline: 'Modular microservice — Demo Day showcase',
      github: 'https://github.com/PhantomVisible/PlantSocial',
      desc: 'A three-module plant management platform built for Demo Day. Presents a Tamagotchi-style care game, plant health diagnosis, and AI-powered species identification — all as loosely coupled services.',
      tags: ['Spring Boot', 'Angular', 'AI Vision', 'Microservices', 'JPA'],
      architecture: [
        { layer: 'Plant Doctor', detail: 'Disease diagnosis module: image upload → Gemini vision API → diagnostic card response' },
        { layer: 'Plant ID', detail: 'Species identification service using AI vision; annotated result with botanical metadata' },
        { layer: 'Tamagotcha', detail: 'Gamified care scheduler: water/sun/fertilize state machine with persistence via JPA/H2' },
        { layer: 'Frontend', detail: 'Angular standalone components per module; shared plant service for state across modules' },
      ],
    },
    {
      icon: '🚗',
      title: 'Car Management',
      tagline: 'Cloud-native microservices platform',
      github: 'https://github.com/PhantomVisible/car-management-system',
      desc: 'Enterprise-grade car rental platform built on microservices. Features real-time availability, secure auth, independent service deployability, and high-volume reservation processing.',
      tags: ['Java', 'Spring Boot', 'Eureka', 'Microservices', 'PostgreSQL'],
      architecture: [
        { layer: 'Service Mesh', detail: 'Eureka discovery server + API Gateway for unified routing; independent Docker deployments' },
        { layer: 'Auth Service', detail: 'JWT-based Spring Security; user roles (admin/customer) with service-to-service auth' },
        { layer: 'Rental Logic', detail: 'Car inventory + reservation logic; event-driven availability updates' },
      ],
    },
    {
      icon: '🏦',
      title: 'Banking System',
      tagline: 'Spring Boot + Java Core',
      github: 'https://github.com/PhantomVisible/bank-account-system',
      desc: 'Robust banking application following clean architecture principles. Handles persistence in both SQL and NoSQL databases simultaneously. Features include dynamic data reporting and secure PDF bank statements.',
      tags: ['Java', 'Spring Security', 'JWT', 'Spring Data JPA', 'H2 Database'],
      architecture: [
        { layer: 'Architecture', detail: 'Spring Boot REST API built on Clean Architecture principles, ensuring strict isolation of business logic.' },
        { layer: 'Persistence', detail: 'Polyglot persistence model utilizing Spring Data JPA for ACID SQL transactions and NoSQL for scalable document storage.' },
        { layer: 'Reports', detail: 'Custom reporting service handling dynamic data aggregation and real-time PDF compilation for exports.' },
      ],
    },
  ];

  private reducedMotion = false;
  private deckTl: gsap.core.Timeline | null = null;
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reducedMotion) {
      setTimeout(() => this.setupAnimations(), 150);
    } else {
      // Graceful degradation layout
      this.cardEls.toArray().forEach((cardRef, i) => {
        gsap.set(cardRef.nativeElement, { position: 'relative', margin: '2rem auto', left: 0, transform: 'none' });
      });
      (this.deckWrapper.nativeElement as HTMLElement).style.height = 'auto';
    }
  }

  ngOnDestroy(): void {
    if (this.deckTl) this.deckTl.kill();
    this.scrollTriggers.forEach(st => st.kill());
  }

  private setupAnimations(): void {
    const section = this.projectsSection.nativeElement;
    const cards = this.cardEls.toArray().map(el => el.nativeElement);

    if (cards.length === 0) return;

    // Standard header entrance
    gsap.from([
      this.label.nativeElement,
      this.title.nativeElement,
      this.subtitle.nativeElement,
    ], {
      opacity: 0, y: 25, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    });

    // --- INITIAL 3D STACK SETUP ---
    // Top card is i=0. It needs to be at z=0. 
    // Card 1 is at z=-30, Card 2 is at z=-60, etc.
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotationY: 180, // All cards start face down
        z: -i * 60,     // Push them back into the screen
        y: i * 8,       // Shift down slightly to see the layers at the bottom edge
      });
    });

    // --- THE GSAP PHYSICS TIMELINE ---
    this.deckTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.deckWrapper.nativeElement,
        start: 'center center', // Pin perfectly in the center of the screen
        end: '+=4500',          // Lots of vertical scroll distance to cleanly flip 3 cards
        scrub: 1.5,             // Beautiful 1.5 second dampening 
        pin: true,
        anticipatePin: 1
      }
    });

    // For every card in the deck...
    cards.forEach((card, i) => {
      
      // 1. Flip the card face up (reveal the project)
      this.deckTl!.to(card, {
        rotationY: 0,    // Spin 180deg to face forward
        duration: 1.5,
        ease: 'power2.inOut'
      });

      // 2. Pause the timeline momentarily with a dummy tween so the user can easily read the card contents 
      // without it immediately ripping out of their hands as they keep scrolling.
      this.deckTl!.to(card, {
        rotationY: 0, 
        duration: 1.5 
      });

      // 3. If this is NOT the last card, we need to slide it out of the way and push it to the BACK of the deck!
      if (i < cards.length - 1) {
        
        const pushBackTl = gsap.timeline();
        
        // Slide out to the right and bend back slightly
        pushBackTl.to(card, {
          x: 500,        // Move physically right
          rotationZ: 15, // Tilt sideways like sliding a real card
          duration: 1.2,
          ease: 'power1.inOut'
        });

        // Plunge it extremely deep along the Z-axis so it goes behind ALL other cards
        pushBackTl.to(card, {
          z: -(cards.length * 60) - 60, // Deepest point
          duration: 0.2
        });

        // Slide it back to the center of the deck, straightening it out, but now it's located at the bottom of the Z-stack
        pushBackTl.to(card, {
          x: 0,
          rotationZ: 0,
          duration: 1.2,
          ease: 'power1.inOut'
        });

        // AT THE EXACT SAME TIME: All the cards sitting below this one need to shift "UP" to take its place
        const remainingCards = cards.slice(i + 1);
        const shiftUpTl = gsap.timeline();
        
        remainingCards.forEach((c) => {
          shiftUpTl.to(c, {
            z: '+=60', // Move 60px forward
            y: '-=8',  // Move 8px up
            duration: 2.6, // Must match the total duration of the card moving out, plunging, and moving back in
            ease: 'power1.inOut'
          }, 0); // Start at timestep 0 of this sub-timeline
        });

        // Inject the two concurrent animations into the main timeline
        this.deckTl!.add(pushBackTl);
        this.deckTl!.add(shiftUpTl, '<'); // Start at the same time as pushBackTl
      } else {
        // Last card behavior: Just flip and stay there. Maybe add a slight "end" dummy timing so it holds.
        this.deckTl!.to(card, { rotationY: 0, duration: 1 });
      }
    });

    const stInstance = ScrollTrigger.getAll().find(st => st.animation === this.deckTl);
    if (stInstance) this.scrollTriggers.push(stInstance);
  }
}
