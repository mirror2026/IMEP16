/** 答题页底部「个人 IP 开发者名片」（结果页仍使用 JointProduction） */
export default function DeveloperIpCard() {
  return (
    <div className="z-10 mx-auto mt-auto mb-6 flex w-full max-w-[360px] flex-col">
      <div className="mb-2 ml-2 mt-5 text-[11px] tracking-widest text-white/70">✦ 创作者介绍</div>
      <div className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
        <img
          src="/奇迹飞鸟头像.png"
          alt="奇迹飞鸟"
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-bold text-white">奇迹飞鸟</span>
            <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-medium text-white">
              抖音/小红书/B站🔍
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] text-white/90">
              #清华硕士
            </span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] text-white/90">
              #独立开发者
            </span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] text-white/90">
              #AI 探索中
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/60">
            真诚地分享 我所能分享的一切
          </p>
        </div>
      </div>
    </div>
  )
}
