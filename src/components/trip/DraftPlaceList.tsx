"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { DraftPlace } from "@/types/place"

type Props = {
  places: DraftPlace[]
  onReorder: (newOrder: DraftPlace[]) => void
  onRemove: (kakaoPlaceId: string) => void
  onMemoChange: (kakaoPlaceId: string, memo: string) => void
}

export function DraftPlaceList({
  places,
  onReorder,
  onRemove,
  onMemoChange,
}: Props) {
  // PointerSensor: 8px 이상 움직여야 드래그 시작 (실수 방지)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = places.findIndex((p) => p.kakaoPlaceId === active.id)
    const newIndex = places.findIndex((p) => p.kakaoPlaceId === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = [...places]
    const [moved] = newOrder.splice(oldIndex, 1)
    newOrder.splice(newIndex, 0, moved)
    onReorder(newOrder)
  }

  if (places.length === 0) {
    return (
      <div className="rounded-md border border-dashed py-8 text-center">
        <p className="text-sm text-muted-foreground">
          위에서 장소를 검색해 추가해보세요
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={places.map((p) => p.kakaoPlaceId)}
        strategy={verticalListSortingStrategy}
      >
        <ol className="space-y-2">
          {places.map((place, idx) => (
            <SortablePlaceItem
              key={place.kakaoPlaceId}
              place={place}
              order={idx + 1}
              onRemove={onRemove}
              onMemoChange={onMemoChange}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}

function SortablePlaceItem({
  place,
  order,
  onRemove,
  onMemoChange,
}: {
  place: DraftPlace
  order: number
  onRemove: (id: string) => void
  onMemoChange: (id: string, memo: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.kakaoPlaceId })

  const [memoOpen, setMemoOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="rounded-md border bg-background">
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="순서 변경"
        >
          ⋮⋮
        </button>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {order}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{place.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {place.roadAddress || place.address}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMemoOpen((v) => !v)}
          className="shrink-0 rounded p-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          title={memoOpen ? "메모 닫기" : "메모 추가"}
        >
          {place.memo ? "📝" : "+ 메모"}
        </button>

        <button
          type="button"
          onClick={() => onRemove(place.kakaoPlaceId)}
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="장소 삭제"
        >
          ✕
        </button>
      </div>

      {memoOpen && (
        <div className="border-t p-3">
          <textarea
            value={place.memo}
            onChange={(e) => onMemoChange(place.kakaoPlaceId, e.target.value)}
            placeholder="이 장소의 추천 포인트를 적어보세요"
            maxLength={150}
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      )}
    </li>
  )
}
