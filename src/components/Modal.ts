import type { Component, Artwork } from '../types';
import { cloneTemplate, query, queryIn, addEvent } from '../utils/template';
import { getCSSTransitionDuration } from '../utils/css';

export class Modal implements Component {
  element: HTMLElement;
  private isOpen: boolean = false;
  private content: HTMLElement | null = null;

  constructor() {
    this.element = this.render();
    this.setupEventListeners();
  }

  render(): HTMLElement {
    const modal = cloneTemplate<HTMLElement>('modal-template');

    // 背景遮罩
    const backdrop = queryIn<HTMLElement>(modal, '.modal-backdrop');
    addEvent(backdrop, 'click', () => this.close());

    // 关闭按钮
    const closeBtn = queryIn<HTMLButtonElement>(modal, '.modal-close');
    addEvent(closeBtn, 'click', () => this.close());

    // 内容区域
    this.content = queryIn<HTMLElement>(modal, '.modal-content');

    return modal;
  }

  private setupEventListeners(): void {
    // 监听自定义事件
    window.addEventListener('openArtworkLightbox', ((e: CustomEvent) => {
      this.openArtworkLightbox(e.detail);
    }) as EventListener);

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  private openArtworkLightbox(artwork: Artwork): void {
    if (!this.content) {
      throw new Error('Modal content element not found');
    }

    this.content.innerHTML = '';
    this.content.className = 'modal-content artwork-lightbox';

    // 根据作品类型决定显示方式
    if (artwork.category === 'animation' && artwork.videoUrl) {
      // 动画：只显示视频播放器
      this.renderAnimationView(artwork);
    } else {
      // 插画/建模：显示所有图片（成品图 + 过程图）
      this.renderImageGalleryView(artwork);
    }

    this.open();
  }

  private renderAnimationView(artwork: Artwork): void {
    if (!this.content) return;

    // 图片/视频容器
    const imageContainer = cloneTemplate<HTMLDivElement>('lightbox-image-container-template');
    const imageWrapper = queryIn<HTMLElement>(imageContainer, '.lightbox-image-wrapper');
    const image = queryIn<HTMLImageElement>(imageContainer, '.lightbox-image');
    image.src = `${import.meta.env.BASE_URL}${artwork.image.slice(1)}`;
    image.alt = artwork.title;

    // 显示播放图标并添加点击事件
    const playIcon = queryIn<HTMLElement>(imageContainer, '.lightbox-play-icon');
    playIcon.classList.remove('hidden');
    imageWrapper.classList.add('clickable');
    
    addEvent(imageWrapper, 'click', () => {
      this.playVideo(imageWrapper, artwork.videoUrl!);
    });

    // 信息区
    const info = this.renderArtworkInfo(artwork);

    this.content.appendChild(imageContainer);
    this.content.appendChild(info);
  }

  private renderImageGalleryView(artwork: Artwork): void {
    if (!this.content) return;

    // 构建所有图片数组：成品图 + 过程图
    const allImages = [artwork.image];
    if (artwork.processImages && artwork.processImages.length > 0) {
      allImages.push(...artwork.processImages);
    }

    // 创建横向滚动容器
    const galleryScroll = cloneTemplate<HTMLDivElement>('lightbox-image-gallery-template');

    // 添加所有图片
    allImages.forEach((imageUrl, index) => {
      const imageContainer = cloneTemplate<HTMLDivElement>('lightbox-image-container-template');
      const image = queryIn<HTMLImageElement>(imageContainer, '.lightbox-image');
      image.src = `${import.meta.env.BASE_URL}${imageUrl.slice(1)}`;
      image.alt = `${artwork.title} - ${index === 0 ? '成品图' : '过程图' + index}`;
      
      // 移除播放图标（图片作品不需要）
      const playIcon = queryIn<HTMLElement>(imageContainer, '.lightbox-play-icon');
      playIcon.remove();

      // 显示标签
      const label = queryIn<HTMLElement>(imageContainer, '.lightbox-image-label');
      if (artwork.processLabels && artwork.processLabels.length > 0) {
        const total = allImages.length;
        const current = index + 1;
        
        // processLabels[index] 对应 allImages[index]
        if (artwork.processLabels[index]) {
          label.textContent = `${artwork.processLabels[index]} ${current}/${total}`;
        } else {
          label.textContent = `图 ${current}/${total}`;
        }
        label.classList.remove('hidden');
      }

      galleryScroll.appendChild(imageContainer);
    });

    // 信息区
    const info = this.renderArtworkInfo(artwork);

    this.content.appendChild(galleryScroll);
    this.content.appendChild(info);
  }

  private renderArtworkInfo(artwork: Artwork): HTMLElement {
    // 信息区
    const info = cloneTemplate<HTMLDivElement>('lightbox-info-template');
    
    // 标题
    const title = cloneTemplate<HTMLHeadingElement>('lightbox-title-template');
    title.textContent = artwork.title;
    info.appendChild(title);

    // 描述
    if (artwork.description) {
      const description = cloneTemplate<HTMLParagraphElement>('lightbox-description-template');
      description.textContent = artwork.description;
      info.appendChild(description);
    }

    // 标签
    if (artwork.tags && artwork.tags.length > 0) {
      const tagsContainer = cloneTemplate<HTMLDivElement>('lightbox-tags-template');
      artwork.tags.forEach(tag => {
        const tagElement = cloneTemplate<HTMLSpanElement>('lightbox-tag-template');
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
      info.appendChild(tagsContainer);
    }

    // 创作信息
    if (artwork.creationCycle || artwork.creationEnvironment) {
      const metaContainer = cloneTemplate<HTMLDivElement>('lightbox-meta-template');
      
      if (artwork.creationCycle) {
        const cycleItem = cloneTemplate<HTMLDivElement>('lightbox-meta-item-template');
        cycleItem.textContent = `创作周期：${artwork.creationCycle}`;
        metaContainer.appendChild(cycleItem);
      }
      
      if (artwork.creationEnvironment) {
        const envItem = cloneTemplate<HTMLDivElement>('lightbox-meta-item-template');
        envItem.textContent = `创作环境：${artwork.creationEnvironment}`;
        metaContainer.appendChild(envItem);
      }
      
      info.appendChild(metaContainer);
    }

    // 链接（动态渲染）
    if (artwork.links && artwork.links.length > 0) {
      const linksContainer = cloneTemplate<HTMLDivElement>('lightbox-links-template');

      artwork.links.forEach(link => {
        const linkElement = cloneTemplate<HTMLAnchorElement>('lightbox-link-template');
        linkElement.href = link.url;
        linkElement.textContent = link.name;
        linksContainer.appendChild(linkElement);
      });
      
      info.appendChild(linksContainer);
    }

    // 类别
    const category = cloneTemplate<HTMLDivElement>('lightbox-category-template');
    const categoryMap: Record<string, string> = {
      painting: '绘画',
      modeling: '3D建模',
      animation: '动画'
    };
    
    if (!(artwork.category in categoryMap)) {
      throw new Error(`Unknown artwork category: ${artwork.category}`);
    }
    
    category.textContent = `类别：${categoryMap[artwork.category]}`;
    info.appendChild(category);

    // 日期
    if (artwork.date) {
      const date = cloneTemplate<HTMLDivElement>('lightbox-date-template');
      date.textContent = `创作时间：${artwork.date}`;
      info.appendChild(date);
    }

    return info;
  }

  private playVideo(wrapper: HTMLElement, videoUrl: string): void {
    // 检查是否已经有视频在播放，防止重复创建
    const existingVideo = wrapper.querySelector('video');
    if (existingVideo) {
      return; // 已经有视频了，直接返回
    }

    // 隐藏图片和播放图标
    const image = queryIn<HTMLImageElement>(wrapper, '.lightbox-image');
    const playIcon = queryIn<HTMLElement>(wrapper, '.lightbox-play-icon');
    image.classList.add('hidden');
    playIcon.classList.add('hidden');

    // 创建并显示视频播放器
    const video = cloneTemplate<HTMLVideoElement>('lightbox-video-template');
    video.src = `${import.meta.env.BASE_URL}${videoUrl.slice(1)}`;
    video.autoplay = true;
    wrapper.appendChild(video);

    // 视频结束后恢复图片显示
    addEvent(video, 'ended', () => {
      video.remove();
      image.classList.remove('hidden');
      playIcon.classList.remove('hidden');
    });
  }

  private open(): void {
    this.isOpen = true;
    this.element.classList.remove('closing'); // 确保移除关闭动画类
    this.element.classList.add('active');
    
    // 计算滚动条宽度并用 margin-right 补偿（而不是 padding-right）
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      // 给 body 添加 margin-right 补偿
      document.body.style.marginRight = `${scrollbarWidth}px`;
      
      // 给 right 定位的 fixed 元素也添加补偿
      const supportSidebar = query<HTMLElement>('#support-sidebar');
      supportSidebar.style.marginRight = `${scrollbarWidth}px`;
      
      // 给居中的 fixed 元素添加 left 补偿（而不是 transform）
      const divider = query<HTMLElement>('#divider');
      const scrollHint = query<HTMLElement>('.main-scroll-hint');
      const offset = scrollbarWidth / 2;
      
      // 使用 margin-left 负值来补偿
      divider.style.marginLeft = `-${offset}px`;
      scrollHint.style.marginLeft = `-${offset}px`;
    }
    
    document.body.classList.add('modal-open');
  }

  close(): void {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.element.classList.add('closing');
    
    // 从 CSS 变量读取动画时长
    const duration = getCSSTransitionDuration('--transition-base'); // 300ms
    
    // 等待动画结束后再真正关闭
    setTimeout(() => {
      this.element.classList.remove('active', 'closing');
      document.body.classList.remove('modal-open');
      
      // 移除 margin-right 补偿
      document.body.style.marginRight = '';
      
      const supportSidebar = query<HTMLElement>('#support-sidebar');
      supportSidebar.style.marginRight = '';
      
      // 移除居中 fixed 元素的 margin-left 补偿
      const divider = query<HTMLElement>('#divider');
      const scrollHint = query<HTMLElement>('.main-scroll-hint');
      
      divider.style.marginLeft = '';
      scrollHint.style.marginLeft = '';
    }, duration);
  }

  destroy(): void {
    this.close();
  }
}

