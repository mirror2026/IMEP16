/** 「联合出品」区块：由答题页与 gate 结果页共用 */
export default function JointProduction() {
  return (
    <section
      id="joint-production"
      className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md"
    >
      <p className="mb-1.5 text-xs font-bold text-amber-200">联合出品</p>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_120px] items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-2">
          <div>
            <a
              href="https://wings-ai.net"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-semibold text-amber-300 underline underline-offset-2"
            >
              奇迹自习室（wings-ai.net）
            </a>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-300">
              辅助知识点记忆，管理自学进度
            </p>
          </div>
          <div className="flex items-center justify-start gap-1.5">
            <img
              src="/奇迹飞鸟头像.png"
              alt="奇迹飞鸟"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <div className="flex h-11 max-w-[72px] flex-col justify-center gap-0.5 text-white">
              <span className="text-[10px] leading-none text-slate-300">抖音/小红书🔍</span>
              <span className="text-[11px] leading-none font-bold">奇迹飞鸟</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_120px] items-center gap-2 rounded-lg border border-white/15 bg-white/10 p-2">
          <div>
            <a
              href="https://h5.yanbot.tech"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-semibold text-amber-300 underline underline-offset-2"
            >
              研Bot（h5.yanbot.tech）
            </a>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-300">全网最硬核的考研院校大数据平台</p>
          </div>
          <div className="flex items-center justify-start gap-1.5">
            <img
              src="/研bot公众号.jpg"
              alt="研Bot 微信公众号"
              className="h-11 w-11 shrink-0 rounded-md border border-white/20 bg-black/25 object-contain"
            />
            <div className="flex h-11 max-w-[72px] flex-col justify-center gap-0.5 text-white">
              <span className="text-[10px] leading-none text-slate-300">微信公众号🔍</span>
              <span className="text-[11px] leading-none font-bold">研Bot</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
