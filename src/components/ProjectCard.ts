import type { Component, Project } from '../types';
import { cloneTemplate, queryIn } from '../utils/template';

export class ProjectCard implements Component {
  element: HTMLElement;
  private project: Project;
  private index: number;
  private searchQuery: string;

  constructor(project: Project, index: number = 0, searchQuery: string = '') {
    this.project = project;
    this.index = index;
    this.searchQuery = searchQuery;
    this.element = this.render();
  }

  render(): HTMLElement {
    const card = cloneTemplate('project-card-template');
    card.setAttribute('data-project-id', this.project.id);

    // 设置卡片序号（左上角）
    const numberElement = queryIn<HTMLElement>(card, '.project-card-number');
    numberElement.textContent = String(this.index + 1);

    // 设置类别标签（右上角，可多个）
    const categoryBadgesContainer = queryIn<HTMLElement>(card, '.project-category-badges');
    const categoryMap: Record<string, string> = {
      web: 'Web',
      software: '软件',
      game: '游戏',
      script: '工具脚本',
      extension: '浏览器插件'
    };
    
    this.project.categories.forEach(category => {
      if (!(category in categoryMap)) {
        throw new Error(`Unknown project category: ${category}`);
      }
      
      const badge = cloneTemplate<HTMLElement>('category-badge-template');
      badge.textContent = categoryMap[category];
      badge.setAttribute('data-category', category);
      categoryBadgesContainer.appendChild(badge);
    });

    // 设置标题（必须存在）
    const title = queryIn(card, '.project-title');
    title.innerHTML = this.highlightText(this.project.title);

    // 设置副标题（必须存在）
    const subtitle = queryIn(card, '.project-subtitle');
    subtitle.innerHTML = this.highlightText(this.project.subtitle);

    // 设置描述（必须存在）
    const description = queryIn(card, '.project-description');
    description.innerHTML = this.highlightText(this.project.description);

    // 设置项目状态（必须存在）
    const status = queryIn(card, '.project-status');
    status.textContent = this.project.status;

    // 设置发布日期（必须存在）
    const releaseDate = queryIn(card, '.project-release-date');
    releaseDate.textContent = this.project.releaseDate;

    // 设置项目角色（必须存在）- 格式：一人包揽XX、XX、XX
    const rolesText = queryIn(card, '.project-roles-text');
    if (this.project.roles.length > 0) {
      rolesText.textContent = `一人包揽${this.project.roles.join('、')}`;
    } else {
      // 如果roles为空，隐藏整个meta-item
      const rolesItem = queryIn(card, '.project-meta-roles');
      rolesItem.classList.add('hidden');
    }

    // 设置开发周期（必须存在）
    const developmentCycle = queryIn(card, '.project-development-cycle');
    developmentCycle.textContent = this.project.developmentCycle;

    // 设置开发环境（必须存在）
    const developmentEnv = queryIn(card, '.project-development-env');
    developmentEnv.textContent = this.project.developmentEnvironment;

    // 设置标签（必须存在）
    const tagsContainer = queryIn(card, '.project-tags');
    this.project.tags.forEach(tag => {
      const tagEl = cloneTemplate<HTMLElement>('project-tag-template');
      tagEl.innerHTML = this.highlightText(tag);
      tagsContainer.appendChild(tagEl);
    });

    // 设置链接（动态渲染）
    const linksContainer = queryIn(card, '.project-links');
    if (this.project.links && this.project.links.length > 0) {
      this.project.links.forEach(link => {
        linksContainer.appendChild(this.createLink(link.name, link.url));
      });
    }

    return card;
  }

  private createLink(text: string, href: string): HTMLElement {
    const link = cloneTemplate<HTMLAnchorElement>('project-link-template');
    link.href = href;
    link.textContent = text;
    
    return link;
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
}

