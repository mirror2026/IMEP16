import { motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { toPng, toSvg } from 'html-to-image'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import PosterErrorToast from './components/PosterErrorToast'
import PosterModal from './components/PosterModal'
import { questions } from './data/questions'
import { resultMap } from './data/results'

type Stage = 'landing' | 'testing' | 'gate' | 'result'
type AnswerChoice = 'left' | 'right' | null
type LeadForm = {
  schoolTier: string
  major: string
  targetRegion: string
  targetProgram: string
}
type Prediction = {
  admissionRate: number
  schools: string[]
  warning: string
}

const defaultPrediction: Prediction = {
  admissionRate: 58,
  schools: ['华东师范大学', '华南师范大学', '暨南大学'],
  warning: '该方向近三年竞争持续升温，建议尽早锁定核心题型与复习节奏。',
}

const qrSrc =
  'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://example.com/study-room'

const questionImageMap: Record<number, string> = {
  1: '/Q20/心动场景-1776864035563.png',
  2: '/Q20/宿舍求生-1776864049480.png',
  3: '/Q20/吃瓜法则-1776864061295.png',
  4: '/Q20/报错场景-1776864068525.png',
  5: '/Q20/选课博弈-1776864074381.png',
  6: '/Q20/海王陷阱-1776864088261.png',
  7: '/Q20/破产危机-1776864097591.png',
  8: '/Q20/违纪边缘-1776864103549.png',
  9: '/Q20/Offer抉择-1776864112983.png',
  10: '/Q20/研Bot预警-1776864118432.png',
  11: '/Q20/深夜茶话会-1776864128460.png',
  12: '/Q20/社团遁术-1776864140691.png',
  13: '/Q20/厕所搭子-1776864148427.png',
  14: '/Q20/饭点落单-1776864157611.png',
  15: '/Q20/小组作业-1776864166140.png',
  16: '/Q20/灵异物理学-1776864174956.png',
  17: '/Q20/兵荒马乱-1776864185496.png',
  18: '/Q20/玄学解压-1776864194042.png',
  19: '/Q20/立Flag-1776864201639.png',
  20: '/Q20/DDL玄学-1776864206860.png',
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

const resolveAssetUrl = (path: string | undefined): string => {
  if (!path) return ''
  return encodeURI(path)
}

function App() {
  const [stage, setStage] = useState<Stage>('landing')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerChoice[]>(
    Array.from({ length: questions.length }, () => null),
  )
  const [cardDirection, setCardDirection] = useState<'forward' | 'backward'>('forward')
  const [form, setForm] = useState<LeadForm>({
    schoolTier: '',
    major: '',
    targetRegion: '',
    targetProgram: '',
  })
  const [prediction, setPrediction] = useState<Prediction>(defaultPrediction)
  const [submitting, setSubmitting] = useState(false)
  const [posterLoading, setPosterLoading] = useState(false)
  const [posterImageUrl, setPosterImageUrl] = useState('')
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [posterErrorOpen, setPosterErrorOpen] = useState(false)
  const [posterErrorMessage, setPosterErrorMessage] = useState('')
  const [swipeCommand, setSwipeCommand] = useState<'left' | 'right' | null>(null)
  const [swipeButtonLocked, setSwipeButtonLocked] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const current = questions[index]
  const currentAnswer = answers[index]

  const imepCode = useMemo(() => {
    const score = { T: 0, P: 0, S: 0, R: 0, L: 0, G: 0, O: 0, C: 0 }
    answers.forEach((choice, i) => {
      if (!choice) return
      const question = questions[i]
      if (!question) return
      const letter = (choice === 'left' ? question.pair.left : question.pair.right) as keyof typeof score
      score[letter] += 1
    })
    const input = score.T >= score.P ? 'T' : 'P'
    const motivation = score.S >= score.R ? 'S' : 'R'
    const energy = score.L >= score.G ? 'L' : 'G'
    const pacing = score.O >= score.C ? 'O' : 'C'
    return `${input}${motivation}${energy}${pacing}`
  }, [answers])

  const result = resultMap[imepCode] ?? resultMap.TSLO
  const progress = Math.round((index / questions.length) * 100)
  const currentQuestionImage = current ? resolveAssetUrl(questionImageMap[current.id]) : ''
  const currentResultImage = resolveAssetUrl(resultImageMap[imepCode])

  const recordAnswer = (isLeft: boolean) => {
    if (!current) return
    playSwipeFeedback(audioContextRef)
    navigator.vibrate?.(20)
    const choice: AnswerChoice = isLeft ? 'left' : 'right'
    setCardDirection('forward')
    setAnswers((prev) => {
      const nextAnswers = [...prev]
      nextAnswers[index] = choice
      return nextAnswers
    })
    const next = index + 1
    if (next >= questions.length) {
      setStage('gate')
      return
    }
    setIndex(next)
  }

  const handleUndo = () => {
    if (index === 0) return
    setCardDirection('backward')
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    const preload = [qrSrc, ...Object.values(questionImageMap), ...Object.values(resultImageMap)]
    preload.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.schoolTier || !form.major || !form.targetRegion) return
    setSubmitting(true)
    try {
      const payload = {
        imepResult: imepCode,
        form,
      }
      const response = await fetch('/api/yanbot/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('API unavailable')
      const data = (await response.json()) as Prediction
      if (data?.schools?.length === 3) {
        setPrediction(data)
      }
    } catch {
      const base = form.schoolTier === '985' ? 70 : form.schoolTier === '211' ? 62 : 52
      setPrediction({
        admissionRate: Math.min(base + (imepCode.includes('O') ? 6 : 1), 83),
        schools:
          form.targetRegion === '北上广深'
            ? ['华东理工大学', '深圳大学', '上海大学']
            : form.targetRegion === '江浙沪'
              ? ['苏州大学', '宁波大学', '浙江工业大学']
              : ['南昌大学', '广西大学', '云南大学'],
        warning: '目标专业复试波动较大，请提前准备跨科目综合题并预留调剂策略。',
      })
    } finally {
      setSubmitting(false)
      setStage('result')
    }
  }

  const generatePoster = async () => {
    if (!posterRef.current) return
    if (posterLoading) return

    setPosterLoading(true)
    setPosterErrorOpen(false)
    try {
      const node = posterRef.current

      await waitForRenderReady()
      // iOS/微信下先执行一次 SVG 预热，降低黑屏概率。
      await toSvg(node, buildCaptureOptions(2))

      let pngDataUrl = ''
      const pixelRatios = [3, 2, 2]
      for (let i = 0; i < pixelRatios.length; i += 1) {
        try {
          pngDataUrl = await toPng(node, buildCaptureOptions(pixelRatios[i]))
          if (pngDataUrl) break
        } catch {
          await sleep(180)
        }
      }

      if (!pngDataUrl) {
        throw new Error('poster_generation_failed')
      }

      setPosterImageUrl(pngDataUrl)
      setPosterModalOpen(true)
    } catch (error) {
      console.error('海报生成失败', error)
      setPosterErrorMessage('当前网络或渲染环境不稳定，请点击重试。若仍失败，可稍后再次尝试。')
      setPosterErrorOpen(true)
    } finally {
      setPosterLoading(false)
    }
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-[url('/background.png')] bg-cover bg-center px-4 py-6 text-slate-100">
      <div className="relative z-10">
      {stage === 'landing' && (
        <section className="flex min-h-[85vh] flex-col justify-between rounded-3xl border border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur-md">
              <span className="font-semibold text-amber-200">奇迹自习室</span>
              <span className="text-slate-300">x</span>
              <span className="font-semibold text-amber-100">研Bot</span>
            </div>
            <h1 className="text-3xl font-black leading-tight">
              IMEP 大学生性格划卡测试
            </h1>
            <p className="text-sm text-slate-300">
              20 道二选一场景题，3 分钟解锁你的考研基因与上岸预测。
            </p>
          </div>
          <button
            className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-300 to-amber-500 px-5 py-4 text-base font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.45)] transition active:scale-95"
            onClick={() => setStage('testing')}
          >
            开始划卡测试
          </button>
        </section>
      )}

      {stage === 'testing' && current && (
        <section className="flex min-h-[calc(100vh-3rem)] flex-col gap-4">
          <div className="rounded-2xl border border-white/30 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={index === 0}
                  className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-slate-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ↶ 回撤
                </button>
                <span>
                  第 {index + 1} / {questions.length} 题
                </span>
              </div>
              <span className="font-semibold text-amber-100">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/35">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex flex-1 items-start justify-center pt-20">
            <SwipeCard
              key={current.id}
              question={current}
              questionImageSrc={currentQuestionImage}
              selectedAnswer={currentAnswer}
              cardDirection={cardDirection}
              swipeCommand={swipeCommand}
              onSwipeCommandConsumed={() => setSwipeCommand(null)}
              onAnswer={recordAnswer}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (swipeButtonLocked) return
                setSwipeButtonLocked(true)
                setSwipeCommand('left')
                setTimeout(() => setSwipeButtonLocked(false), 320)
              }}
              disabled={swipeButtonLocked}
              className="rounded-2xl border border-white/30 bg-white/10 p-3 text-sm backdrop-blur-md transition-opacity disabled:opacity-65"
            >
              左划选 A
            </button>
            <button
              onClick={() => {
                if (swipeButtonLocked) return
                setSwipeButtonLocked(true)
                setSwipeCommand('right')
                setTimeout(() => setSwipeButtonLocked(false), 320)
              }}
              disabled={swipeButtonLocked}
              className="rounded-2xl border border-white/30 bg-white/10 p-3 text-sm backdrop-blur-md transition-opacity disabled:opacity-65"
            >
              右划选 B
            </button>
          </div>
        </section>
      )}

      {stage === 'gate' && (
        <section className="space-y-4 rounded-3xl border border-white/30 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200">初步结论</p>
          <h2 className="text-2xl font-bold text-amber-100">{imepCode}</h2>
          {currentResultImage ? (
            <img
              src={currentResultImage}
              alt={`${imepCode} 类型示意图`}
              className="mx-auto h-52 w-52 rounded-2xl border border-white/20 object-cover object-center shadow-xl"
            />
          ) : (
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-xs text-slate-300">
              暂无对应结果示意图
            </div>
          )}
          <p className="text-lg font-semibold">{result.title}</p>
          <p className="text-sm text-slate-300">{result.description}</p>
          <div className="rounded-2xl border border-amber-200/50 bg-amber-300/15 p-4 text-sm text-amber-50">
            填写你的战斗参数，解锁研Bot专属【考研生死预测】
          </div>
          <form onSubmit={submitLead} className="space-y-3">
            <select
              required
              value={form.schoolTier}
              onChange={(e) => setForm({ ...form, schoolTier: e.target.value })}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm backdrop-blur-md"
            >
              <option value="">本科院校档次（必填）</option>
              <option value="985">985</option>
              <option value="211">211</option>
              <option value="双非">双非</option>
            </select>
            <input
              required
              value={form.major}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
              placeholder="目前就读专业（必填）"
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm backdrop-blur-md placeholder:text-slate-300"
            />
            <select
              required
              value={form.targetRegion}
              onChange={(e) => setForm({ ...form, targetRegion: e.target.value })}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm backdrop-blur-md"
            >
              <option value="">意向考研地区（必填）</option>
              <option value="北上广深">北上广深</option>
              <option value="江浙沪">江浙沪</option>
              <option value="其他不限">其他不限</option>
            </select>
            <input
              value={form.targetProgram}
              onChange={(e) => setForm({ ...form, targetProgram: e.target.value })}
              placeholder="目标院校/专业（选填）"
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm backdrop-blur-md placeholder:text-slate-300"
            />
            <button
              disabled={submitting}
              className="w-full rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-300 to-amber-500 py-3 font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.4)] disabled:opacity-60"
            >
              {submitting ? '正在解锁预测...' : '解锁完整结果'}
            </button>
          </form>
        </section>
      )}

      {stage === 'result' && (
        <section className="space-y-4">
          <div
            ref={posterRef}
            className="overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className="border-b border-white/20 p-4">
              <p className="text-xs text-slate-400">我的 IMEP 基因是：</p>
              <p className="text-xl font-black text-amber-100">
                {imepCode} | {result.title}
              </p>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                {currentResultImage ? (
                  <img
                    src={currentResultImage}
                    alt={`${imepCode} 类型示意图`}
                    className="mb-3 h-44 w-full rounded-2xl object-cover object-center"
                  />
                ) : (
                  <div className="mb-3 flex h-44 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-xs text-slate-300">
                    暂无对应结果示意图
                  </div>
                )}
                <p className="font-semibold">{result.animal}</p>
                <p className="text-xs text-slate-300">{result.mbtiGuess}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-slate-200 backdrop-blur-md">
                胜算预测：由于你是典型的 {imepCode}，研Bot 预测综合上岸率约为{' '}
                <span className="font-bold text-amber-100">{prediction.admissionRate}%</span>。
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur-md">
                <p className="mb-2 font-semibold text-amber-100">院校雷达</p>
                <p>{prediction.schools.join(' / ')}</p>
                <p className="mt-3 text-xs text-rose-200">避雷警告：{prediction.warning}</p>
              </div>
              <div className="rounded-2xl border border-amber-200/30 bg-amber-300/10 p-4 text-sm backdrop-blur-md">
                <p className="mb-2 font-semibold text-amber-100">💡 研Bot 走心夜话</p>
                <p className="whitespace-pre-line text-slate-200">{result.heartfeltNote}</p>
              </div>
              <div className="grid grid-cols-[1fr_88px] gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <div>
                  <p className="mb-1 text-sm font-bold text-amber-100">
                    告别低效感动，建立你的考研外脑
                  </p>
                  <p className="text-xs text-slate-300">{result.studyRoomCta}</p>
                </div>
                <img src={qrSrc} alt="奇迹自习室二维码" className="h-[88px] w-[88px] rounded-lg" />
              </div>
            </div>
          </div>
          <button
            onClick={generatePoster}
            disabled={posterLoading}
            className="w-full rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-300 to-amber-500 py-3 font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.45)]"
          >
            {posterLoading ? '海报生成中...' : '生成并保存海报'}
          </button>
        </section>
      )}
      </div>
      <PosterModal
        open={posterModalOpen}
        imageUrl={posterImageUrl}
        onClose={() => setPosterModalOpen(false)}
      />
      <PosterErrorToast
        open={posterErrorOpen}
        message={posterErrorMessage}
        loading={posterLoading}
        onRetry={generatePoster}
        onClose={() => setPosterErrorOpen(false)}
      />
    </main>
  )
}

