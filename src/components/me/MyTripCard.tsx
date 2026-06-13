import Link from "next/link"
import { Globe, Heart, Lock, MapPin } from "lucide-react"
import type { MyTripCardData } from "@/lib/trips"

type Props = {
  trip: MyTripCardData
}

export function MyTripCard({ trip }: Props) {
  return (
    <Link
      href={`/trips/${trip.slug ?? trip.id}`}
      className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate font-medium">{trip.title}</h3>
        <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs text-muted-foreground">
          {trip.isPublic ? (
            <>
              <Globe className="size-3" />
              공개
            </>
          ) : (
            <>
              <Lock className="size-3" />
              비공개
            </>
          )}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {trip.region ?? "지역 미정"} · 장소 {trip.placeCount}개
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3.5" />
          {trip.likeCount}
        </span>
      </div>
    </Link>
  )
}
