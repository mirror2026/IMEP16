import { motion } from 'framer-motion'
import { resultMap } from '../data/results'
import JointProduction from './JointProduction'

type AxisDatum = {
  id: string
  label: string
  leftLabel: string
  rightLabel: string
  leftScore: number
  rightScore: number
  winner: 'left' | 'right'
}

type ResultPageProps = {
  resultCode: string
  axes: AxisDatum[]
}

const resultImageMap: Record<string, string> = {
  TSLO: '/IMEP16/TSLO-满绩卷王-1776863339319.png',
  TSLC: '/IMEP16/TSLC-薛定谔学霸-1776863340547.png',
  TSGO: '/IMEP16/TSGO-移动资料库-1776863346337.png',
  TSGC: '/IMEP16/TSGC-群聊焦虑传播者-1776863347537.png',
  PSLO: '/IMEP16/PSLO-体制内隐形人-1776863356090.png',
  PSLC: '/IMEP16/PSLC-极限捡漏大师-1776863357603.png',
  PSGO: '/IMEP16/PSGO-社团劳模-1776863360671.png',
  PSGC: '/IMEP16/PSGC-快乐混子-1776863368413.png',
  TRGC: '/IMEP16/TRGC-赛博街溜子-1776863379820.png',
  TRGO: '/IMEP16/TRGO-PPT画饼导师-1776863378576.png',
  TRLC: '/IMEP16/TRLC-午夜学术疯子-1776863374121.png',
  TRLO: '/IMEP16/TRLO-闭门极客-1776863374614.png',
  PRLO: '/IMEP16/PRLO-独狼搞钱机-1776863394805.png',
  PRLC: '/IMEP16/PRLC-草莽创业猴-1776863403263.png',
  PRGO: '/IMEP16/PRGO-大厂发电机-1776863407333.png',
  PRGC: '/IMEP16/PRGC-风口交际花-1776863410140.png',
}

export default function ResultPage({ resultCode, axes }: ResultPageProps) {
  const result = resultMap[resultCode] ?? resultMap.TSLO
  const resultImage = resultImageMap[resultCode] ? encodeURI(resultImageMap[resultCode]) : ''

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-3 py-4 text-slate-100">
      <p className="mb-3 text-center text-xs tracking-[0.22em] text-white/90">IMNB 大学生物种图鉴</p>
      <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <PersonaHeader resultCode={resultCode} resultImage={resultImage} />
        <GeneBars axes={axes} />
        <HeartfeltNote note={result.heartfeltNote} />
        <JointProduction />
        <div
          className="my-12 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <UltimateEggPromo />
      </div>
    </div>
  )
}

