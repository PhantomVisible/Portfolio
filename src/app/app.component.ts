import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { SkillsComponent } from './components/skills/skills.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PhilosophyComponent } from './components/philosophy/philosophy.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    HeroComponent,
    SkillsComponent,
    TimelineComponent,
    ProjectsComponent,
    PhilosophyComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-nav></app-nav>
    <main>
      <app-hero></app-hero>
      <app-skills></app-skills>
      <app-timeline></app-timeline>
      <app-projects></app-projects>
      <app-philosophy></app-philosophy>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host { display: block; }
    main { position: relative; z-index: 1; }
  `]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private lenisInstance: any;
  private rafId: number = 0;
  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initLenis();
  }

  private async initLenis(): Promise<void> {
    if (this.reducedMotion) return;
    try {
      const Lenis = (await import('lenis')).default;
      this.lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      this.lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time: number) => {
        this.lenisInstance?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn('Lenis init failed, falling back to native scroll.', e);
    }
  }

  ngOnDestroy(): void {
    if (this.lenisInstance) {
      this.lenisInstance.destroy();
    }
    if (this.rafId) cancelAnimationFrame(this.rafId);
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
