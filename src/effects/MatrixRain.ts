export class MatrixRain {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private columns: number = 0;
  private drops: number[] = [];
  private fontSize: number = 14;
  private animationId: number = 0;
  private characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  private lastTime: number = 0;
  private targetFPS: number = 60; // 目标帧率：60 FPS
  private frameInterval: number = 1000 / this.targetFPS; // 每帧间隔时间（毫秒）

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
    
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(0).map(() => 
      Math.floor(Math.random() * -100)
    );
  }

  private draw(): void {
    // 半透明黑色背景，创建尾迹效果
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 设置文字样式
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.font = `${this.fontSize}px monospace`;

    // 绘制字符
    for (let i = 0; i < this.drops.length; i++) {
      // 随机选择字符
      const char = this.characters[Math.floor(Math.random() * this.characters.length)];
      
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // 渐变效果
      const gradient = this.ctx.createLinearGradient(x, y - this.fontSize * 10, x, y);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 1)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillText(char, x, y);

      // 高亮头部
      if (this.drops[i] * this.fontSize > 0) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText(char, x, y);
      }

      // 重置滴落的雨滴
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      // 随机速度
      this.drops[i] += Math.random() > 0.95 ? 2 : 1;
    }
  }

  private animate(currentTime: number = 0): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // 计算时间差
    const deltaTime = currentTime - this.lastTime;
    
    // 只有当时间差大于目标帧间隔时才绘制
    if (deltaTime >= this.frameInterval) {
      this.lastTime = currentTime - (deltaTime % this.frameInterval);
      this.draw();
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize.bind(this));
  }
}

