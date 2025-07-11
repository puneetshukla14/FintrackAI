export default function GradientLoader() {
  return (
    <div className="w-full flex justify-center items-center space-x-2">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-ping"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}
