import type { Project } from '../types';

// 编程作品示例数据
export const projects: Project[] = [
    // {
    //   id: 'my-awesome-game',
    //   title: '我的独立游戏',
    //   subtitle: 'MyAwesomeGame',
    //   description: '一款充满创意的独立游戏作品',
    //   tags: ['Unity', 'C#', '2D'],
    //   categories: ['game'],
    //   developmentCycle: '3个月',
    //   developmentEnvironment: '居家开发',
    //   status: '已上线',
    //   releaseDate: '2024年10月',
    //   roles: ['程序', '美术', '音乐', '策划'],
    //   links: [
    //     { name: '演示', url: 'https://itch.io/my-game' },
    //     { name: 'GitHub', url: 'https://github.com/username/my-game' }
    //   ]
    // },
  {
    id: 'project-1',
    title: '国际最萌大会2023赛季数据可视化项目',
    subtitle: 'ISML2023-Visualization',
    description: '一个基于 Python 和 Web 技术的数据可视化项目，旨在分析和展示 2023 年国际最萌大会（ISML）的投票数据。项目包含数据处理脚本、生成的图表页面以及一个前端展示界面。',
    tags: ['Python', 'pyecharts', 'D3.js', 'Pandas', 'JavaScript', 'HTML5', 'CSS3', 'Canvas API', '静态网站'],
    categories: ['web', 'script'],
    developmentCycle: '60天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '可视化已完成，但前端网页呈半成品状态。',
    releaseDate: '视频2024-12-07，源码2025-12-22',
    roles: ['架构设计', '数据分析', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1mci1YiE4M/' },
      { name: '贴吧', url: 'https://tieba.baidu.com/p/9228689566' },
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/ISML2023-Visualization/' },
      { name: '主页', url: 'https://hatsusumi.github.io/ISML2023-Visualization/'}
    ]
  },
  {
    id: 'project-2',
    title: '定制化动态投票数据可视化工具项目',
    subtitle: 'Animative-Viz',
    description: '一个专门为角色投票比赛（如萌战）定制的工具，不是通用的CSV可视化工具。',
    tags: ['Python', 'FastAPI', 'React', 'Recharts', 'Chart.js', 'Pandas', 'Ant Design', 'Framer Motion', 'Canvas API'],
    categories: ['web'],
    developmentCycle: '8天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '已完成。',
    releaseDate: '视频2025-02-26，源码2025-12-23',
    roles: ['架构设计', '数据分析', '前端', 'UI/UX', '后端', '测试', '维护'],
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1KLPLeXEwN/' },
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/ISML-2024/' },
    ]
  },
  {
    id: 'project-3',
    title: '国际最萌大会2024赛季数据可视化项目',
    subtitle: 'ISML2024-Visualization',
    description: '一个基于 Python 和 Web 技术的数据可视化项目，旨在分析和展示 2024 年国际最萌大会（ISML）的投票数据。项目包含赛事数据展示与分析、角色数据统计与对比和赛程安排与进度追踪。',
    tags: ['Python', 'Pandas', 'JavaScript', 'ECharts', 'HTML5', 'CSS3', 'Canvas API', '静态网站'],
    categories: ['web', 'script'],
    developmentCycle: '36天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '在提名阶段后停更，呈半成品状态。',
    releaseDate: '2025-02-14',
    roles: ['架构设计', '数据分析', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: '贴吧', url: 'https://tieba.baidu.com/p/9493543244' },
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/ISML-2024/' },
      { name: '主页', url: 'https://hatsusumi.github.io/ISML-2024/'}
    ]
  },
  {
    id: 'project-4',
    title: '《地平线行者》手游护卫及皮肤筛选器项目',
    subtitle: 'Character-Archive',
    description: '一个多功能的《地平线行者》手游角色筛选器，包含多维度的筛选以及实现了最复杂的标签筛选。',
    tags: ['JavaScript', 'HTML5', 'CSS3', '静态网站'],
    categories: ['web'],
    developmentCycle: '46天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '已停更。',
    releaseDate: '2025-06-24',
    roles: ['架构设计', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: '主页', url: 'https://zingy-jelly-8029b4.netlify.app/'}
    ]
  },
  {
    id: 'project-5',
    title: '卡片滚动类视频制作工具项目',
    subtitle: 'CardScroller',
    description: '一个简单易用的滚动视频制作工具，帮助用户快速制作水平滚动类视频，适合不会使用PPT、剪映、PR或者Flourish等工具制作的人群。',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'SPA','静态网站'],
    categories: ['web'],
    developmentCycle: '68天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '已完成。',
    releaseDate: '2025-11-25',
    roles: ['架构设计', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1iySjBcEwy/'},
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/CardScroller'},
      { name: '主页', url: 'https://hatsusumi.github.io/CardScroller/'}
    ]
  },
  {
    id: 'project-6',
    title: '收录每年去世的现役及退役赛马网站项目',
    subtitle: 'Racehorse-Memorial',
    description: '一个专注于记录和纪念年度去世赛马的纪念网站。我（没有们）希望通过这个简洁、静谧的页面，为每一位赛马爱好者提供一个查阅和缅怀的空间。',
    tags: ['JavaScript', 'HTML5', 'CSS3', '静态网站'],
    categories: ['web'],
    developmentCycle: '6天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '持续更新中。',
    releaseDate: '2025-12-31',
    roles: ['架构设计', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/Racehorse-Memorial'},
      { name: '主页', url: 'https://hatsusumi.github.io/Racehorse-Memorial/'}
    ]
  },
  {
    id: 'project-7',
    title: '通用项目文件代码及资源统计工具项目',
    subtitle: 'Omni-Project-Stats',
    description: '一个单文件、零依赖、跨平台的通用项目统计工具，不仅能统计代码（智能去除注释与空行），还能深入统计美术资源、音频、游戏工程文件等，特别适合游戏开发、多媒体项目或全栈工程的体量分析。',
    tags: ['Python', 'Tkinter', 'CLI', 'GUI'],
    categories: ['script'],
    developmentCycle: '2天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '已完成。',
    releaseDate: '2025-12-21',
    roles: ['架构设计', '程序', 'UI/UX', '测试', '维护'],
    links: [
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/Omni-Project-Stats/'}
    ]
  },
  {
    id: 'project-8',
    title: '专业的视频延时处理工具项目',
    subtitle: 'HumanLapse – One-Click Video Speed Controller',
    description: '一个功能强大的视频延时处理工具，可以将视频智能加速或减速至指定的目标时长。采用 Premiere Pro 级别的编码参数（PAL标准、2-Pass VBR、H.264 High Profile），确保输出视频的专业品质。',
    tags: ['Python', 'CLI', 'FFmpeg', 'FFbrobe'],
    categories: ['script'],
    developmentCycle: '2天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '已完成。',
    releaseDate: '2025-12-23',
    roles: ['架构设计', '程序', '测试', '维护'],
    links: [
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/HumanLapse-One-Click-Video-Speed-Controller/'}
    ]
  },
  {
    id: 'project-9',
    title: '个人网站（本站）项目',
    subtitle: 'FinalTestamentProofILived',
    description: '一个炫酷的个人作品集网站，展示独立游戏开发者在编程和美术两个领域的全栈才能。',
    tags: ['TypeScript', 'Vite', 'Vanilla JS', 'SPA', 'HTML5', 'CSS3', 'Canvas API', '静态网站'],
    categories: ['web'],
    developmentCycle: '6天',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '持续更新中。',
    releaseDate: '2025-12-31',
    roles: ['架构设计', '前端', 'UI/UX', '测试', '维护'],
    links: [
      { name: 'GitHub', url: 'https://github.com/HatsuSumi/FinalTestamentProofILived'},
      { name: '主页', url: 'https://hatsusumi.github.io/FinalTestamentProofILived/'}
    ]
  },
  {
    id: 'project-10',
    title: '图片抓取与转换浏览器插件项目',
    subtitle: 'mage-Hawk',
    description: '一个功能强大的浏览器扩展，支持12种图片来源检测，提供JPEG、PNG、WebP、GIF、AVIF、SVG六种格式的下载与转换功能。支持防盗链图片下载、动态内容检测、精准定位、高级过滤规则、侧边栏视图等专业功能。',
    tags: ['TypeScript', 'HTML5', 'React', 'Vite', 'Tailwind CSS', 'Chrome Extension'],
    categories: ['extension'],
    developmentCycle: '3天+',
    developmentEnvironment: '居家开发，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    status: '待发布。',
    releaseDate: '2026-01',
    roles: ['架构设计', '前端', 'UI/UX', '测试', '维护'],
    links: [

    ]
  },
];

