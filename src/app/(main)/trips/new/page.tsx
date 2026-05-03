import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { TripBuilder } from "@/components/trip/TripBuilder"

export default async function NewTripPage() {
  const session = await auth()
  if (!session?.user) redirect("/")
  return <TripBuilder />
}