function PersonaHeader({
  resultCode,
  resultImage,
}: {
  resultCode: string
  resultImage: string
}) {
  const result = resultMap[resultCode] ?? resultMap.TSLO
  const mbtiParsed = parseBracketText(result.mbtiGuess)
  const careerParsed = parseCareer(result.career)
  const partnerParsed = parseSentence(result.partner)
  const rivalParsed = parseSentence(result.rival)
  const infoCards = [
    {
      icon: '🔮',
      label: '盲猜 MBTI',
      value: mbtiParsed.title,
      detail: mbtiParsed.detail,
    },
    {
      icon: '🎓',
      label: '参考出路',
      value: careerParsed.title,
      detail: careerParsed.detail,
    },
    {
      icon: '🤝',
      label: '天选搭子',
      value: partnerParsed.title,
      detail: partnerParsed.detail,
    },
    {
      icon: '⚔️',
      label: '天生犯冲',
      value: rivalParsed.title,
      detail: rivalParsed.detail,
    },
  ]

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full">
        {resultImage ? (
          <img src={resultImage} alt={`${resultCode} 人物形象`} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-amber-100">人物形象</div>
        )}
      </div>
      <h1 className="bg-gradient-to-r from-amber-300 via-amber-500 to-orange-300 bg-clip-text text-center text-2xl font-black text-transparent drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
        {resultCode} - {result.title}
      </h1>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="flex h-28 flex-col rounded-xl bg-[#2B303A] p-3"
          >
            <p className="mb-1 text-xs text-slate-300">
              {card.icon} {card.label}
            </p>
            <p className="line-clamp-1 text-sm font-semibold text-amber-200">{card.value}</p>
            {'detail' in card && card.detail && (
              <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-slate-300">
                {card.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function parseCareer(career: string) {
  const match = career.match(/【([^】]+)】\s*(.*)/)
  if (!match) return { title: career, detail: '' }
  return {
    title: match[1].trim(),
    detail: match[2].trim(),
  }
}

function parseSentence(text: string) {
  const splitIndex = text.indexOf('。')
  if (splitIndex === -1) {
    return { title: text.trim(), detail: '' }
  }
  return {
    title: text.slice(0, splitIndex).trim(),
    detail: text.slice(splitIndex + 1).trim(),
  }
}

function parseBracketText(text: string) {
  const match = text.match(/^(.+?)[（(]([^）)]+)[）)]$/)
  if (!match) {
    return { title: text.trim(), detail: '' }
  }
  return {
    title: match[1].trim(),
    detail: match[2].trim(),
  }
}

function GeneBars({ axes }: { axes: AxisDatum[] }) {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-base font-bold text-amber-200">四维基因条</h2>
      <div className="space-y-3">
        {axes.map((axis) => {
          const dominantScore = axis.winner === 'left' ? axis.leftScore : axis.rightScore
          const dominantStyle = { width: `${dominantScore}%` }

          return (
            <div key={axis.id} className="rounded-xl border border-white/15 bg-white/10 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">{axis.label}</span>
              <span className="font-semibold text-amber-300">
                {axis.winner === 'left' ? `${axis.leftScore}%` : `${axis.rightScore}%`}
              </span>
            </div>
            <div className="relative mb-1.5 h-2 overflow-hidden rounded-full bg-black/25">
              <div className="flex h-full w-full">
                <div className="relative h-full w-1/2 bg-slate-500/40">
                  {axis.winner === 'left' && (
                    <div
                      className="absolute right-0 top-0 h-full rounded-l-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                      style={dominantStyle}
                    />
                  )}
                </div>
                <div className="relative h-full w-1/2 bg-slate-500/40">
                  {axis.winner === 'right' && (
                    <div
                      className="absolute left-0 top-0 h-full rounded-r-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                      style={dominantStyle}
                    />
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>{axis.leftLabel}</span>
              <span>{axis.rightLabel}</span>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

function HeartfeltNote({ note }: { note: string }) {
  return (
    <section className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 backdrop-blur-md">
      <h2 className="mb-2 text-base font-bold text-amber-200">一些走心话</h2>
      <p className="text-sm leading-relaxed text-slate-200">{note}</p>
    </section>
  )
}

const EGG_HIGHLIGHTS = [
  {
    icon: '🎯',
    headline: '精准梯队定位',
    sub: '「冲/稳/保」三档建议',
  },
  {
    icon: '📊',
    headline: '硬核数据底座',
    sub: '基于往年真实报录比',
  },
  {
    icon: '⚠️',
    headline: '核心风险预警',
    sub: '精准定位背景短板',
  },
  {
    icon: '🗺️',
    headline: '通关行动指南',
    sub: '定制备考路线图',
  },
] as const

function UltimateEggPromo() {
  const goYanbot = () => {
    window.location.href = 'https://h5.yanbot.tech/imnb'
  }

  return (
    <section
      className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-4 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md"
      aria-labelledby="egg-promo-title"
    >
      <div className="mb-3 inline-flex items-center rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-900">
        🎁 考研党福利
      </div>
      <h2
        id="egg-promo-title"
        className="text-base font-semibold leading-snug tracking-tight sm:text-lg"
      >
        <span className="text-amber-400">限时免费</span>
        <span className="text-white"> | 你最适合考哪所学校？</span>
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        AI择校大师为你进行多维度的上岸策略推演：
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {EGG_HIGHLIGHTS.map((item) => (
          <li
            key={item.headline}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2"
          >
            <div className="flex items-start gap-1.5">
              <span className="shrink-0 text-base leading-none" aria-hidden>
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold leading-tight text-amber-100">{item.headline}</p>
                <p className="mt-1 text-[10px] leading-snug text-slate-400">{item.sub}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <motion.button
        type="button"
        onClick={goYanbot}
        className="mt-4 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_100%] py-4 text-base font-black text-slate-900 shadow-[0_0_28px_rgba(245,158,11,0.5),0_10px_28px_rgba(245,158,11,0.3)] transition-shadow hover:shadow-[0_0_36px_rgba(245,158,11,0.6)]"
        animate={{
          boxShadow: [
            '0 0 20px rgba(245,158,11,0.35), 0 8px 24px rgba(245,158,11,0.2)',
            '0 0 36px rgba(245,158,11,0.55), 0 10px 28px rgba(245,158,11,0.35)',
            '0 0 20px rgba(245,158,11,0.35), 0 8px 24px rgba(245,158,11,0.2)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🚀 点击生成专属择校报告
      </motion.button>
    </section>
  )
}
