import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <span class="footer-logo font-mono">AE<span class="footer-dot">.</span></span>
        <p class="footer-text">
          © {{ year }} Amine El Haouat.
          <span class="footer-sub">Built with Angular + GSAP.</span>
        </p>
        <div class="footer-links">
          <a href="https://github.com/PhantomVisible" target="_blank" rel="noopener" class="footer-link">GitHub</a>
          <a href="https://www.linkedin.com/in/amine-el-haouat/" target="_blank" rel="noopener" class="footer-link">LinkedIn</a>
          <a href="mailto:amineelhaouat@outlook.com" class="footer-link">Email</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-primary);
      border-top: 1px solid var(--border);
      padding: 2rem 0;
    }

    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-logo {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-dim);
    }

    .footer-dot {
      color: var(--accent-green);
    }

    .footer-text {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .footer-sub {
      opacity: 0.6;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
    }

    .footer-link {
      font-size: 0.82rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--accent);
    }

    @media (max-width: 600px) {
      .footer-inner { justify-content: center; text-align: center; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
