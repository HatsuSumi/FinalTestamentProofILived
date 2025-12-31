import type { Component, Artwork } from '../types';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';
import { getCSSTransitionDuration } from '../utils/css';

export class GalleryItem implements Component {
  element: HTMLElement;
  private artwork: Artwork;
  private index: number;
  private searchQuery: string;
  private currentImageIndex: number = 0; // 当前显示的图片索引
  private allImages: string[] = []; // 所有图片（成品图 + 过程图）
  private autoPlayTimer: number | null = null; // 自动轮播定时器
  private autoPlayInterval: number = 3000; // 自动轮播间隔（3秒）

  constructor(artwork: Artwork, index: number = 0, searchQuery: string = '') {
    this.artwork = artwork;
    this.index = index;
    this.searchQuery = searchQuery;
    
    // 构建图片数组：成品图 + 过程图
    this.allImages = [this.artwork.image];
    if (this.artwork.processImages && this.artwork.processImages.length > 0) {
      this.allImages.push(...this.artwork.processImages);
    }
    
    this.element = this.render();
  }

  render(): HTMLElement {
    const item = cloneTemplate('gallery-item-template');
    item.setAttribute('data-artwork-id', this.artwork.id);

    // 设置卡片序号（左上角）
    const numberElement = queryIn<HTMLElement>(item, '.gallery-item-number');
    numberElement.textContent = String(this.index + 1);

    // 设置类别标签（右上角）
    const categoryBadge = queryIn<HTMLElement>(item, '.gallery-category-badge');
    const categoryMap: Record<string, string> = {
      painting: '绘画',
      modeling: '建模',
      animation: '动画'
    };
    
    if (!(this.artwork.category in categoryMap)) {
      throw new Error(`Unknown artwork category: ${this.artwork.category}`);
    }
    
    categoryBadge.textContent = categoryMap[this.artwork.category];
    categoryBadge.setAttribute('data-category', this.artwork.category);

    // 设置缩略图（必须存在）
    const img = queryIn<HTMLImageElement>(item, '.gallery-thumbnail img');
    img.src = `${import.meta.env.BASE_URL}${this.artwork.thumbnail.slice(1)}`;
    img.alt = this.artwork.title;

    // 如果有多张图片，设置导航箭头和指示器
    if (this.allImages.length > 1) {
      this.setupImageNavigation(item);
    }

    // 设置标题（必须存在）
    const title = queryIn(item, '.gallery-title');
    title.innerHTML = this.highlightText(this.artwork.title);

    // 设置描述（必须存在容器）
    const description = queryIn<HTMLElement>(item, '.gallery-description');
    if (this.artwork.description) {
      description.innerHTML = this.highlightText(this.artwork.description);
      description.classList.remove('hidden');
    } else {
      description.classList.add('hidden');
    }

    // 设置标签
    const tagsContainer = queryIn<HTMLElement>(item, '.gallery-tags');
    if (this.artwork.tags && this.artwork.tags.length > 0) {
      this.artwork.tags.forEach(tag => {
        const tagElement = cloneTemplate<HTMLElement>('gallery-tag-template');
        tagElement.innerHTML = this.highlightText(tag);
        tagsContainer.appendChild(tagElement);
      });
      tagsContainer.classList.remove('hidden');
    } else {
      tagsContainer.classList.add('hidden');
    }

    // 设置创作周期
    const creationCycleElement = queryIn<HTMLElement>(item, '.gallery-creation-cycle');
    if (this.artwork.creationCycle) {
      creationCycleElement.textContent = `创作周期：${this.artwork.creationCycle}`;
      creationCycleElement.classList.remove('hidden');
    } else {
      creationCycleElement.classList.add('hidden');
    }

    // 设置创作环境
    const creationEnvironmentElement = queryIn<HTMLElement>(item, '.gallery-creation-environment');
    if (this.artwork.creationEnvironment) {
      creationEnvironmentElement.textContent = `创作环境：${this.artwork.creationEnvironment}`;
      creationEnvironmentElement.classList.remove('hidden');
    } else {
      creationEnvironmentElement.classList.add('hidden');
    }

    // 设置链接（动态渲染）
    const linksContainer = queryIn<HTMLElement>(item, '.gallery-links');
    if (this.artwork.links && this.artwork.links.length > 0) {
      this.artwork.links.forEach(link => {
        const linkElement = cloneTemplate<HTMLAnchorElement>('gallery-link-template');
        linkElement.href = link.url;
        linkElement.textContent = link.name;
        
        // 阻止链接点击事件冒泡到卡片，避免同时打开模态框
        addEvent(linkElement, 'click', (e: Event) => {
          e.stopPropagation();
        });
        
        linksContainer.appendChild(linkElement);
      });
      linksContainer.classList.remove('hidden');
    } else {
      linksContainer.classList.add('hidden');
    }

    // 设置日期（必须存在容器）
    const date = queryIn<HTMLElement>(item, '.gallery-date');
    if (this.artwork.date) {
      date.textContent = this.artwork.date;
      date.classList.remove('hidden');
    } else {
      date.classList.add('hidden');
    }

    // 点击事件
    addEvent(item, 'click', () => {
      this.handleItemClick();
    });

    return item;
  }

