import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { getTripBySlug, getLikedTripIds } from "@/lib/trips"
import { TripDetailView } from "@/components/trip/TripDetailView"
import { SimilarTripsSection } from "@/components/SimilarTripsSection"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TripDetailPage({ params }: Props) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)

  if (!trip) {
    notFound()
  }

  const session = await auth()
  const viewerId = session?.user?.id ?? null

  // 비공개 코스 접근 제어
  if (!trip.isPublic && trip.authorId !== viewerId) {
    notFound()
  }

  const isOwner = viewerId !== null && viewerId === trip.authorId
  const isLiked = viewerId
    ? (await getLikedTripIds(viewerId, [trip.id])).has(trip.id)
    : false

  return (
    <TripDetailView
      trip={trip}
      isOwner={isOwner}
      isLiked={isLiked}
      isAuthenticated={viewerId !== null}
      similarSection={<SimilarTripsSection tripId={trip.id} />}
    />
  )
}
