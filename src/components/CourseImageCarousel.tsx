"use client"

import { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"

export type CarouselPlace = {
  id: string
  name: string
  imageUrl: string | null
  order: number
}

type Props = {
  places: CarouselPlace[]
  activeIndex: number
  onActiveChange: (index: number) => void
}

export function CourseImageCarousel({ places, activeIndex, onActiveChange }: Readonly<Props>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    onActiveChange(emblaApi.selectedScrollSnap())
  }, [emblaApi, onActiveChange])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  // 외부(마커 클릭 등)에서 activeIndex가 바뀌면 캐러셀 스크롤 동기화
  useEffect(() => {
    if (!emblaApi) return
    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex)
    }
  }, [emblaApi, activeIndex])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {places.map((place, i) => (
          <div
            key={place.id}
            className="relative min-w-0 flex-[0_0_85%] sm:flex-[0_0_70%] mr-3 first:ml-3"
          >
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden">
              {place.imageUrl ? (
                <Image
                  src={place.imageUrl}
                  alt={place.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, 70vw"
                  priority={i === 0}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-rose-100">
                  <div className="text-5xl font-bold text-gray-300 mb-2">
                    {place.order + 1}
                  </div>
                  <div className="text-base font-medium text-gray-500 px-6 text-center leading-snug">
                    {place.name}
                  </div>
                </div>
              )}
              {/* 순서 뱃지 */}
              <div className="absolute top-3 left-3 bg-black/55 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                {i + 1} / {places.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
