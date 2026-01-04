import type { Component } from '../types';
import { cloneTemplate, queryIn } from '../utils/template';
import { smoothScrollTo } from '../utils/scroll';

/**
 * 遗书段落数据接口
 */
interface TestamentParagraph {
  text: string;           // 段落文字（可包含 HTML 角标，如 <sup>1</sup>）
}

/**
 * 遗书角标注释接口
 */
interface TestamentFootnote {
  text: string;           // 注释文字（编号会自动生成）
}

export class TestamentSection implements Component {
  element: HTMLElement;
  private hasAnimated: boolean = false;
  private titleElement!: HTMLElement;
  private subtitleElement!: HTMLElement;
  private contentContainer!: HTMLElement;
  private footnotesContainer!: HTMLElement;

  constructor() {
    this.element = this.render();
    this.setupIntersectionObserver();
  }

  render(): HTMLElement {
    const section = cloneTemplate<HTMLElement>('testament-section-template');

    // 保存元素引用
    this.titleElement = queryIn<HTMLElement>(section, '.testament-title');
    this.subtitleElement = queryIn<HTMLElement>(section, '.testament-subtitle');
    this.contentContainer = queryIn<HTMLElement>(section, '.testament-main-content');
    this.footnotesContainer = queryIn<HTMLElement>(section, '.testament-footnotes');

    // 遗书正文内容数组
    const contents: TestamentParagraph[] = [
      { text: '如果你正在读到这些文字，说明我至少曾经存在过。不论是以什么方式，被谁看到，这一点本身就已经足够了。' },
      { text: '我并不是在某个突如其来的不幸中走到这一步的。也没有发生什么戏剧性的转折。只是随着时间不断向前，我逐渐意识到，有些东西从一开始就不在我的人生选项里。' },
      { text: '因为家庭的原因，我很早就感受不到所谓的亲情。不是争吵，也不是决裂，更不是刻意的冷漠。而是一种更接近"空白"的状态。亲情这个概念，对我来说始终像是他人的经验谈，我知道它存在，却从未真正触碰过。' },
      { text: '再加上天生内向的性格，我也始终没能建立起真正的友情。我不擅长靠近别人，也不懂得该在什么距离停下。靠得太近会感到不安，站得太远又会被轻易忽略。于是我学会了一个人待着，并逐渐把这种状态当成常态。' },
      { text: '正因为极度内向社恐的性格，我从未真正踏入过所谓的社会。我没有认真考虑过找工作这件事。在招聘应用上看到"性格开朗""擅长沟通""具有团队精神"之类的关键词时，我几乎都会下意识地快速划过。那些要求对我来说，并不是门槛，而是一种明确的拒绝。' },
      { text: '我也没有去接单、接稿，更没有尝试过送外卖、跑腿或其他需要频繁与人沟通的事情。并不是觉得那些工作有什么问题，只是我很清楚，自己无法在那样的环境中坚持下去。' },
      { text: '于是我选择了独自一人进行独立开发。一个人写代码，一个人构思，一个人解决问题。确实，这种生活方式很自由，不需要迎合他人，也不需要解释自己。但自由的另一面，是没有稳定的收入，是长期的不确定性，也是在看不到回报的情况下，不断消耗自己的时间、精力和生命。' },
      { text: '我很清楚，只靠他人的自愿赞助来继续活下去，本身就是一条几乎无法成立的路线。这个名为‘人生’的游戏，从一开始就没有为我准备通关方式。我只是拖延着失败的结算时间，而已。这很正常。毕竟这个世界穷人比富人多，大多数人也没钱，更不可能去赞助一个陌生人，再说了，陌生人为什么要管另一个陌生人的死活呢？我就不应该活着，如果可以，我本想不出生的。'},
      { text: '我从后台可以看到，我曾经发布过的所有项目及视频的浏览量及播放量都很低。这很正常。毕竟我说过的，我不被期待。即便想造轮子、开发一个新项目，搜索引擎也告诉我市面上已有很多同类作品。自己犹豫要不要动手，就算最终开发完了，独立开发者的知名度也远不及团队，结果项目没人用，自己亏本，透支生命。这一切，依旧很正常。' },
      { text: '有时候我也会怀疑，这到底算不算是在"活着"。可即便如此，我还是无法说服自己去选择另一条路。至少在这里，我不需要假装成别的样子。' },
      { text: '至于爱情，那更像是一个只存在于叙事中的词语。我理解它的意义，也明白它为什么重要，却始终无法在现实中与它产生交集。它就像一条永远不会被触发的分支路线，明明写在设定里，却注定无法进入。' },
      { text: '曾经我以为，只要看到别人幸福，自己也会随之幸福。然而事实彻底否定了这一点。我不能再欺骗自己，我就是不幸福。' },
      { text: '我是独生子。从出生开始，就已经习惯了"只有自己"的生活方式。到现在为止，我已经积累了好几十年的孤独经验与多年的抑郁经验。这种孤独并不激烈，也不张扬，它只是静静地存在着，像空气一样，让人几乎察觉不到，却无法摆脱。' },
      { text: '抑郁也是如此。它并不是某一天突然降临的灾难，而是随着时间一点点渗透进来的东西。一开始只是疲惫，后来变成迟钝，再后来，连悲伤本身都失去了清晰的轮廓。对不幸的事、痛苦的事，我逐渐变得麻木。情感、表情、语言，都慢慢失去了反应。最后只剩下一种"无心、无口、无情"的状态。' },
      { text: '我带着这些debuff，失去亲情、友情与爱情，伴随着长期的孤独、抑郁以及5个不被XX[*]，就这样浑浑噩噩地活到了现在。不是因为有什么明确的目标，只是因为还没有倒下而已。' },
      { text: '半夜的时候，我经常会难受得哭泣。明知道这些发泄的声音不会被任何人听见，也不会带来任何改变，可我还是说了出来。也许正因为没人回应，我的人生一直没发生变化，也没有任何所谓的救赎。' },
      { text: '欸，我前几个页面所写的所有文案，估计不懂行以及没有经历过我事迹的人是无法理解的吧。' },
      { text: '好比说一个项目开发完毕，大多数人只知道结果，但不知道促成这个结果的过程中，花费了多少时间、精力与生命，有多么辛苦，改了多少bug，成本亏了多少。' },
      { text: '这很正常。毕竟我说过的，我不被理解。' },
      { text: '三次元的世界，果然糟糕透了，就是狗屎[*]。班上没有听力障碍的同学[*]、被椅子砸中的同学[*]、得绝症的同学[*]、患中二病的同学[*]、说俄语的同学[*]；没有被误送情书[*]；没有告白错人[*]；没有在家庭餐厅目睹被甩的同学[*]；没有邂逅一起学习画画的朋友[*]；没有在路灯下邂逅无家可归的少女[*]；身边没有出现“我很好奇”的人[*]；没有尾随跟踪我的少女[*]；青梅竹马[*]或妹妹[*]没有被杀害（压根没有青梅竹马和妹妹）；母亲没有被巨人吃掉[*]；家族没有被灭门，妹妹没有变成鬼[*]，没有负责插画的妹妹[*]，也没有电波系妹妹[*]，更没有能让我变成女性的妹妹[*]；我的外婆没有打败并收服过妖怪[*]；住宅隔壁没有住着女友[*]或天使[*]；家里阳台没有少女被晾过[*]；没有与各种各样的精灵邂逅[*]；' },
      { text: '没有邂逅仿生机器人[*]；没有被喂食APTX4869导致缩小[*]；从没有触发过互换身体事件[*]，也没有邂逅过晴女[*]；手中没有守护好的单词本[*]；我不具备当五胞胎家教的能力[*]；更不可能做到恋爱和学习两不误[*]。现实没有闭门师这个职业[*]，也没有进入就会时间加速的隧道[*]；去图书馆，不会邂逅兔女郎[*]，去学校里的图书室，不会邂逅偷吃的同学[*]；在街上行走，也不会被车撞[*]或被卡车撞进异世界[*]；没有遇到列车脱轨被困事故[*]；去便利店买东西，也不会穿越到异世界[*]；天空不会突然降下雷电选中我[*]；我曾经上过的学校都不是高级监狱[*]；更不会被卷入什么死亡游戏[*]。' },
      { text: '现实，始终保持着它一贯的冷静与无趣。' },
      { text: '没有奇迹发生的每一天，就是我所承受的一切。我只是凭借着相对还算强的心理承受能力，接受了这一切，并继续活下去。没有奖励，也没有安慰，只是不断重复，精神状态日渐削弱。' },
      { text: '死亡这种东西，通常是无法预测的。可我总觉得，每个人似乎都能为了"重要之物"而牺牲自己的性命。那样的选择看起来很耀眼，也很有重量。但我活到现在，却始终没有遇到过那样的存在。没有重要之物，没有不能忘记的人，没有绝对要守护的事物[*]。这很正常。毕竟我说过的，我不被认可和信任。' },
      { text: '就算这样的我活在世上，数亿的人也对我一无所知，就算我死了，全世界80亿人也无所改变吧[*]，更不会有人感到悲伤。这很正常。毕竟我说过的，我不被认识。就算会悲伤，也只是少数人，悲伤的人占比少数总比多数要好，至少从结果上看，这是一个相对合理的选择。' },
      { text: '我无法衡量生命的重量。因为在我的人生里，从未有过可以用来对比的参照。我只是做着自己想做的事情，随心所欲地活到了现在[*]。而本站，就是我活过的证明。' },
      { text: '如果所谓的自我救赎真的能够成功，那为什么会出现相互救赎呢？也许我的核心问题，并不是我不够努力，而是从一开始，就出生在了错误的世界观里。' },
      { text: '我知道，二次元也并不完美。那里同样充满悲剧、失去与痛苦。但至少，那些痛苦看起来更温柔一些。二次元带给我的所有感动与刀子，我都会记住。' },
      { text: '这一切，仅此而已。この世界、だいっきらい。' },
      { text: '以上遗书内容仅为提前写的，留给未来。并不是写完就去死，人还没死。' },
      { text: '我声明：本站所有文本均为本人真实记录，不涉及虚构或刻意夸张。（中国人不骗中国人，否则我死全家）' },
      { text: '声明人：陈冠霖' }
    ];

    // 角标注释数组（编号会自动生成）
    const footnotes: TestamentFootnote[] = [
      { text: '不被理解、不被认可、不被信任、不被期待和不被认识' },
      { text: '出自歌曲《bibouroku》歌词' },
      { text: '动画电影《声之形》' },
      { text: '国产Galgame《候鸟》' },
      { text: '动画电影《我想吃掉你的胰脏》、《四月是你的谎言》等其他女主患有绝症的作品' },
      { text: '《中二病也要谈恋爱!》' },
      { text: '《不时轻声地以俄语遮羞的邻座艾莉同学》' },
      { text: '《龙与虎》' },
      { text: '《出包王女》' },
      { text: '《败犬女主也太多了!》' },
      { text: '《月刊少女野崎君》、《这个美术社大有问题!》、动画电影《蓦然回首》等其他作品' },
      { text: '《剃须。然后捡到女高中生。》' },
      { text: '《冰菓》' },
      { text: '《噬血狂袭》' },
      { text: '《夏日重现》' },
      { text: '《妖精的旋律》' },
      { text: '《进击的巨人》' },
      { text: '《鬼灭之刃》' },
      { text: '《埃罗芒阿老师》' },
      { text: '《电波女与青春男》' },
      { text: '《别当欧尼酱了!》'},
      { text: '《夏目友人帐》' },
      { text: '《租借女友》' },
      { text: '《关于邻家的天使大人不知不觉把我惯成了废人这档子事》' },
      { text: '《魔法禁书目录》' },
      { text: '《约会大作战》等其他作品' },
      { text: '《可塑性记忆》、《ATRI -My Dear Moments-》等其他作品' },
      { text: '《名侦探柯南》' },
      { text: '动画电影《你的名字。》' },
      { text: '动画电影《天气之子》' },
      { text: '《Charlotte》' },
      { text: '《五等分的新娘》' },
      { text: '基本上所有校园恋爱题材作品都能做到，真科幻啊' },
      { text: '动画电影《铃芽之旅》' },
      { text: '动画电影《通往夏天的隧道，再见的出口》' },
      { text: '《青春猪头少年》系列' },
      { text: '《我心里危险的东西》' },
      { text: '《总之就是非常可爱》' },
      { text: '《无职转生～到了异世界就拿出真本事～》' },
      { text: '《Angel Beats!》' },
      { text: '《Re:从零开始的异世界生活》' },
      { text: '动画电影《HELLO WORLD》' },
      { text: '《欢迎来到实力至上主义的教室》、《弹丸论破》系列等其他作品' },
      { text: '《刀剑神域》、《未来日记》、《弹丸论破》系列等其他带有死亡游戏设定的作品' },
      { text: '语录出自动画电影《你的名字。》' },
      { text: '出自歌曲《自傷無色》歌词' },
      { text: '语录出自Galgame《永不枯萎的世界与终结之花》' }
    ];

    // 如果有内容则渲染，否则显示"敬请期待"
    if (contents.length > 0) {
      this.subtitleElement.classList.add('hidden');
      this.renderContents(contents);
      
      // 如果有角标注释，则渲染注释区域
      if (footnotes.length > 0) {
        this.renderFootnotes(footnotes);
      }
    }

    return section;
  }

