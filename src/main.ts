import './styles/reset.css';
import './styles/variables.css';
import './styles/intro.css';
import './styles/split-world.css';
import './styles/sidebar.css';
import './styles/cards.css';
import './styles/modal.css';
import './styles/animations.css';
import './styles/about.css';
import './styles/reality.css';
import './styles/testament.css';
import './styles/settings.css';

import { IntroSection } from './components/IntroSection';
import { CodeWorld } from './components/CodeWorld';
import { ArtWorld } from './components/ArtWorld';
import { SupportSidebar } from './components/SupportSidebar';
import { Modal } from './components/Modal';
import { AboutSection } from './components/AboutSection';
import { RealitySection } from './components/RealitySection';
import { TestamentSection } from './components/TestamentSection';
import { SettingsPanel } from './components/SettingsPanel';

import { ParticleNetwork } from './effects/ParticleNetwork';
import { MatrixRain } from './effects/MatrixRain';
import { GradientFlow } from './effects/GradientFlow';
import { SplitAnimation } from './effects/SplitAnimation';
import { FallingParticles } from './effects/FallingParticles';
import { IceParticles } from './effects/IceParticles';

import { query, cloneTemplate } from './utils/template';
import { smoothScrollTo } from './utils/scroll';
import { getCSSTransitionDuration } from './utils/css';

// 视图状态常量
const ViewState = {
  INTRO: 'intro',
  MAIN: 'main',
  ABOUT: 'about',
  REALITY: 'reality',
  TESTAMENT: 'testament'
} as const;

type ViewState = typeof ViewState[keyof typeof ViewState];

// 页面顺序定义（用于智能判断滚动提示）
const VIEW_ORDER: ViewState[] = [
  ViewState.INTRO,
  ViewState.MAIN,
  ViewState.ABOUT,
  ViewState.REALITY,
  ViewState.TESTAMENT
];

class App {
  private app: HTMLElement;
  private introSection: IntroSection;
  private codeWorld: CodeWorld;
  private artWorld: ArtWorld;
  private supportSidebar: SupportSidebar;
  private modal: Modal;
  private aboutSection: AboutSection;
  private realitySection: RealitySection;
  private testamentSection: TestamentSection;
  private settingsPanel: SettingsPanel;
  private scrollHint!: HTMLElement;
  
  private particleNetwork: ParticleNetwork | null = null;
  private matrixRain!: MatrixRain | null;
  private gradientFlow!: GradientFlow | null;
  private fallingParticles!: FallingParticles | null;
  private iceParticles!: IceParticles | null;
  
  // 状态机
  private currentView: ViewState = ViewState.INTRO;
  private isTransitioning: boolean = false;

  private updateViewClass(view: ViewState): void {
    // 移除所有视图类名
    document.body.classList.remove('view-intro', 'view-main', 'view-about', 'view-reality', 'view-testament');
    // 添加当前视图类名
    switch (view) {
      case ViewState.INTRO:
        document.body.classList.add('view-intro');
        break;
      case ViewState.MAIN:
        document.body.classList.add('view-main');
        break;
      case ViewState.ABOUT:
        document.body.classList.add('view-about');
        break;
      case ViewState.REALITY:
        document.body.classList.add('view-reality');
        break;
      case ViewState.TESTAMENT:
        document.body.classList.add('view-testament');
        break;
    }
  }

  /**
   * 检查元素是否滚动到底部（基于 window.scrollY）
   * @param element 要检查的元素
   * @param threshold 阈值（像素），默认50px
   */
  private isScrolledToBottom(element: HTMLElement, threshold = 50): boolean {
    const elementBottom = element.offsetTop + element.scrollHeight;
    const windowBottom = window.scrollY + window.innerHeight;
    return windowBottom >= elementBottom - threshold;
  }

  /**
   * 检查元素是否滚动到顶部（基于 window.scrollY）
   * @param element 要检查的元素
   * @param threshold 阈值（像素），默认10px
   */
  private isScrolledToTop(element: HTMLElement, threshold = 10): boolean {
    return window.scrollY <= element.offsetTop + threshold;
  }

  /**
   * 检查当前视图的最后一个内容元素是否完全可见
   * @param view 当前视图
   */
  private isLastContentVisible(view: ViewState): boolean {
    switch (view) {
      case ViewState.ABOUT:
        return this.aboutSection.isLastContentVisible();
      
      case ViewState.REALITY:
        return this.realitySection.isLastContentVisible();
      
      case ViewState.TESTAMENT:
        return this.testamentSection.isLastContentVisible();
      
      default:
        return true;
    }
  }

