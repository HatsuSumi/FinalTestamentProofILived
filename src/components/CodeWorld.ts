import type { Component, Project } from '../types';
import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';

export class CodeWorld implements Component {
  element: HTMLElement;
  private projects: Project[] = projects;
  private filteredProjects: Project[] = projects;
  private currentFilter: string = 'all';
  private searchQuery: string = '';
  private projectCards: ProjectCard[] = [];
  private searchDebounceTimer: number | null = null;

  constructor() {
    this.element = this.render();
  }

  render(): HTMLElement {
    const container = cloneTemplate<HTMLElement>('code-world-template');
    
    // 筛选标签
    const filterContainer = queryIn<HTMLElement>(container, '.filter-tags');
    this.createFilterTags(filterContainer);
    
    // 搜索框
    const searchInput = queryIn<HTMLInputElement>(container, '#code-search');
    this.setupSearch(searchInput);
    
    // 作品网格
    const grid = queryIn<HTMLElement>(container, '#projects-grid');
    this.renderProjects(grid);
    
    return container;
  }

  private createFilterTags(container: HTMLElement): void {
    const filters = [
      { label: '全部', value: 'all' },
      { label: 'Web', value: 'web' },
      { label: '软件', value: 'software' },
      { label: '游戏', value: 'game' },
      { label: '工具脚本', value: 'script' },
      { label: '浏览器插件', value: 'extension' }
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
      ? this.projects 
      : this.projects.filter(p => p.categories.includes(this.currentFilter as 'web' | 'software' | 'game' | 'script' | 'extension'));
    
    // 再按搜索词筛选
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(this.searchQuery);
        const subtitleMatch = p.subtitle.toLowerCase().includes(this.searchQuery);
        const descriptionMatch = p.description.toLowerCase().includes(this.searchQuery);
        const tagsMatch = p.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
        return titleMatch || subtitleMatch || descriptionMatch || tagsMatch;
      });
    }
    
    this.filteredProjects = filtered;
    
    // 重新渲染
    const grid = this.element.querySelector('#projects-grid');
    if (grid) {
      this.renderProjects(grid as HTMLElement);
    }
  }

  private renderProjects(grid: HTMLElement): void {
    // 清空现有卡片
    grid.innerHTML = '';
    this.projectCards = [];
    
    // 检查是否有结果
    if (this.filteredProjects.length === 0) {
      this.renderEmptyState(grid);
      return;
    }
    
    // 渲染新卡片
    this.filteredProjects.forEach((project, index) => {
      const card = new ProjectCard(project, index, this.searchQuery);
      const cardElement = card.render();
      
      // 添加滚动动画类
      cardElement.classList.add('scroll-animate');
      cardElement.style.setProperty('--animation-delay', `${index * 0.1}s`);
      
      // 阻止卡片内部滚动触发页面切换
      const cardInner = queryIn<HTMLElement>(cardElement, '.project-card-inner');
      cardInner.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: true });
      
      grid.appendChild(cardElement);
      this.projectCards.push(card);
      
      // 触发动画
      setTimeout(() => {
        cardElement.classList.add('visible');
      }, 100 + index * 100);
    });
  }

  private renderEmptyState(grid: HTMLElement): void {
    const emptyState = cloneTemplate<HTMLElement>('empty-state-template');
    const textElement = queryIn<HTMLElement>(emptyState, '.empty-state-text');
    
    // 根据筛选类型显示不同的消息
    if (this.currentFilter === 'game') {
      textElement.textContent = '我只开发非小型游戏，开发周期一般在4年-6年，因此还没有作品';
    } else {
      textElement.textContent = '暂无相关作品';
    }
    
    grid.appendChild(emptyState);
  }

  destroy(): void {
    // 清理子组件
    this.projectCards = [];
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