  private handleItemClick(): void {
    const event = new CustomEvent('openArtworkLightbox', {
      detail: this.artwork
    });
    window.dispatchEvent(event);
  }

  private highlightText(text: string): string {
    if (!this.searchQuery) {
      return text;
    }
    
    // 转义正则表达式特殊字符
    const escapedQuery = this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  private setupImageNavigation(item: HTMLElement): void {
    const img = queryIn<HTMLImageElement>(item, '.gallery-thumbnail img');
    const prevBtn = queryIn<HTMLButtonElement>(item, '.gallery-nav-prev');
    const nextBtn = queryIn<HTMLButtonElement>(item, '.gallery-nav-next');
    const indicators = queryIn<HTMLElement>(item, '.gallery-image-indicators');
    const label = queryIn<HTMLElement>(item, '.gallery-image-label');

    // 显示箭头和指示器
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    indicators.classList.remove('hidden');

    // 如果有标签，显示标签
    if (this.artwork.processLabels && this.artwork.processLabels.length > 0) {
      label.classList.remove('hidden');
      this.updateImageLabel(label, 0); // 初始显示第一张的标签
    }

    // 创建指示器圆点
    for (let i = 0; i < this.allImages.length; i++) {
      const dot = cloneTemplate<HTMLSpanElement>('gallery-indicator-dot-template');
      if (i === 0) {
        dot.classList.add('active');
      }
      indicators.appendChild(dot);
    }

    // 阻止箭头点击事件冒泡到卡片
    addEvent(prevBtn, 'click', (e: Event) => {
      e.stopPropagation();
      this.navigateImage(img, indicators, label, -1);
      this.resetAutoPlay(img, indicators, label); // 手动切换后重置自动播放
    });

    addEvent(nextBtn, 'click', (e: Event) => {
      e.stopPropagation();
      this.navigateImage(img, indicators, label, 1);
      this.resetAutoPlay(img, indicators, label); // 手动切换后重置自动播放
    });

    // 悬停时暂停自动播放，离开时恢复
    addEvent(item, 'mouseenter', () => {
      this.stopAutoPlay();
    });

    addEvent(item, 'mouseleave', () => {
      this.startAutoPlay(img, indicators, label);
    });

    // 启动自动播放
    this.startAutoPlay(img, indicators, label);
  }

  private navigateImage(img: HTMLImageElement, indicators: HTMLElement, label: HTMLElement, direction: number): void {
    // 更新索引
    this.currentImageIndex += direction;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.allImages.length - 1;
    } else if (this.currentImageIndex >= this.allImages.length) {
      this.currentImageIndex = 0;
    }

    // 滑出动画
    const slideOutClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
    img.classList.add(slideOutClass);

    // 从 CSS 变量读取动画时长
    const duration = getCSSTransitionDuration('--transition-slow'); // 500ms

    // 等待滑出动画完成后更换图片
    setTimeout(() => {
      // 移除滑出类
      img.classList.remove(slideOutClass);
      
      // 添加滑入类（禁用过渡，瞬间移动到另一边）
      const slideInClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';
      img.classList.add(slideInClass);

      // 更新图片
      img.src = `${import.meta.env.BASE_URL}${this.allImages[this.currentImageIndex].slice(1)}`;

      // 更新指示器
      const dots = indicators.querySelectorAll('.gallery-indicator-dot');
      dots.forEach((dot, index) => {
        if (index === this.currentImageIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // 更新标签
      this.updateImageLabel(label, this.currentImageIndex);

      // 强制重绘
      img.offsetHeight;

      // 移除滑入类，添加居中类（恢复过渡，滑入动画）
      img.classList.remove(slideInClass);
      img.classList.add('slide-center');
      
      // 下次切换前移除居中类
      setTimeout(() => {
        img.classList.remove('slide-center');
      }, duration);
    }, duration); // 等待滑出动画完成
  }

  private startAutoPlay(img: HTMLImageElement, indicators: HTMLElement, label: HTMLElement): void {
    // 先清除现有定时器
    this.stopAutoPlay();
    
    // 启动新定时器
    this.autoPlayTimer = window.setInterval(() => {
      this.navigateImage(img, indicators, label, 1); // 自动向下一张切换
    }, this.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer !== null) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private resetAutoPlay(img: HTMLImageElement, indicators: HTMLElement, label: HTMLElement): void {
    // 手动切换后，重置自动播放
    this.stopAutoPlay();
    this.startAutoPlay(img, indicators, label);
  }

  private updateImageLabel(label: HTMLElement, index: number): void {
    // 如果有标签数组，显示对应的标签
    if (this.artwork.processLabels && this.artwork.processLabels.length > 0) {
      const total = this.allImages.length;
      const current = index + 1;
      
      // processLabels[index] 对应 allImages[index]
      // processLabels[0] 对应第一张主图，可以是任何阶段（成品/线稿/半成品等）
      if (this.artwork.processLabels[index]) {
        label.textContent = `${this.artwork.processLabels[index]} ${current}/${total}`;
      } else {
        label.textContent = `图 ${current}/${total}`;
      }
    }
  }

  destroy(): void {
    // 清理自动播放定时器
    this.stopAutoPlay();
  }
}

