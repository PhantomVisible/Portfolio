import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-philosophy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="philosophy" class="philosophy-section" #philosophySection>
      <div class="container">
        <span class="section-label" #label>Thoughts & Vision</span>
        <h2 class="section-title" #title>Building "Main Character" Experiences</h2>
        <p class="section-subtitle" #subtitle>
          Products that give users agency, narrative momentum, and the feeling they're the protagonist.
        </p>

        <!-- Philosophy Manifesto -->
        <div class="manifesto card" #manifesto>
          <div class="manifesto-icon">💡</div>
          <blockquote class="manifesto-quote">
            "The best software doesn't just solve problems — it gives users a sense of
            agency and forward momentum. I design systems around narrative tropes: quests,
            progress bars, mastery loops. When a user opens your app, they should feel like
            the main character of their own story."
          </blockquote>
          <cite class="manifesto-author">
            <span class="font-mono text-[var(--accent)]">amine&#64;phantom</span> ~/philosophy
          </cite>
        </div>

        <!-- Article Feed -->
        <div class="articles-grid">
          <article class="article-card card" *ngFor="let article of articles; let i = index" #articleEl>
            <div class="article-meta">
              <span class="article-cat tag" [class.tag-green]="i === 0">{{ article.category }}</span>
              <span class="article-date font-mono">{{ article.date }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-footer">
              <span class="article-read font-mono">{{ article.readTime }}</span>
              <div class="article-tags">
                <span class="tag" *ngFor="let tag of article.tags">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Dev Philosophy Row -->
        <div class="philosophy-row">
          <div class="philosophy-item" *ngFor="let item of pillars" #pillarEl>
            <div class="pillar-icon">{{ item.icon }}</div>
            <h3 class="pillar-title">{{ item.title }}</h3>
            <p class="pillar-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .philosophy-section {
      background: var(--bg-primary);
      position: relative;
    }

    /* Manifesto */
    .manifesto {
      padding: 2.5rem;
      margin-bottom: 3rem;
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      gap: 0.5rem 1.5rem;
      align-items: start;
      position: relative;
      overflow: hidden;
    }

    .manifesto::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--accent), var(--accent-cyan));
    }

    .manifesto-icon {
      font-size: 1.8rem;
      grid-row: 1;
      grid-column: 1;
    }

    .manifesto-quote {
      grid-row: 1;
      grid-column: 2;
      font-size: 1.05rem;
      color: var(--text-dim);
      line-height: 1.8;
      font-style: italic;
      font-weight: 400;
      quotes: none;
    }

    .manifesto-author {
      grid-row: 2;
      grid-column: 2;
      font-style: normal;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    /* Article grid */
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }

    .article-card {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      cursor: default;
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .article-date {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .article-title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.4;
    }

    .article-excerpt {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.7;
      flex: 1;
    }

    .article-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
    }

    .article-read {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .article-tags {
      display: flex;
      gap: 0.35rem;
    }

    /* Pillars row */
    .philosophy-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .philosophy-item {
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      transition: border-color 0.3s ease;
    }

    .philosophy-item:hover {
      border-color: rgba(124, 106, 255, 0.3);
    }

    .pillar-icon {
      font-size: 1.6rem;
      margin-bottom: 0.75rem;
    }

    .pillar-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .pillar-desc {
      font-size: 0.83rem;
      color: var(--text-muted);
      line-height: 1.65;
    }
  `]
})
export class PhilosophyComponent implements AfterViewInit {
  @ViewChild('philosophySection') philosophySection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('manifesto') manifesto!: ElementRef;
  @ViewChildren('articleEl') articleEls!: QueryList<ElementRef>;
  @ViewChildren('pillarEl') pillarEls!: QueryList<ElementRef>;

  articles = [
    {
      category: '🧠 Psychology',
      date: 'Mar 2026',
      title: 'Narrative Loops & the Dopamine Architecture of Great UX',
      excerpt: 'Why the best digital products borrow from JRPG quest design — progress bars, unlocks, and mastery arcs are not gamification gimmicks; they are cognitive maps that make users feel capable.',
      readTime: '6 min read',
      tags: ['UX', 'Psychology'],
    },
    {
      category: '⚡ Engineering',
      date: 'Feb 2026',
      title: 'Vibe Coding with AI: From Prompt to Production in 48 Hours',
      excerpt: 'A field report on shipping a full-stack Spring Boot + Angular app using Antigravity as co-pilot. What worked, what the AI got confidently wrong, and where the human judgment still wins.',
      readTime: '8 min read',
      tags: ['AI', 'Workflow'],
    },
    {
      category: '🎯 Product',
      date: 'Jan 2026',
      title: 'Main Character Energy as a Design Principle',
      excerpt: 'Users abandon tools that make them feel like NPCs. Building systems that center the user as the hero of their workflow — a philosophical and practical framework for empowering software.',
      readTime: '5 min read',
      tags: ['Design', 'Philosophy'],
    },
  ];

  pillars = [
    {
      icon: '🏗️',
      title: 'Systems Thinking',
      desc: 'Every feature is a module in a larger machine. I think in interfaces, contracts, and failure modes before writing a line.',
    },
    {
      icon: '🎭',
      title: 'Narrative UX',
      desc: 'Great products tell a story. I borrow from screenwriting and game design to shape user journeys that feel intentional.',
    },
    {
      icon: '⚡',
      title: 'AI-Native Workflow',
      desc: 'I code with AI as a co-pilot, not a crutch. The goal is 10x velocity while keeping architect-level judgment.',
    },
    {
      icon: '🔬',
      title: 'Continuous Learning',
      desc: 'From competitive gaming to behavioral economics — I pull mental models from every domain into how I write software.',
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
    const section = this.philosophySection.nativeElement;

    gsap.from([
      this.label.nativeElement,
      this.title.nativeElement,
      this.subtitle.nativeElement,
    ], {
      opacity: 0, y: 25, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    });

    gsap.from(this.manifesto.nativeElement, {
      opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: this.manifesto.nativeElement, start: 'top 80%', toggleActions: 'play none none none' }
    });

    this.articleEls.toArray().forEach((el, i) => {
      gsap.from(el.nativeElement, {
        opacity: 0, y: 35, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: el.nativeElement, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    this.pillarEls.toArray().forEach((el, i) => {
      gsap.from(el.nativeElement, {
        opacity: 0, scale: 0.96, duration: 0.5, delay: i * 0.08, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el.nativeElement, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  }
}
