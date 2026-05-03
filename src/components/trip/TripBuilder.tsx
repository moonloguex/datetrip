"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlaceSearch } from "@/components/trip/PlaceSearch"
import { DraftPlaceList } from "@/components/trip/DraftPlaceList"
import { DraftCourseMap } from "@/components/trip/DraftCourseMap"
import type { DraftPlace, SearchedPlace } from "@/types/place"

export function TripBuilder() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [region, setRegion] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [places, setPlaces] = useState<DraftPlace[]>([])

  const addedIds = useMemo(
    () => new Set(places.map((p) => p.kakaoId)),
    [places],
  )

  function handleAdd(place: SearchedPlace) {
    if (addedIds.has(place.id)) return
    setPlaces((prev) => [
      ...prev,
      {
        kakaoId: place.id,
        name: place.place_name,
        category: place.category_name,
        address: place.address_name,
        roadAddress: place.road_address_name,
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
        memo: "",
      },
    ])
  }

  function handleRemove(kakaoId: string) {
    setPlaces((prev) => prev.filter((p) => p.kakaoId !== kakaoId))
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 좌측 패널: 폼 + 장소 검색/목록 */}
      <div className="flex w-[420px] flex-none flex-col gap-6 overflow-y-auto border-r p-6">
        <h2 className="text-xl font-semibold">새 코스 만들기</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="코스 이름을 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">설명</Label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="코스를 간단히 소개해주세요"
            className="h-auto w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="region">지역</Label>
          <Input
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="예: 성수동"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">태그</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="예: 카페, 감성 (쉼표 구분)"
          />
        </div>

        <hr />

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">장소 추가</h3>
          <PlaceSearch onAdd={handleAdd} addedIds={addedIds} />
          <DraftPlaceList places={places} onRemove={handleRemove} />
        </div>

        <Button disabled className="mt-auto w-full" size="default">
          저장 (준비 중)
        </Button>
      </div>

      {/* 우측 패널: 지도 프리뷰 */}
      <div className="flex-1">
        <DraftCourseMap places={places} />
      </div>
    </div>
  )
}
