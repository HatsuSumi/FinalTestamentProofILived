export class IceParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('[IceParticles] Canvas element is required');
    }

    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('[IceParticles] Failed to get 2d context');
    }
    this.ctx = context;

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private createParticles(): void {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制粒子
    this.particles.forEach(particle => {
      particle.update(this.canvas.height);
      this.drawParticle(particle);
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawParticle(particle: Particle): void {
    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);

    // 绘制冰晶形状（六边形）
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = Math.cos(angle) * particle.size;
      const y = Math.sin(angle) * particle.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fillStyle = particle.color;
    this.ctx.fill();
    this.ctx.strokeStyle = `rgba(100, 181, 246, ${particle.opacity * 0.5})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.restore();
  }

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight - canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    
    // 冰晶蓝色
    const blueShade = Math.floor(Math.random() * 50) + 150;
    this.color = `rgba(${blueShade - 50}, ${blueShade}, ${blueShade + 50}, ${this.opacity})`;
  }

  update(canvasHeight: number): void {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    // 重置到顶部
    if (this.y > canvasHeight) {
      this.y = -10;
      this.x = Math.random() * canvasHeight;
    }
  }
}

