import { animate } from '../utils/animations';
import { getCSSTransitionDuration } from '../utils/css';

export class SplitAnimation {
  private introSection: HTMLElement;
  private codeWorld: HTMLElement;
  private artWorld: HTMLElement;
  private divider: HTMLElement;
  private sidebar: HTMLElement;

  constructor(
    introSection: HTMLElement,
    codeWorld: HTMLElement,
    artWorld: HTMLElement,
    divider: HTMLElement,
    sidebar: HTMLElement
  ) {
    if (!introSection) {
      throw new Error('SplitAnimation: introSection is required');
    }
    if (!codeWorld) {
      throw new Error('SplitAnimation: codeWorld is required');
    }
    if (!artWorld) {
      throw new Error('SplitAnimation: artWorld is required');
    }
    if (!divider) {
      throw new Error('SplitAnimation: divider is required');
    }
    if (!sidebar) {
      throw new Error('SplitAnimation: sidebar is required');
    }

    this.introSection = introSection;
    this.codeWorld = codeWorld;
    this.artWorld = artWorld;
    this.divider = divider;
    this.sidebar = sidebar;
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      // 从 CSS 变量读取时长
      const fadeoutDuration = getCSSTransitionDuration('--split-intro-fadeout'); // 500ms
      const particleDelay = getCSSTransitionDuration('--split-particle-delay'); // 300ms
      const dividerDelay = getCSSTransitionDuration('--split-divider-delay'); // 600ms
      const sidebarDelay = getCSSTransitionDuration('--split-sidebar-delay'); // 900ms
      const totalDuration = getCSSTransitionDuration('--split-total-duration'); // 1500ms

      // 第一步：首屏震动并淡出（使用组合动画）
      this.introSection.classList.add('shake-and-fade-out');

      // 第二步：等待淡出完成后隐藏首屏
      setTimeout(() => {
        this.introSection.classList.add('hidden');
        this.introSection.classList.remove('shake-and-fade-out');
        
        // 第三步：先触发分屏动画（裂开效果）
        this.codeWorld.classList.add('split-active');
        this.artWorld.classList.add('split-active');
        
        // 第四步：稍微延迟后触发粒子爆炸（避免掩盖裂开动画）
        setTimeout(() => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          this.createParticleExplosion(centerX, centerY);
        }, particleDelay);
        
        // 第五步：显示分割线
        setTimeout(() => {
          this.divider.classList.add('visible');
        }, dividerDelay);
        
        // 第六步：显示侧边栏
        setTimeout(() => {
          this.sidebar.classList.add('visible');
        }, sidebarDelay);
        
        // 动画完成
        setTimeout(() => {
          resolve();
        }, totalDuration);
      }, fadeoutDuration);
    });
  }

  // 创建粒子爆炸效果
  createParticleExplosion(x: number, y: number): void {
    const particleDuration = getCSSTransitionDuration('--split-particle-duration'); // 1000ms

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 200 + Math.random() * 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      animate(particleDuration, (progress) => {
        const currentX = x + vx * progress;
        const currentY = y + vy * progress + (500 * progress * progress);
        particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
        particle.style.opacity = String(1 - progress);
      });
    }

    setTimeout(() => {
      container.remove();
    }, particleDuration);
  }
}

