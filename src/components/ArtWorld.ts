import type { Component, Artwork } from '../types';
import { artworks } from '../data/artworks';
import { GalleryItem } from './GalleryItem';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';

export class ArtWorld implements Component {
  element: HTMLElement;
  private artworks: Artwork[] = artworks;
  private filteredArtworks: Artwork[] = artworks;
  private currentFilter: string = 'all';
  private searchQuery: string = '';
  private galleryItems: GalleryItem[] = [];
  private searchDebounceTimer: number | null = null;

  constructor() {
    this.element = this.render();
  }

  render(): HTMLElement {
    const container = cloneTemplate<HTMLElement>('art-world-template');
    
    // 筛选标签
    const filterContainer = queryIn<HTMLElement>(container, '.filter-tags');
    this.createFilterTags(filterContainer);
    
    // 搜索框
    const searchInput = queryIn<HTMLInputElement>(container, '#art-search');
    this.setupSearch(searchInput);
    
    // 作品网格
    const grid = queryIn<HTMLElement>(container, '#artworks-grid');
    this.renderArtworks(grid);
    
    return container;
  }

  private createFilterTags(container: HTMLElement): void {
    const filters = [
      { label: '全部', value: 'all' },
      { label: '绘画', value: 'painting' },
      { label: '建模', value: 'modeling' },
      { label: '动画制作', value: 'animation' }
    ];
    
    filters.forEach(filter => {
      const tag = cloneTemplate<HTMLButtonElement>('filter-tag-template');
      tag.textContent = filter.label;
      if (filter.value === this.currentFilter) {
        tag.classList.add('active');
      }
      
      addEvent(tag, 'click', () => {
        this.handleFilterClick(filter.value, tag);
      });
      
      container.appendChild(tag);
    });
  }

  private setupSearch(input: HTMLInputElement): void {
    addEvent(input, 'input', () => {
      // 清除之前的定时器
      if (this.searchDebounceTimer !== null) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      // 设置新的定时器（300ms 延迟）
      this.searchDebounceTimer = window.setTimeout(() => {
        this.searchQuery = input.value.trim().toLowerCase();
        this.applyFilters();
      }, 300);
    });
  }

  private handleFilterClick(filterValue: string, clickedTag: HTMLElement): void {
    this.currentFilter = filterValue;
    
    // 更新激活状态
    const allTags = this.element.querySelectorAll('.filter-tag');
    allTags.forEach(tag => tag.classList.remove('active'));
    clickedTag.classList.add('active');
    
    this.applyFilters();
  }

  private applyFilters(): void {
    // 先按类别筛选
    let filtered = this.currentFilter === 'all' 
      ? this.artworks 
      : this.artworks.filter(a => a.category === this.currentFilter);
    
    // 再按搜索词筛选
    if (this.searchQuery) {
      filtered = filtered.filter(a => {
        const titleMatch = a.title.toLowerCase().includes(this.searchQuery);
        const descriptionMatch = a.description?.toLowerCase().includes(this.searchQuery) || false;
        const tagsMatch = a.tags?.some(tag => tag.toLowerCase().includes(this.searchQuery)) || false;
        return titleMatch || descriptionMatch || tagsMatch;
      });
    }
    
    this.filteredArtworks = filtered;
    
    // 重新渲染
    const grid = this.element.querySelector('#artworks-grid');
    if (grid) {
      this.renderArtworks(grid as HTMLElement);
    }
  }

  private renderArtworks(grid: HTMLElement): void {
    // 清理旧项（防止内存泄漏）
    this.galleryItems.forEach(item => item.destroy());
    
    // 清空现有项
    grid.innerHTML = '';
    this.galleryItems = [];
    
    // 检查是否有结果
    if (this.filteredArtworks.length === 0) {
      this.renderEmptyState(grid);
      return;
    }
    
    // 渲染新项
    this.filteredArtworks.forEach((artwork, index) => {
      const item = new GalleryItem(artwork, index, this.searchQuery);
      const itemElement = item.render();
      
      // 添加滚动动画类
      itemElement.classList.add('scroll-animate');
      itemElement.style.setProperty('--animation-delay', `${index * 0.1}s`);
      
      grid.appendChild(itemElement);
      this.galleryItems.push(item);
      
      // 触发动画
      setTimeout(() => {
        itemElement.classList.add('visible');
      }, 100 + index * 100);
    });
  }

  private renderEmptyState(grid: HTMLElement): void {
    const emptyState = cloneTemplate<HTMLElement>('empty-state-template');
    const textElement = queryIn<HTMLElement>(emptyState, '.empty-state-text');
    
    textElement.textContent = '暂无相关作品';
    
    grid.appendChild(emptyState);
  }

  destroy(): void {
    // 清理子组件
    this.galleryItems = [];
  }

  /**
   * 获取 works-grid 元素
   */
  private getWorksGrid(): HTMLElement {
    return queryIn<HTMLElement>(this.element, '.works-grid');
  }

  /**
   * 检查 works-grid 是否滚动到底部
   */
  public isAtBottom(threshold = 50): boolean {
    const grid = this.getWorksGrid();
    if (!grid) return true;
    return grid.scrollHeight - grid.scrollTop <= grid.clientHeight + threshold;
  }

  /**
   * 检查 works-grid 是否滚动到顶部
   */
  public isAtTop(threshold = 10): boolean {
    const grid = this.getWorksGrid();
    if (!grid) return true;
    return grid.scrollTop <= threshold;
  }

  /**
   * 重置 works-grid 滚动位置到顶部
   */
  public resetScroll(): void {
    const grid = this.getWorksGrid();
    if (grid) {
      grid.scrollTop = 0;
    }
  }
}