  /**
   * 检查当前视图是否允许切换到下一页（向下滚动）
   * @param view 当前视图状态
   */
  private canTransitionToNext(view: ViewState): boolean {
    switch (view) {
      case ViewState.INTRO:
        // 首屏可以直接切换
        return true;
      
      case ViewState.MAIN:
        // 主视图可以直接切换（不检查 works-grid）
        return true;
      
      case ViewState.ABOUT:
        // 关于页面需要最后一条内容完全可见
        return this.isLastContentVisible(ViewState.ABOUT);
      
      case ViewState.REALITY:
        // 现实页面需要最后一条内容（第8条）完全可见
        return this.isLastContentVisible(ViewState.REALITY);
      
      case ViewState.TESTAMENT:
        // 最后一页，不允许向下切换
        return false;
      
      default:
        return true;
    }
  }

  /**
   * 检查当前视图是否允许切换到上一页（向上滚动）
   * @param view 当前视图状态
   */
  private canTransitionToPrevious(view: ViewState): boolean {
    switch (view) {
      case ViewState.INTRO:
        // 首屏，不允许向上切换
        return false;
      
      case ViewState.MAIN:
        // 主视图需要编程区域滚动到顶部
        return this.codeWorld.isAtTop();
      
      case ViewState.ABOUT:
        // 关于页面需要滚动到顶部
        return this.isScrolledToTop(this.aboutSection.element);
      
      case ViewState.REALITY:
        // 现实页面需要滚动到顶部
        return this.isScrolledToTop(this.realitySection.element);
      
      case ViewState.TESTAMENT:
        // 遗书页面需要滚动到顶部
        return this.isScrolledToTop(this.testamentSection.element);
      
      default:
        return true;
    }
  }

  /**
   * 智能判断当前视图是否应该显示滚动提示
   * 规则：首屏不显示，最后一页不显示，其他页面都显示
   */
  private shouldShowScrollHint(view: ViewState): boolean {
    const viewIndex = VIEW_ORDER.indexOf(view);
    // 首屏（索引 0）或最后一页不显示
    return viewIndex > 0 && viewIndex < VIEW_ORDER.length - 1;
  }

  /**
   * 根据当前滚动位置判断应该在哪个视图（基于元素实际位置）
   * @param scrollY 当前滚动位置
   */
  private getViewByScrollPosition(scrollY: number): ViewState {
    const viewportHeight = window.innerHeight;
    
    // 检查是否在首屏区域
    if (scrollY < viewportHeight * 0.5) {
      return ViewState.INTRO;
    }
    
    // 检查是否在主视图区域
    if (scrollY < this.aboutSection.element.offsetTop - viewportHeight * 0.5) {
      return ViewState.MAIN;
    }
    
    // 检查是否在关于页面区域
    if (scrollY < this.realitySection.element.offsetTop - viewportHeight * 0.5) {
      return ViewState.ABOUT;
    }
    
    // 检查是否在现实页面区域
    if (scrollY < this.testamentSection.element.offsetTop - viewportHeight * 0.5) {
      return ViewState.REALITY;
    }
    
    // 否则在遗书页面
    return ViewState.TESTAMENT;
  }

  /**
   * 根据目标视图智能更新滚动提示（带延迟）
   * @param targetView 目标视图
   * @param delayBeforeShow 显示前的延迟时间（毫秒），默认使用 CSS transition duration
   */
  private async updateScrollHint(targetView: ViewState, delayBeforeShow?: number): Promise<void> {
    const transitionDuration = getCSSTransitionDuration('--transition-base');
    const showDelay = delayBeforeShow !== undefined ? delayBeforeShow : transitionDuration;
    const shouldShow = this.shouldShowScrollHint(targetView);
    const currentlyVisible = this.scrollHint.classList.contains('visible');
    
    if (shouldShow && !currentlyVisible) {
      // 需要显示：先延迟（让页面稳定），再添加类（触发 CSS transition）
      if (showDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, showDelay));
      }
      
      // 强制浏览器重排，确保初始状态（opacity: 0, translateY(100px)）已应用
      void this.scrollHint.offsetHeight;
      
