"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlaceSearch } from "@/components/trip/PlaceSearch"
import { DraftPlaceList } from "@/components/trip/DraftPlaceList"
import { DraftCourseMap } from "@/components/trip/DraftCourseMap"
import { createTrip, updateTrip } from "@/app/actions/trips"
import type { DraftPlace, SearchedPlace } from "@/types/place"

// Discriminated union으로 mode별 props를 구분.
// TypeScript가 mode === "edit"일 때만 tripId/initial이 있다고 추론해줌.
type CreateProps = { mode: "create" }
type EditProps = {
  mode: "edit"
  tripId: string
  initial: InitialValues
}
type Props = CreateProps | EditProps

export type InitialValues = {
  title: string
  description: string
  region: string
  tags: string[]
  isPublic: boolean
  places: DraftPlace[]
}

export function TripBuilder(props: Props) {
  const router = useRouter()
  const [isSaving, startSaving] = useTransition()

  const initialValues: InitialValues =
    props.mode === "edit"
      ? props.initial
      : {
          title: "",
          description: "",
          region: "",
          tags: [],
          isPublic: true,
          places: [],
        }

  const [title, setTitle] = useState(initialValues.title)
  const [description, setDescription] = useState(initialValues.description)
  const [region, setRegion] = useState(initialValues.region)
  const [tags, setTags] = useState<string[]>(initialValues.tags)
  const [tagInput, setTagInput] = useState("")
  const [isPublic, setIsPublic] = useState(initialValues.isPublic)
  const [places, setPlaces] = useState<DraftPlace[]>(initialValues.places)

  const referencePoint = useMemo(() => {
    if (places.length === 0) return undefined
    const last = places[places.length - 1]
    return { latitude: last.latitude, longitude: last.longitude }
  }, [places])

  const addedPlaceIds = useMemo(
    () => new Set(places.map((p) => p.kakaoPlaceId)),
    [places],
  )

  const canSave = title.trim().length > 0 && places.length >= 2

  function handleAdd(place: SearchedPlace) {
    setPlaces((prev) => [
      ...prev,
      {
        kakaoPlaceId: place.id,
        name: place.place_name,
        category: place.category_name,
        address: place.address_name,
        roadAddress: place.road_address_name,
        phone: "",
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
        memo: "",
      },
    ])
  }

  function handleRemove(kakaoPlaceId: string) {
    setPlaces((prev) => prev.filter((p) => p.kakaoPlaceId !== kakaoPlaceId))
  }

  function handleReorder(newOrder: DraftPlace[]) {
    setPlaces(newOrder)
  }

  function handleMemoChange(kakaoPlaceId: string, memo: string) {
    setPlaces((prev) =>
      prev.map((p) => (p.kakaoPlaceId === kakaoPlaceId ? { ...p, memo } : p)),
    )
  }

  function handleAddTag() {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) return
    setTags((prev) => [...prev, trimmed])
    setTagInput("")
  }

  function handleRemoveTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function handleSave() {
    if (!canSave) return

    const payload = {
      title,
      description: description.trim() || undefined,
      region: region.trim() || undefined,
      tags,
      isPublic,
      places: places.map((p) => ({
        kakaoPlaceId: p.kakaoPlaceId,
        name: p.name,
        category: p.category,
        address: p.address,
        roadAddress: p.roadAddress,
        phone: p.phone,
        latitude: p.latitude,
        longitude: p.longitude,
        memo: p.memo,
      })),
    }

    startSaving(async () => {
      if (props.mode === "create") {
        const result = await createTrip(payload)
        if (result.ok) {
          toast.success("코스가 저장됐어요")
          router.push("/")
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await updateTrip({ ...payload, tripId: props.tripId })
        if (result.ok) {
          toast.success("코스를 수정했어요")
          router.push(`/trips/${props.tripId}`)
        } else {
          toast.error(result.error)
        }
      }
    })
  }

  const pageTitle = props.mode === "create" ? "새 코스 만들기" : "코스 수정"
  const backLink = props.mode === "create" ? "/" : `/trips/${props.tripId}`

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-[minmax(380px,2fr)_3fr]">
      {/* 좌측 ─ 폼 */}
      <div className="flex flex-col gap-6 overflow-y-auto border-r p-6">
        <div className="flex items-center justify-between">
          <Link
            href={backLink}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 돌아가기
          </Link>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave || isSaving}
            size="sm"
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>

        <h1 className="text-xl font-bold tracking-tight">{pageTitle}</h1>

        {/* 메타 정보 */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">
              코스 제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 성수 카페 투어"
              maxLength={50}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 코스의 매력을 한두 줄로 소개해보세요"
              maxLength={200}
              rows={3}
              className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="region">지역</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예: 성수동"
              maxLength={20}
            />
          </div>

          <div className="space-y-1.5">
            <Label>태그 (최대 5개)</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="태그 입력 후 Enter"
                maxLength={10}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs hover:bg-accent/70"
                  >
                    {tag} <span className="text-muted-foreground">✕</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isPublic" className="text-sm font-normal">
              공개 (다른 사용자도 볼 수 있어요)
            </Label>
          </div>
        </div>

        <div className="border-t" />

        <div className="space-y-3">
          <Label>장소 추가</Label>
          <PlaceSearch
            referencePoint={referencePoint}
            onAdd={handleAdd}
            addedPlaceIds={addedPlaceIds}
          />
        </div>

        <div className="border-t" />

        <div className="space-y-3">
          <Label>
            코스 ({places.length}개 장소)
            {places.length > 0 && places.length < 2 && (
              <span className="ml-2 text-xs font-normal text-destructive">
                최소 2곳 필요
              </span>
            )}
          </Label>
          <DraftPlaceList
            places={places}
            onReorder={handleReorder}
            onRemove={handleRemove}
            onMemoChange={handleMemoChange}
          />
        </div>
      </div>

      {/* 우측 ─ 지도 미리보기 */}
      <div className="relative">
        <DraftCourseMap places={places} />
      </div>
    </div>
  )
}
