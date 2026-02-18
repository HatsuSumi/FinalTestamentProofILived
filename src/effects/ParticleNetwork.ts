import type { ParticleConfig } from '../types';
import { randomRange } from '../utils/animations';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export class ParticleNetwork {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse: { x: number; y: number } = { x: 0, y: 0 };
  private animationId: number = 0;
  private config: Required<ParticleConfig>;

  constructor(canvas: HTMLCanvasElement, config?: ParticleConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法获取 canvas 上下文');
    }
    this.ctx = context;

    this.config = {
      count: config?.count || 100,
      speed: config?.speed || 0.5,
      color: config?.color || '#00d4ff',
      size: config?.size || 2
    };

    this.init();
  }

  private init(): void {
    this.resize();
    this.createParticles();
    
    // 监听鼠标移动
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.resize.bind(this));
    
    this.animate();
  }

  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private createParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: randomRange(-this.config.speed, this.config.speed),
        vy: randomRange(-this.config.speed, this.config.speed),
        radius: randomRange(this.config.size * 0.5, this.config.size * 1.5)
      });
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  private updateParticles(): void {
    this.particles.forEach((particle) => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检测
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // 鼠标吸引力
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx += dx * force * 0.01;
        particle.vy += dy * force * 0.01;
      }

      // 速度限制
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > this.config.speed * 2) {
        particle.vx = (particle.vx / speed) * this.config.speed * 2;
        particle.vy = (particle.vy / speed) * this.config.speed * 2;
      }
    });
  }

  private drawParticles(): void {
    this.ctx.fillStyle = this.config.color;
    
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private connectParticles(): void {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (150 - distance) / 150;
          this.ctx.strokeStyle = `${this.config.color}${Math.floor(opacity * 50).toString(16).padStart(2, '0')}`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.connectParticles();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize.bind(this));
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
  }
}

