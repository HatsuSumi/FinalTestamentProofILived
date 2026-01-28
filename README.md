# 双面世界 - 我活过的最后证明

一个融合作品集、人生记录与遗书的个人网站，记录独立游戏开发者在编程和美术两个领域的全栈才能，以及在抑郁症和孤独中挣扎的真实人生。

🌐 **在线访问**：https://hatsusumi.github.io/FinalTestamentProofILived/

## ✨ 特性

- 🎮 **双面世界设计** - 左侧展示编程作品，右侧展示美术作品
- 📖 **5页面滚动导航** - 首屏 → 主视图 → 关于我 → 冰冷冷的现实 → 遗书，支持双向滚动
- 🌟 **6种炫酷特效** - 粒子网络、页面分裂、矩阵代码雨、渐变流动、飘落粒子、冰晶粒子
- 🎯 **智能动画管理** - 背景特效按需加载，性能优化高达60%
- 🔍 **智能搜索** - 支持标题/副标题/描述/标签搜索 + 实时高亮 + 防抖优化（300ms）
- 🎠 **轮播图功能** - 自动播放（3秒）+ 滑动动画 + 箭头控制 + 圆点指示器 + 过程标签显示
- 🎬 **多媒体模态框** - 动画作品视频播放 + 图片作品横向滚动画廊 + 过程图标签 + 过程视频全屏播放
- 📊 **卡片序号** - 自动编号，筛选时动态更新
- 🎨 **过程图展示** - 支持展示创作过程（草稿 → 线稿 → 上色），灵活标记任意阶段 + 可选过程视频播放
- 💬 **空状态提示** - 无搜索/筛选结果时显示友好提示
- 📱 **完全响应式** - 支持桌面、平板和移动设备
- 🎨 **赛博朋克风格** - 科技感与艺术感的完美融合
- ⚡ **性能优化** - 懒加载、RAF动画、代码分割、状态机管理
- 💝 **赞助功能** - 侧边栏固定赞助二维码

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
FinalTestamentProofILived/
├── public/                    # 静态资源
│   ├── assets/
│   │   ├── artworks/         # 美术作品图片
│   │   └── qrcodes/          # 收款码
│   └── favicon-32x32.png
├── src/
│   ├── main.ts               # 应用入口 + 状态机管理
│   ├── styles/               # 样式文件
│   │   ├── reset.css         # CSS重置
│   │   ├── variables.css     # CSS变量
│   │   ├── intro.css         # 首屏样式
│   │   ├── split-world.css   # 主视图样式
│   │   ├── about.css         # 关于我页面样式
│   │   ├── reality.css       # 现实页面样式
│   │   ├── testament.css     # 遗书页面样式
│   │   ├── settings.css      # 设置面板样式
│   │   ├── sidebar.css       # 赞助侧边栏
│   │   ├── cards.css         # 卡片组件
│   │   ├── modal.css         # 模态框
│   │   ├── video-player.css  # 视频播放器样式
│   │   └── animations.css    # 动画效果
│   ├── components/           # 组件
│   │   ├── IntroSection.ts   # 首屏组件
│   │   ├── CodeWorld.ts      # 编程作品展示
│   │   ├── ArtWorld.ts       # 美术作品展示
│   │   ├── ProjectCard.ts    # 编程卡片
│   │   ├── GalleryItem.ts    # 美术卡片
│   │   ├── AboutSection.ts   # 关于我组件
│   │   ├── RealitySection.ts # 现实页面组件
│   │   ├── TestamentSection.ts # 遗书页面组件
│   │   ├── SettingsPanel.ts  # 设置面板组件
│   │   ├── SupportSidebar.ts # 赞助侧边栏
│   │   ├── Modal.ts          # 模态框组件
│   │   ├── ImageViewer.ts    # 图片查看器组件
│   │   └── VideoPlayer.ts    # 视频播放器组件
│   ├── effects/              # 特效
│   │   ├── ParticleNetwork.ts   # 粒子网络（首屏）
│   │   ├── MatrixRain.ts        # 矩阵代码雨（编程）
│   │   ├── GradientFlow.ts      # 渐变流动（美术）
│   │   ├── FallingParticles.ts  # 飘落粒子（关于）
│   │   ├── IceParticles.ts      # 冰晶粒子（现实）
│   │   └── SplitAnimation.ts    # 页面分裂动画
│   ├── data/                 # 数据文件
│   │   ├── projects.ts       # 编程作品数据
│   │   └── artworks.ts       # 美术作品数据
│   ├── utils/                # 工具函数
│   │   ├── template.ts       # DOM模板工具（Fail Fast）
│   │   ├── scroll.ts         # 自定义滚动
│   │   ├── lazyLoad.ts       # 图片懒加载
│   │   ├── animations.ts     # 动画工具
│   │   └── css.ts            # CSS变量读取工具
│   └── types/                # TypeScript类型定义
│       └── index.ts
├── index.html                 # 主HTML文件 + 所有模板定义
├── package.json               # 项目依赖和脚本
├── tsconfig.json              # TypeScript配置
├── vite.config.ts             # Vite构建配置（动态base路径）
└── README.md                  # 项目文档
```

## 📊 项目规模

### 文件统计

- **总文件数**：47 个
  - TypeScript 文件：29 个
  - CSS 文件：13 个
  - JSON 文件：3 个
  - HTML 文件：1 个
  - Markdown 文档：1 个

### 代码规模

- **代码总行数**：9,023 行（不含空行、注释）
  - CSS：3,805 行（42.2%）
  - TypeScript：3,653 行（40.5%）
  - JSON：1,113 行（12.3%）
  - HTML：452 行（5.0%）

- **字符总数**：271,453 字符（不含注释）
  - CSS：82,489 字符（30.4%）
  - TypeScript：139,319 字符（51.3%）
  - JSON：33,211 字符（12.2%）
  - HTML：16,434 字符（6.1%）

> 💡 **数据来源**：以上数据基于项目内的 `project_stats.py` 统计生成
> 
> 📊 **统计工具 GitHub 仓库链接**：[Omni-Project-Stats](https://github.com/HatsuSumi/Omni-Project-Stats) —— 90%项目通用，涵盖多个领域

## 🛠️ 技术栈

### 核心技术
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite 7.x** - 下一代前端构建工具，极速的热更新
- **Vanilla JS/TS** - 无框架依赖，纯原生实现

### 前端技术
- **HTML5 Templates** - 高性能 DOM 克隆，避免 `createElement` 开销
- **CSS3** - 现代 CSS 特性（Grid、Flexbox、Custom Properties、Animations、`writing-mode`）
- **Canvas API** - 实现6种特效（粒子网络、矩阵雨、渐变流动、飘落粒子、冰晶粒子、分裂动画）
- **Intersection Observer API** - 图片懒加载 + 滚动动画触发

### 架构设计
- **状态机管理** - `ViewState` 枚举管理5个页面状态（INTRO/MAIN/ABOUT/REALITY/TESTAMENT）
- **有限状态机** - 使用 `currentView` + `isTransitioning` 防止状态冲突
- **智能边界检测** - 检测最后一个内容元素是否完全可见，确保用户看完所有内容才能切换页面
- **组件封装架构** - 子组件提供公开接口（`isLastContentVisible()`, `isAtBottom()`, `resetScroll()` 等），main.ts 不直接操作子组件 DOM
- **通用逻辑抽象** - 背景效果管理、页面切换逻辑通用化，消除重复代码（DRY 原则）
- **动态位置计算** - 基于元素实际 `offsetTop` 计算滚动位置，避免硬编码
- **事件防抖** - 滚动事件防抖 + 搜索输入防抖（300ms）优化性能
- **自定义平滑滚动** - `requestAnimationFrame` + `easeInOutQuad` 缓动函数
- **模态框事件隔离** - 模态框打开时阻止滚轮/触摸事件触发页面切换
- **单一数据源** - CSS变量定义动画时长，JavaScript动态读取

### 开发规范
- **Fail Fast 原则** - 关键条件不满足时立即抛出明确错误，禁止使用 `?.`、`??`、`||` 等容错逻辑
  - ✅ **例外**：`querySelectorAll` 返回空数组不违反原则（空数组是有效结果）
  - ✅ **例外**：可选参数的默认值处理（如 `textContent?.trim()`）
- **HTML5 Templates 原则** - 使用 `<template>` 标签 + `cloneTemplate` 克隆 DOM，禁止 `createElement`
  - ✅ **例外**：Canvas 特效动画中的大量粒子创建（性能考虑）
  - ✅ **例外**：`innerHTML` 用于文本高亮和 HTML 内容处理
- **封装原则（Encapsulation）** - 子组件隐藏内部实现细节，只暴露公开接口给父组件调用
- **单一职责原则（SRP）** - 每个组件/方法只负责一个职责，main.ts 只负责协调，不管理子组件内部状态
  - ✅ **例外**：页面级状态管理（如 `.split-active`、`.hidden` 等全局状态类）
- **依赖倒置原则（DIP）** - 高层模块依赖抽象接口（组件公开方法），不依赖具体实现（CSS类名、DOM结构）
- **开闭原则（OCP）** - 对扩展开放，对修改封闭，修改子组件内部不影响 main.ts
- **DRY 原则（Don't Repeat Yourself）** - 消除重复代码，提取通用逻辑到独立方法
- **CSS类管理原则** - TypeScript 只负责添加/移除CSS类名，避免直接修改内联样式
  - ✅ **例外**：Canvas 绘制相关样式
  - ✅ **例外**：动态定位（如 tooltip 的 `top`/`left`）
  - ✅ **例外**：动态 CSS 变量（如 `--animation-delay`）
  - ✅ **例外**：滚动条宽度补偿（如 `marginRight`/`marginLeft`）
- **避免 `!important`** - 优先通过提高选择器优先级来覆盖样式
  - ✅ **例外**：工具类（如 `.hidden`）需要确保始终生效
- **组件化架构** - 模块化设计，职责单一
- **类型安全** - 充分利用 TypeScript 的类型系统

### 性能优化
- **按需加载动画** - 每个页面只运行1-2个背景特效，切换时销毁不可见动画，性能提升60%
- **Template Cloning** - 使用 HTML `<template>` 标签克隆 DOM，性能优于 `createElement`
- **Lazy Loading** - 图片懒加载（Intersection Observer API）
- **RAF Animation** - 使用 `requestAnimationFrame` 优化动画性能，并在页面切换时调用 `destroy()` 清理资源
- **Code Splitting** - Vite 自动代码分割和懒加载
- **ESBuild Minification** - 快速的代码压缩
- **滚动位置恢复禁用** - `history.scrollRestoration = 'manual'` 确保页面总是从顶部开始

### 构建工具
- **TypeScript Compiler** - 类型检查和转译
- **Vite Plugin System** - 插件化构建流程
- **ESBuild** - 极速的 JavaScript/TypeScript 打包器

### 部署
- **GitHub Pages** - 静态网站托管
- **GitHub Actions** - CI/CD 自动化部署

**仅以此站，代表我活过的证明。** 💖

