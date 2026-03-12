import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
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
        <span class="section-label" #label>Systems Over Screenshots</span>
        <h2 class="section-title" #title>Featured Work</h2>
        <p class="section-subtitle" #subtitle>
          Architecture-first projects. Each card details the engineering decisions, not just the outcome.
        </p>

        <div class="projects-grid">
          <article class="project-card card" *ngFor="let project of projects" #cardEl>
            <div class="project-header">
              <div class="project-icon">{{ project.icon }}</div>
              <div>
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-tagline font-mono">{{ project.tagline }}</p>
              </div>
              <a *ngIf="project.github" [href]="project.github" target="_blank" rel="noopener"
                 class="project-link" aria-label="View on GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>

            <p class="project-desc">{{ project.desc }}</p>

            <div class="project-tags">
              <span class="tag" *ngFor="let tag of project.tags">{{ tag }}</span>
            </div>

            <details class="arch-details">
              <summary class="arch-summary">
                <span>Architecture Details</span>
                <span class="arch-chevron">›</span>
              </summary>
              <div class="arch-content">
                <div class="arch-item" *ngFor="let detail of project.architecture">
                  <span class="arch-label font-mono">{{ detail.layer }}</span>
                  <span class="arch-value">{{ detail.detail }}</span>
                </div>
              </div>
            </details>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      background: var(--bg-secondary);
      position: relative;
    }

    .projects-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.75rem;
    }

    .project-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .project-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .project-icon {
      font-size: 2rem;
      flex-shrink: 0;
      line-height: 1;
    }

    .project-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }

    .project-tagline {
      font-size: 0.75rem;
      color: var(--accent);
    }

    .project-link {
      margin-left: auto;
      color: var(--text-muted);
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    .project-link:hover {
      color: var(--accent);
    }

    .project-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    /* Architecture details */
    .arch-details {
      border-top: 1px solid var(--border);
      padding-top: 1rem;
      margin-top: auto;
    }

    .arch-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      list-style: none;
      user-select: none;
      transition: color 0.2s;
    }

    .arch-summary::-webkit-details-marker { display: none; }

    .arch-summary:hover { color: var(--text-dim); }

    .arch-chevron {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    details[open] .arch-chevron {
      transform: rotate(90deg);
    }

    .arch-content {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .arch-item {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 1rem;
      font-size: 0.82rem;
    }

    .arch-label {
      color: var(--accent-green);
      font-size: 0.72rem;
    }

    .arch-value {
      color: var(--text-dim);
      line-height: 1.5;
    }

    @media (max-width: 480px) {
      .projects-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
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
      title: 'Car Management System',
      tagline: 'Cloud-native microservices platform',
      github: 'https://github.com/PhantomVisible/car-management-system',
      desc: 'Enterprise-grade car rental platform built on microservices. Features real-time availability, secure auth, independent service deployability, and high-volume reservation processing.',
      tags: ['Java', 'Spring Boot', 'Eureka', 'Microservices', 'Hexagonal Architecture', 'PostgreSQL'],
      architecture: [
        { layer: 'Service Mesh', detail: 'Eureka discovery server + API Gateway for unified routing; independent Docker deployments' },
        { layer: 'Auth Service', detail: 'JWT-based Spring Security; user roles (admin/customer) with service-to-service auth' },
        { layer: 'Rental Service', detail: 'Car inventory + reservation logic; event-driven availability updates' },
        { layer: 'Frontend', detail: 'Angular SPA consuming the gateway API; image upload → Base64 storage + retrieval' },
      ],
    },
    {
      icon: '🏦',
      title: 'bank-account-system',
      tagline: 'Spring Boot + Java',
      github: 'https://github.com/PhantomVisible/bank-account-system',
      desc: ' robust banking application where users can manage accounts, perform transactions, and generate account statements. The application follows clean architecture principles and handles persistence in both SQL and NoSQL databases. Users should be able to export their bank statement as a PDF. ',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Spring Data JPA', 'H2 Database'],
      architecture: [
        { layer: 'Core Architecture', detail: 'Spring Boot REST API built on Clean Architecture principles, ensuring strict separation between domain business logic and web layers.' },
        { layer: 'Data & Persistence', detail: 'Polyglot persistence model utilizing Spring Data JPA for ACID-compliant SQL transactions and NoSQL for scalable document storage.' },
        { layer: 'Document Engine', detail: 'Custom reporting service handling dynamic data aggregation and real-time PDF compilation for secure bank statement exports.' },
        { layer: 'Security & Auth', detail: 'Stateless authentication architecture secured via Spring Security and JWT, ensuring robust endpoint protection and user isolation.' },
      ],
    },
  ];

  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reducedMotion) {
      this.setupScrollAnimations();
    }
  }

  private setupScrollAnimations(): void {
    const section = this.projectsSection.nativeElement;

    gsap.from([
      this.label.nativeElement,
      this.title.nativeElement,
      this.subtitle.nativeElement,
    ], {
      opacity: 0,
      y: 25,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    // Each card: scale 0.95 → 1 + fade in
    this.cardEls.toArray().forEach((cardRef, i) => {
      const card = cardRef.nativeElement;
      gsap.from(card, {
        opacity: 0,
        scale: 0.95,
        y: 30,
        duration: 0.65,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }
}