  /**
   * 渲染遗书正文内容
   */
  private renderContents(contents: TestamentParagraph[]): void {
    let footnoteCounter = 1;
    
    contents.forEach((item, index) => {
      const paragraph = cloneTemplate<HTMLElement>('testament-paragraph-template');
      const textElement = queryIn<HTMLElement>(paragraph, '.testament-text');
      
      // 自动替换 [*] 为递增的角标编号
      let processedText = item.text;
      processedText = processedText.replace(/\[\*\]/g, () => {
        const currentNumber = footnoteCounter;
        footnoteCounter++;
        return `<sup>${currentNumber}</sup>`;
      });
      
      textElement.innerHTML = processedText;
      
      paragraph.dataset.delay = `${1.5 + index * 0.3}`;
      this.contentContainer.appendChild(paragraph);
    });
    
    // 为所有角标添加点击事件
    this.setupFootnoteClicks();
  }

  /**
   * 为角标添加点击事件和悬停提示
   */
  private setupFootnoteClicks(): void {
    const supElements = this.contentContainer.querySelectorAll('sup');
    
    supElements.forEach((sup) => {
      // 点击事件
      sup.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 获取角标编号
        const footnoteNumber = sup.textContent?.trim();
        if (!footnoteNumber) return;
        
        // 查找对应的注释元素
        const footnoteElement = this.findFootnoteByNumber(footnoteNumber);
        
        // 平滑滚动到注释位置
        this.scrollToFootnote(footnoteElement);
      });
      
      // 悬停事件 - 显示 tooltip
      sup.addEventListener('mouseenter', () => {
        const footnoteNumber = sup.textContent?.trim();
        if (!footnoteNumber) return;
        
        const footnoteElement = this.findFootnoteByNumber(footnoteNumber);
        
        const footnoteText = this.getFootnoteText(footnoteElement);
        this.showTooltip(sup, footnoteText);
      });
      
      // 鼠标离开 - 隐藏 tooltip
      sup.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  /**
   * 根据编号查找注释元素
   */
  private findFootnoteByNumber(number: string): HTMLElement {
    const footnotes = this.footnotesContainer.querySelectorAll('.testament-footnote');
    
    for (const footnote of Array.from(footnotes)) {
      const numberElement = footnote.querySelector('.testament-footnote-number');
      if (numberElement && numberElement.textContent?.startsWith(number)) {
        return footnote as HTMLElement;
      }
    }
    
    throw new Error(`Footnote with number "${number}" not found`);
  }

  /**
   * 平滑滚动到注释并高亮
   */
  private async scrollToFootnote(footnoteElement: HTMLElement): Promise<void> {
    // 计算目标位置（留出一些顶部空间）
    const elementTop = footnoteElement.getBoundingClientRect().top + window.scrollY;
    const offset = 100; // 距离顶部的偏移量
    const targetY = elementTop - offset;
    
    // 平滑滚动
    await smoothScrollTo(targetY, 600);
    
    // 高亮注释
    this.highlightFootnote(footnoteElement);
  }

  /**
   * 高亮注释（短暂显示后消失）
   */
  private highlightFootnote(footnoteElement: HTMLElement): void {
    // 添加高亮类
    footnoteElement.classList.add('testament-footnote-highlight');
    
    // 2秒后移除高亮
    setTimeout(() => {
      footnoteElement.classList.remove('testament-footnote-highlight');
    }, 2000);
  }

  /**
   * 获取注释文本
   */
  private getFootnoteText(footnoteElement: HTMLElement): string {
    const textElement = footnoteElement.querySelector('.testament-footnote-text');
    return textElement?.textContent || '';
  }

  /**
   * 显示 tooltip
   */
  private showTooltip(supElement: HTMLElement, text: string): void {
    // 移除已存在的 tooltip
    this.hideTooltip();
    
    // 使用模板克隆 tooltip 元素
    const tooltip = cloneTemplate<HTMLElement>('testament-tooltip-template');
    tooltip.textContent = text;
    
    // 添加到 body
    document.body.appendChild(tooltip);
    
    // 计算位置
    const supRect = supElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // 默认显示在角标上方
    let top = supRect.top + window.scrollY - tooltipRect.height - 8;
    let left = supRect.left + window.scrollX + (supRect.width / 2) - (tooltipRect.width / 2);
    
    // 如果上方空间不够，显示在下方
    if (supRect.top < tooltipRect.height + 8) {
      top = supRect.bottom + window.scrollY + 8;
    }
    
    // 确保不超出左右边界
    const padding = 16;
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  /**
   * 隐藏 tooltip
   */
  private hideTooltip(): void {
    const existingTooltip = document.querySelector('[data-tooltip="true"]') as HTMLElement;
    if (existingTooltip) {
      // 添加淡出动画
      existingTooltip.style.animation = 'tooltipFadeOut 0.2s ease-out forwards';
      
      // 动画结束后移除元素
      setTimeout(() => {
        existingTooltip.remove();
      }, 200);
    }
  }

  /**
   * 渲染角标注释区域
   */
  private renderFootnotes(footnotes: TestamentFootnote[]): void {
    // 显示注释容器
    this.footnotesContainer.classList.remove('hidden');
    
    footnotes.forEach((footnote, index) => {
      const footnoteElement = cloneTemplate<HTMLElement>('testament-footnote-template');
      const numberElement = queryIn<HTMLElement>(footnoteElement, '.testament-footnote-number');
      const textElement = queryIn<HTMLElement>(footnoteElement, '.testament-footnote-text');
      
      // 自动生成编号（从 1 开始）
      numberElement.textContent = `${index + 1}.`;
      textElement.textContent = footnote.text;
      
      this.footnotesContainer.appendChild(footnoteElement);
    });
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.triggerAnimations();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 50px 0px'
      }
    );

    observer.observe(this.element);
  }

