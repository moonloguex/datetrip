"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MyTripCard } from "@/components/me/MyTripCard"
import type { MyTripCardData } from "@/lib/trips"

type Props = {
  myTrips: MyTripCardData[]
  likedTrips: MyTripCardData[]
}

export function MyPageTabs({ myTrips, likedTrips }: Props) {
  const [tab, setTab] = useState<"mine" | "liked">("mine")
  const list = tab === "mine" ? myTrips : likedTrips

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b">
        <button
          type="button"
          data-active={tab === "mine"}
          className="border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-muted-foreground data-[active=true]:border-foreground data-[active=true]:text-foreground"
          onClick={() => setTab("mine")}
        >
          내 코스 {myTrips.length}
        </button>
        <button
          type="button"
          data-active={tab === "liked"}
          className="border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-muted-foreground data-[active=true]:border-foreground data-[active=true]:text-foreground"
          onClick={() => setTab("liked")}
        >
          좋아요 {likedTrips.length}
        </button>
      </div>

      {list.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((t) => (
            <MyTripCard key={t.id} trip={t} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
          {tab === "mine" ? (
            <>
              <p>아직 만든 코스가 없어요.</p>
              <Button
                render={<Link href="/trips/new" />}
                nativeButton={false}
                size="sm"
              >
                코스 만들기
              </Button>
            </>
          ) : (
            <>
              <p>아직 좋아요한 코스가 없어요.</p>
              <Button
                render={<Link href="/" />}
                nativeButton={false}
                variant="outline"
                size="sm"
              >
                코스 둘러보기
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
