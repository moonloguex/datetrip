// 6단계에서 카카오맵으로 교체될 자리.
// 지금은 "여기에 지도가 들어갑니다" 상태를 명확히 보여주는 회색 박스.
//
// h-[calc(100vh-12rem)]: 헤더(64px) + 필터바 + 패딩을 제외한 나머지 뷰포트 높이.

export function MapPlaceholder() {
  return (
    <div className="flex h-[calc(100vh-12rem)] items-center justify-center rounded-lg border border-dashed bg-muted/30">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          지도가 여기에 표시됩니다
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          (다음 단계에서 카카오맵 연동 예정)
        </p>
      </div>
    </div>
  )
}
