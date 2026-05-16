// 시드 코스 데이터.
//
// 규칙:
//   - slug: 영구 식별자. 한 번 정한 후 절대 변경 X (변경 = 코스 정체성 바뀜 = 새 코스)
//   - tags: 첫 태그가 주제 태그 (예: "조용한", "활기찬"). 나머지는 보조 태그
//   - places: 카카오 검색용 장소명 + region 힌트만. 실제 좌표/주소는 카카오 API 응답으로 채워짐
//   - 큰 변경 시: 새 slug 사용 ("seongsu-cafe-tour" → "seongsu-cafe-tour-v2")
//
// 카카오 검색 실패 시:
//   - 시드 스크립트가 해당 장소 스킵
//   - 한 코스의 유효 장소가 3개 미만이면 그 코스 전체 스킵
//   - 사용자가 production UI에서 보강 가능

export interface SeedPlace {
  /** 카카오 검색에 사용할 장소명 */
  name: string
  /** 검색 정확도 향상용 region 힌트 */
  region: string
  /** 큐레이터 코멘트 (선택) */
  memo?: string
}

export interface SeedTrip {
  slug: string
  title: string
  description: string
  region: string
  tags: string[]
  places: SeedPlace[]
}

export const SEED_TRIPS: SeedTrip[] = [
  // ─── 성수/연남/연희 (4) ───
  {
    slug: "seongsu-cafe-tour",
    title: "성수 카페 투어",
    description: "성수동을 대표하는 시그니처 카페 4곳을 둘러보는 카페 호퍼 코스",
    region: "성수",
    tags: ["카페", "감성", "데이트"],
    places: [
      { name: "어니언 성수", region: "성수동", memo: "넓고 분위기 좋은 본점. 사진 명소" },
      { name: "센터커피 성수점", region: "성수동", memo: "스페셜티 커피로 유명" },
      { name: "대림창고", region: "성수동", memo: "갤러리 분위기 카페" },
      { name: "블루보틀 성수", region: "성수동", memo: "국내 1호점. 항상 인기" },
    ],
  },
  {
    slug: "yeonnam-alley-walk",
    title: "연남동 골목 산책",
    description: "연트럴파크와 골목 사이의 카페·디저트를 따라 걷는 여유로운 산책",
    region: "연남",
    tags: ["산책", "조용한", "카페"],
    places: [
      { name: "경의선숲길", region: "연남동", memo: "일명 연트럴파크. 여유로운 산책로" },
      { name: "노티드 도넛 연남", region: "연남동", memo: "달콤한 시그니처 도넛" },
      { name: "매뉴팩트커피 연남", region: "연남동", memo: "로스터리 커피" },
      { name: "어반플랜트 연남", region: "연남동", memo: "식물 가득한 공간" },
    ],
  },
  {
    slug: "yeonhui-bookstore-date",
    title: "연희 책방 데이트",
    description: "독립서점과 동네 카페가 모인 연희동의 조용한 데이트 코스",
    region: "연희",
    tags: ["조용한", "책", "데이트"],
    places: [
      { name: "사러가쇼핑센터", region: "연희동", memo: "동네의 작은 랜드마크" },
      { name: "1984 책방", region: "연희동", memo: "독립서점" },
      { name: "매뉴팩트커피 연희", region: "연희동", memo: "넓고 차분한 카페" },
      { name: "끽다점", region: "연희동", memo: "찻집 분위기" },
    ],
  },
  {
    slug: "seongsu-trendy-tour",
    title: "성수 트렌디 투어",
    description: "성수동의 복합 문화 공간과 디저트, 편집숍을 둘러보는 트렌디 코스",
    region: "성수",
    tags: ["트렌디", "쇼핑", "카페"],
    places: [
      { name: "LCDC 서울", region: "성수동", memo: "복합 문화 공간" },
      { name: "누데이크 성수", region: "성수동", memo: "비주얼이 예술인 디저트" },
      { name: "자그마치", region: "성수동", memo: "디자인 카페" },
      { name: "메쉬커피", region: "성수동", memo: "스페셜티 커피" },
    ],
  },

  // ─── 강남/논현/도산 (3) ───
  {
    slug: "dosan-fine-dining",
    title: "도산 미식 투어",
    description: "도산공원 주변의 디저트와 베이커리, 갤러리 같은 매장을 둘러보는 코스",
    region: "강남",
    tags: ["미식", "디저트", "트렌디"],
    places: [
      { name: "도산공원", region: "강남구 신사동", memo: "산책 시작점" },
      { name: "누데이크 도산", region: "강남구 신사동", memo: "디저트의 정점" },
      { name: "런던베이글뮤지엄 도산", region: "강남구 신사동", memo: "런던식 베이글" },
      { name: "젠틀몬스터 하우스 도산", region: "강남구 신사동", memo: "플래그십 스토어" },
    ],
  },
  {
    slug: "gangnam-date-course",
    title: "강남 데이트 코스",
    description: "코엑스 별마당 도서관과 봉은사를 잇는 도심 데이트",
    region: "강남",
    tags: ["데이트", "도심", "산책"],
    places: [
      { name: "코엑스", region: "강남구 삼성동", memo: "쇼핑·식사" },
      { name: "별마당 도서관", region: "강남구 삼성동", memo: "랜드마크 도서관" },
      { name: "봉은사", region: "강남구 삼성동", memo: "도심 속 사찰" },
      { name: "선릉공원", region: "강남구 삼성동", memo: "조용한 산책로" },
    ],
  },
  {
    slug: "sinsa-dessert-tour",
    title: "신사동 디저트 투어",
    description: "가로수길과 신사동의 인기 디저트 가게를 차례로 도는 단 코스",
    region: "강남",
    tags: ["디저트", "카페", "트렌디"],
    places: [
      { name: "가로수길", region: "강남구 신사동", memo: "쇼핑 거리" },
      { name: "노티드 압구정", region: "강남구 압구정동", memo: "도넛과 케이크" },
      { name: "도산공원", region: "강남구 신사동", memo: "디저트 후 산책" },
      { name: "카페 레이어드 신사", region: "강남구 신사동", memo: "스콘이 유명" },
    ],
  },

  // ─── 홍대/합정 (2) ───
  {
    slug: "hongdae-cafe-tour",
    title: "홍대 카페·소극장 데이트",
    description: "홍대의 카페와 작은 공연장을 잇는 활기찬 데이트 코스",
    region: "홍대",
    tags: ["활기찬", "카페", "데이트"],
    places: [
      { name: "홍대 걷고싶은거리", region: "마포구 서교동", memo: "거리 공연 명소" },
      { name: "산울림소극장", region: "마포구 서교동", memo: "전통 있는 소극장" },
      { name: "카페 노티드 홍대", region: "마포구 서교동", memo: "도넛 명가" },
      { name: "홍대입구역", region: "마포구 서교동", memo: "9번 출구 약속 장소" },
    ],
  },
  {
    slug: "hapjeong-book-tour",
    title: "합정 책방 산책",
    description: "한강을 끼고 책방과 카페를 도는 차분한 합정 산책",
    region: "합정",
    tags: ["조용한", "책", "산책"],
    places: [
      { name: "메세나폴리스", region: "마포구 합정동", memo: "쇼핑·식사" },
      { name: "더북소사이어티", region: "마포구 합정동", memo: "독립서점" },
      { name: "절두산순교성지", region: "마포구 합정동", memo: "한강뷰 산책로" },
      { name: "양화진외국인선교사묘원", region: "마포구 합정동", memo: "고즈넉한 공간" },
    ],
  },

  // ─── 이태원/한남 (2) ───
  {
    slug: "hannam-gallery-date",
    title: "한남 갤러리 데이트",
    description: "리움부터 디뮤지엄까지, 한남동의 갤러리와 트렌디 카페",
    region: "한남",
    tags: ["예술", "트렌디", "데이트"],
    places: [
      { name: "리움미술관", region: "용산구 한남동", memo: "현대 미술의 정점" },
      { name: "디뮤지엄", region: "용산구 한남동", memo: "기획전 명가" },
      { name: "사운즈 한남", region: "용산구 한남동", memo: "복합 문화 공간" },
      { name: "노티드 한남", region: "용산구 한남동", memo: "도넛 한남점" },
    ],
  },
  {
    slug: "itaewon-foodie-walk",
    title: "이태원 미식 산책",
    description: "경리단길과 해방촌의 다국적 음식과 골목 분위기",
    region: "이태원",
    tags: ["미식", "이국적", "활기찬"],
    places: [
      { name: "경리단길", region: "용산구 이태원동", memo: "다국적 음식 거리" },
      { name: "해방촌", region: "용산구 용산동2가", memo: "골목 카페" },
      { name: "이태원 우사단로", region: "용산구 이태원동", memo: "이슬람 거리" },
      { name: "남산공원", region: "용산구 한남동", memo: "야경 명소" },
    ],
  },

  // ─── 잠실/송파 (2) ───
  {
    slug: "seokchon-lake-walk",
    title: "석촌호수 데이트",
    description: "벚꽃철이나 가을이면 더 예쁜 석촌호수와 송리단길",
    region: "잠실",
    tags: ["산책", "데이트", "자연"],
    places: [
      { name: "석촌호수", region: "송파구 잠실동", memo: "한 바퀴 약 2.5km" },
      { name: "롯데월드 어드벤처", region: "송파구 잠실동", memo: "테마파크" },
      { name: "송리단길", region: "송파구 송파동", memo: "골목 카페 거리" },
      { name: "잠실역", region: "송파구 잠실동", memo: "교통 허브" },
    ],
  },
  {
    slug: "lotte-tower-night",
    title: "롯데타워 야경 코스",
    description: "서울스카이에서 보는 야경과 쇼핑, 호수 산책을 합친 코스",
    region: "잠실",
    tags: ["야경", "전망", "데이트"],
    places: [
      { name: "롯데월드타워 서울스카이", region: "송파구 신천동", memo: "555m 전망대" },
      { name: "롯데월드몰", region: "송파구 신천동", memo: "식사와 쇼핑" },
      { name: "석촌호수", region: "송파구 잠실동", memo: "야경 산책" },
      { name: "잠실종합운동장", region: "송파구 잠실동", memo: "공연·경기" },
    ],
  },

  // ─── 서촌/북촌 (2) ───
  {
    slug: "bukchon-hanok-walk",
    title: "북촌 한옥 산책",
    description: "한옥 골목을 따라 인사동까지, 전통과 현대가 만나는 코스",
    region: "북촌",
    tags: ["전통", "산책", "조용한"],
    places: [
      { name: "북촌한옥마을", region: "종로구 가회동", memo: "한옥 골목 사진 명소" },
      { name: "가회동성당", region: "종로구 가회동", memo: "한옥 양식 성당" },
      { name: "안국역", region: "종로구 안국동", memo: "북촌·인사동 접근점" },
      { name: "인사동", region: "종로구 인사동", memo: "전통 공예 거리" },
    ],
  },
  {
    slug: "seochon-art-walk",
    title: "서촌 산책 코스",
    description: "갤러리와 옛 가옥, 시장이 어우러진 서촌의 차분한 산책",
    region: "서촌",
    tags: ["예술", "전통", "산책"],
    places: [
      { name: "통의동 보안여관", region: "종로구 통의동", memo: "복합 문화 공간" },
      { name: "대림미술관", region: "종로구 통의동", memo: "사진·디자인 전시" },
      { name: "통인시장", region: "종로구 통인동", memo: "도시락 카페로 유명" },
      { name: "윤동주문학관", region: "종로구 청운동", memo: "시인의 자취" },
    ],
  },
]
