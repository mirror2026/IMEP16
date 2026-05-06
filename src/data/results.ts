export type CharacterResult = {
  code: string
  title: string
  mbti: string
  career: string
  partner: string
  rival: string
}

export type Faction = {
  id: string
  name: string
  tagline: string
  description: string
  characters: CharacterResult[]
}

export type ImepResult = CharacterResult & {
  factionId: string
  factionName: string
  factionTagline: string
  factionDescription: string
  mbtiGuess: string
  description: string
  studyRoomCta: string
  heartfeltNote: string
  animal: string
  accent: string
}

export const factions: Faction[] = [
  {
    id: 'f1',
    name: 'S+T 卷王区',
    tagline: '求稳+理论 —— 考研/考编的绝对主力',
    description: '主打一个分数至上，考编考研的绝对基本盘。',
    characters: [
      {
        code: 'TSLO',
        title: '无情满绩卷王',
        mbti: 'INTJ 或 ISTJ（极度自律）',
        career: '【考研圣体】 985学硕、定向选调生',
        partner: 'PSLO (体制内隐形人)。两人在图书馆一天不说一句话，但配合默契',
        rival: 'PRGC (风口交际牛马)。你觉得ta吵闹，ta觉得你莫得感情',
      },
      {
        code: 'TSLC',
        title: '薛定谔的学霸',
        mbti: 'INTP（日常摸鱼，考前超神）',
        career: '【考前突击的神】 考研本校保底，或去国企研究所',
        partner: 'PSLC (极限捡漏大师)。两人可以一起研究性价比最高的上岸方式',
        rival: 'PRGO (大厂人形发电机)。ta 的疯狂内卷和每日打卡会让你感到窒息',
      },
      {
        code: 'TSGO',
        title: '移动的资料库',
        mbti: 'ISFJ 或 ENFJ（大爱无疆，乐于助人）',
        career: '【考研搭子首选】师范类专硕、高校行政编',
        partner: 'TSLO (无情满绩卷王)。你负责搜集信息，ta 负责给你讲题',
        rival: 'TRLC (午夜学术疯子)。ta 那些天马行空的理论在你看来毫无价值',
      },
      {
        code: 'TSGC',
        title: '群聊焦虑传播者',
        mbti: 'ESFJ（一边焦虑一边吃瓜）',
        career: '【考研气氛组】最终大概率走秋招去传统行业',
        partner: 'PSGC (快乐的混子)。两人能在群里聊八卦聊到半夜，完美释放压力',
        rival: 'TRLO (闭门造车极客)。ta 会直接把你拉黑，嫌你消息太多',
      },
    ],
  },
  {
    id: 'f2',
    name: 'S+P 务实区',
    tagline: '求稳+实践 —— 闷声发大财的实用主义者',
    description: '不听大道理，只看性价比，生存能力极强。',
    characters: [
      {
        code: 'PSLO',
        title: '体制内隐形人',
        mbti: 'ISTJ（无情的打卡机器）',
        career: '【闷声考公王】考公、国企、银行，稳当饭最香',
        partner: 'TSLO (无情满绩卷王)。各卷各的，互不打扰',
        rival: 'TRGC (赛博街溜子)。ta 为什么每天都在折腾没用的东西',
      },
      {
        code: 'PSLC',
        title: '极限捡漏大师',
        mbti: 'ISTP（实用主义，绝不多花一分力气）',
        career: '【调剂区战神】名校的边缘冷门专业、或者回老家考个编',
        partner: 'TSLC (薛定谔的学霸)。交流摸鱼心得的最佳损友',
        rival: 'PRGO (大厂发电机)。ta 鄙视你的躺平，你觉得 ta 是工贼',
      },
      {
        code: 'PSGO',
        title: '社团万能劳模',
        mbti: 'ESFJ 或 ESTJ',
        career: '【HR最爱万金油】 专硕、大厂行政/HR、管培生',
        partner: 'TRGO (PPT画饼导师)。ta 负责在台前，你负责在台后',
        rival: 'TRLC (午夜学术疯子)。你觉得 ta 不切实际且不配合团队工作',
      },
      {
        code: 'PSGC',
        title: '快乐的混子',
        mbti: 'ESFP（表演型人格）',
        career: '【主打一个陪伴】灵活就业、家里安排、或者随便找个班上',
        partner: 'TSGC (群聊焦虑传播者)。两人是完美的八卦搭子',
        rival: 'TRLO (闭门造车极客)。完全不是一个世界的人，连话都说不上',
      },
    ],
  },
  {
    id: 'f3',
    name: 'R+T 极客区',
    tagline: '冒险+理论 —— 仰望星空的偏执狂',
    description: '精神状态极其超前，要么成神要么成神……经。',
    characters: [
      {
        code: 'TRLO',
        title: '闭门造车极客',
        mbti: 'INTJ 或 INTP（并且有极高几率是代码大佬）',
        career: '【跨考降维打击】 跨考计算机/AI、顶尖实验室直博、独立开发者',
        partner: 'PRLO (独狼搞钱机)。你出核心技术，ta 出商业模式',
        rival: 'PSGC (快乐的混子)。人类的悲欢并不相通，你只觉得 ta 浪费空气',
      },
      {
        code: 'TRLC',
        title: '午夜学术疯子',
        mbti: 'INFP 或 ENTP（脑洞大开，极其浪漫或疯癫）',
        career: '【灵感流哲学家】申请海外名校 MFA/Ph.D、艺术创作者',
        partner: 'TRGC (赛博街溜子)。两个疯子可以一起碰撞出改变世界的点子',
        rival: 'PSLO (体制内隐形人)。ta 觉得你迟早要饿死',
      },
      {
        code: 'TRGO',
        title: 'PPT画饼导师',
        mbti: 'ENTJ（天生的忽悠大师和 Leader）',
        career: '【嘴强王者】名校 MBA、初创公司创始人、咨询行业',
        partner: 'PSGO (社团万能劳模)。你需要一个靠谱的执行者来兜底你的大饼',
        rival: 'TSLC (薛定谔的学霸)。ta 一眼看穿了你的 PPT 里全是虚的',
      },
      {
        code: 'TRGC',
        title: '赛博街溜子',
        mbti: 'ENFP（快乐小狗，思维极其跳跃）',
        career: '【每天一个新想法】 自媒体博主、Gap Year、经常换赛道',
        partner: 'TRLC (午夜疯子)。精神状态完美契合',
        rival: 'TSLO (无情卷王)。ta 的日程表，让你头皮发麻',
      },
    ],
  },
  {
    id: 'f4',
    name: 'R+P 搞事区',
    tagline: '冒险+实践 —— 浑身是胆的社会人',
    description: '浑身是胆，不服就干。考研？考研耽误我赚钱。',
    characters: [
      {
        code: 'PRLO',
        title: '独狼搞钱机',
        mbti: 'ISTP 或 ENTJ',
        career: '【闷声干大事的狠人】 大厂核心技术/业务线、直接创业',
        partner: 'TRLO (闭门极客)。互为对方的最强辅助',
        rival: 'TSGC (群聊焦虑传播者)。别烦我，挡着我搞钱了',
      },
      {
        code: 'PRLC',
        title: '草莽创业猴子',
        mbti: 'ESTP（永远在风口，永远在折腾）',
        career: '【想一出是一出】去最卷的市场做销售、开淘宝店、做电商',
        partner: 'PRGC (风口交际牛马)。两人合伙，一个敢想一个敢卖',
        rival: 'TSGO (移动资料库)。嫌弃对方太保守、动作太慢',
      },
      {
        code: 'PRGO',
        title: '大厂人形发电机',
        mbti: 'ESTJ 或 ENFJ（卷王之王，鸡血满满）',
        career: '【天生Leader】 互联网大厂卷王、四大审计、名企管培',
        partner: 'TRGO (画饼导师)。一起把蛋糕做大',
        rival: 'PSLC (极限捡漏大师)。你恨不得把 ta 从床上揪起来去干活',
      },
      {
        code: 'PRGC',
        title: '风口交际牛马',
        mbti: 'ENTP 或 ESFP',
        career: '【哪里热闹去哪里】 广告传媒、公关 PR、MCN 商务',
        partner: 'PRLC (草莽猴子)。最佳酒肉朋友和搞钱合伙人',
        rival: 'TSLO (无情卷王)。宿命之敌，水火不容',
      },
    ],
  },
]

