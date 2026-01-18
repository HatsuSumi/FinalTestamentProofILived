import type { Component, Artwork } from '../types';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';
import { getCSSTransitionDuration } from '../utils/css';

export class VideoPlayer implements Component {
  element: HTMLElement;
  private video!: HTMLVideoElement;
  private isOpen: boolean = false;

  constructor() {
    this.element = this.render();
    this.setupEventListeners();
  }

  render(): HTMLElement {
    const player = cloneTemplate<HTMLElement>('video-player-template');
    
    this.video = queryIn<HTMLVideoElement>(player, '.video-player-video');
    
    return player;
  }

  private setupEventListeners(): void {
    const closeBtn = queryIn<HTMLButtonElement>(this.element, '.video-player-close');
    const backdrop = queryIn<HTMLElement>(this.element, '.video-player-backdrop');

    // 关闭按钮
    addEvent(closeBtn, 'click', () => {
      this.close();
    });

    // 点击背景关闭
    addEvent(backdrop, 'click', () => {
      this.close();
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // 监听全局事件
    window.addEventListener('openProcessVideo', ((e: CustomEvent) => {
      const artwork = e.detail as Artwork;
      this.open(artwork);
    }) as EventListener);
  }

  public open(artwork: Artwork): void {
    if (!artwork.processVideoUrl) {
      console.warn('No process video URL found for artwork:', artwork.id);
      return;
    }

    // 设置标题
    const title = queryIn<HTMLElement>(this.element, '.video-player-title');
    const categoryText = artwork.category === 'painting' ? '绘画' : '建模';
    title.textContent = `${artwork.title} - ${categoryText}过程`;

    // 设置视频源
    this.video.src = `${import.meta.env.BASE_URL}${artwork.processVideoUrl.slice(1)}`;

    // 显示播放器（确保移除 closing 类）
    this.element.classList.remove('closing');
    this.element.classList.add('active');
    document.body.classList.add('video-player-open');
    this.isOpen = true;

    // 播放视频
    this.video.play().catch(err => {
      console.error('Video play failed:', err);
    });
  }

  public close(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // 添加关闭动画类
    this.element.classList.add('closing');
    
    // 从 CSS 变量读取动画时长
    const duration = getCSSTransitionDuration('--transition-base');
    
    // 等待动画完成后再清理
    setTimeout(() => {
      // 暂停视频
      this.video.pause();
      this.video.currentTime = 0;
      this.video.src = '';

      // 隐藏播放器
      this.element.classList.remove('active', 'closing');
      document.body.classList.remove('video-player-open');
    }, duration);
  }

  destroy(): void {
    this.close();
  }
}