function SwipeCard({
  question,
  questionImageSrc,
  selectedAnswer,
  cardDirection,
  swipeCommand,
  onSwipeCommandConsumed,
  onAnswer,
}: {
  question: (typeof questions)[number]
  questionImageSrc: string
  selectedAnswer: AnswerChoice
  cardDirection: 'forward' | 'backward'
  swipeCommand: 'left' | 'right' | null
  onSwipeCommandConsumed: () => void
  onAnswer: (isLeft: boolean) => void
}) {
  const x = useMotionValue(0)
  const controls = useAnimationControls()
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const hintOpacity = useTransform(x, [-120, 0, 120], [1, 0, 1])
  const leftTagOpacity = useTransform(x, [-180, -70, 0], [1, 0.55, 0])
  const rightTagOpacity = useTransform(x, [0, 70, 180], [0, 0.55, 1])

  useEffect(() => {
    controls.set({ x: cardDirection === 'backward' ? -32 : 32, opacity: 0 })
    void controls.start({
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 280, damping: 24 },
    })
    x.set(0)
  }, [cardDirection, controls, question.id, x])

  useEffect(() => {
    if (!swipeCommand) return
    const distance = window.innerWidth + 240
    const targetX = swipeCommand === 'left' ? -distance : distance
    void controls.start({
      x: targetX,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    })
    onSwipeCommandConsumed()
    setTimeout(() => onAnswer(swipeCommand === 'left'), 0)
  }, [controls, onAnswer, onSwipeCommandConsumed, swipeCommand])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > 100) {
      void controls.start({
        x: window.innerWidth + 240,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      })
      setTimeout(() => onAnswer(false), 0)
      return
    }
    if (info.offset.x < -100) {
      void controls.start({
        x: -window.innerWidth - 240,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      })
      setTimeout(() => onAnswer(true), 0)
      return
    }
    void controls.start({
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    })
  }

  return (
    <motion.div
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      className="relative h-[430px] w-full max-w-[360px] rounded-3xl border border-white/30 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="absolute -top-14 left-1/2 flex h-36 w-36 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/15 p-2 shadow-xl backdrop-blur-xl">
        <img
          src={questionImageSrc}
          alt={`第 ${question.id} 题示意图`}
          className="h-full w-full rounded-full object-contain"
        />
      </div>
      <motion.div
        style={{ opacity: leftTagOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-xl border border-rose-200/60 bg-rose-300/20 px-3 py-1 text-xs font-bold tracking-wide text-rose-100"
      >
        👈 A
      </motion.div>
      <motion.div
        style={{ opacity: rightTagOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-xl border border-emerald-200/60 bg-emerald-300/20 px-3 py-1 text-xs font-bold tracking-wide text-emerald-100"
      >
        B 👉
      </motion.div>
      <p className="mb-4 mt-10 text-sm text-slate-300">{question.sceneTag}</p>
      <p className="mb-6 text-xl font-bold leading-relaxed">{question.prompt}</p>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/70 bg-amber-300/20 text-sm">
            👈
          </div>
          <div
            className={`flex-1 rounded-2xl p-3 text-sm ${
              selectedAnswer === 'left'
                ? 'border border-amber-500 bg-amber-500/20'
                : 'border border-white/15 bg-black/25'
            }`}
          >
            <span className="mb-1 block text-amber-100">A. {question.optionA}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 rounded-2xl p-3 text-sm ${
              selectedAnswer === 'right'
                ? 'border border-amber-500 bg-amber-500/20'
                : 'border border-white/15 bg-black/25'
            }`}
          >
            <span className="mb-1 block text-amber-100">B. {question.optionB}</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/70 bg-amber-300/20 text-sm">
            👉
          </div>
        </div>
      </div>
      <motion.p style={{ opacity: hintOpacity }} className="mt-5 text-center text-xs text-slate-400">
        轻滑卡片进行选择
      </motion.p>
    </motion.div>
  )
}

export default App

function playSwipeFeedback(audioContextRef: RefObject<AudioContext | null>) {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioCtx()
  }
  const context = audioContextRef.current
  if (context.state === 'suspended') {
    void context.resume()
  }
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(920, context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(220, context.currentTime + 0.12)
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.125)
}

function buildCaptureOptions(pixelRatio: number) {
  return {
    pixelRatio,
    cacheBust: true,
    backgroundColor: '#0b0f19',
    // 按需求保留 useCORS，部分 WebView 对该字段兼容处理更稳。
    useCORS: true,
  } as const
}

async function waitForRenderReady() {
  await sleep(180)
  if ('fonts' in document) {
    try {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready
    } catch {
      // ignore
    }
  }
  await sleep(120)
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
