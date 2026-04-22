type PosterErrorToastProps = {
  open: boolean
  message: string
  loading?: boolean
  onRetry: () => void
  onClose: () => void
}

export default function PosterErrorToast({
  open,
  message,
  loading = false,
  onRetry,
  onClose,
}: PosterErrorToastProps) {
  if (!open) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9998] flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-amber-200/40 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-amber-200">海报生成失败</p>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-slate-200"
          >
            关闭
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-300">{message}</p>
        <button
          onClick={onRetry}
          disabled={loading}
          className="w-full rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-300 to-amber-500 py-2.5 text-sm font-bold text-slate-900 disabled:opacity-60"
        >
          {loading ? '重试中...' : '重新生成海报'}
        </button>
      </div>
    </div>
  )
}
