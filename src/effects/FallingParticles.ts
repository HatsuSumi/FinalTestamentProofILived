export class FallingParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法获取 canvas 上下文');
    }
    this.ctx = context;

    this.init();
  }

  private init(): void {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
    this.createParticles();
    this.animate();
  }

  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private createParticles(): void {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  private draw(): void {
    const { width, height } = this.canvas;
    
    // 清空画布
    this.ctx.clearRect(0, 0, width, height);

    // 绘制粒子
    this.particles.forEach(particle => {
      // 闪烁效果
      particle.twinkle += 0.02;
      const opacity = particle.opacity * (0.5 + Math.sin(particle.twinkle) * 0.5);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
      this.ctx.fill();

      // 添加光晕
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, `rgba(100, 200, 255, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      this.ctx.fill();

      // 更新位置
      particle.y += particle.speedY;

      // 重置到顶部
      if (particle.y > height) {
        particle.y = -10;
        particle.x = Math.random() * width;
      }
    });
  }

  private animate(): void {
    this.draw();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  twinkle: number;
}