const accentByFaction: Record<string, string> = {
  f1: 'amber',
  f2: 'emerald',
  f3: 'violet',
  f4: 'rose',
}

const animalByFaction: Record<string, string> = {
  f1: '卷王区拟态体',
  f2: '务实区生存体',
  f3: '极客区异能体',
  f4: '搞事区突击体',
}

const ctaByCode = (code: string): string => {
  if (code.includes('S')) {
    return '你是稳定推进型，奇迹自习室的知识点地图可以把你的长期主义转成可追踪复利。'
  }
  if (code.includes('R') && code.includes('C')) {
    return '你是高波动冲刺型，建议用奇迹自习室管理自学进度，避免临近 DDL 才极限爆发。'
  }
  return '你适合把灵感变流程，奇迹自习室能把分散任务收敛成清晰主线。'
}

const heartfeltNoteByCode: Record<string, string> = {
  TSLO:
    '你习惯了把日程表排得严丝合缝，用近乎苛刻的标准要求自己。你看起来坚不可摧，但其实内心一直紧绷，生怕一次失误就会跌落神坛。请记得，你不是一台精密的做题机器，人生的容错率比你想象的要大得多。偶尔的失控、疲惫和“毫无产出的一天”，并不会毁掉你的未来。试着把对自己的爱，从“条件反射式的优秀”中剥离出来——那个会累、会哭、不完美的你，依然非常耀眼。',
  TSLC:
    '你聪明、悟性高，却常常在“疯狂摸鱼”和“极度自责”之间反复横跳。看着别人稳扎稳打，你总会陷入“如果我再努力一点就好了”的习得性懊悔中。别再用别人的进度条来惩罚自己了。接纳自己脉冲式的能量爆发规律，你的灵光一闪和超强爆发力，就是你的天赋。在这个世界上，通往终点的方式有很多种，允许自己用不那么常规的姿势跑到终点。',
  TSGO:
    '群里有人求助，你总是第一时间响应；你照顾身边所有人的情绪，却唯独总是委屈了自己。你太害怕让别人失望，以至于把别人的期待当成了自己的坐标。在这场名为成长的单人赛里，希望你能“自私”一点。学会课题分离，把你给别人的耐心分一半给那个同样疲惫的自己。你不需要通过“被需要”来证明价值，你本身就值得被爱。',
  TSGC:
    '你每天在各个考研群和社交平台上疯狂刷新报录比，试图用海量的信息来填补内心的不安。但亲爱的，网上的幸存者偏差和贩卖焦虑，正在吞噬你本就不多的能量。别人的上岸经验不是你的标准答案，你不用背负整个大环境的沉重。试着关掉手机两小时，只看着眼前这一页书。世界很吵，但你的节奏由你自己决定。',
  PSLO:
    '互联网上总是在鼓吹“年薪百万”和“改变世界”，这有时会让你对自己追求的“安稳”产生自我怀疑，甚至觉得自己不够上进。但在充满不确定的时代，能清醒地知道自己想要什么，并踏实地去构建这种生活，是一种极其稀缺的清醒。不要被外界的喧嚣乱了阵脚，守护好内心的秩序，平平淡淡的人生同样拥有抵御风浪的万钧之力。',
  PSLC:
    '你用“性价比”和“躺平”武装自己，看似对什么都不在乎。但也许在你内心深处，只是太害怕“拼尽全力却依然失败”的无力感。因为害怕得不到，所以假装不想要，这是一种自我保护机制。研Bot 希望你在未来的某一天，能遇到一件让你心甘情愿放下所有算计的事。哪怕笨拙，哪怕头破血流，也请去痛快地体验一次“全力以赴”。不怕输，才是真的赢。',
  PSGO:
    '你是那个在幕后默默把坑填好、把事情落地的人，习惯了做团队的基石。但长此以往，你可能会陷入一种迷茫：脱离了这些组织和头衔，我是谁？你不是任何人的工具人，也不只是一个完美的执行者。把精力往回收一收，去寻找那些仅仅因为“我喜欢”而去做的事情。你不需要对任何人有用，你只要对自己觉得有趣就好。',
  PSGC:
    '你看起来总是乐呵呵的，好像天塌下来当被子盖。但每当夜深人静，面临毕业和未来的选择时，你也会感到一种深切的迷茫和无力，觉得自己好像什么都比不过别人。别被传统的世俗标准困住！你提供情绪价值的能力、你的乐观与鲜活，本身就是巨大的财富。人生不是只有考研考编一条单行道，在宽广的旷野里，你一定会找到属于你的游乐场。',
  TRLO:
    '你的大脑是一座精密的宫殿，你习惯在代码和理论的绝对逻辑里寻找安全感，却常常觉得现实世界的人际关系吵闹且无序。孤独是你的铠甲，但有时也会变成困住你的牢笼。不要因为某次社交挫败就给自己贴上“社恐”的标签。试着对这个混沌的现实世界多一点点耐心，它虽然不够完美，但总有人能听懂你的宇宙。',
  TRLC:
    '你的灵魂浪漫、跳跃、充满理想主义。正因如此，当面对僵硬的考试大纲和枯燥的报录比时，你感受到的痛苦比任何人都深烈。你容易觉得这个功利的系统配不上你的才华。但，现实不是用来妥协的，而是用来跨越的。不要让这份才华在抱怨中消磨，找到那个能承载你灵感的现实容器，用世俗的盾牌，保护好你理想的矛。',
  TRGO:
    '你极具煽动性，总能描绘出宏大的蓝图，看起来永远自信满满。但在无人的角落，你是否也会被“冒名顶替综合征”折磨？害怕别人发现你其实没有那么厉害，害怕大饼一旦戳破就会失去一切。真正的领导力，不仅包含指点江山，也包含承认自己的脆弱与未知。卸下“永远全能”的包袱，真实的你，比你想象的更具感染力。',
  TRGC:
    '你对世界永远好奇，今天想做博主，明天想去 Gap，你的生命力令人惊叹。但也正因如此，你常常陷入“什么都没坚持下来”的自我怀疑中，看着别人在一个赛道深耕，你会感到焦虑。别怕，你的每一次跨界都没有白费，它们最终会连点成线。接纳自己是一只自由的飞鸟，无需羡慕那些生根的树。探索本身，就是你的宿命。',
  PRLO:
    '你像一头狼，信奉丛林法则，觉得除了搞钱和搞事业，一切都不值一提。你用铠甲把柔软的内心包裹得严严实实，甚至把情感需求视作软弱。但人生不是一张冰冷的资产负债表，在这个世界上，总有一些事物是无法用 ROI（投资回报率）来衡量的。允许自己偶尔停下来看一场无用的日落，接纳别人的善意，那不会让你变弱，只会让你更完整。',
  PRLC:
    '你永远在风口上狂奔，执行力爆表。但你总是用极高频的行动来掩盖对未知的恐惧。你害怕停下来，好像只要一直跑，失败就追不上你。其实，即使某次项目搞砸了，某次选择错了，也绝对不会剥夺你重新站起来的底牌。给自己留一点复盘和放空的时间，偶尔“怂”一次，并不代表你是个失败者。',
  PRGO:
    '卷王之王，永远在打鸡血。你把自我价值深度绑定在 Title、绩效和别人的赞美上，就像在跑步机上狂奔，不敢有丝毫懈怠。停下来！真的希望你能停下来深呼吸。你的价值不需要靠永远的“第一名”来维系。即使你今天什么宏伟的目标都没有完成，哪怕只是躺在床上发呆，你依然是一个极其优秀、值得被深爱的人。休息，是你的基本人权。',
  PRGC:
    '你的通讯录里有无数个好友，你能在任何局里游刃有余。但在狂欢散去后的深夜，那种巨大的空虚感是不是常常将你淹没？你习惯了用社交的热闹来确认自己的存在感，害怕一旦脱离人群，自己就什么都不是。去试着独处吧，哪怕一开始会很难熬。不用随时随地做一个闪闪发光的“捧场王”，去拥抱那个安静的、甚至有些孤单的本真自我。',
}

export const resultMap: Record<string, ImepResult> = factions.flatMap((faction) =>
  faction.characters.map((character) => ({
    ...character,
    factionId: faction.id,
    factionName: faction.name,
    factionTagline: faction.tagline,
    factionDescription: faction.description,
    mbtiGuess: character.mbti,
    description: `${character.career}\n最佳搭子：${character.partner}\n宿命对手：${character.rival}`,
    studyRoomCta: ctaByCode(character.code),
    heartfeltNote: heartfeltNoteByCode[character.code] ?? '你已经很努力了，别忘了照顾好自己。',
    animal: animalByFaction[faction.id] ?? '通用战斗单位',
    accent: accentByFaction[faction.id] ?? 'amber',
  })),
).reduce(
  (acc, item) => {
    acc[item.code] = item
    return acc
  },
  {} as Record<string, ImepResult>,
)
