"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { toggleLike } from "@/app/actions/likes"
import { getCourseColor } from "@/lib/courseColors"
import { haversineKm, travelMinutes, formatDistance } from "@/lib/distance"
import type { ExploreTrip } from "@/components/explore/ExploreLayout"

type Props = {
  trip: ExploreTrip | null
  userId: string | null
  likedTripIds: Set<string>
  onClose: () => void
}

export function CourseTripModal({ trip, userId, likedTripIds, onClose }: Props) {
  const isOpen = trip !== null
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // 열릴 때 이전 포커스를 저장하고 닫기 버튼으로 포커스 이동; 닫힐 때 복원
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    return () => { previousFocus?.focus() }
  }, [isOpen])

  // Escape 닫기 + Tab 포커스 트랩
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return }
      if (e.key !== "Tab" || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.closest('[aria-hidden="true"]') === null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="코스 상세"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-backdrop-in" onClick={onClose} aria-hidden />

      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="닫기"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative z-10 flex w-full max-w-5xl mx-4 max-h-[92vh] rounded-2xl overflow-hidden bg-background shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent trip={trip} userId={userId} likedTripIds={likedTripIds} onClose={onClose} />
      </div>
    </div>
  )
}

// 이미지 로딩 실패 시 컬러 플레이스홀더로 대체하는 래퍼
function PlaceImage({
  src,
  alt,
  fill,
  className,
  sizes,
  fallback,
}: {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  fallback: React.ReactNode
}) {
  const [error, setError] = useState(false)
  if (error) return <>{fallback}</>
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
    />
  )
}

