import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="nav-header" [class.scrolled]="scrolled">
      <div class="container nav-inner">
        <a href="#home" class="nav-logo" aria-label="Home">
          <span class="logo-text">AE</span>
          <span class="logo-dot"></span>
        </a>

        <nav class="nav-links" [class.open]="menuOpen" aria-label="Main navigation">
          <a *ngFor="let link of navLinks"
             [href]="link.href"
             class="nav-link"
             [class.active]="activeSection === link.id"
             (click)="closeMenu()">
            {{ link.label }}
          </a>
        </nav>

        <button class="hamburger" [class.open]="menuOpen"
                (click)="toggleMenu()"
                aria-label="Toggle navigation"
                [attr.aria-expanded]="menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .nav-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1.25rem 0;
      transition: all 0.4s ease;
    }

    .nav-header.scrolled {
      background: rgba(10, 12, 15, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0.85rem 0;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
    }

    .logo-text {
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: 0.05em;
    }

    .logo-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-green);
      animation: blink 2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted);
      text-decoration: none;
      letter-spacing: 0.01em;
      transition: color 0.2s ease;
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transition: transform 0.25s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--text-primary);
    }

    .nav-link:hover::after,
    .nav-link.active::after {
      transform: scaleX(1);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-dim);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .hamburger.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }
    .hamburger.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    @media (max-width: 768px) {
      .hamburger { display: flex; }

      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        bottom: 0;
        width: 260px;
        background: var(--bg-secondary);
        border-left: 1px solid var(--border);
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 2rem;
        gap: 1.5rem;
        transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nav-links.open {
        right: 0;
      }

      .nav-link {
        font-size: 1.1rem;
      }
    }
  `]
})
export class NavComponent implements OnInit {
  scrolled = false;
  menuOpen = false;
  activeSection = 'home';

  navLinks = [
    { href: '#home', id: 'home', label: 'Home' },
    { href: '#skills', id: 'skills', label: 'Skills' },
    { href: '#timeline', id: 'timeline', label: 'Timeline' },
    { href: '#projects', id: 'projects', label: 'Work' },
    { href: '#philosophy', id: 'philosophy', label: 'Thoughts' },
    { href: '#contact', id: 'contact', label: 'Contact' },
  ];

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.initIntersectionObserver();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  private initIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    setTimeout(() => {
      this.navLinks.forEach(link => {
        const el = document.getElementById(link.id);
        if (el) this.observer.observe(el);
      });
    }, 500);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
