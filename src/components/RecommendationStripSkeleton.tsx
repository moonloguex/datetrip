// floating strip의 Suspense fallback.

export function RecommendationStripSkeleton() {
  return (
    <div className="px-4 pointer-events-none">
      <div className="h-5 w-24 bg-white/80 backdrop-blur rounded-full mb-2 animate-pulse" />
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[280px] h-[80px] bg-white/85 backdrop-blur rounded-xl flex-shrink-0 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