function ModalContent({
  trip,
  userId,
  likedTripIds,
  onClose,
}: {
  trip: ExploreTrip
  userId: string | null
  likedTripIds: Set<string>
  onClose: () => void
}) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const color = getCourseColor(trip.id)
  const places = trip.places
  const hasAnyImage = places.some((p) => p.imageUrl)

  const isAuthenticated = userId !== null
  const isOwner = userId !== null && trip.authorId === userId

  // 좋아요 상태 — useOptimistic 대신 useState로 직접 관리
  // (useOptimistic은 async startTransition 경계에서 base state로 되돌아가는 타이밍 이슈가 있음)
  const [liked, setLiked] = useState(() => likedTripIds.has(trip.id))
  const [likeCount, setLikeCount] = useState(trip.likeCount)
  const [isLikePending, setIsLikePending] = useState(false)
  const [likeAnimating, setLikeAnimating] = useState(false)

  // 부모 컴포넌트가 revalidatePath 후 새 likedTripIds를 내려줄 때 동기화.
  // effect 대신 렌더 중 이전 값과 비교해 즉시 반영 (React "Adjusting state" 패턴 — 이중 렌더 회피)
  const [syncedLikeSource, setSyncedLikeSource] = useState({ likedTripIds, tripId: trip.id })
  if (syncedLikeSource.likedTripIds !== likedTripIds || syncedLikeSource.tripId !== trip.id) {
    setSyncedLikeSource({ likedTripIds, tripId: trip.id })
    setLiked(likedTripIds.has(trip.id))
  }

  async function handleLike() {
    if (!isAuthenticated) {
      toast("로그인하고 마음에 든 코스를 저장하세요", {
        action: { label: "로그인하기", onClick: () => router.push("/login") },
      })
      return
    }
    if (isLikePending) return

    // 낙관적 업데이트
    const newLiked = !liked
    if (newLiked) setLikeAnimating(true)
    setLiked(newLiked)
    setLikeCount((c) => c + (newLiked ? 1 : -1))
    setIsLikePending(true)

    const result = await toggleLike(trip.id)
    setIsLikePending(false)

    if (result.ok) {
      // 서버 확정 값으로 덮어쓰기
      setLiked(result.liked)
      setLikeCount(result.likeCount)
    } else {
      // 실패 시 되돌리기
      setLiked(!newLiked)
      setLikeCount((c) => c + (newLiked ? -1 : 1))
      toast.error(result.error)
    }
  }

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx)
    const el = listRef.current?.querySelector(`[data-place-idx="${idx}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(Math.max(0, activeIndex - 1))
      if (e.key === "ArrowRight") goTo(Math.min(places.length - 1, activeIndex + 1))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeIndex, places.length, goTo])

  const activePlace = places[activeIndex]

  return (
    <>
      {/* ── 왼쪽: 이미지 캐러셀 (데스크톱) ── */}
      <div className="hidden sm:flex flex-col relative bg-black flex-1 overflow-hidden min-h-0">
        <div className="relative flex-1">
          {activePlace?.imageUrl ? (
            <PlaceImage
              key={activePlace.imageUrl}
              src={activePlace.imageUrl}
              alt={activePlace.name}
              fill
              className="object-contain animate-fade-in"
              sizes="60vw"
              fallback={
                <ColorPlaceholder color={color} index={activeIndex} name={activePlace.name} />
              }
            />
          ) : (
            <ColorPlaceholder color={color} index={activeIndex} name={activePlace?.name} />
          )}
        </div>

        {activeIndex > 0 && (
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="이전 장소"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        {activeIndex < places.length - 1 && (
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="다음 장소"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}

        {activePlace && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-10">
            <p className="text-white font-semibold">{activePlace.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{activePlace.roadAddress ?? activePlace.address}</p>
          </div>
        )}

        {places.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pb-1">
            {places.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번 장소`}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 오른쪽: 상세 정보 패널 ── */}
      <div className="flex flex-col w-full sm:w-[360px] shrink-0 border-l">
        {/* 헤더 */}
        <div className="shrink-0 px-4 pt-4 pb-3 border-b space-y-2">
          {/* 모바일: 이미지 영역 */}
          {hasAnyImage && (
            <div className="relative h-52 sm:hidden w-full rounded-xl overflow-hidden bg-black mb-3">
              {activePlace?.imageUrl ? (
                <PlaceImage
                  key={activePlace.imageUrl}
                  src={activePlace.imageUrl}
                  alt={activePlace.name}
                  fill
                  className="object-contain animate-fade-in"
                  sizes="100vw"
                  fallback={<ColorPlaceholder color={color} index={activeIndex} name={activePlace.name} />}
                />
              ) : (
                <ColorPlaceholder color={color} index={activeIndex} name={activePlace?.name} />
              )}
              {activeIndex > 0 && (
                <button type="button" onClick={() => goTo(activeIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" aria-label="이전">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m15 18-6-6 6-6" /></svg>
                </button>
              )}
              {activeIndex < places.length - 1 && (
                <button type="button" onClick={() => goTo(activeIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" aria-label="다음">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m9 18 6-6-6-6" /></svg>
                </button>
              )}
            </div>
          )}

          {/* 작성자 + 타이틀 */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {(trip.author.nickname ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-tight line-clamp-1">{trip.title}</p>
              <p className="text-xs text-muted-foreground">
                {trip.author.nickname ?? "익명"}
                {trip.region && ` · ${trip.region}`}
                {` · ${places.length}곳`}
              </p>
            </div>
          </div>

          {trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trip.tags.map((tag) => (
                <span key={tag} className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {trip.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{trip.description}</p>
          )}
        </div>

        {/* 장소 목록 (스크롤) */}
        <div ref={listRef} className="flex-1 overflow-y-auto min-h-0">
          {places.map((place, idx) => {
            const isActive = idx === activeIndex
            const showTravel = idx < places.length - 1
            const km = showTravel
              ? haversineKm(place.latitude, place.longitude, places[idx + 1].latitude, places[idx + 1].longitude)
              : 0
            const mins = showTravel ? travelMinutes(km, "walk") : 0

            return (
              <div key={place.order}>
                <button
                  type="button"
                  data-place-idx={idx}
                  onClick={() => goTo(idx)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                    isActive ? "bg-accent/60" : "hover:bg-accent/30"
                  }`}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
                    style={{ backgroundColor: color }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight">{place.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {place.roadAddress ?? place.address}
                    </p>
                    {place.memo && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic">
                        &ldquo;{place.memo}&rdquo;
                      </p>
                    )}
                  </div>
                  {place.imageUrl && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <PlaceImage
                        src={place.imageUrl}
                        alt={place.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        fallback={null}
                      />
                    </div>
                  )}
                </button>

                {showTravel && (
                  <div className="flex items-center gap-1.5 px-4 py-1 bg-muted/30">
                    <div className="ml-[11px] h-4 w-px bg-border" />
                    <span className="text-[10px] text-muted-foreground">
                      도보 {mins}분 · {formatDistance(km)}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 하단 액션 바 */}
        <div className="shrink-0 border-t px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleLike}
            disabled={isLikePending}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
            aria-pressed={liked}
            className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-colors ${
              liked ? "text-dusk-rose" : "text-muted-foreground hover:text-foreground"
            } ${isLikePending ? "opacity-60" : ""}`}
          >
            <svg
              className={`h-5 w-5 transition-colors duration-150 ${likeAnimating ? "animate-like-pulse" : ""}`}
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={liked ? 0 : 2}
              onAnimationEnd={() => setLikeAnimating(false)}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{likeCount}</span>
          </button>

          <div className="flex-1" />

          {isOwner && (
            <Link
              href={`/trips/${trip.slug ?? trip.id}/edit`}
              className="text-xs text-muted-foreground hover:text-foreground border rounded-lg px-2.5 py-2 transition-colors"
              onClick={onClose}
            >
              편집
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

function ColorPlaceholder({
  color,
  index,
  name,
}: {
  color: string
  index: number
  name?: string
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}
    >
      <div className="text-center px-6">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-white text-xl font-bold"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </div>
        {name && <p className="text-base font-semibold" style={{ color }}>{name}</p>}
      </div>
    </div>
  )
}
