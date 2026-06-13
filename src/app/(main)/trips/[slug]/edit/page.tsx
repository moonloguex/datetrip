import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { getTripBySlug } from "@/lib/trips"
import { TripBuilder, type InitialValues } from "@/components/trip/TripBuilder"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function EditTripPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const trip = await getTripBySlug(slug)
  if (!trip) {
    notFound()
  }

  // 작성자 본인만 수정 가능
  if (trip.authorId !== session.user.id) {
    notFound()
  }

  const initial: InitialValues = {
    title: trip.title,
    description: trip.description ?? "",
    region: trip.region ?? "",
    tags: trip.tags,
    isPublic: trip.isPublic,
    places: trip.places.map((p) => ({
      kakaoPlaceId: p.kakaoPlaceId ?? "",
      name: p.name,
      category: p.category ?? "",
      address: p.address,
      roadAddress: p.roadAddress ?? "",
      phone: p.phone ?? "",
      latitude: p.latitude,
      longitude: p.longitude,
      memo: p.memo ?? "",
    })),
  }

  return (
    <TripBuilder
      mode="edit"
      tripId={trip.id}
      tripSlug={trip.slug ?? undefined}
      initial={initial}
    />
  )
}
