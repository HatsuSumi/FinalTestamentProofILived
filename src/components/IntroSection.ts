import type { Component } from '../types';
import { cloneTemplate, queryIn } from '../utils/template';

export class IntroSection implements Component {
  element: HTMLElement;
  private texts: string[] = [
    '独立游戏开发者',
    '代码与艺术的创造者',
    '全能创作者',
    '编程 · 美术 · 音乐 · 策划 · 剧本一条龙'
  ];
  private currentTextIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;
  private typingSpeed: number = 100;
  private deletingSpeed: number = 50;
  private pauseDuration: number = 2000;
  private typewriterElement: HTMLElement;

  constructor() {
    this.element = this.render();
    
    // 立即获取打字机元素并验证
    this.typewriterElement = queryIn(this.element, '.typewriter');
    
    // 设置桌面截图区域的移动端交互
    this.setupDesktopToggle();
    
    // 开始打字机动画
    setTimeout(() => this.typeWriter(), 1200);
  }

  private setupDesktopToggle(): void {
    const toggleButton = queryIn(this.element, '.intro-desktop-toggle');
    const desktopContent = queryIn(this.element, '.intro-desktop-content');
    const introContent = queryIn(this.element, '.intro-content');
    
    toggleButton.addEventListener('click', () => {
      const isActive = toggleButton.classList.contains('active');
      
      if (isActive) {
        // 返回：图片滑出，内容滑入
        desktopContent.classList.remove('visible');
        introContent.classList.remove('pushed-out');
        toggleButton.classList.remove('active');
        toggleButton.textContent = '我的电脑桌面 →';
        // 恢复页面滚动
        document.body.classList.remove('desktop-viewing');
      } else {
        // 查看：内容被推出，图片滑入
        introContent.classList.add('pushed-out');
        desktopContent.classList.add('visible');
        toggleButton.classList.add('active');
        toggleButton.textContent = '← 返回';
        // 阻止页面滚动
        document.body.classList.add('desktop-viewing');
      }
    });
  }

  render(): HTMLElement {
    return cloneTemplate('intro-template');
  }

  private typeWriter(): void {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      // 删除字符
      this.typewriterElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
      
      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        setTimeout(() => this.typeWriter(), 500);
        return;
      }
      
      setTimeout(() => this.typeWriter(), this.deletingSpeed);
    } else {
      // 添加字符
      this.typewriterElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      
      if (this.currentCharIndex === currentText.length) {
        // 暂停后开始删除
        setTimeout(() => {
          this.isDeleting = true;
          this.typeWriter();
        }, this.pauseDuration);
        return;
      }
      
      setTimeout(() => this.typeWriter(), this.typingSpeed);
    }
  }
}

