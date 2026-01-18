// 编程作品数据结构
export interface Project {
  id: string;
  title: string;
  subtitle: string; // 项目副标题（英文名/文件夹名）
  description: string;
  tags: string[];
  categories: ('web' | 'software' | 'game' | 'script' | 'extension')[]; // 项目类别（可多选）
  developmentCycle: string; // 开发周期（如：30天、2周、3个月、持续维护中等）
  developmentEnvironment: string; // 开发环境
  status: string; // 项目状态（如：开发中、已完成、已上线、持续维护中等）
  releaseDate: string; // 发布日期（如：2024年6月、2024.06等）
  roles: string[]; // 项目角色（如：['程序', '美术', '音乐', '策划']）
  links?: {
    name: string;   // 显示名称（如 "B站"、"GitHub"、"贴吧"）
    url: string;    // 链接地址
  }[];
}

// 美术作品数据结构
export interface Artwork {
  id: string;
  title: string;
  image: string;
  thumbnail: string;
  category: 'painting' | 'modeling' | 'animation';
  tags?: string[]; // 作品标签
  description?: string;
  date?: string;
  creationCycle?: string; // 创作周期
  creationEnvironment?: string; // 创作环境
  videoUrl?: string; // 视频链接（用于动画类作品）
  processImages?: string[]; // 过程图数组（仅用于插画/建模，动画不需要）
  processLabels?: string[]; // 图片标签数组，processLabels[0]对应主图(image)，processLabels[1+]对应processImages[0+]
  processVideoUrl?: string; // 过程视频链接（用于绘画/建模作品的创作过程视频）
  links?: {
    name: string;   // 显示名称（如 "B站"、"Pixiv"、"ArtStation"）
    url: string;    // 链接地址
  }[];
}

// 组件基类接口
export interface Component {
  element: HTMLElement;
  render(): HTMLElement;
  destroy?(): void;
}

// 动画配置
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

// 粒子配置
export interface ParticleConfig {
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
}

