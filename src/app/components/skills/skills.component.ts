import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        <span class="section-label" #label>Technical Arsenal</span>
        <h2 class="section-title" #title>Built to Ship</h2>
        <p class="section-subtitle" #subtitle>
          A full-stack toolkit forged through intensive bootcamp training and real-world project delivery.
        </p>

        <div class="categories-grid">
          <div class="skill-category card" *ngFor="let cat of categories; let ci = index" [attr.data-cat]="ci" #categoryEl>
            <div class="cat-header">
              <span class="cat-icon">{{ cat.icon }}</span>
              <h3 class="cat-name">{{ cat.name }}</h3>
            </div>
            <div class="skills-badges">
              <span class="skill-badge" *ngFor="let skill of cat.skills" #badgeEl>
                {{ skill }}
              </span>
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
    }

    .skills-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .skill-category {
      padding: 1.75rem;
    }

    .cat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .cat-icon {
      font-size: 1.4rem;
      line-height: 1;
    }

    .cat-name {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .skills-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-dim);
      transition: all 0.2s ease;
      cursor: default;
    }

    .skill-badge:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(124, 106, 255, 0.06);
    }
  `]
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChildren('categoryEl') categoryEls!: QueryList<ElementRef>;

  categories = [
    {
      icon: '☕',
      name: 'Backend',
      skills: ['Java', 'Spring Boot', 'Spring AI', 'Spring Security', 'H2 / JPA', 'REST APIs', 'Hexagonal Arch'],
    },
    {
      icon: '⚡',
      name: 'Frontend',
      skills: ['Angular 17+', 'TypeScript', 'HTML5', 'CSS3 / SCSS', 'RxJS', 'Standalone Components'],
    },
    {
      icon: '🐧',
      name: 'DevOps & OS',
      skills: ['Linux (Fedora)', 'Docker', 'Git / GitHub', 'Maven', 'Nginx', 'SSH'],
    },
    {
      icon: '🤖',
      name: 'AI & Tooling',
      skills: ['Gemini 2.5 Flash', 'Antigravity', 'OpenCode', 'Spring AI', 'Prompt Engineering', 'Vibe Coding'],
    },
    {
      icon: '🗄️',
      name: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'H2 (embedded)', 'JPA / Hibernate'],
    },
    {
      icon: '🏗️',
      name: 'Architecture',
      skills: ['Microservices', 'Hexagonal', 'REST', 'Eureka', 'Clean Code', 'SOLID'],
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
    const section = this.skillsSection.nativeElement;

    // Header elements stagger in
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

    // Category cards stagger with spring-like easing
    const cards = this.categoryEls.toArray().map(el => el.nativeElement);
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.65,
      stagger: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        toggleActions: 'play none none none',
      }
    });

    // Individual badges stagger in after cards
    setTimeout(() => {
      const allBadges = section.querySelectorAll('.skill-badge');
      gsap.from(allBadges, {
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 55%',
          toggleActions: 'play none none none',
        }
      });
    }, 50);
  }
}
