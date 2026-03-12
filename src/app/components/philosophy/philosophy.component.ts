import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild, OnDestroy, HostListener } from '@angular/core';
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
        
        <div class="section-header text-center">
          <span class="section-label" #label>Thoughts & Vision</span>
          <h2 class="section-title" #title>The Engineering Library</h2>
          <p class="section-subtitle" #subtitle>
            Scroll down to browse the core architectural principles that guide my work.
          </p>
        </div>

        <!-- 3D Interactive Book -->
        <div class="book-container-wrapper" #bookWrapper>
          <div class="book-container" #bookContainer>
            <div class="book" #book>
              
              <!-- Page 0: The Cover / Manifesto -->
              <div class="page cover" #pageEl style="z-index: 10;">
                <div class="page-front cover-front">
                  <div class="manifesto-icon">📚</div>
                  <h3 class="cover-title">Architecture<br>First</h3>
                  <p class="cover-subtitle">A Manifesto on Building Resilient Systems</p>
                  <cite class="manifesto-author">
                    <span class="font-mono text-[var(--accent)]">amine&#64;phantom</span>
                  </cite>
                  <div class="scroll-hint">Scroll down to read</div>
                </div>
                <div class="page-back"></div>
              </div>

              <!-- Article Pages -->
              <div class="page article-page" *ngFor="let article of articles; let i = index" #pageEl [style.z-index]="9 - i">
                <div class="page-front">
                  <div class="page-content card">
                    <div class="article-meta">
                      <span class="article-cat tag" [class.tag-green]="i === 1">{{ article.category }}</span>
                    </div>
                    
                    <h3 class="article-title">{{ article.title }}</h3>
                    
                    <div class="author-block">
                      <span class="author-name font-mono">{{ article.author }}</span>
                    </div>

                    <p class="article-excerpt">{{ article.excerpt }}</p>

                    <div class="article-footer">
                      <div class="article-tags">
                        <span class="tag" *ngFor="let tag of article.tags">{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- The back of the page (prevents mirrored text when flipped) -->
                <div class="page-back"></div>
              </div>

            </div>
          </div>
        </div>

        <!-- Dev Philosophy Pillars -->
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
      padding-bottom: 6rem;
      overflow-x: hidden;
    }

    .section-header {
      margin-bottom: 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── 3D BOOK STAGE ────────────────────────────────────────── */
    .book-container-wrapper {
      width: 100%;
      height: 85vh; /* Provides the vertical viewport for scrolling */
      margin: 2rem 0 6rem 0;
      position: relative;
    }

    .book-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      perspective: 2000px; /* Crucial for 3D depth */
      -webkit-perspective: 2000px;
    }

    .book {
      position: relative;
      width: 85%;
      max-width: 480px;
      height: 600px;
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      /* Rotate slightly down to see depth */
      transform: rotateX(15deg) rotateY(10deg); 
    }

    /* ── PAGES ────────────────────────────────────────────────── */
    .page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: 0% 50%; /* Anchor left edge (spine) */
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      /* Will be controlled by GSAP, but set default */
      transform: rotateY(0deg); 
      border-radius: 4px 18px 18px 4px; /* Curve the right side of the book */
    }

    /* Front and Back layers of each page ticket */
    .page-front, .page-back {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: inherit;
      overflow: hidden;
    }

    /* The actual content surface */
    .page-front {
      background: linear-gradient(135deg, rgba(30,30,30, 0.95) 0%, rgba(20,20,20, 0.98) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 2px solid rgba(255, 255, 255, 0.4); /* The light Spine */
      box-shadow: 12px 12px 30px rgba(0,0,0,0.8), inset 4px 0 10px rgba(255,255,255,0.05);
      z-index: 2;
    }

    /* Back of the page (darker, mirrored structural fix) */
    .page-back {
      /* Reverses the spine border to match the flip */
      background: linear-gradient(-135deg, rgba(15,15,15, 0.98) 0%, rgba(5,5,5, 1) 100%);
      transform: rotateY(180deg);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-right: 2px solid rgba(255, 255, 255, 0.2); /* Left side spine is now on the right */
      z-index: 1;
      border-radius: 18px 4px 4px 18px;
    }

    /* Specific Cover styling */
    .cover-front {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(145deg, var(--bg-card), var(--bg-hover));
      border: 1px solid var(--accent-cyan);
      border-left: 4px solid var(--accent); /* Darker, thicker spine */
    }
    
    .manifesto-icon { font-size: 5rem; margin-bottom: 2rem; }
    .cover-title { font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 1rem; color: #fff; text-transform: uppercase; letter-spacing: -1px; }
    .cover-subtitle { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 3rem; }
    
    .manifesto-author { font-style: normal; font-size: 0.9rem;}
    
    .scroll-hint { position: absolute; bottom: 2rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; animation: pulse 2.5s infinite; }
    @keyframes pulse { 0%, 100% {opacity: 0.4;} 50% {opacity: 1;} }

    /* Article Content */
    .page-content {
      width: 100%; height: 100%;
      box-sizing: border-box;
      padding: 3.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: transparent;
      border: none;
      box-shadow: none;
    }

    .article-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .article-title {
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1.35;
      color: #fff;
    }

    .author-block {
      margin-bottom: 1.5rem;
    }
    .author-name {
      font-size: 0.9rem;
      color: var(--text-muted);
      opacity: 0.8;
    }

    .article-excerpt {
      font-size: 1rem;
      color: var(--text-dim);
      line-height: 1.8;
      flex: 1;
      position: relative;
      font-family: inherit;
    }

    /* Stylish quote marks indicating it's a book passage */
    .article-excerpt::before {
      content: '"';
      position: absolute;
      top: -1.75rem;
      left: -1.25rem;
      font-size: 4rem;
      color: rgba(124, 106, 255, 0.15);
      font-family: serif;
      pointer-events: none;
    }

    .article-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .article-tags {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }

    /* Pillars row */
    .philosophy-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .philosophy-item {
      padding: 1.8rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color 0.3s ease;
    }

    .philosophy-item:hover {
      border-color: rgba(124, 106, 255, 0.3);
    }

    .pillar-icon { font-size: 1.8rem; margin-bottom: 1rem; }
    .pillar-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .pillar-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.65; }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .book { max-width: 95%; height: 500px; transform: rotateX(10deg); }
      .page-content { padding: 2rem 1.5rem; }
      .article-title { font-size: 1.3rem; }
      .article-excerpt { font-size: 0.9rem; line-height: 1.6; }
      .cover-title { font-size: 2.2rem; }
    }
  `]
})
export class PhilosophyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('philosophySection') philosophySection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  
  // 3D Book References
  @ViewChild('bookWrapper') bookWrapper!: ElementRef;
  @ViewChild('bookContainer') bookContainer!: ElementRef;
  @ViewChild('book') book!: ElementRef;
  @ViewChildren('pageEl') pageEls!: QueryList<ElementRef>;
  
  @ViewChildren('pillarEl') pillarEls!: QueryList<ElementRef>;

  articles = [
    {
      category: '📖 Clean Code',
      author: 'Robert C. Martin',
      title: 'The Boy Scout Rule of Software Architecture',
      excerpt: 'Leave the campground cleaner than you found it. Code rots over time unless actively maintained. True professional engineering isn\'t just about shipping features; it\'s about ruthless refactoring, expressive naming, and ensuring the next maintainer reads your work like well-written prose.',
      tags: ['Refactoring', 'Architecture', 'Clean Code'],
    },
    {
      category: '📖 The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      title: 'Orthogonality & The DRY Principle',
      excerpt: 'Every piece of knowledge must have a single, unambiguous, authoritative representation within a system. Building decoupled, orthogonal systems prevents the ripple effect where changing one component breaks three others. Good design is about minimizing the blast radius of change.',
      tags: ['Design Patterns', 'DRY', 'Decoupling'],
    },
    {
      category: '📖 Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      title: 'Scalability vs. Reliability',
      excerpt: 'A system that stops working when you add more than 10,000 users is not scalable, but a system that randomly loses user data is not reliable. Mastering backend engineering requires navigating the brutal trade-offs between distributed consensus, eventual consistency, and fault tolerance at scale.',
      tags: ['Databases', 'Consensus', 'Fault Tolerance'],
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
  private scrollTriggers: ScrollTrigger[] = [];
  private bookTl: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reducedMotion) {
      setTimeout(() => this.setupAnimations(), 150);
    } else {
      // Degrade gracefully for reduced motion users by flattening the rotation
      this.pageEls.toArray().forEach((page, i) => {
        gsap.set(page.nativeElement, { rotationY: 0, position: 'relative', marginTop: i > 0 ? '2rem' : '0' });
      });
      // Ensure the container is visible
      (this.bookContainer.nativeElement as HTMLElement).style.perspective = 'none';
      (this.book.nativeElement as HTMLElement).style.transform = 'none';
      (this.bookWrapper.nativeElement as HTMLElement).style.height = 'auto';
    }
  }

  ngOnDestroy(): void {
    if (this.bookTl) this.bookTl.kill();
    this.scrollTriggers.forEach(st => st.kill());
  }

  private setupAnimations(): void {
    const section = this.philosophySection.nativeElement;

    // Standard header animations
    gsap.from([
      this.label.nativeElement,
      this.title.nativeElement,
      this.subtitle.nativeElement,
    ], {
      opacity: 0, y: 25, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    });

    // --- 3D BOOK STAGGERED SCROLL ANIMATION ---
    const bookWrapper = this.bookWrapper.nativeElement;
    const pages = this.pageEls.toArray().map(el => el.nativeElement);
    
    // Safety check
    if (pages.length === 0) return;

    // Calculate total pages for mapping timeline
    const totalPages = pages.length;

    // We want the book to stay fixed in place while the user scrolls down to "flip" the pages
    this.bookTl = gsap.timeline({
      scrollTrigger: {
        trigger: bookWrapper,
        start: 'top top+=10%',  // Pin when the book hits near the top of the viewport
        end: '+=4000',          // Requires 4000px of vertical scrolling across the whole book
        scrub: 1.5,             // Smooth 1.5-second easing interpolation
        pin: true,              // Lock it in place
        anticipatePin: 1
      }
    });

    // Sequence the rotation of each page EXCEPT the very last one 
    // The last page acts as the structural back cover of the book
    for (let i = 0; i < totalPages - 1; i++) {
        // Rotate the page over the left-aligned spine Y axis
        // We go to -178 degrees so the pages stack slightly incrementally instead of Z-fighting
        this.bookTl.to(pages[i], {
          rotationY: -178,
          duration: 1,       // Each page turn gets 1 whole unit of time relative to the total timeline
          ease: 'power1.inOut' // Simulates realistic slow-start > fast-middle > slow-end turn
        }, i); // Append directly after the previous page finishes tracking
    }

    const stInstance = ScrollTrigger.getAll().find(st => st.animation === this.bookTl);
    if(stInstance) this.scrollTriggers.push(stInstance);

    // Bottom Pillars stagger in once the book passes
    this.pillarEls.toArray().forEach((el, i) => {
      gsap.from(el.nativeElement, {
        opacity: 0, scale: 0.96, duration: 0.5, delay: i * 0.08, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el.nativeElement, start: 'top 90%', toggleActions: 'play none none none' }
      });
    });
  }
}
