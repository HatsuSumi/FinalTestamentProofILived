import type { Component } from '../types';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';
import { getCSSTransitionDuration } from '../utils/css';

export class ImageViewer implements Component {
  element: HTMLElement;
  private isOpen: boolean = false;
  private currentImageSrc: string = '';
  private currentImageAlt: string = '';

  constructor() {
    this.element = this.render();
    this.setupEventListeners();
  }

  render(): HTMLElement {
    const viewer = cloneTemplate<HTMLElement>('image-viewer-template');

    // 背景遮罩点击关闭
    const backdrop = queryIn<HTMLElement>(viewer, '.image-viewer-backdrop');
    addEvent(backdrop, 'click', () => this.close());

    // 关闭按钮
    const closeBtn = queryIn<HTMLButtonElement>(viewer, '.image-viewer-close');
    addEvent(closeBtn, 'click', () => this.close());

    // 下载按钮
    const downloadBtn = queryIn<HTMLButtonElement>(viewer, '.image-viewer-download');
    addEvent(downloadBtn, 'click', () => this.downloadImage());

    return viewer;
  }

  private setupEventListeners(): void {
    // 监听自定义事件
    window.addEventListener('openImageViewer', ((e: CustomEvent) => {
      this.open(e.detail.src, e.detail.alt);
    }) as EventListener);

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(src: string, alt: string): void {
    if (!src) {
      throw new Error('Image source is required');
    }

    this.currentImageSrc = src;
    this.currentImageAlt = alt;
    this.isOpen = true;

    // 设置图片
    const image = queryIn<HTMLImageElement>(this.element, '.image-viewer-image');
    image.src = src;
    image.alt = alt;

    // 显示查看器
    this.element.classList.remove('closing');
    this.element.classList.add('active');
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.element.classList.add('closing');

    const duration = getCSSTransitionDuration('--transition-base');

    setTimeout(() => {
      this.element.classList.remove('active', 'closing');
    }, duration);
  }

  private downloadImage(): void {
    if (!this.currentImageSrc) {
      throw new Error('No image to download');
    }
    
    if (!this.currentImageAlt) {
      throw new Error('Image alt text is required for download');
    }

    // 使用 template 中的隐藏下载链接
    const link = queryIn<HTMLAnchorElement>(this.element, '.image-viewer-download-link');
    link.href = this.currentImageSrc;
    
    // 从 URL 中提取文件扩展名
    const urlParts = this.currentImageSrc.split('/');
    const urlFilename = urlParts[urlParts.length - 1];
    const extensionMatch = urlFilename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const extension = extensionMatch ? extensionMatch[0] : '.png';
    
    // 使用 alt 作为基础文件名，只移除文件系统不允许的字符
    const baseFilename = this.currentImageAlt.replace(/[/\\:*?"<>|]/g, '').trim();
    const filename = `${baseFilename}${extension}`;
    
    link.download = filename;
    link.click();
  }

  destroy(): void {
    this.close();
  }
}

