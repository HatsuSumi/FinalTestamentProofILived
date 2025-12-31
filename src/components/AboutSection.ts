import type { Component } from '../types';
import { cloneTemplate, queryIn } from '../utils/template';

export class AboutSection implements Component {
  element: HTMLElement;
  private hasAnimated: boolean = false;
  private paragraphElements: HTMLElement[] = [];
  private titleElement!: HTMLElement;
  private verticalTextElement!: HTMLElement;

  constructor() {
    this.element = this.render();
    this.setupIntersectionObserver();
  }

  render(): HTMLElement {
    const section = cloneTemplate<HTMLElement>('about-section-template');

    // 文字分段
    const paragraphs = [
      '我是一位<span class="highlight-emotion">性格悲观</span>的<span class="highlight-identity">独立游戏开发者</span>，技术栈：<span class="highlight-identity">编程</span>（Web开发、软件开发、游戏开发）、<span class="highlight-identity">美术</span>（绘画、建模、动画制作）和<span class="highlight-identity">音乐</span>（作曲）。<span class="highlight-core">即是开发者也是创作者</span>。',
      '同时我也是一位<span class="highlight-emotion">极度内向社恐</span>的人，甚至连<span class="highlight-emotion">人类都感到害怕</span>，我<span class="highlight-emotion">非常不擅长与人沟通</span>，这也是我成为<span class="highlight-identity">独立开发者</span>的原因，我<span class="highlight-status">没想过</span>去找工作，也<span class="highlight-status">没有</span>去接单，接稿，送外卖，而是自己一人在家进行独立开发。一个人，一个房间，一台电脑，<span class="highlight-status">与世隔绝</span>，<span class="highlight-emotion">寂静无声</span>，一天接一天，<span class="highlight-emotion">消耗生命</span>，<span class="highlight-emotion">可能出现尸体</span>。<span class="highlight-status">我已经放弃了合作的可能</span>。',
      '因此我的大多数作品的开发/制作环境都是<span class="highlight-status">居家开发</span>，<span class="highlight-status">没有工作，没有收入</span>，在<span class="highlight-emotion">抑郁症和孤独</span>的陪伴下。因为项目<span class="highlight-core">开源免费</span>，所以本身<span class="highlight-status">并不赚钱</span>，也<span class="highlight-status">没有</span>回本，甚至<span class="highlight-emotion">透支</span>生命。可以发现我的项目大多数都部署在Github或者Netlify这种免费部署平台上，原因很简单，对于<span class="highlight-status">月入0元</span>的我来说，<span class="highlight-status">最便宜的服务器都租不起</span>。',
      '为什么明明<span class="highlight-status">没有收入</span>，却还在做这些<span class="highlight-core">免费开源</span>的项目？我也不知道，可能是因为我是个<span class="highlight-emotion">傻逼</span>吧，我只知道<span class="highlight-core">免费一辈子都不会改变</span>，<span class="highlight-status">其实也不可能收费</span>，因为调用微信/支付宝提供的API<span class="highlight-status">就需要服务器了</span>，我只靠<span class="highlight-core">赞助支持</span>（<span class="highlight-core">完全自愿</span>）和<span class="highlight-emotion">啃老</span>活下去，<span class="highlight-core">为爱发电</span><span class="highlight-emotion">到死为止</span>。你可能经常听到"谁不是为了赚钱而工作？"这句话，但我就是个<span class="highlight-core">反例</span>，没错，<span class="highlight-core">我对金钱不感兴趣</span>，<span class="highlight-emotion">我只对死亡感兴趣</span>。',
      '我在<span class="highlight-identity">独立开发</span>过程中也发现了很多局限，如果说一人是<span class="highlight-status">无法</span>开发出一个团队规模的项目，那我倒是要<span class="highlight-core">挑战独立开发者的能力上限</span>。',
      '常年<span class="highlight-emotion">精神状态很差</span>，<span class="highlight-status">已闭关</span>，<span class="highlight-status">不会看</span>社媒的<span class="highlight-status">任何消息</span>（评论、回复、私信）。毕竟我和我的作品都<span class="highlight-emotion">不被理解、不被认可、不被信任、不被期待和不被认识</span>。<span class="highlight-emotion">我已经被这个世界逼疯了</span>。',
      '最后，如果某天发现我开始长期<span class="highlight-status">没更新、没动静</span>，那要么是<span class="highlight-emotion">死了</span>，要么是<span class="highlight-emotion">抑郁症加重</span>到<span class="highlight-status">无法</span>打开电脑了。'
    ];

    const contentContainer = queryIn<HTMLElement>(section, '.about-content');
    
    // 保存标题和竖排文字引用
    this.titleElement = queryIn<HTMLElement>(section, '.about-title');
    this.verticalTextElement = queryIn<HTMLElement>(section, '.about-vertical-text');

    paragraphs.forEach((text, index) => {
      const p = cloneTemplate<HTMLElement>('about-paragraph-template');
      p.innerHTML = text; 
      
      // 先不添加动画类，等进入视口时再添加
      // 但是设置好方向属性，方便后续添加
      p.dataset.direction = index % 2 === 0 ? 'left' : 'right';
      // 标题动画0.8s，所以段落从0.9s开始
      p.dataset.delay = `${0.9 + index * 0.15}`;
      
      contentContainer.appendChild(p);
      this.paragraphElements.push(p);
    });

    // 添加移动端横排文本
    const mobileText = cloneTemplate<HTMLElement>('about-paragraph-template');
    mobileText.className = 'about-mobile-slogan';
    mobileText.textContent = '没钱却依旧为爱发电第n人';
    contentContainer.appendChild(mobileText);

    // 填充移动端侧边栏二维码
    this.setupMobileSidebar(section);

    return section;
  }

