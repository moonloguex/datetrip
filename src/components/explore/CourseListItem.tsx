"use client"

import { useState } from "react"
import Image from "next/image"
import { getCourseColor } from "@/lib/courseColors"

export type ListTrip = {
  id: string
  slug: string | null
  title: string
  region: string | null
  tags: string[]
  places: Array<{ name: string; imageUrl: string | null }>
}

type Props = {
  trip: ListTrip
  isSelected: boolean
  onSelect: (id: string) => void
  onDetail: (id: string) => void
}

export function CourseListItem({ trip, isSelected, onSelect, onDetail }: Props) {
  const color = getCourseColor(trip.id)
  const thumbnailUrl = trip.places[0]?.imageUrl ?? null
  const [imgError, setImgError] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      data-trip-id={trip.id}
      onClick={() => onSelect(trip.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(trip.id)
        }
      }}
      className={`group flex items-stretch gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
        isSelected ? "bg-accent/60" : "hover:bg-accent/30 active:bg-accent/50"
      }`}
    >
      {/* 썸네일 */}
      <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-md self-start mt-0.5">
        {thumbnailUrl && !imgError ? (
          <Image
            src={thumbnailUrl}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="60px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {trip.places.length}곳
          </div>
        )}
      </div>

      {/* 텍스트 + 자세히 보기 */}
      <div className="min-w-0 flex-1 flex flex-col gap-1 py-0.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
            <p className="font-medium text-sm leading-tight line-clamp-1">{trip.title}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {[trip.region, `${trip.places.length}곳`].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* 태그 */}
        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trip.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground leading-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 자세히 보기 — 선택됐을 때만 표시 */}
        {isSelected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDetail(trip.id)
            }}
            className="mt-1 self-start flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background hover:opacity-80 transition-opacity animate-reveal-up"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
            자세히 보기
          </button>
        )}
      </div>
    </div>
  )
}
