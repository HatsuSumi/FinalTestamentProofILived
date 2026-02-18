import type { Component } from '../types';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';

export class SettingsPanel implements Component {
  element: HTMLElement;
  private toggleBtn!: HTMLElement;
  private sidebar!: HTMLElement;
  private backdrop!: HTMLElement;
  private isOpen: boolean = false;
  
  // LocalStorage Key 常量
  private readonly STORAGE_KEY = 'final-testament-proof-i-lived-settings';

  // 设置状态
  public state = {
    preventBackToHome: false, // 防止误触返回首屏
    disableScanline: false,   // 禁用扫描线动画
    layoutMode: 'horizontal' as 'horizontal' | 'vertical' // 作品集布局模式
  };

  constructor() {
    // 从 localStorage 读取配置
    this.loadSettings();
    this.element = this.render();
    this.setupEventListeners();
    this.applySettings(); // 初始化应用设置
  }

  render(): HTMLElement {
    // 1. 克隆模板 (直接获取包裹容器)
    const container = cloneTemplate<HTMLElement>('settings-template');
    
    this.toggleBtn = queryIn(container, '.settings-toggle');
    this.sidebar = queryIn(container, '.settings-sidebar');
    this.backdrop = queryIn(container, '.settings-backdrop');

    // 2. 初始化开关状态
    const preventToggle = queryIn<HTMLInputElement>(this.sidebar, '#setting-prevent-back');
    const scanlineToggle = queryIn<HTMLInputElement>(this.sidebar, '#setting-disable-scanline');
    const layoutHorizontal = queryIn<HTMLInputElement>(this.sidebar, '#setting-layout-horizontal');
    const layoutVertical = queryIn<HTMLInputElement>(this.sidebar, '#setting-layout-vertical');

    preventToggle.checked = this.state.preventBackToHome;
    scanlineToggle.checked = this.state.disableScanline;
    
    // 初始化布局单选按钮
    if (this.state.layoutMode === 'horizontal') {
      layoutHorizontal.checked = true;
    } else {
      layoutVertical.checked = true;
    }

    return container;
  }

  private setupEventListeners(): void {
    // 切换侧边栏
    addEvent(this.toggleBtn, 'click', () => this.toggle());
    addEvent(this.backdrop, 'click', () => this.close());

    // 设置项：防误触
    const preventToggle = queryIn<HTMLInputElement>(this.sidebar, '#setting-prevent-back');
    addEvent(preventToggle, 'change', (e) => {
      this.state.preventBackToHome = (e.target as HTMLInputElement).checked;
      this.saveSettings();
    });

    // 设置项：禁用扫描线
    const scanlineToggle = queryIn<HTMLInputElement>(this.sidebar, '#setting-disable-scanline');
    addEvent(scanlineToggle, 'change', (e) => {
      this.state.disableScanline = (e.target as HTMLInputElement).checked;
      this.saveSettings();
      this.applyScanlineSetting();
    });

    // 设置项：布局模式
    const layoutHorizontal = queryIn<HTMLInputElement>(this.sidebar, '#setting-layout-horizontal');
    const layoutVertical = queryIn<HTMLInputElement>(this.sidebar, '#setting-layout-vertical');
    
    addEvent(layoutHorizontal, 'change', () => {
      this.state.layoutMode = 'horizontal';
      this.saveSettings();
      this.applyLayoutSetting();
    });
    
    addEvent(layoutVertical, 'change', () => {
      this.state.layoutMode = 'vertical';
      this.saveSettings();
      this.applyLayoutSetting();
    });
  }

  private toggle(): void {
    this.isOpen = !this.isOpen;
    this.updateVisibility();
  }

  private close(): void {
    this.isOpen = false;
    this.updateVisibility();
  }

  private updateVisibility(): void {
    if (this.isOpen) {
      this.sidebar.classList.add('active');
      this.backdrop.classList.add('active');
      this.toggleBtn.classList.add('hidden'); // 打开时隐藏汉堡菜单
    } else {
      this.sidebar.classList.remove('active');
      this.backdrop.classList.remove('active');
      this.toggleBtn.classList.remove('hidden');
    }
  }

  private loadSettings(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = { ...this.state, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }

  private saveSettings(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  private applySettings(): void {
    this.applyScanlineSetting();
    this.applyLayoutSetting();
  }

  private applyScanlineSetting(): void {
    if (this.state.disableScanline) {
      document.body.classList.add('no-scanline');
    } else {
      document.body.classList.remove('no-scanline');
    }
  }

  public applyLayoutSetting(): void {
    const mainContainer = document.querySelector('#main-container');
    const divider = document.querySelector('#divider');
    
    if (!mainContainer) return;
    
    if (this.state.layoutMode === 'vertical') {
      mainContainer.classList.add('layout-vertical');
      if (divider) {
        divider.classList.add('hidden');
      }
    } else {
      mainContainer.classList.remove('layout-vertical');
      if (divider) {
        divider.classList.remove('hidden');
      }
    }
  }
}

