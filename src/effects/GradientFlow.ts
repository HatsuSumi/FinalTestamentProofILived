export class GradientFlow {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private time: number = 0;
  private colors = [
    { r: 255, g: 107, b: 157 }, // pink
    { r: 255, g: 163, b: 77 },  // orange
    { r: 255, g: 217, b: 61 }   // yellow
  ];

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
    this.animate();
  }

  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private draw(): void {
    const { width, height } = this.canvas;
    
    // 清空画布
    this.ctx.clearRect(0, 0, width, height);

    // 创建多个渐变圆
    const circles = [
      {
        x: width * 0.3 + Math.sin(this.time * 0.009) * 100,
        y: height * 0.3 + Math.cos(this.time * 0.009) * 100,
        radius: 300,
        color: this.colors[0]
      },
      {
        x: width * 0.7 + Math.sin(this.time * 0.009 + 2) * 100,
        y: height * 0.5 + Math.cos(this.time * 0.009 + 2) * 100,
        radius: 350,
        color: this.colors[1]
      },
      {
        x: width * 0.5 + Math.sin(this.time * 0.0099 + 4) * 100,
        y: height * 0.7 + Math.cos(this.time * 0.0099 + 4) * 100,
        radius: 300,
        color: this.colors[2]
      }
    ];

    // 绘制每个圆
    circles.forEach(circle => {
      const gradient = this.ctx.createRadialGradient(
        circle.x, circle.y, 0,
        circle.x, circle.y, circle.radius
      );

      const { r, g, b } = circle.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.15)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
    });

    // 添加柔和光斑
    this.drawSoftSpots();
  }

  private drawSoftSpots(): void {
    const { width, height } = this.canvas;
    const spotCount = 5;

    for (let i = 0; i < spotCount; i++) {
      const angle = (this.time * 0.0005 + i * (Math.PI * 2 / spotCount)) % (Math.PI * 2);
      const x = width / 2 + Math.cos(angle) * (width * 0.3);
      const y = height / 2 + Math.sin(angle) * (height * 0.3);
      const radius = 150;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      const colorIndex = i % this.colors.length;
      const { r, g, b } = this.colors[colorIndex];
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  private animate(): void {
    this.draw();
    this.time++;
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize.bind(this));
  }
}

