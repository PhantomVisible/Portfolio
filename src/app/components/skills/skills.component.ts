import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="skills" class="skills-section" #skillsSection>
      <div class="container">
        
        <div class="section-header">
          <span class="section-label">Technical Arsenal</span>
          <h2 class="section-title">Built to Ship</h2>
          <p class="section-subtitle">
            A full-stack toolkit forged through intensive bootcamp training and real-world project delivery.
          </p>
        </div>

        <div class="bento-grid" #bentoGrid>
          <div class="skill-card" *ngFor="let cat of categories; let ci = index" [ngClass]="getCardClass(ci)">
            
            <div class="card-glow"></div>
            
            <div class="card-content">
              <div class="cat-header">
                <div class="icon-wrapper">
                  <span class="cat-icon">{{ cat.icon }}</span>
                </div>
                <h3 class="cat-name">{{ cat.name }}</h3>
              </div>
              
              <div class="skills-badges">
                <span class="skill-badge" *ngFor="let skill of cat.skills; let vi = index" [style.animation-delay]="(ci * 0.1) + (vi * 0.05) + 's'">
                  {{ skill }}
                </span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .skills-section {
      background: var(--bg-secondary);
      position: relative;
      padding: 6rem 0;
      overflow: hidden;
    }

    .skills-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
    }
    
    .section-header {
      margin-bottom: 4rem;
    }
    
    .section-title {
      background: linear-gradient(90deg, #ffffff, var(--text-dim));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 3rem;
    }

    /* ── BENTO GRID ────────────────────────────────────────────── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1.5rem;
      opacity: 0; /* Hidden until IO fires */
      transform: translateY(30px);
      transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .bento-grid.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    /* Asymmetrical columns */
    .skill-card {
      position: relative;
      grid-column: span 12; /* Mobile default */
      border-radius: 24px;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .skill-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.12);
    }

    /* Subtle top glowing borders */
    .skill-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      opacity: 0.3;
      transition: opacity 0.3s;
    }
    .skill-card:hover::before { opacity: 0.8; }

    /* Size assignments for Desktop */
    @media (min-width: 768px) {
      .card-large { grid-column: span 7; }
      .card-medium { grid-column: span 5; }
      .card-tall { grid-column: span 4; grid-row: span 2; }
      .card-square { grid-column: span 4; }
    }
    @media (min-width: 1024px) {
      .card-large { grid-column: span 8; }
      .card-medium { grid-column: span 4; }
      .card-tall { grid-column: span 4; grid-row: span 2; }
      .card-square { grid-column: span 4; }
    }

    /* Ambient internal glow */
    .card-glow {
      position: absolute;
      top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
      z-index: 0;
    }
    .skill-card:hover .card-glow { opacity: 1; }

    .card-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .cat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .icon-wrapper {
      width: 44px; height: 44px;
      display: flex;
      align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      font-size: 1.4rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
    }

    .cat-name {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #e2e8f0;
      margin: 0;
    }

    .skills-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      margin-top: auto; /* Push to bottom if card is tall */
    }

    /* ── NATIVE CSS ANIMATIONS (No GSAP opacity bugs) ────────────────── */
    .skill-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: #94a3b8;
      transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
      cursor: crosshair;
      
      /* Hidden state before animation */
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }

    /* When the parent bento grid enters the view, fire the animation */
    .bento-grid.in-view .skill-badge {
      animation: badgePop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    @keyframes badgePop {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .skill-badge:hover {
      border-color: var(--accent);
      color: #ffffff;
      background: rgba(139, 92, 246, 0.15);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }
  `]
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bentoGrid') bentoGrid!: ElementRef;

  private observer: IntersectionObserver | null = null;
  private reducedMotion = false;

  categories = [
    {
      icon: '☕',
      name: 'Backend',
      skills: ['Java', 'Spring Boot', 'Spring AI', 'Spring Security', 'REST APIs', 'Hexagonal Arch'],
    },
    {
      icon: '⚡',
      name: 'Frontend',
      skills: ['Angular 17+', 'TypeScript', 'HTML5', 'CSS3 / SCSS', 'RxJS', 'Standalone Components', 'JavaScript', 'Bootstrap', 'Tailwind CSS'],
    },
    {
      icon: '🐧',
      name: 'DevOps & OS',
      skills: ['Linux (Fedora)', 'Docker', 'Git / GitHub', 'Maven', 'Jenkins', 'Gradle', 'Nginx', 'SSH'],
    },
    {
      icon: '🤖',
      name: 'AI & Tooling',
      skills: ['Antigravity', 'OpenCode', 'Spring AI', 'Prompt Engineering', 'Vibe Coding', 'Claude code', 'Codex', 'Gemini'],
    },
    {
      icon: '🗄️',
      name: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'H2 (embedded)', 'JPA / Hibernate', 'NoSQL', 'SQL'],
    },
    {
      icon: '🏗️',
      name: 'Architecture',
      skills: ['Microservices', 'Hexagonal', 'REST', 'Eureka', 'Clean Code', 'SOLID','DDD','Design Patterns'],
    },
  ];

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reducedMotion) {
      // Need a slight timeout to ensure DOM is ready for observation
      setTimeout(() => this.setupIntersectionObserver(), 100);
    } else {
      // If user prefers reduced motion, force show immediately
      if (this.bentoGrid) {
        this.bentoGrid.nativeElement.classList.add('in-view');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.bentoGrid) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Fire when 15% of the bento grid is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.observer?.unobserve(entry.target); 
        }
      });
    }, options);

    this.observer.observe(this.bentoGrid.nativeElement);
  }

  getCardClass(index: number): string {
    // Generate an asymmetrical bento box layout based on the index position
    switch (index) {
      case 0: return 'card-large';  // Backend (wide)
      case 1: return 'card-medium'; // Frontend (medium beside Backend)
      case 2: return 'card-tall';   // DevOps (tall, spans two rows on right)
      case 3: return 'card-square'; // AI Tooling (square bottom left)
      case 4: return 'card-square'; // Database (square bottom middle)
      case 5: return 'card-large';  // Architecture (wide closing row)
      default: return 'card-medium';
    }
  }
}
