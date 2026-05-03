"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"
import type { SearchedPlace } from "@/types/place"

type Props = Readonly<{
  onAdd: (place: SearchedPlace) => void
  addedIds: Set<string>
}>

export function PlaceSearch({ onAdd, addedIds }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchedPlace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    const fetchPlaces = async () => {
      try {
        const res = await fetch(
          `/api/places/search?q=${encodeURIComponent(debouncedQuery)}`,
        )
        const data = await res.json()
        if (!cancelled) setResults(data.documents ?? [])
      } catch {
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchPlaces()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="장소 검색 (예: 성수동 카페)"
      />

      {isLoading && (
        <p className="px-1 text-xs text-muted-foreground">검색 중...</p>
      )}

      {!isLoading && results.length > 0 && (
        <ul className="flex flex-col rounded-md border bg-background shadow-sm">
          {results.map((place) => {
            const added = addedIds.has(place.id)
            return (
              <li
                key={place.id}
                className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{place.place_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {place.category_name} · {place.road_address_name || place.address_name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={added}
                  onClick={() => onAdd(place)}
                >
                  {added ? "추가됨" : "+ 추가"}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
