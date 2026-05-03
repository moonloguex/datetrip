import { Button } from "@/components/ui/button"
import type { DraftPlace } from "@/types/place"

type Props = Readonly<{
  places: DraftPlace[]
  onRemove: (kakaoId: string) => void
}>

export function DraftPlaceList({ places, onRemove }: Props) {
  if (places.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        검색 후 장소를 추가하세요
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-1">
      {places.map((place, index) => (
        <li
          key={place.kakaoId}
          className="flex items-center gap-3 rounded-md border bg-background px-3 py-2"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{place.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {place.roadAddress || place.address}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemove(place.kakaoId)}
            aria-label={`${place.name} 삭제`}
          >
            ✕
          </Button>
        </li>
      ))}
    </ol>
  )
}
