import type { Component } from '../types';
import { cloneTemplate, queryIn } from '../utils/template';

export class RealitySection implements Component {
  element: HTMLElement;
  private hasAnimated: boolean = false;
  private itemElements: HTMLElement[] = [];
  private titleElement!: HTMLElement;
  private introTexts: HTMLElement[] = [];

  constructor() {
    this.element = this.render();
    this.setupIntersectionObserver();
  }

  render(): HTMLElement {
    const section = cloneTemplate<HTMLElement>('reality-section-template');

    // 现实列表
    const realities = [
      '项目内留下的联系方式形同虚设，所有bug都是开发者自己发现的，从未收到过用户反馈，从项目上线就一直在演独角戏。',
      '项目内的赞助入口形同虚设，除非强制收费，否则没人会主动付费。',
      '大多数用户只知道"开发者做了个什么样的项目"，但不知道"开发者的开发环境和精神状态"。',
      '游戏开发中程序和美术都很重要：没有程序，游戏跑都跑不起来；美术则是玩家的第一印象。但当玩家玩到一个战斗系统时，他们关注的都是"打击感怎么样"、"角色立绘怎么样"，而不是"代码质量怎么样"，因此背后的程序员容易被忽略。',
      '在看游戏排行榜上的万氪大佬时陷入了沉思：大部分用户宁愿把钱充进游戏、买官方周边，也不愿赞助创作者，创作者开始怀疑自己是否做得不如官方，最终自闭。其实可能真的不如官方，因为这是独立游戏开发者这个身份的必然结果，详见第7条。',
      '社交媒体的赞美都是廉价的，点赞收藏转发一句感谢都不需要付出任何成本，但真正的支持（金钱/时间）几乎为零，创作者最终发现热度和实际回报完全不成正比。',
      '独立游戏开发者样样都会，但样样不精：编程、美术、音乐、策划、剧本都只是够用就行，没有一个领域能达到专业水准，因为学得太散、太乱（好比说今天学编程，明天学美术，后天学音乐），每个领域都学，不知道正确的学习顺序，只能每个都浅尝辄止。',
      '别人花相同的时间精通单一领域，而我花相同的时间熟悉各个领域，所以在单一领域上我是永远比不过别人的，给我带来的自卑是无法避免的，别对我抱有太大的期待，我只是个废物而已。',
      '一人根本无法长期运营维护项目，我很多项目停更就是因为精力耗尽，网站的举报功能、内容审核都只是装饰，从来没有时间和精力去处理。',
      '未来就算做出前后端俱全的大型项目，当服务器被攻击的那一天，也会因为一人应付不过来而被迫废弃。'
    ];

    // 保存标题引用
    this.titleElement = queryIn<HTMLElement>(section, '.reality-title');
    
    // 保存引言文本引用
    const introTexts = section.querySelectorAll('.reality-intro-text');
    introTexts.forEach((text) => {
      this.introTexts.push(text as HTMLElement);
    });

    // 获取网格容器
    const gridContainer = queryIn<HTMLElement>(section, '.reality-items-grid');

    realities.forEach((text, index) => {
      const item = cloneTemplate<HTMLElement>('reality-item-template');
      const number = queryIn<HTMLElement>(item, '.reality-number');
      const textElement = queryIn<HTMLElement>(item, '.reality-text');
      
      number.textContent = `${index + 1}`;
      textElement.textContent = text;
      
      // 先不添加动画类，等进入视口时再添加
      // 引言文本的最后一个在 1.1s，所以列表项从 1.5s 开始
      item.dataset.delay = `${1.5 + index * 0.2}`;
      
      gridContainer.appendChild(item);
      this.itemElements.push(item);
    });

    return section;
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当现实区域进入视口且还没播放过动画
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
    // 触发标题动画
    this.titleElement.classList.add('animate');

    // 触发引言文本动画（通过添加类来启用 CSS 动画）
    this.introTexts.forEach((text) => {
      text.classList.add('animate');
    });

    // 触发列表项动画
    this.itemElements.forEach((item) => {
      const delay = item.dataset.delay;

      // 添加动画类
      item.classList.add('fly-in');

      // 设置延迟
      if (delay) {
        item.style.animationDelay = `${delay}s`;
      }
    });
  }

  /**
   * 检查最后一个内容元素是否完全可见
   */
  public isLastContentVisible(): boolean {
    if (this.itemElements.length === 0) return true;
    
    const lastElement = this.itemElements[this.itemElements.length - 1];
    const rect = lastElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // 检查元素底部是否完全在视口内（留 10px 余量，避免像素级误差）
    return rect.bottom <= windowHeight - 10;
  }
}

