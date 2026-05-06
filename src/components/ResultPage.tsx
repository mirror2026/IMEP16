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
  TSLO: '/IMEP16/result-tslo.png',
  TSLC: '/IMEP16/result-tslc.png',
  TSGO: '/IMEP16/result-tsgo.png',
  TSGC: '/IMEP16/result-tsgc.png',
  PSLO: '/IMEP16/result-pslo.png',
  PSLC: '/IMEP16/result-pslc.png',
  PSGO: '/IMEP16/result-psgo.png',
  PSGC: '/IMEP16/result-psgc.png',
  TRGC: '/IMEP16/result-trgc.png',
  TRGO: '/IMEP16/result-trgo.png',
  TRLC: '/IMEP16/result-trlc.png',
  TRLO: '/IMEP16/result-trlo.png',
  PRLO: '/IMEP16/result-prlo.png',
  PRLC: '/IMEP16/result-prlc.png',
  PRGO: '/IMEP16/result-prgo.png',
  PRGC: '/IMEP16/result-prgc.png',
}

export default function ResultPage({ resultCode, axes }: ResultPageProps) {
  const result = resultMap[resultCode] ?? resultMap.TSLO
  const resultImage = resultImageMap[resultCode] ? encodeURI(resultImageMap[resultCode]) : ''

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-3 py-4 text-slate-100">
      <p className="mb-3 text-center text-xs tracking-[0.22em] text-white/90">IMNB 大学生物种图鉴</p>

      <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 pb-8 shadow-2xl backdrop-blur-md">
        <PersonaHeader resultCode={resultCode} resultImage={resultImage} />
        <GeneBars axes={axes} />
        <HeartfeltNote note={result.heartfeltNote} />
        <JointProduction />
      </div>

      <div className="mt-8 mb-4 text-center text-sm font-medium tracking-widest text-white/60">
        👇 测完性格，来点硬核的～
      </div>

      <UltimateEggPromo />
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
            className="flex h-28 flex-col rounded-xl border border-white/5 bg-black/25 p-3 backdrop-blur-md"
          >
            <p className="mb-1 text-xs text-slate-300">
              {card.icon} {card.label}
            </p>
            <p className="line-clamp-1 text-sm font-semibold text-amber-200">{card.value}</p>
            {'detail' in card && card.detail && (
              <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-white">
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
            <div key={axis.id} className="rounded-xl border border-white/5 bg-black/25 p-3">
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
  { headline: '精准分差带', sub: '冲刺 / 稳妥 / 保底' },
  { headline: '大数据依据', sub: '最新报录比与调剂线' },
  { headline: '跨考风险预警', sub: '精准定位背景短板' },
  { headline: 'AI 深度研判', sub: '专属备考路线规划' },
] as const

function UltimateEggPromo() {
  const goYanbot = () => {
    window.location.href = 'https://h5.yanbot.tech/imnb'
  }

  return (
    <section
      className="mx-auto w-[92%] rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl"
      aria-labelledby="egg-promo-title"
    >
      <div className="mb-4 inline-flex items-center rounded bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white">
        <span
          className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-white animate-pulse"
          aria-hidden
        />
        给考研党的彩蛋
      </div>
      <h2
        id="egg-promo-title"
        className="text-base font-semibold leading-snug tracking-tight text-slate-900 sm:text-lg"
      >
        <span className="text-blue-600">限时免费</span>
        <span> | 你最适合考哪所学校？</span>
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        「研Bot」AI择校大师为你提供多维度上岸策略：
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {EGG_HIGHLIGHTS.map((item) => (
          <li
            key={item.headline}
            className="rounded-lg border border-white/50 bg-white/60 px-2.5 py-2"
          >
            <p className="text-sm font-semibold leading-tight text-slate-800">{item.headline}</p>
            <p className="mt-1 text-xs leading-snug text-slate-500">{item.sub}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={goYanbot}
        className="mt-5 w-full rounded-2xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700"
      >
        点击生成专属择校报告
      </button>
    </section>
  )
}
