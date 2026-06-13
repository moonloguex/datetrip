"use client"

// 홈 지도에서 코스 선택 시 좌하단에 떠오르는 미리보기 카드.
// "자세히 보기" 클릭 시 /trips/[slug]로 이동 (slug 없으면 id fallback).

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCourseColor } from "@/lib/courseColors"

type Trip = {
  id: string
  slug: string | null
  title: string
  description: string | null
  region: string | null
  likeCount: number
  places: Array<unknown>
  author: {
    nickname: string | null
  }
}

type Props = {
  trip: Trip
  onClose: () => void
}

export function TripPreviewCard({ trip, onClose }: Readonly<Props>) {
  const color = getCourseColor(trip.id)

  return (
    <div className="w-full rounded-t-2xl border-t sm:w-80 sm:rounded-xl sm:border bg-background/95 shadow-lg backdrop-blur-sm pb-[env(safe-area-inset-bottom)] sm:pb-0">
      {/* 그랩 핸들 (모바일 전용) */}
      <div className="sm:hidden mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-muted" aria-hidden />
      <div className="flex items-start gap-3 p-4">
        <div
          className="mt-1.5 h-3 w-3 shrink-0 rounded-sm"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold">{trip.title}</h3>
          <p className="text-xs text-muted-foreground">
            by {trip.author.nickname ?? "익명"}
            {trip.region && ` · ${trip.region}`}
            {` · ${trip.places.length}개 장소`}
          </p>
          {trip.description && (
            <p className="line-clamp-2 pt-1 text-sm text-muted-foreground">
              {trip.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 flex items-center justify-center -m-1 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
      <div className="border-t p-3">
        <Button
          render={<Link href={`/trips/${trip.slug ?? trip.id}`} />}
          nativeButton={false}
          size="sm"
          className="w-full min-h-11 sm:min-h-0"
        >
          자세히 보기
        </Button>
      </div>
    </div>
  )
}
