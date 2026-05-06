export type TraitPair = {
  left: string
  right: string
}

export type Question = {
  id: number
  dimension: 'Input' | 'Motivation' | 'Energy' | 'Pacing'
  sceneTag: string
  pair: TraitPair
  prompt: string
  optionA: string
  optionB: string
}

export const questions: Question[] = [
  // --- Dimension 1: Input (理论 T vs 实践 P) 偏向于：系统认知 vs 试探实操 ---
  {
    id: 1,
    dimension: 'Input',
    sceneTag: '心动场景',
    pair: { left: 'T', right: 'P' },
    prompt: '遇到一个长在审美点上的 crush，你习惯的第一步“作战计划”通常是？',
    optionA: '赛博柯南附体：习惯先翻遍 ta 的社交动态，试图拼凑出对方喜好和性格底色',
    optionB: '创造机会接触：先想办法制造点偶遇，或者找个合理的借口搭个话再说',
  },
  {
    id: 2,
    dimension: 'Input',
    sceneTag: '宿舍求生',
    pair: { left: 'T', right: 'P' },
    prompt: '宿舍的花洒 / 路由器突然坏了，你的习惯性操作更偏向？',
    optionA: '先搜一下症状或原理，搞清楚到底是怎么坏的，再去动手或报修',
    optionB: '拍两下、拔电源重启，主打一个“大力出奇迹”，能用就行，不行再找人',
  },
  {
    id: 3,
    dimension: 'Input',
    sceneTag: '吃瓜法则',
    pair: { left: 'T', right: 'P' },
    prompt: '吃到了一个惊天大瓜，但只听到了半截，你会：',
    optionA: '立刻去各大平台搜关键词，像做文献综述一样，试图理清完整的时间线和逻辑',
    optionB: '直接冲去群里求爆料，或者顺藤摸瓜去问相关的知情人，拿到一手鲜活信息',
  },
  {
    id: 4,
    dimension: 'Input',
    sceneTag: '报错场景',
    pair: { left: 'T', right: 'P' },
    prompt: '电脑突然弹出一串你从没见过的报错代码 / 专业难题，你的第一反应是：',
    optionA: '把关键信息丢进搜索引擎，习惯性翻找官方文档或技术帖，想搞懂底层原理',
    optionB: '直接丢给 AI 或者搜短视频教程，不求甚解，能赶紧跑通解决就行',
  },
  {
    id: 5,
    dimension: 'Input',
    sceneTag: '选课博弈',
    pair: { left: 'T', right: 'P' },
    prompt: '选修课二选一，抛开学分不谈，你内心其实更容易被哪种吸引？',
    optionA: '偏理论硬核：虽然要闭卷考，但能系统性地学到非常扎实的知识',
    optionB: '偏实操项目：期末成绩靠小组实践或者 PPT，实战自由度极高',
  },

  // --- Dimension 2: Motivation (求稳 S vs 冒险 R) ---
  {
    id: 6,
    dimension: 'Motivation',
    sceneTag: '海王陷阱',
    pair: { left: 'S', right: 'R' },
    prompt: '遇到一个堪称完美的男/女神，但听说 ta 的鱼塘深不可测，你会？',
    optionA: '大概率会赶紧撤退。这种高风险局我驾驭不住，还是求稳最重要',
    optionB: '隐隐觉得有点刺激。大不了谈一段，体验过就好，万一我就是那个终结者呢？',
  },
  {
    id: 7,
    dimension: 'Motivation',
    sceneTag: '破产危机',
    pair: { left: 'S', right: 'R' },
    prompt: '月底生活费告急，但突然刷到一个超想要的绝版盲盒 / 游戏皮肤：',
    optionA: '大多时候能忍住。接下来的日子还能吃食堂，保证基本的生存',
    optionB: '很容易上头拿下！大不了厚着脸皮蹭饭，或者疯狂找兼职',
  },
  {
    id: 8,
    dimension: 'Motivation',
    sceneTag: '违纪边缘',
    pair: { left: 'S', right: 'R' },
    prompt: '明天有必点名的早八专业课，但暧昧对象约你去通宵看日出，你会？',
    optionA: '大概率还是会忍痛拒绝。点名扣分挂科的潜在风险，会让我通宵也玩得不踏实',
    optionB: '倾向于冲动答应！青春没有售价，大不了明早让室友帮忙答个到，赌一把',
  },
  {
    id: 9,
    dimension: 'Motivation',
    sceneTag: 'Offer抉择',
    pair: { left: 'S', right: 'R' },
    prompt: '毕业前夕，面前有两个极端选项，你内心最深处其实更倾向：',
    optionA: '老家国企/编制。薪资虽一般，但早九晚五很稳定，不用害怕被裁员',
    optionB: '一线初创团队。起薪极高且充满想象力，但公司可能明年就倒闭',
  },
  {
    id: 10,
    dimension: 'Motivation',
    sceneTag: '研Bot预警',
    pair: { left: 'S', right: 'R' },
    prompt: '你想考的 985 专业今年报录比高达 1:25（神仙打架），你会：',
    optionA: '理性看待，立刻去查调剂数据，或者找一个性价比更高的学校，上岸优先',
    optionB: '搏一搏单车变摩托，非它不考，大不了硬刚二战，不想给自己留遗憾！',
  },

  // --- Dimension 3: Energy (独狼 L vs 抱团 G) ---
  {
    id: 11,
    dimension: 'Energy',
    sceneTag: '深夜茶话会',
    pair: { left: 'L', right: 'G' },
    prompt: '熄灯后的宿舍，室友们突然开始热烈讨论某个八卦，此时拉着床帘的你：',
    optionA: '选择默默戴上耳机。此时社交电量已低，只想沉浸在自己的世界里',
    optionB: '总是会瞬间来精神，猛地掀开床帘探出脑袋：“这是说谁呢？也和我讲讲！”',
  },
  {
    id: 12,
    dimension: 'Energy',
    sceneTag: '社团遁术',
    pair: { left: 'L', right: 'G' },
    prompt: '社团大聚餐刚结束，部长提议大家去 KTV 开启“第二场”，此时的你：',
    optionA: '社交电量告急。表面还在附和，内心飞速构思借口试图开溜～',
    optionB: '接着奏乐接着舞！甚至已经在帮着打电话，询问最近KTV还有没有空包厢',
  },
  {
    id: 13,
    dimension: 'Energy',
    sceneTag: '跑步搭子',
    pair: { left: 'L', right: 'G' },
    prompt: '下课后想去操场运动一下，你的常态是：',
    optionA: '站起来自己就去了。一个人行动自由自在，不用互相迁就时间，效率最高',
    optionB: '习惯性地环顾四周：“有人去操场吗？走走走一起！”喜欢有人陪伴的热闹氛围',
  },
  {
    id: 14,
    dimension: 'Energy',
    sceneTag: '饭点落单',
    pair: { left: 'L', right: 'G' },
    prompt: '到了饭点，但平时一起干饭的搭子今天不在，你的真实反应：',
    optionA: '隐隐开心。终于可以戴上耳机，一边看电子榨菜一边沉浸式干饭了',
    optionB: '略微有点焦虑或不习惯。一个人吃饭总觉得太冷清了，可能会试着摇个人',
  },
  {
    id: 15,
    dimension: 'Energy',
    sceneTag: '小组作业',
    pair: { left: 'L', right: 'G' },
    prompt: '遇到一门必须组队的作业，你最受不了的是什么？',
    optionA: '无休止的开会和低效扯皮。如果可以，我其实更希望自己一个人把活全包了',
    optionB: '群里发消息大家都在装死，没人互动，气氛死气沉沉的，毫无团队凝聚力',
  },

  // --- Dimension 4: Pacing (秩序 O vs 混沌 C) ---
  {
    id: 16,
    dimension: 'Pacing',
    sceneTag: '坦白局',
    pair: { left: 'O', right: 'C' },
    prompt: '灵魂发问：你宿舍那把椅子的靠背，目前处于什么状态？',
    optionA: '还是拿来坐的。上面比较清爽，最多搭了一件今天刚穿过的外套',
    optionB: '已经长满了衣服。平时随手一扔，要坐的时候只能把衣服一股脑挪到床上',
  },
  {
    id: 17,
    dimension: 'Pacing',
    sceneTag: '兵荒马乱',
    pair: { left: 'O', right: 'C' },
    prompt: '和好朋友约了明天早上 9 点出去玩，明早你的状态大概率是：',
    optionA: '比较从容地起床。衣服昨晚就想好怎么搭了，还能留出时间按时吃个早饭',
    optionB: '8点50惊醒。迷迷瞪瞪套上衣服，不加收拾，或者在出租车上极限化妆',
  },
  {
    id: 18,
    dimension: 'Pacing',
    sceneTag: '玄学解压',
    pair: { left: 'O', right: 'C' },
    prompt: '期末周压力巨大，实在复习不进去的时候，你经常会干出一件什么事？',
    optionA: '把桌面从头到尾仔细收拾一遍。看到环境变得井井有条，心里更有安全感',
    optionB: '很容易思绪乱飘。突然被算法吸引，连看两小时甄嬛传解说或短视频',
  },
  {
    id: 19,
    dimension: 'Pacing',
    sceneTag: '立Flag',
    pair: { left: 'O', right: 'C' },
    prompt: '你买了一本极好的考研资料（或精致的手账本），拿到的第一天你会：',
    optionA: '翻到扉页，充满仪式感地工工整整写下名字、日期，并列好本学期的详细规划',
    optionB: '随便翻开其中一页，拿笔乱划拉两下，在心里假装自己“已经开始学了”',
  },
  {
    id: 20,
    dimension: 'Pacing',
    sceneTag: 'DDL玄学',
    pair: { left: 'O', right: 'C' },
    prompt: '距离极其重要的毕业论文（或大作业）截稿还有整整一个月，你会：',
    optionA: '习惯性列好提纲框架，每周推进一点，进度条基本始终在自己的掌控之中',
    optionB: '前三周毫无进展，最后几天靠着DDL和咖啡红牛创造奇迹',
  },
]