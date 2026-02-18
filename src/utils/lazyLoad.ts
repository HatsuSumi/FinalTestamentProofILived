// 图片懒加载工具

export class LazyLoader {
  private observer: IntersectionObserver;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options?: IntersectionObserverInit) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options
      }
    );
  }

  observe(img: HTMLImageElement): void {
    if (!img) {
      throw new Error('LazyLoader.observe: img element is required');
    }
    if (!(img instanceof HTMLImageElement)) {
      throw new Error('LazyLoader.observe: img must be an HTMLImageElement');
    }
    
    this.images.add(img);
    this.observer.observe(img);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (!src) {
      throw new Error(`LazyLoader.loadImage: img element is missing data-src attribute`);
    }

    img.src = src;
    img.addEventListener('load', () => {
      img.classList.add('loaded');
      this.observer.unobserve(img);
      this.images.delete(img);
    });
  }

  disconnect(): void {
    this.observer.disconnect();
    this.images.clear();
  }
}

// 创建全局懒加载实例
export const lazyLoader = new LazyLoader();

