import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="timeline" class="timeline-section" #timelineSection>
      <div class="container">
        <span class="section-label" #label>Journey</span>
        <h2 class="section-title" #title>Experience & Training</h2>
        <p class="section-subtitle" #subtitle>
          From engineering degree to full-stack bootcamp and real-world delivery.
        </p>

        <div class="timeline-wrapper">
          <!-- The scroll-scrubbed vertical line -->
          <div class="timeline-track" #timelineTrack>
            <div class="timeline-fill" #timelineFill></div>
          </div>

          <div class="timeline-items">
            <div class="timeline-item"
                 *ngFor="let item of timelineItems; let i = index"
                 [class.right]="i % 2 !== 0"
                 #itemEl>
              <div class="timeline-dot" [class.dot-accent]="item.highlight" #dotEl></div>
              <div class="timeline-card card" #cardEl>
                <div class="timeline-meta">
                  <span class="timeline-date font-mono">{{ item.date }}</span>
                  <span class="timeline-status tag" [class.tag-green]="item.highlight">{{ item.status }}</span>
                </div>
                <h3 class="timeline-role">{{ item.role }}</h3>
                <p class="timeline-org">{{ item.org }}</p>
                <p class="timeline-desc">{{ item.desc }}</p>
                <div class="timeline-tags" *ngIf="item.tags">
                  <span class="tag" *ngFor="let tag of item.tags">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline-section {
      background: var(--bg-primary);
      position: relative;
      overflow: hidden;
    }

    .timeline-wrapper {
      position: relative;
      padding: 0 0 2rem;
    }

    /* Vertical Track */
    .timeline-track {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border);
      transform: translateX(-50%);
    }

    .timeline-fill {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0%;
      background: linear-gradient(180deg, var(--accent), var(--accent-cyan));
      border-radius: 2px;
      transform-origin: top;
    }

    /* Items */
    .timeline-items {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding-top: 1rem;
    }

    .timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 32px 1fr;
      align-items: start;
      gap: 0 1.5rem;
    }

    .timeline-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--bg-secondary);
      border: 2px solid var(--border);
      margin: 1.5rem auto 0;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
      grid-column: 2;
    }

    .timeline-dot.dot-accent {
      border-color: var(--accent);
      background: var(--accent);
      box-shadow: 0 0 12px rgba(124, 106, 255, 0.5);
    }

    .timeline-card {
      padding: 1.5rem;
      grid-column: 1;
    }

    .timeline-item.right .timeline-card {
      grid-column: 3;
      grid-row: 1;
    }

    .timeline-item.right .timeline-dot {
      grid-column: 2;
      grid-row: 1;
    }

    .timeline-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .timeline-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .timeline-status {
      font-size: 0.68rem;
    }

    .timeline-role {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .timeline-org {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent);
      margin-bottom: 0.75rem;
    }

    .timeline-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 0.75rem;
    }

    .timeline-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .timeline-track { left: 20px; }

      .timeline-item,
      .timeline-item.right {
        grid-template-columns: 32px 1fr;
        grid-template-rows: auto;
      }

      .timeline-dot,
      .timeline-item.right .timeline-dot {
        grid-column: 1;
        grid-row: 1;
        margin-left: 3px;
      }

      .timeline-card,
      .timeline-item.right .timeline-card {
        grid-column: 2;
        grid-row: 1;
      }
    }
  `]
})
export class TimelineComponent implements AfterViewInit {
  @ViewChild('timelineSection') timelineSection!: ElementRef;
  @ViewChild('timelineFill') timelineFill!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef>;
  @ViewChildren('dotEl') dotEls!: QueryList<ElementRef>;

  timelineItems = [
    {
      date: '2026 – Present',
      status: '🟢 Evolving',
      role: 'Founder & Creative Director',
      org: 'Plant Social',
      desc: 'Building an interactive, AI-powered social platform for plant enthusiasts. Designed to bridge robust backend data with engaging, gamified user workflows.',
      tags: ['System Design', 'Gamification', 'REST APIs', 'UI/UX', 'AI', 'Spring Boot', 'Angular'],
      highlight: true,
    },
    {
      date: '2025 – 2026',
      status: '🟢 Completed',
      role: 'Full-Stack Java/Angular Bootcamp',
      org: 'ArkX Academy × JobinTech',
      desc: 'Intensive full-stack bootcamp building production-grade applications with Java, Spring Boot, Angular, and modern DevOps practices.',
      tags: ['Java', 'Spring Boot', 'Angular', 'Docker'],
      highlight: true,
    },
    {
      date: '2024 – 2025',
      status: 'Experience',
      role: 'ISP Technical Support Consultant',
      org: 'Alten — Bouygues Telecom',
      desc: 'Supported FTTH fiber installations via remote diagnostics and Salesforce ticket management. Bridge between field technicians and clients.',
      tags: ['Salesforce', 'FTTH', 'Remote Diagnostics'],
      highlight: false,
    },
    {
      date: '2020 – 2024',
      status: '🟢 Graduated',
      role: 'BSc Computer Science & Technology',
      org: 'Dalian Polytechnic University',
      desc: 'Four-year engineering degree in Computer Science — covering algorithms, data structures, system design, databases, and software engineering fundamentals.',
      tags: ['CS Fundamentals', 'Algorithms', 'System Design'],
      highlight: true,
    },
    {
      date: '2022 – 2023',
      status: 'Experience',
      role: 'Retention Agent',
      org: 'Cnexia — Bell Aliant',
      desc: 'Retained telecom customers through negotiation and consultative sales. Strong KPIs on churn reduction across mobile, TV, internet, and home services.',
      tags: ['Retention', 'Negotiation', 'CRM'],
      highlight: false,
    },
    {
      date: '2021 – 2022',
      status: 'Experience',
      role: 'Inbound Customer Service',
      org: 'Concentrix — Louvre Hotels Group',
      desc: 'Managed international hotel reservations across a global portfolio through Opera PMS. High-quality service delivery across time zones.',
      tags: ['Opera PMS', 'B2B', 'Multilingual'],
      highlight: false,
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
    const section = this.timelineSection.nativeElement;

    // Header
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

    // Scroll-scrubbed timeline line fill
    gsap.fromTo(this.timelineFill.nativeElement,
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section.querySelector('.timeline-wrapper'),
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.5,
        }
      }
    );

    // Each card fades in when scrolled to
    this.cardEls.toArray().forEach((cardRef, i) => {
      const card = cardRef.nativeElement;
      const isRight = i % 2 !== 0;

      gsap.from(card, {
        opacity: 0,
        x: isRight ? 50 : -50,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Dots pop in
    this.dotEls.toArray().forEach(dotRef => {
      const dot = dotRef.nativeElement;
      gsap.from(dot, {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: dot,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }
}
