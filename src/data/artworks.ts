import type { Artwork } from '../types';

// 美术作品示例数据
export const artworks: Artwork[] = [
    // ========== 模板示例1：插画/建模作品（有过程图） ==========
    // {
    //   id: 'my-character-art',
    //   title: '游戏角色原画',
    //   image: '/assets/artworks/character.jpg',
    //   thumbnail: '/assets/artworks/character-thumb.jpg',
    //   category: 'painting',  // 'painting' | 'modeling'
    //   tags: ['角色设计', '原画', '数字绘画'],
    //   description: '为独立游戏创作的主角原画设计',
    //   date: '2025-01',
    //   creationCycle: '7天',
    //   creationEnvironment: '居家创作',
    //   processImages: [
    //     '/assets/artworks/character-sketch.jpg',   // 草稿
    //     '/assets/artworks/character-lineart.jpg',  // 线稿
    //     '/assets/artworks/character-color.jpg',    // 上色
    //   ],
    //   processLabels: ['成品', '草稿', '线稿', '上色'],  // 第1个对应主图，后续对应processImages
    //   processVideoUrl: '/assets/artworks/character-process.mp4',  // 🆕 可选：创作过程视频（会显示「查看绘画/建模过程」按钮）
    //   links: [
    //     { name: 'B站', url: 'https://www.bilibili.com/video/xxxxx' },
    //     { name: 'Pixiv', url: 'https://www.pixiv.net/artworks/xxxxx' }
    //   ]
    // },

    // ========== 模板示例2：动画作品（只有视频） ==========
    // {
    //   id: 'my-animation',
    //   title: '角色动作动画',
    //   image: '/assets/artworks/animation-cover.jpg',      // 动画封面
    //   thumbnail: '/assets/artworks/animation-thumb.jpg',  // 缩略图
    //   category: 'animation',  // ⚠️ 动画类型必须是 'animation'
    //   tags: ['动作捕捉', '骨骼动画', 'Unity'],
    //   description: '角色跑步动作动画演示',
    //   date: '2025-01',
    //   creationCycle: '3天',
    //   creationEnvironment: '居家创作',
    //   videoUrl: 'https://www.bilibili.com/video/BV1xxxxxx',  // ⚠️ 动画必须有视频链接
    //   // ❌ 动画不需要 processImages
    //   // ❌ 动画不需要 processLabels
    //   // ❌ 动画不需要 processVideoUrl（动画类作品不显示「查看过程」按钮）
    //   links: [
    //     { name: 'B站', url: 'https://www.bilibili.com/video/BV1xxxxxx' }
    //   ]
    // },
  {
    id: 'art-1',
    title: '人物立绘动画制作练习',
    image: '/assets/artworks/art-1/Fate Testarossa.png',
    thumbnail: '/assets/artworks/art-1/Fate Testarossa.png',
    category: 'animation',
    tags: ['角色动态设计', '2D动画', '菲特·泰斯塔罗沙', '《魔法少女奈叶》'],
    description: '最初学习动画时做的第一个练习作品。',
    date: '2023-01-02',
    creationCycle: '忘了',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-1/Fate Testarossa.mp4'
  },
  {
    id: 'art-2',
    title: '首个动态壁纸制作练习',
    image: '/assets/artworks/art-2/A girl in space.png',
    thumbnail: '/assets/artworks/art-2/A girl in space.png',
    category: 'animation',
    tags: ['动态壁纸', '2D动画', '太空'],
    description: '非常随便找的图完成了第一个动态壁纸制作练习。',
    date: '2023-06-18',
    creationCycle: '忘了',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-2/A girl in space.mp4',
    links: [
      { name: 'Steam创意工坊', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2991091478' }
    ]
  },
  {
    id: 'art-3',
    title: '【4K60FPS】伊地知虹夏动态壁纸——浮动效果',
    image: '/assets/artworks/art-3/Nijika.png',
    thumbnail: '/assets/artworks/art-3/Nijika.png',
    category: 'animation',
    tags: ['动态壁纸', '2D动画', '伊地知虹夏', '《孤独摇滚!》', '星空'],
    description: '第一个正式的动态壁纸制作作品。',
    date: '2023-07-06',
    creationCycle: '22天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-3/Nijika.mp4',
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1jN411m7Xw/' },
      { name: 'Steam创意工坊', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2999883675' }
    ]
  },
  {
    id: 'art-4',
    title: '【4K60FPS】伊地知虹夏动态壁纸——坠落效果',
    image: '/assets/artworks/art-4/Nijika.png',
    thumbnail: '/assets/artworks/art-4/Nijika.png',
    category: 'animation',
    tags: ['动态壁纸', '2D动画', '伊地知虹夏', '《孤独摇滚!》', '星空'],
    description: '浮动效果的改版，坠落效果。',
    date: '2023-07-06',
    creationCycle: '22天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-4/Nijika.mp4',
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1jN411m7Xw/' },
      { name: 'Steam创意工坊', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2999886482' }
    ]
  },
  {
    id: 'art-5',
    title: '【4K60FPS】洛天依动态壁纸',
    image: '/assets/artworks/art-5/Luo Tianyi.png',
    thumbnail: '/assets/artworks/art-5/Luo Tianyi.png',
    category: 'animation',
    tags: ['动态壁纸', '2D动画', '洛天依', 'Vsinger', '樱花'],
    description: '制作的起因是当时接近天依11周年生日。',
    date: '2023-07-11',
    creationCycle: '3天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-5/Luo Tianyi.mp4',
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1ru411j7fK/' },
      { name: 'Steam创意工坊', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3002549606' }
    ]
  },
  {
    id: 'art-6',
    title: '【4K60FPS】伊地知虹夏动态壁纸——雪景',
    image: '/assets/artworks/art-6/Nijika.jpg',
    thumbnail: '/assets/artworks/art-6/Nijika.jpg',
    category: 'animation',
    tags: ['动态壁纸', '2D动画', '伊地知虹夏', '《孤独摇滚!》', '雪'],
    description: '突发灵感制作的。',
    date: '2023-09-03',
    creationCycle: '3天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    videoUrl: '/assets/artworks/art-6/Nijika.mp4',
    links: [
      { name: 'B站', url: 'https://www.bilibili.com/video/BV1xV411w7gf/' },
      { name: 'Steam创意工坊', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3030053645' }
    ]
  },
  {
    id: 'art-7',
    title: '手游《地平线行者》蕾雅角色立绘临摹',
    image: '/assets/artworks/art-7/Leah_Line art.jpg',
    thumbnail: '/assets/artworks/art-7/Leah_Line art.jpg',
    category: 'painting',
    tags: ['线稿', '临摹', '蕾雅', '《地平线行者》'],
    description: '绘画总用时：10h58m24s，原图分辨率：2104*3844，临摹用分辨率：2104*3844。',
    date: '2025-12-08-12-09',
    creationCycle: '2天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    processImages:
    [
      '/assets/artworks/art-7/Leah_Comparison.jpg',
      '/assets/artworks/art-7/Leah_Original image.jpg'
    ],
    processLabels: ['线稿', '对比', '原图'],
    links: [
      { name: 'GameKee帖子', url: 'https://www.gamekee.com/hw/685096.html' }
    ]
  },
  {
    id: 'art-8',
    title: '手游《地平线行者》格里泽尔达角色立绘临摹',
    image: '/assets/artworks/art-8/Griselda_Line art.jpg',
    thumbnail: '/assets/artworks/art-8/Griselda_Line art.jpg',
    category: 'painting',
    tags: ['线稿', '临摹', '格里泽尔达', '《地平线行者》'],
    description: '绘画总用时：5h11m55s，原图分辨率：1000*1000，临摹用分辨率：1000*1000。',
    date: '2026-01-02',
    creationCycle: '1天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    processImages:
    [
      '/assets/artworks/art-8/Griselda_Comparison.jpg',
      '/assets/artworks/art-8/Griselda_Original image.png'
    ],
    processLabels: ['线稿', '对比', '原图'],
    links: [
      { name: 'GameKee帖子', url: 'https://www.gamekee.com/hw/688557.html' }
    ]
  },
  {
    id: 'art-9',
    title: '手游《地平线行者》艾弗里特角色立绘临摹',
    image: '/assets/artworks/art-9/Everette_Refinement.png',
    thumbnail: '/assets/artworks/art-9/Everette_Refinement.png',
    category: 'painting',
    tags: ['线稿', '临摹', '蕾雅', '《地平线行者》'],
    description: '绘画总用时：13h24m31s，原图分辨率：2048*2048，临摹用分辨率：1201*1506。',
    date: '2025-01-03-01-06',
    creationCycle: '4天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    processImages:
    [
      '/assets/artworks/art-9/Everette_Line art.png',
      '/assets/artworks/art-9/Everette_Comparison.png',
      '/assets/artworks/art-9/Everette_Original image.png'
    ],
    processLabels: ['细化', '线稿', '对比', '原图'],
    links: [
      { name: 'GameKee帖子', url: 'https://www.gamekee.com/hw/688956.html' }
    ]
  },
  {
    id: 'art-10',
    title: '《BanG Dream!》系列角色高松灯立绘临摹',
    image: '/assets/artworks/art-10/Takamatsu Tomori_Refinement.png',
    thumbnail: '/assets/artworks/art-10/Takamatsu Tomori_Refinement.png',
    category: 'painting',
    tags: ['线稿', '临摹', '高松灯', '《BanG Dream!》', 'MyGo!!!!!'],
    description: '绘画总用时：3h47m42s，原图分辨率：1000*1514，临摹用分辨率：1000*1514。',
    date: '2025-01-10-01-11',
    creationCycle: '2天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    processImages:
    [
      '/assets/artworks/art-10/Takamatsu Tomori_Comparison.png',
      '/assets/artworks/art-10/Takamatsu Tomori_Original image.png'
    ],
    processLabels: ['细化', '对比', '原图'],
    processVideoUrl: '/assets/artworks/art-10/Takamatsu Tomori_Video.mp4',
    links: [
      
    ]
  },
  {
    id: 'art-11',
    title: '《BanG Dream!》系列角色千早爱音立绘临摹',
    image: '/assets/artworks/art-11/Chihaya Anon_Refinement.png',
    thumbnail: '/assets/artworks/art-11/Chihaya Anon_Refinement.png',
    category: 'painting',
    tags: ['线稿', '临摹', '千早爱音', '《BanG Dream!》', 'MyGo!!!!!'],
    description: '绘画总用时：5h34m32s，原图分辨率：1000*1514，临摹用分辨率：1000*1514。',
    date: '2025-01-16-01-17',
    creationCycle: '2天',
    creationEnvironment: '居家创作，没有工作，没有收入，在抑郁症和孤独的陪伴下。',
    processImages:
    [
      '/assets/artworks/art-11/Chihaya Anon_Comparison.png',
      '/assets/artworks/art-11/Chihaya Anon_Original image.png'
    ],
    processLabels: ['细化', '对比', '原图'],
    processVideoUrl: '/assets/artworks/art-11/Chihaya Anon_Video.mp4',
    links: [
      
    ]
  }
];

