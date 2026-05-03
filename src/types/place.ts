export type SearchedPlace = {
  id: string
  place_name: string
  category_name: string
  address_name: string
  road_address_name: string
  x: string // longitude
  y: string // latitude
}

export type DraftPlace = {
  kakaoId: string
  name: string
  category: string
  address: string
  roadAddress: string
  latitude: number
  longitude: number
  memo: string
}
