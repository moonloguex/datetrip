"use client"

import { useRef, useState } from "react"
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
import { toast } from "sonner"
import type { DraftPlace } from "@/types/place"

type Props = {
  places: DraftPlace[]
  onReorder: (newOrder: DraftPlace[]) => void
  onRemove: (kakaoPlaceId: string) => void
  onMemoChange: (kakaoPlaceId: string, memo: string) => void
  onImageChange: (kakaoPlaceId: string, imageUrl: string | null) => void
}

export function DraftPlaceList({
  places,
  onReorder,
  onRemove,
  onMemoChange,
  onImageChange,
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
              onImageChange={onImageChange}
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
  onImageChange,
}: {
  place: DraftPlace
  order: number
  onRemove: (id: string) => void
  onMemoChange: (id: string, memo: string) => void
  onImageChange: (id: string, imageUrl: string | null) => void
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
  const [imageOpen, setImageOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentImage = localPreview ?? place.imageUrl ?? null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있어요")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("5MB 이하 파일만 업로드할 수 있어요")
      return
    }

    const preview = URL.createObjectURL(file)
    setLocalPreview(preview)
    setImageOpen(true)
    setIsUploading(true)

    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "업로드에 실패했어요")
      }
      const { url } = await res.json()
      onImageChange(place.kakaoPlaceId, url)
      setLocalPreview(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드에 실패했어요")
      setLocalPreview(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleDeleteImage() {
    setLocalPreview(null)
    onImageChange(place.kakaoPlaceId, null)
    setImageOpen(false)
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

        {/* 이미지 버튼: 이미지 있으면 썸네일, 없으면 아이콘 */}
        <button
          type="button"
          onClick={() => {
            if (!currentImage) {
              fileInputRef.current?.click()
            } else {
              setImageOpen((v) => !v)
            }
          }}
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          title={currentImage ? "사진 관리" : "사진 추가"}
        >
          {currentImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImage}
              alt=""
              className="h-6 w-6 rounded object-cover"
            />
          ) : (
            <span className="text-xs">📷</span>
          )}
        </button>

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

      {/* 이미지 섹션 */}
      {imageOpen && (
        <div className="border-t p-3">
          {currentImage ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt="장소 사진"
                className="h-16 w-16 rounded-md object-cover shrink-0"
              />
              <div className="flex flex-col gap-1">
                {isUploading && (
                  <span className="text-xs text-muted-foreground">업로드 중…</span>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 disabled:opacity-50"
                  >
                    교체
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={isUploading}
                    className="text-xs text-destructive hover:text-destructive/80 underline underline-offset-2 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full rounded-md border border-dashed py-4 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isUploading ? "업로드 중…" : "사진 선택"}
            </button>
          )}
        </div>
      )}

      {/* 항상 마운트 — imageOpen 여부와 무관하게 ref가 연결돼야 함 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 메모 섹션 */}
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