  private triggerAnimations(): void {
    // 标题动画
    this.titleElement.classList.add('animate');
    
    // 副标题动画
    this.subtitleElement.classList.add('animate');

    // 正文段落动画
    const paragraphs = this.contentContainer.querySelectorAll('.testament-paragraph');
    
    paragraphs.forEach((p) => {
      const paragraph = p as HTMLElement;
      const delay = paragraph.dataset.delay;
      paragraph.classList.add('fade-in');
      if (delay) {
        paragraph.style.animationDelay = `${delay}s`;
      }
    });
  }

  /**
   * 检查最后一个内容元素是否完全可见
   * 注：如果有注释区域，则检查注释区域；否则检查最后一个段落
   */
  public isLastContentVisible(): boolean {
    // 优先检查注释区域（如果存在且可见）
    if (!this.footnotesContainer.classList.contains('hidden')) {
      const rect = this.footnotesContainer.getBoundingClientRect();
      return rect.bottom <= window.innerHeight - 10;
    }
    
    // 否则检查最后一个段落
    const paragraphs = this.contentContainer.querySelectorAll('.testament-paragraph');
    if (paragraphs.length === 0) return true;
    
    const lastElement = paragraphs[paragraphs.length - 1] as HTMLElement;
    const rect = lastElement.getBoundingClientRect();
    
    return rect.bottom <= window.innerHeight - 10;
  }

  /**
   * 获取最后一个内容元素
   */
  public getLastContentElement(): HTMLElement | null {
    // 优先返回注释区域（如果存在且可见）
    if (!this.footnotesContainer.classList.contains('hidden')) {
      return this.footnotesContainer;
    }
    
    // 否则返回最后一个段落
    const paragraphs = this.contentContainer.querySelectorAll('.testament-paragraph');
    if (paragraphs.length === 0) return null;
    
    return paragraphs[paragraphs.length - 1] as HTMLElement;
  }
}

