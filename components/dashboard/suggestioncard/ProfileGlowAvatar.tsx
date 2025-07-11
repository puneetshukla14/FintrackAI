export default function NeonAvatar({ initial }: { initial: string }) {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse blur-sm"></div>
      <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center bg-zinc-900 border border-white/10 text-white font-semibold text-sm uppercase shadow-lg">
        {initial}
      </div>
    </div>
  )
}