      // 使用 requestAnimationFrame 确保在下一帧添加类
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      
      this.scrollHint.classList.add('visible');
    } else if (!shouldShow && currentlyVisible) {
      // 需要隐藏：立即移除类（触发 CSS transition），然后等待动画完成
      this.scrollHint.classList.remove('visible');
      
      // 等待 CSS transition 完成
      if (transitionDuration > 0) {
        await new Promise(resolve => setTimeout(resolve, transitionDuration));
      }
    }
  }

  constructor() {
    const appElement = query<HTMLElement>('#app');
    this.app = appElement;

    // 初始化视图类名
    this.updateViewClass(this.currentView);

    // 创建组件
    this.introSection = new IntroSection();
    this.codeWorld = new CodeWorld();
    this.artWorld = new ArtWorld();
    this.supportSidebar = new SupportSidebar();
    this.modal = new Modal();
    this.aboutSection = new AboutSection();
    this.realitySection = new RealitySection();
    this.testamentSection = new TestamentSection();
    this.settingsPanel = new SettingsPanel();

    this.init();
  }

  private init(): void {
    // 添加首屏
    this.app.appendChild(this.introSection.element);

    // 创建主容器
    const mainContainer = cloneTemplate<HTMLDivElement>('main-container-template');
    
    // 添加双面世界
    mainContainer.appendChild(this.codeWorld.element);
    mainContainer.appendChild(this.artWorld.element);
    
    // 添加分割线
    const divider = cloneTemplate<HTMLDivElement>('divider-template');
    mainContainer.appendChild(divider);
    
    // 添加滚动提示（初始隐藏）
    this.scrollHint = cloneTemplate<HTMLDivElement>('scroll-hint-template');
    mainContainer.appendChild(this.scrollHint);

    
    this.app.appendChild(mainContainer);
    
    // 添加关于我区域
    this.app.appendChild(this.aboutSection.element);
    
    // 添加现实区域
    this.app.appendChild(this.realitySection.element);
    
    // 添加遗书区域
    this.app.appendChild(this.testamentSection.element);
    
    // 添加侧边栏
    this.app.appendChild(this.supportSidebar.element);
    
    // 添加设置组件
    document.body.appendChild(this.settingsPanel.element);

    // 添加模态窗
    this.app.appendChild(this.modal.element);

    // 初始化粒子效果
    this.initParticleEffect();

    // 绑定进入按钮事件和滚动监听
    this.setupEnterButton(mainContainer, divider);
    this.setupScrollListener(mainContainer, divider);
    this.setupMainToAboutTransition(divider);
    this.setupScrollBarSync(mainContainer, divider);

    // 初始化滚动动画
    this.initScrollAnimations();
  }

  private initParticleEffect(): void {
    const particlesCanvas = query<HTMLCanvasElement>('#particles-canvas');
    this.particleNetwork = new ParticleNetwork(particlesCanvas, {
      count: 80,
      speed: 0.3,
      color: '#00d4ff',
      size: 2
    });
  }

  private setupEnterButton(mainContainer: HTMLElement, divider: HTMLElement): void {
    const ctaButton = query<HTMLButtonElement>('.intro-cta');

    ctaButton.addEventListener('click', async () => {
      if (this.currentView === ViewState.INTRO && !this.isTransitioning) {
        await this.enterMainView(mainContainer, divider);
      }
    });
  }

  private setupScrollListener(mainContainer: HTMLElement, divider: HTMLElement): void {
    let scrollAccumulator = 0;
    const scrollThreshold = 30;
    
    const handleWheel = async (e: WheelEvent) => {
      // 如果正在转换中，忽略滚动事件
      if (this.isTransitioning) {
        e.preventDefault(); // 转换中禁止滚动
        return;
      }
      
      // 如果模态框打开，忽略滚动事件
      if (document.body.classList.contains('modal-open')) {
        return;
      }

      // 【关键】检查事件目标是否在 works-grid 内部
      // 如果用户正在滚动 works-grid，永远不要触发页面切换
      const target = e.target as HTMLElement;
      const worksGrid = target.closest('.works-grid');
      if (worksGrid) {
        // 用户正在滚动 works-grid 内部，不触发页面切换
        return;
      }

      // 【物理拦截】检查设置：防止误触返回首屏
      // 如果在主视图顶部（允许少量误差），且试图向上滚动
      if (this.currentView === ViewState.MAIN && this.settingsPanel.state.preventBackToHome) {
        if (window.scrollY <= window.innerHeight + 10 && e.deltaY < 0) {
          e.preventDefault(); // 核心：阻止浏览器默认滚动行为
          return;
        }
      }
      
      // 首屏 → 主视图
      if (this.currentView === ViewState.INTRO && e.deltaY > 0) {
        scrollAccumulator += e.deltaY;
        if (scrollAccumulator > scrollThreshold) {
          scrollAccumulator = 0;
          await this.enterMainView(mainContainer, divider);
        }
      }
      // 主视图 → 首屏
      else if (this.currentView === ViewState.MAIN && e.deltaY < 0) {
        // 检查设置：防止误触返回首屏
        if (this.settingsPanel.state.preventBackToHome) {
          scrollAccumulator = 0;
          return;
        }

        scrollAccumulator += e.deltaY;
        if (scrollAccumulator < -scrollThreshold) {
          scrollAccumulator = 0;
          await this.returnToIntro(mainContainer, divider);
        }
      }
      // 其他情况重置累加器
      else {
        scrollAccumulator = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // 触摸滑动支持
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchDeltaAccumulator = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchDeltaAccumulator = 0;
    };
    
    const handleTouchMove = async (e: TouchEvent) => {
      // 如果正在转换中，忽略触摸事件
      if (this.isTransitioning) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      
      // 如果模态框打开，忽略触摸事件
      if (document.body.classList.contains('modal-open')) {
        return;
      }
      
      // 如果桌面截图正在显示，忽略触摸事件
      if (document.body.classList.contains('desktop-viewing')) {
        return;
      }
      
      const currentY = e.touches[0].clientY;
      const moveDelta = lastTouchY - currentY; // < 0 表示手指向下划（页面向上滚）
      
      // 【物理拦截】检查设置：防止误触返回首屏
      if (this.currentView === ViewState.MAIN && this.settingsPanel.state.preventBackToHome) {
        // 如果在主视图顶部，且手指向下划（试图看上面）
        if (window.scrollY <= window.innerHeight + 10 && moveDelta < 0) {
          if (e.cancelable) e.preventDefault(); // 核心：阻止浏览器默认滚动
          // 同时也重置累积器，防止逻辑触发
          touchDeltaAccumulator = 0;
          return;
        }
      }

      lastTouchY = currentY;
      
      // 累积同方向的滑动距离，如果方向改变则重置
      if ((touchDeltaAccumulator > 0 && moveDelta > 0) || (touchDeltaAccumulator < 0 && moveDelta < 0)) {
        touchDeltaAccumulator += moveDelta;
      } else {
        touchDeltaAccumulator = moveDelta;
      }
      
      // 首屏 → 主视图
      if (this.currentView === ViewState.INTRO && touchDeltaAccumulator > 50) {
        touchDeltaAccumulator = 0;
        await this.enterMainView(mainContainer, divider);
      }
      // 主视图 → 首屏
      else if (this.currentView === ViewState.MAIN && touchDeltaAccumulator < -50) {
        
        // 检查设置：防止误触返回首屏
        if (this.settingsPanel.state.preventBackToHome) {
          touchDeltaAccumulator = 0; // 重置累积，防止连续滑动触发
          return;
        }

        // 必须同时满足两个条件才允许返回首屏：
        // 1. 编程作品的 works-grid 滚动到顶部
        // 2. window.scrollY 也在主视图顶部（允许少量误差）
        const isCodeAtTop = this.codeWorld.isAtTop();
        const isWindowAtTop = window.scrollY <= window.innerHeight + 10;
        
        // 只有两个条件都满足才允许返回首屏
        if (isCodeAtTop && isWindowAtTop) {
          touchDeltaAccumulator = 0;
          await this.returnToIntro(mainContainer, divider);
        } else {
          // 条件不满足，重置累积
          touchDeltaAccumulator = 0;
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
  }

  private async enterMainView(mainContainer: HTMLElement, divider: HTMLElement): Promise<void> {
    if (this.currentView !== ViewState.INTRO || this.isTransitioning) return;
    this.isTransitioning = true;

    const introHintDelay = getCSSTransitionDuration('--transition-page-intro'); // 700ms

    // 平滑滚动到主视图顶部
    await smoothScrollTo(window.innerHeight, 800);

    // 创建分裂动画
    const splitAnimation = new SplitAnimation(
      this.introSection.element,
      this.codeWorld.element,
      this.artWorld.element,
      divider,
      this.supportSidebar.element
    );

    await splitAnimation.start();

    // 显示主容器
    mainContainer.classList.add('visible');

    // 销毁首屏粒子效果
    if (this.particleNetwork) {
      this.particleNetwork.destroy();
      this.particleNetwork = null;
    }

    // 初始化主视图背景效果
    if (!this.matrixRain && !this.gradientFlow) {
      this.initMainBackgroundEffects();
    }

    // 状态转换：INTRO → MAIN
    this.currentView = ViewState.MAIN;
    this.updateViewClass(ViewState.MAIN);

    // 智能更新滚动提示（延迟显示，让用户先看到主视图内容）
    await this.updateScrollHint(ViewState.MAIN, introHintDelay);
    
    this.isTransitioning = false;
  }

  private async returnToIntro(mainContainer: HTMLElement, divider: HTMLElement): Promise<void> {
    if (this.currentView !== ViewState.MAIN || this.isTransitioning) return;
    this.isTransitioning = true;

    // 智能更新滚动提示（隐藏）
    await this.updateScrollHint(ViewState.INTRO, 0);

    // 隐藏UI元素
    divider.classList.remove('visible');
    this.supportSidebar.element.classList.remove('visible');

    // 销毁主视图背景效果
    if (this.matrixRain) {
      this.matrixRain.destroy();
      this.matrixRain = null;
    }
    if (this.gradientFlow) {
      this.gradientFlow.destroy();
      this.gradientFlow = null;
    }

    // 先触发反向裂开动画（左右合拢）
    this.codeWorld.element.classList.remove('split-active');
    this.artWorld.element.classList.remove('split-active');

    // 等待裂开动画完成（对应 CSS transition: transform 1.2s）
    const splitAnimationDuration = getCSSTransitionDuration('--split-animation-duration'); // 1200ms
    await new Promise(resolve => setTimeout(resolve, splitAnimationDuration));

    // 动画播放完后，再滚动回首屏
    await smoothScrollTo(0, 800);

    // 延迟后显示首屏
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.introSection.element.classList.remove('hidden');
        // 先移除旧的动画类，触发重排，再添加新的
        this.introSection.element.classList.remove('fade-in');
        // 强制重排
        void this.introSection.element.offsetWidth;
        // 添加动画类
        this.introSection.element.classList.add('fade-in');
        
        mainContainer.classList.remove('visible');
        
        // 重新创建首屏粒子效果
        this.initParticleEffect();
        
        // 状态转换：MAIN → INTRO
        this.currentView = ViewState.INTRO;
        this.updateViewClass(ViewState.INTRO);
        this.isTransitioning = false;
        
        resolve();
      }, 600);
    });
  }

  private setupMainToAboutTransition(divider: HTMLElement): void {
    // 滚动控制常量
    const SCROLL_THRESHOLD = 30;
    const COOLDOWN_DURATION = 1000; // 冷却期 1 秒
    const VIEWPORT_MARGIN = 20; // 视口底部余量
    
    let scrollAccumulator = 0;
    
    // 维护每个视图的状态
    const lastContentVisibleState = new Map<ViewState, boolean>();
    const cooldownEndTime = new Map<ViewState, number>();
    const lockedScrollPosition = new Map<ViewState, number>();
    
    // 清理视图状态的辅助函数
    const clearViewState = (view: ViewState) => {
      lastContentVisibleState.set(view, false);
      cooldownEndTime.delete(view);
      lockedScrollPosition.delete(view);
    };

    // 监听全局滚动事件
    const handleWheel = async (e: WheelEvent) => {
      if (this.isTransitioning) return;

      // 如果模态框打开，忽略滚动事件
      if (document.body.classList.contains('modal-open')) {
        return;
      }

      // 【关键】检查事件目标是否在 works-grid 内部
      // 如果用户正在滚动 works-grid，永远不要触发页面切换
      const target = e.target as HTMLElement;
      const worksGrid = target.closest('.works-grid');
      if (worksGrid) {
        // 用户正在滚动 works-grid 内部，不触发页面切换
        return;
      }

      // 向下滚动：尝试切换到下一页
      if (e.deltaY > 0) {
        // 检查当前视图是否允许向下切换
        const canTransition = this.canTransitionToNext(this.currentView);
        
        if (!canTransition) {
          scrollAccumulator = 0;
          return;
        }
        
        // 【用户体验优化】检查最后内容是否刚刚显示出来
        // 如果从不可见变为可见，启动冷却期，强制用户停下来看内容
        if (this.currentView === ViewState.ABOUT || this.currentView === ViewState.REALITY) {
          const currentlyVisible = this.isLastContentVisible(this.currentView);
          const previouslyVisibleRaw = lastContentVisibleState.get(this.currentView);
          const isFirstCheck = previouslyVisibleRaw === undefined;
          const previouslyVisible = previouslyVisibleRaw ?? false;
          
          // 特殊处理：如果是第一次检查且内容已经可见，说明页面进来时内容就全部可见了
          // 这种情况不需要启动冷却期，直接设置状态即可
          if (isFirstCheck && currentlyVisible) {
            lastContentVisibleState.set(this.currentView, true);
            // 不 return，继续正常的滚动累积逻辑
          }
          // 特殊处理：如果是第一次检查且内容不可见，可能是因为动画还没完成
          // 先标记为"待确认"状态，不启动冷却期，让用户可以继续滚动
          else if (isFirstCheck && !currentlyVisible) {
            lastContentVisibleState.set(this.currentView, false);
            // 不 return，继续正常的滚动累积逻辑
          }
          // 从不可见变为可见：检查是否是因为用户滚动导致的（真正需要冷却期的情况）
          // 还是因为动画完成导致的（不需要冷却期）
          else if (!previouslyVisible && currentlyVisible) {
            // 如果用户已经滚动过了（scrollAccumulator > 0），说明是真正的滚动行为
            // 这种情况才启动冷却期
            const isRealScroll = scrollAccumulator > 10; // 至少滚动了 10px
            
            if (isRealScroll) {
              cooldownEndTime.set(this.currentView, Date.now() + COOLDOWN_DURATION);
              
              // 【关键】计算理想的锁定位置：让最后一个元素底部刚好在视口底部
              const section = this.currentView === ViewState.ABOUT ? this.aboutSection : this.realitySection;
              const selector = this.currentView === ViewState.ABOUT ? '.about-paragraph:last-child' : '.reality-item:last-child';
              const lastElement = section.element.querySelector(selector) as HTMLElement;
              
              const idealPosition = lastElement
                ? window.scrollY + lastElement.getBoundingClientRect().bottom - window.innerHeight + VIEWPORT_MARGIN
                : window.scrollY;
              
              lockedScrollPosition.set(this.currentView, idealPosition);
              lastContentVisibleState.set(this.currentView, true);
              scrollAccumulator = 0;
              e.preventDefault();
              return;
            } else {
              // 不是真正的滚动行为（可能是动画完成导致的），直接更新状态，不启动冷却期
              lastContentVisibleState.set(this.currentView, true);
            }
          }
          
          // 检查是否在冷却期内
          const now = Date.now();
          const cooldownEnd = cooldownEndTime.get(this.currentView);
          
          if (cooldownEnd && now < cooldownEnd) {
            // 刷新冷却期，只要用户在滚动就一直拦截
            cooldownEndTime.set(this.currentView, now + COOLDOWN_DURATION);
            
            // 强制把页面锁定在理想位置，防止滚动过头
            const idealPosition = lockedScrollPosition.get(this.currentView);
            if (idealPosition !== undefined) {
              window.scrollTo(0, idealPosition);
            }
            
            scrollAccumulator = 0;
            e.preventDefault();
            return;
          }
          
          // 冷却期已结束，清除锁定位置
          if (cooldownEnd) {
            lockedScrollPosition.delete(this.currentView);
            cooldownEndTime.delete(this.currentView);
          }
          
          // 更新状态
          lastContentVisibleState.set(this.currentView, currentlyVisible);
        }

        scrollAccumulator += e.deltaY;
        
        if (scrollAccumulator > SCROLL_THRESHOLD) {
          scrollAccumulator = 0;
          
          // 根据当前视图切换到对应的下一页
          switch (this.currentView) {
            case ViewState.MAIN:
              await this.enterAboutView(divider);
              break;
            case ViewState.ABOUT:
              await this.enterRealityView();
              clearViewState(ViewState.REALITY);
              break;
            case ViewState.REALITY:
              await this.enterTestamentView();
              clearViewState(ViewState.REALITY);
              break;
          }
        }
      }
      // 向上滚动：尝试切换到上一页
      else if (e.deltaY < 0) {
        // 检查当前视图是否允许向上切换
        if (!this.canTransitionToPrevious(this.currentView)) {
          scrollAccumulator = 0;
          return;
        }

        scrollAccumulator += e.deltaY;
        if (scrollAccumulator < -SCROLL_THRESHOLD) {
          scrollAccumulator = 0;
          
          // 根据当前视图切换到对应的上一页
          switch (this.currentView) {
            case ViewState.ABOUT:
              await this.returnToMainView(divider);
              break;
            case ViewState.REALITY:
              await this.returnToAboutView();
              // 返回上一页，重置该页面的状态
              lastContentVisibleState.set(ViewState.ABOUT, false);
              break;
            case ViewState.TESTAMENT:
              await this.returnToRealityView();
              // 返回现实页面，重置状态
              lastContentVisibleState.set(ViewState.REALITY, false);
              break;
          }
        }
      }
      // 其他情况重置累加器
      else {
        scrollAccumulator = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
  }

  private async enterAboutView(divider: HTMLElement): Promise<void> {
    await this.transitionToView(ViewState.MAIN, ViewState.ABOUT, this.aboutSection.element, divider);
  }

  private async returnToMainView(divider: HTMLElement): Promise<void> {
    const mainOffsetTop = window.innerHeight; // 主视图固定在第二屏
    
    if (this.currentView !== ViewState.ABOUT || this.isTransitioning) return;
    this.isTransitioning = true;

    const duration = getCSSTransitionDuration('--transition-base');

    // 销毁关于页面背景效果
    this.destroyBackgroundForView(ViewState.ABOUT);

    // 重新创建主视图背景效果
    this.initBackgroundForView(ViewState.MAIN);

    // 平滑滚动回主视图
    await smoothScrollTo(mainOffsetTop, 800);

    // 显示分隔线
    divider.classList.add('visible');

    // 将 works-grid 滚动到顶部，方便用户继续向上滚动返回首屏
    this.codeWorld.resetScroll();
    this.artWorld.resetScroll();

    // 状态转换：ABOUT → MAIN
    this.currentView = ViewState.MAIN;
    this.updateViewClass(ViewState.MAIN);

    // 智能更新滚动提示（延迟显示，让用户看到滑入效果）
    await this.updateScrollHint(ViewState.MAIN, duration);

    this.isTransitioning = false;
  }

  private async enterRealityView(): Promise<void> {
    await this.transitionToView(ViewState.ABOUT, ViewState.REALITY, this.realitySection.element);
  }

  private async returnToAboutView(): Promise<void> {
    await this.transitionToView(ViewState.REALITY, ViewState.ABOUT, this.aboutSection.element);
  }

  private async enterTestamentView(): Promise<void> {
    await this.transitionToView(ViewState.REALITY, ViewState.TESTAMENT, this.testamentSection.element);
  }

  private async returnToRealityView(): Promise<void> {
    await this.transitionToView(ViewState.TESTAMENT, ViewState.REALITY, this.realitySection.element);
  }

  private setupScrollBarSync(mainContainer: HTMLElement, divider: HTMLElement): void {
    let syncTimeout: number | undefined;

    const handleScroll = () => {
      // 【强力锁定】检查设置：防止误触返回首屏（针对滚动条拖动）
      // 如果当前是 MAIN 视图，开启了锁定，且滚动位置小于 100vh (进入了首屏区域)
      if (this.currentView === ViewState.MAIN && this.settingsPanel.state.preventBackToHome) {
        if (window.scrollY < window.innerHeight) {
          // 立即强制弹回 MAIN 的起始位置
          window.scrollTo(0, window.innerHeight);
          return; // 终止后续所有逻辑
        }
      }

      // 如果正在转换中，不要同步状态（避免冲突）
      if (this.isTransitioning) return;

      // 如果桌面截图正在显示，不要同步状态
      if (document.body.classList.contains('desktop-viewing')) {
        return;
      }

      // 使用防抖，避免频繁触发
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }

      syncTimeout = window.setTimeout(() => {
        const scrollY = window.scrollY;

        // 根据滚动位置判断应该在哪个视图
        let targetView = this.getViewByScrollPosition(scrollY);
        
        // 检查设置：防止误触返回首屏
        // 如果开启了防止误触，且当前是 MAIN 视图，且目标是 INTRO，则保持在 MAIN
        if (this.currentView === ViewState.MAIN && targetView === ViewState.INTRO && this.settingsPanel.state.preventBackToHome) {
          targetView = ViewState.MAIN;
        }

        // 如果状态不匹配，同步视图
        if (this.currentView !== targetView) {
          this.syncViewState(targetView, mainContainer, divider);
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private syncViewState(targetView: ViewState, mainContainer: HTMLElement, divider: HTMLElement): void {
    // 如果设置了防误触，且试图从 MAIN 切回 INTRO，进行拦截
    if (this.currentView === ViewState.MAIN && targetView === ViewState.INTRO && this.settingsPanel.state.preventBackToHome) {
      return;
    }

    // 同步视图状态（不触发平滑滚动，因为用户已经在目标位置了）
    const previousView = this.currentView;
    this.currentView = targetView;

    // 注意：不在这里直接操作滚动提示，避免打断 updateScrollHint 的 transition
    // 滚动提示的显示/隐藏由各个视图切换方法中的 updateScrollHint 处理

    // 更新 body 的视图类名
    this.updateViewClass(targetView);

    // 根据目标视图更新 UI 状态
    switch (targetView) {
      case ViewState.INTRO:
        // 显示首屏
        this.introSection.element.classList.remove('hidden');
        mainContainer.classList.remove('visible');
        this.codeWorld.element.classList.remove('split-active');
        this.artWorld.element.classList.remove('split-active');
        divider.classList.remove('visible');
        this.supportSidebar.element.classList.remove('visible');
        break;

      case ViewState.MAIN:
        // 显示主视图
        this.introSection.element.classList.add('hidden');
        mainContainer.classList.add('visible');
        this.codeWorld.element.classList.add('split-active');
        this.artWorld.element.classList.add('split-active');
        divider.classList.add('visible');
        this.supportSidebar.element.classList.add('visible');
        break;

      case ViewState.ABOUT:
      case ViewState.REALITY:
      case ViewState.TESTAMENT:
        // 其他页面：隐藏首屏和分隔线，保持主容器和侧边栏可见
        this.introSection.element.classList.add('hidden');
        mainContainer.classList.add('visible');
        this.codeWorld.element.classList.add('split-active');
        this.artWorld.element.classList.add('split-active');
        divider.classList.remove('visible');
        this.supportSidebar.element.classList.add('visible');
        break;
    }

    // 管理背景效果：销毁其他页面的背景，初始化当前页面的背景
    this.destroyAllBackgroundsExcept(targetView);
    this.initBackgroundForView(targetView);
  }

  private initMainBackgroundEffects(): void {
    const codeCanvas = query<HTMLCanvasElement>('#code-canvas');
    this.matrixRain = new MatrixRain(codeCanvas);

    const artCanvas = query<HTMLCanvasElement>('#art-canvas');
    this.gradientFlow = new GradientFlow(artCanvas);
  }

  private initAboutBackgroundEffects(): void {
    const aboutCanvas = query<HTMLCanvasElement>('.about-canvas');
    this.fallingParticles = new FallingParticles(aboutCanvas);
  }

  private initRealityBackgroundEffects(): void {
    const realityCanvas = query<HTMLCanvasElement>('.reality-canvas');
    this.iceParticles = new IceParticles(realityCanvas);
  }

  private destroyIntroBackgroundEffects(): void {
    if (this.particleNetwork) {
      this.particleNetwork.destroy();
      this.particleNetwork = null;
    }
  }

  private destroyMainBackgroundEffects(): void {
    if (this.matrixRain) {
      this.matrixRain.destroy();
      this.matrixRain = null;
    }
    if (this.gradientFlow) {
      this.gradientFlow.destroy();
      this.gradientFlow = null;
    }
  }

  private destroyAboutBackgroundEffects(): void {
    if (this.fallingParticles) {
      this.fallingParticles.destroy();
      this.fallingParticles = null;
    }
  }

  private destroyRealityBackgroundEffects(): void {
    if (this.iceParticles) {
      this.iceParticles.destroy();
      this.iceParticles = null;
    }
  }

  /**
   * 根据视图类型销毁对应的背景效果
   * @param view 视图状态
   */
  private destroyBackgroundForView(view: ViewState): void {
    switch (view) {
      case ViewState.INTRO:
        this.destroyIntroBackgroundEffects();
        break;
      case ViewState.MAIN:
        this.destroyMainBackgroundEffects();
        break;
      case ViewState.ABOUT:
        this.destroyAboutBackgroundEffects();
        break;
      case ViewState.REALITY:
        this.destroyRealityBackgroundEffects();
        break;
    }
  }

  /**
   * 销毁除指定视图外的所有背景效果
   * @param exceptView 保留的视图（不销毁其背景）
   */
  private destroyAllBackgroundsExcept(exceptView: ViewState): void {
    const allViews: ViewState[] = [ViewState.INTRO, ViewState.MAIN, ViewState.ABOUT, ViewState.REALITY];
    allViews.forEach(view => {
      if (view !== exceptView) {
        this.destroyBackgroundForView(view);
      }
    });
  }

  /**
   * 根据视图类型初始化对应的背景效果（如果尚未初始化）
   * @param view 视图状态
   */
  private initBackgroundForView(view: ViewState): void {
    switch (view) {
      case ViewState.INTRO:
        if (!this.particleNetwork) {
          this.initParticleEffect();
        }
        break;
      case ViewState.MAIN:
        if (!this.matrixRain && !this.gradientFlow) {
          this.initMainBackgroundEffects();
        }
        break;
      case ViewState.ABOUT:
        if (!this.fallingParticles) {
          this.initAboutBackgroundEffects();
        }
        break;
      case ViewState.REALITY:
        if (!this.iceParticles) {
          this.initRealityBackgroundEffects();
        }
        break;
      case ViewState.TESTAMENT:
        // 遗书页面无背景效果
        break;
    }
  }

  /**
   * 通用的页面切换逻辑
   * @param fromView 来源视图
   * @param toView 目标视图
   * @param targetElement 目标页面元素
   * @param divider 分隔线元素（可选，某些切换不需要）
   */
  private async transitionToView(fromView: ViewState, toView: ViewState, targetElement: HTMLElement, divider?: HTMLElement): Promise<void> {
    if (this.currentView !== fromView || this.isTransitioning) return;
    this.isTransitioning = true;

    const duration = getCSSTransitionDuration('--transition-base');

    // 销毁旧视图背景效果
    this.destroyBackgroundForView(fromView);

    // 初始化新视图背景效果
    this.initBackgroundForView(toView);

    // 特殊处理：从 MAIN 离开时隐藏分隔线
    if (fromView === ViewState.MAIN && divider) {
      divider.classList.remove('visible');
    }

    // 特殊处理：返回 MAIN 时显示分隔线并重置 works-grid 滚动位置
    if (toView === ViewState.MAIN && divider) {
      divider.classList.add('visible');
      const codeGrid = query<HTMLElement>('#code-world .works-grid');
      const artGrid = query<HTMLElement>('#art-world .works-grid');
      codeGrid.scrollTop = 0;
      artGrid.scrollTop = 0;
    }

    // 【关键】先更新状态，再开始滚动
    // 这样在滚动过程中，currentView 就已经是新的了
    this.currentView = toView;
    this.updateViewClass(toView);

    // 平滑滚动到目标页面
    await smoothScrollTo(targetElement.offsetTop, 800);

    // 智能更新滚动提示
    const hintDelay = toView === ViewState.TESTAMENT ? 0 : duration;
    await this.updateScrollHint(toView, hintDelay);

    this.isTransitioning = false;
  }

  private initScrollAnimations(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // 观察所有带有 scroll-animate 类的元素
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => observer.observe(el));
  }
}

// 禁用浏览器的滚动位置恢复功能
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 强制滚动到顶部，确保总是从首屏开始
  window.scrollTo(0, 0);
  
  new App();
});
