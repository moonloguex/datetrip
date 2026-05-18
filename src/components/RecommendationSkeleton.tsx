// 추천 섹션 로딩 스켈레톤. Suspense fallback으로 사용.

export function RecommendationSkeleton() {
  return (
    <section className="py-6 px-4">
      <header className="mb-4">
        <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        <div className="h-4 w-44 bg-muted rounded mt-1.5 animate-pulse" />
      </header>
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[80vw] max-w-[320px] flex-shrink-0 h-36 bg-muted rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </section>
  )
}