  private setupMobileSidebar(section: HTMLElement): void {
    const sidebarContainer = section.querySelector('.about-support-sidebar .qrcode-container');
    if (!sidebarContainer) return;

    const qrcodes = [
      { label: '微信', image: `${import.meta.env.BASE_URL}assets/qrcodes/wechat.png` },
      { label: '支付宝', image: `${import.meta.env.BASE_URL}assets/qrcodes/alipay.png` }
    ];

    qrcodes.forEach(qr => {
      const item = cloneTemplate<HTMLElement>('qrcode-item-template');
      const label = queryIn<HTMLElement>(item, '.qrcode-label');
      const image = queryIn<HTMLImageElement>(item, '.qrcode-image');
      
      label.textContent = qr.label;
      image.src = qr.image;
      image.alt = `${qr.label}赞助二维码`;
      
      sidebarContainer.appendChild(item);
    });
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当关于区域进入视口且还没播放过动画
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.triggerAnimations();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // 当 20% 进入视口时触发
        rootMargin: '0px'
      }
    );

    observer.observe(this.element);
  }

  private triggerAnimations(): void {
    // 触发竖排文字动画
    this.verticalTextElement.classList.add('animate');
    
    // 触发标题动画
    this.titleElement.classList.add('animate');

    // 触发段落动画
    this.paragraphElements.forEach((p) => {
      const direction = p.dataset.direction;
      const delay = p.dataset.delay;

      // 添加动画类
      if (direction === 'left') {
        p.classList.add('fly-from-left');
      } else {
        p.classList.add('fly-from-right');
      }

      // 设置延迟
      if (delay) {
        p.style.animationDelay = `${delay}s`;
      }
    });
  }

  /**
   * 检查最后一个内容元素是否完全可见
   */
  public isLastContentVisible(): boolean {
    // 获取所有段落（不包括移动端的横排文本）
    const paragraphs = this.paragraphElements.filter(p => !p.classList.contains('about-mobile-slogan'));
    
    if (paragraphs.length === 0) return true;
    
    const lastElement = paragraphs[paragraphs.length - 1];
    const rect = lastElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // 检查元素底部是否完全在视口内（留 10px 余量，避免像素级误差）
    return rect.bottom <= windowHeight - 10;
  }
}

