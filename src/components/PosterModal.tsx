type PosterModalProps = {
  open: boolean
  imageUrl: string
  onClose: () => void
}

export default function PosterModal({ open, imageUrl, onClose }: PosterModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-amber-200/40 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100"
        >
          关闭
        </button>
        <p className="mb-3 pr-14 text-sm font-semibold text-amber-200">
          💡 图片已生成，请长按保存图片，手动分享到朋友圈
        </p>
        <img
          src={imageUrl}
          alt="测试结果海报"
          className="max-h-[70vh] w-full rounded-2xl border border-white/20 object-contain"
        />
      </div>
    </div>
  )
}
