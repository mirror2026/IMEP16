import { useState } from 'react'
import { resultMap } from '../data/results'

type AxisDatum = {
  id: string
  label: string
  leftLabel: string
  rightLabel: string
  leftScore: number
  rightScore: number
  winner: 'left' | 'right'
}

type DeepReportState = 'form' | 'loading' | 'success'

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
  const [deepReportState, setDeepReportState] = useState<DeepReportState>('form')
  const [form, setForm] = useState({
    undergraduateSchool: '',
    targetMajor: '',
    stage: '',
  })
  const result = resultMap[resultCode] ?? resultMap.TSLO
  const resultImage = resultImageMap[resultCode] ? encodeURI(resultImageMap[resultCode]) : ''

  const submitDeepReport = (event: React.FormEvent) => {
    event.preventDefault()
    setDeepReportState('loading')
    window.setTimeout(() => {
      setDeepReportState('success')
    }, 2000)
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-3 py-4 text-slate-100">
      <p className="mb-3 text-center text-xs tracking-[0.22em] text-white/90">IMNB 大学生物种图鉴</p>
      <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <PersonaHeader resultCode={resultCode} resultImage={resultImage} />
        <GeneBars axes={axes} />
        <HeartfeltNote note={result.heartfeltNote} />
        <MarketingBanner />
        <DeepReportSection
          form={form}
          deepReportState={deepReportState}
          onSubmit={submitDeepReport}
          onChange={setForm}
        />
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
        {axes.map((axis) => (
          <div key={axis.id} className="rounded-xl border border-white/15 bg-white/10 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">{axis.label}</span>
              <span className="font-semibold text-amber-300">
                {axis.winner === 'left' ? axis.leftScore : axis.rightScore}%
              </span>
            </div>
            <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-black/25">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                style={{ width: `${axis.winner === 'left' ? axis.leftScore : axis.rightScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>
                {axis.leftLabel} ({axis.leftScore}%)
              </span>
              <span>
                {axis.rightLabel} ({axis.rightScore}%)
              </span>
            </div>
          </div>
        ))}
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

function MarketingBanner() {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-base font-bold text-amber-200">联合出品</h2>
      <div className="space-y-3">
        <div className="rounded-xl border border-white/15 bg-white/10 p-3">
          <a
            href="https://wings-ai.net"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-amber-300 underline underline-offset-2"
          >
            奇迹自习室（wings-ai.net）
          </a>
          <p className="mt-1 text-xs text-slate-300">
            辅助记忆考研知识点，可视化管理你的自习进度
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/20 bg-black/25 text-[11px] text-slate-200">
              二维码
            </div>
            <div>
              <p className="text-xs text-slate-300">扫码关注公众号</p>
              <p className="mt-0.5 text-sm font-semibold text-white">奇迹飞鸟</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/10 p-3">
          <a
            href="https://h5.yanbot.tech"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-amber-300 underline underline-offset-2"
          >
            研Bot（h5.yanbot.tech）
          </a>
          <p className="mt-1 text-xs text-slate-300">全网最硬核的考研院校大数据平台</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/20 bg-black/25 text-[11px] text-slate-200">
              二维码
            </div>
            <div>
              <p className="text-xs text-slate-300">扫码关注公众号</p>
              <p className="mt-0.5 text-sm font-semibold text-white">研Bot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DeepReportSection({
  form,
  deepReportState,
  onSubmit,
  onChange,
}: {
  form: { undergraduateSchool: string; targetMajor: string; stage: string }
  deepReportState: DeepReportState
  onSubmit: (event: React.FormEvent) => void
  onChange: (value: { undergraduateSchool: string; targetMajor: string; stage: string }) => void
}) {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      {deepReportState === 'form' && (
        <>
          <h2 className="mb-3 text-base font-bold text-amber-200">
            获取专属考研建议
          </h2>
          <form className="space-y-2.5" onSubmit={onSubmit}>
            <input
              value={form.undergraduateSchool}
              onChange={(event) =>
                onChange({ ...form, undergraduateSchool: event.target.value })
              }
              placeholder="本科院校"
              className="w-full rounded-xl border border-slate-500/40 bg-slate-700/60 px-3 py-2.5 text-sm placeholder:text-slate-300"
            />
            <input
              value={form.targetMajor}
              onChange={(event) => onChange({ ...form, targetMajor: event.target.value })}
              placeholder="目标专业代码/名称"
              className="w-full rounded-xl border border-slate-500/40 bg-slate-700/60 px-3 py-2.5 text-sm placeholder:text-slate-300"
            />
            <input
              value={form.stage}
              onChange={(event) => onChange({ ...form, stage: event.target.value })}
              placeholder="目前复习阶段"
              className="w-full rounded-xl border border-slate-500/40 bg-slate-700/60 px-3 py-2.5 text-sm placeholder:text-slate-300"
            />
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(245,158,11,0.35)]"
            >
              一键生成评估结果（免费）
            </button>
          </form>
        </>
      )}

      {deepReportState === 'loading' && (
        <div className="flex min-h-[190px] flex-col items-center justify-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-500" />
          <p className="text-sm font-semibold text-amber-200">研Bot 大数据检索中...</p>
        </div>
      )}

      {deepReportState === 'success' && (
        <div className="space-y-2 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
          <h3 className="text-sm font-bold text-amber-200">AI 报考评估报告</h3>
          <p className="text-sm text-slate-100">💡 推荐冲刺院校：电子科技大学 (985)</p>
          <p className="text-sm text-slate-100">📊 往年复试线：345分 / 录取均分: 362分</p>
          <p className="text-sm text-slate-100">📈 最新报录比：1 : 12 (竞争极度激烈)</p>
          <p className="text-sm leading-relaxed text-slate-200">
            ⚠️ 研Bot 诊断：你的 TSLO 卷王基因非常契合该专业的理论深度，但建议重点提升专业课二的
            实战项目经验，难度评级：⭐⭐⭐⭐
          </p>
        </div>
      )}
    </section>
  )
}
