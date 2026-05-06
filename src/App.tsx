import { motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { toPng, toSvg } from 'html-to-image'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import DeveloperIpCard from './components/DeveloperIpCard'
import PosterErrorToast from './components/PosterErrorToast'
import PosterModal from './components/PosterModal'
import ResultPage from './components/ResultPage'
import { questions } from './data/questions'
import { resultMap } from './data/results'

type Stage = 'landing' | 'testing' | 'gate' | 'result'
type AnswerChoice = 'left' | 'right' | null
type AxisDatum = {
  id: string
  label: string
  leftLabel: string
  rightLabel: string
  leftScore: number
  rightScore: number
  winner: 'left' | 'right'
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
  1: '/Q20/scene-q1.png',
  2: '/Q20/scene-q2.png',
  3: '/Q20/scene-q3.png',
  4: '/Q20/scene-q4.png',
  5: '/Q20/scene-q5.png',
  6: '/Q20/scene-q6.png',
  7: '/Q20/scene-q7.png',
  8: '/Q20/scene-q8.png',
  9: '/Q20/scene-q9.png',
  10: '/Q20/scene-q10.png',
  11: '/Q20/scene-q11.png',
  12: '/Q20/scene-q12.png',
  13: '/Q20/scene-q13.png',
  14: '/Q20/scene-q14.png',
  15: '/Q20/scene-q15.png',
  16: '/Q20/scene-q16.png',
  17: '/Q20/scene-q17.png',
  18: '/Q20/scene-q18.png',
  19: '/Q20/scene-q19.png',
  20: '/Q20/scene-q20.png',
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

const resolveAssetUrl = (path: string | undefined): string => {
  if (!path) return ''
  return encodeURI(path)
}

function App() {
  const [stage, setStage] = useState<Stage>('testing')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerChoice[]>(
    Array.from({ length: questions.length }, () => null),
  )
  const [cardDirection, setCardDirection] = useState<'forward' | 'backward'>('forward')
  const [prediction] = useState<Prediction>(defaultPrediction)
  const [posterLoading, setPosterLoading] = useState(false)
  const [posterImageUrl, setPosterImageUrl] = useState('')
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [posterErrorOpen, setPosterErrorOpen] = useState(false)
  const [posterErrorMessage, setPosterErrorMessage] = useState('')
  const [swipeCommand, setSwipeCommand] = useState<'left' | 'right' | null>(null)
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

  const geneAxes = useMemo<AxisDatum[]>(() => {
    const axisConfigs = [
      {
        id: 'input',
        dimension: 'Input',
        label: '输入轴 Input',
        leftLabel: '理论 T',
        rightLabel: '实践 P',
      },
      {
        id: 'motivation',
        dimension: 'Motivation',
        label: '动机轴 Motivation',
        leftLabel: '求稳 S',
        rightLabel: '冒险 R',
      },
      {
        id: 'network',
        dimension: 'Energy',
        label: '社交轴 Network',
        leftLabel: '独狼 L',
        rightLabel: '抱团 G',
      },
      {
        id: 'behavior',
        dimension: 'Pacing',
        label: '执行轴 Behavior',
        leftLabel: '秩序 O',
        rightLabel: '混沌 C',
      },
    ] as const

    return axisConfigs.map((axis) => {
      const ids = questions
        .filter((question) => question.dimension === axis.dimension)
        .map((question) => question.id - 1)
      const total = ids.length || 1
      const leftCount = ids.reduce((count, idx) => count + (answers[idx] === 'left' ? 1 : 0), 0)
      const rightCount = ids.reduce((count, idx) => count + (answers[idx] === 'right' ? 1 : 0), 0)
      const leftScore = Math.round((leftCount / total) * 100)
      const rightScore = Math.round((rightCount / total) * 100)
      return {
        id: axis.id,
        label: axis.label,
        leftLabel: axis.leftLabel,
        rightLabel: axis.rightLabel,
        leftScore,
        rightScore,
        winner: leftScore >= rightScore ? 'left' : 'right',
      }
    })
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
    <main className="relative mx-auto min-h-screen w-full max-w-md overflow-x-hidden bg-[url('/background.png')] bg-cover bg-center px-4 py-6 text-slate-100">
      <div className="relative z-10">
      {stage === 'testing' && current && (
        <section className="flex h-[calc(100svh-3rem)] max-h-[calc(100dvh-3rem)] flex-col gap-2 overflow-hidden pb-0">
          <div className="shrink-0 rounded-2xl border border-white/30 bg-white/10 p-3 shadow-xl backdrop-blur-xl">
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
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-1">
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
          <DeveloperIpCard />
        </section>
      )}

      {stage === 'gate' && (
        <ResultPage resultCode={imepCode} axes={geneAxes} />
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
      className="relative h-[430px] max-h-[calc(100svh-17rem)] min-h-[260px] w-full max-w-[360px] rounded-3xl border border-white/30 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
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
