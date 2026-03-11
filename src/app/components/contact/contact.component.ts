import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" class="contact-section" #contactSection>
      <div class="container">
        <span class="section-label" #label>Let's Connect</span>
        <h2 class="section-title" #title>Get In Touch</h2>
        <p class="section-subtitle" #subtitle>
          Open to full-stack roles, freelance projects, and interesting collaborations.
          I respond within 24 hours.
        </p>

        <div class="contact-grid" #contactGrid>
          <!-- Contact Info -->
          <div class="contact-info">
            <div class="contact-links">
              <a href="mailto:amineelhaouat@outlook.com" class="contact-item card">
                <span class="contact-icon">📧</span>
                <div>
                  <span class="contact-label font-mono">Email</span>
                  <span class="contact-value">amineelhaouat&#64;outlook.com</span>
                </div>
              </a>
              <a href="tel:+212716110954" class="contact-item card">
                <span class="contact-icon">📱</span>
                <div>
                  <span class="contact-label font-mono">Phone</span>
                  <span class="contact-value">+212 716 110 954</span>
                </div>
              </a>
              <div class="contact-item card">
                <span class="contact-icon">📍</span>
                <div>
                  <span class="contact-label font-mono">Location</span>
                  <span class="contact-value">Fez, Morocco — Open to Remote</span>
                </div>
              </div>
            </div>

            <div class="social-row">
              <a href="https://github.com/PhantomVisible" target="_blank" rel="noopener"
                 class="social-btn" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/amine-el-haouat/" target="_blank" rel="noopener"
                 class="social-btn" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <form class="contact-form card" #contactForm (submit)="handleSubmit($event)">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" name="name" class="form-input"
                       placeholder="Your name" required>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" name="email" class="form-input"
                       placeholder="your@email.com" required>
              </div>
            </div>
            <div class="form-group">
              <label for="subject" class="form-label">Subject</label>
              <input type="text" id="subject" name="subject" class="form-input"
                     placeholder="What's this about?" required>
            </div>
            <div class="form-group">
              <label for="message" class="form-label">Message</label>
              <textarea id="message" name="message" class="form-textarea"
                        rows="5" placeholder="Tell me about your project or opportunity..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary form-submit">
              <span *ngIf="!submitted">Send Message →</span>
              <span *ngIf="submitted">✓ Message Sent!</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      background: var(--bg-secondary);
      position: relative;
    }

    .contact-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 3rem;
      align-items: start;
    }

    /* Info */
    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.2s ease;
    }

    .contact-item:hover {
      border-color: rgba(124, 106, 255, 0.3);
    }

    .contact-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .contact-label {
      display: block;
      font-size: 0.68rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.2rem;
    }

    .contact-value {
      font-size: 0.88rem;
      color: var(--text-dim);
    }

    .social-row {
      display: flex;
      gap: 0.75rem;
    }

    .social-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(124, 106, 255, 0.06);
    }

    /* Form */
    .contact-form {
      padding: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }

    .form-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .form-input,
    .form-textarea {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      outline: none;
      width: 100%;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--text-muted);
    }

    .form-input:focus,
    .form-textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(124, 106, 255, 0.12);
    }

    .form-textarea {
      resize: vertical;
      min-height: 130px;
    }

    .form-submit {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }

    @media (max-width: 900px) {
      .contact-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 500px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('contactGrid') contactGrid!: ElementRef;

  submitted = false;
  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reducedMotion) {
      this.setupScrollAnimations();
    }
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    this.submitted = true;
    setTimeout(() => { this.submitted = false; }, 4000);
    (e.target as HTMLFormElement).reset();
  }

  private setupScrollAnimations(): void {
    const section = this.contactSection.nativeElement;

    gsap.from([
      this.label.nativeElement,
      this.title.nativeElement,
      this.subtitle.nativeElement,
    ], {
      opacity: 0, y: 25, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    });

    gsap.from(this.contactGrid.nativeElement.children, {
      opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: this.contactGrid.nativeElement, start: 'top 80%', toggleActions: 'play none none none' }
    });
  }
}
