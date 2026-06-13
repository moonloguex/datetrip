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
  /** Vercel Blob 이미지 URL (선택) */
  imageUrl?: string
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
      { name: "어니언 성수", region: "성수동", memo: "넓고 분위기 좋은 본점. 사진 명소", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190130_120%2F1548821831784g8Y7T_JPEG%2FwJlWCsWmdut805DTzoZoRWil.jpeg.jpg" },
      { name: "대림창고", region: "성수동", memo: "갤러리 분위기 카페", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220705_65%2F1656959975574rVrxW_JPEG%2FKakaoTalk_Photo_2022-07-05-03-39-02_001.jpeg" },
      { name: "블루보틀 성수", region: "성수동", memo: "국내 1호점. 항상 인기", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjA1MDhfMTg3%2FMDAxNzc4MjUwMDY5MTIw.BOG-BvtLbPjB8sQ7nwMnD_qDQ-7DAWjKwzumkP133OIg.WtulBiIigPfVyTp-epxvqJj7vQlrIuKvdyDFNudYDrog.JPEG%2FBBCK_SS_2_Sub_PC__2220x1232_a0b0919b-1c01-4f05-a681-e4762269a7b8.jpg%2F1232x1232" },
    ],
  },
  {
    slug: "yeonnam-alley-walk",
    title: "연남동 골목 산책",
    description: "연트럴파크와 골목 사이의 카페·디저트를 따라 걷는 여유로운 산책",
    region: "연남",
    tags: ["산책", "조용한", "카페"],
    places: [
      { name: "경의선숲길", region: "연남동", memo: "일명 연트럴파크. 여유로운 산책로", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150429_149%2F1430304417189s1n7i_JPEG%2Fh8jKXoLh5lqj0mN8a9n6Zt3H.jpeg.jpg" },
      { name: "노티드", region: "연남동", memo: "달콤한 시그니처 도넛", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "매뉴팩트커피", region: "연남동", memo: "로스터리 커피", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "어반플랜트 연남", region: "연남동", memo: "식물 가득한 공간", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
    ],
  },
  {
    slug: "yeonhui-bookstore-date",
    title: "연희 책방 데이트",
    description: "독립서점과 동네 카페가 모인 연희동의 조용한 데이트 코스",
    region: "연희",
    tags: ["조용한", "책", "데이트"],
    places: [
      { name: "사러가쇼핑센터", region: "연희동", memo: "동네의 작은 랜드마크", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "책방 1984", region: "연희동", memo: "독립서점", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "매뉴팩트커피 연희", region: "연희동", memo: "넓고 차분한 카페", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "테일러커피 연희", region: "연희동", memo: "찻집 분위기", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
    ],
  },
  {
    slug: "seongsu-trendy-tour",
    title: "성수 트렌디 투어",
    description: "성수동의 복합 문화 공간과 디저트, 편집숍을 둘러보는 트렌디 코스",
    region: "성수",
    tags: ["트렌디", "쇼핑", "카페"],
    places: [
      { name: "LCDC 서울", region: "성수동", memo: "복합 문화 공간", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "누데이크 성수", region: "성수동", memo: "비주얼이 예술인 디저트", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "자그마치", region: "성수동", memo: "디자인 카페", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
      { name: "메쉬커피", region: "성수동", memo: "스페셜티 커피", imageUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210510_184%2F1620634845434rVrxW_JPEG%2FKakaoTalk_Photo_2021-05-10-10-40-45_001.jpeg" },
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
      { name: "D MUSEUM", region: "용산구 한남동", memo: "기획전 명가" },
      { name: "사운즈 한남", region: "용산구 한남동", memo: "복합 문화 공간" },
      { name: "노티드 한남", region: "", memo: "도넛 한남점" },
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

  // ─── 을지로/종로 (3) ───
  {
    slug: "euljiro-hip-night-v1",
    title: "을지로 힙지로 밤마실",
    description: "낡은 인쇄골목 사이 숨은 노포와 루프탑 바를 잇는 을지로의 밤",
    region: "을지로",
    tags: ["야경", "활기찬", "미식"],
    places: [
      { name: "을지로3가역", region: "중구 을지로3가", memo: "힙지로 탐방의 출발점" },
      { name: "을지면옥", region: "중구 주교동", memo: "노포 평양냉면의 정석" },
      { name: "호프", region: "중구 을지로3가", memo: "골목 안 숨은 맥주집 분위기" },
      { name: "을지로 노가리골목", region: "중구 을지로3가", memo: "저녁이면 활기찬 노상" },
      { name: "청계천", region: "중구 장교동", memo: "야경 산책으로 마무리" },
    ],
  },
  {
    slug: "ikseon-hanok-date-v1",
    title: "익선동 한옥 데이트",
    description: "좁은 한옥 골목에 모인 감성 카페와 소품숍을 둘러보는 데이트",
    region: "익선동",
    tags: ["전통", "카페", "데이트"],
    places: [
      { name: "익선동 한옥거리", region: "종로구 익선동", memo: "한옥 개조 카페 골목" },
      { name: "낙원악기상가", region: "종로구 낙원동", memo: "옥상정원과 예술영화관" },
      { name: "창덕궁", region: "종로구 와룡동", memo: "후원이 아름다운 궁궐" },
      { name: "익선동 거리", region: "종로구 익선동", memo: "한옥 사이 소품숍 골목" },
    ],
  },
  {
    slug: "gwangjang-market-food-v1",
    title: "광장시장 먹거리 투어",
    description: "빈대떡과 마약김밥, 육회까지 전통시장의 먹거리를 정복하는 코스",
    region: "종로",
    tags: ["미식", "전통", "활기찬"],
    places: [
      { name: "광장시장", region: "종로구 예지동", memo: "먹거리 투어의 중심" },
      { name: "광장시장 마약김밥", region: "종로구 예지동", memo: "줄 서서 먹는 명물" },
      { name: "부촌육회", region: "종로구 예지동", memo: "신선한 생육회" },
      { name: "방산시장", region: "중구 을지로5가", memo: "식후 구경거리 골목" },
      { name: "청계천", region: "종로구 장사동", memo: "산책으로 소화" },
    ],
  },

  // ─── 망원/상수 (2) ───
  {
    slug: "mangwon-market-walk-v1",
    title: "망원 시장 맛집 산책",
    description: "망원시장 먹거리와 망원한강공원을 잇는 동네 정취 가득한 코스",
    region: "망원",
    tags: ["미식", "산책", "활기찬"],
    places: [
      { name: "망원시장", region: "마포구 망원동", memo: "고로케·닭강정으로 유명" },
      { name: "포비 망원", region: "마포구 망원동", memo: "베이글과 커피" },
      { name: "망원한강공원", region: "마포구 망원동", memo: "노을 명소 한강뷰" },
      { name: "카페 망리단길", region: "마포구 망원동", memo: "망리단길 감성 카페거리" },
    ],
  },
  {
    slug: "sangsu-indie-night-v1",
    title: "상수 인디 음악 코스",
    description: "상수동의 라이브 클럽과 골목 카페로 채우는 인디 감성 저녁",
    region: "상수",
    tags: ["활기찬", "예술", "카페"],
    places: [
      { name: "상수역", region: "마포구 상수동", memo: "골목 탐방의 시작" },
      { name: "제비다방", region: "마포구 상수동", memo: "인디 공연이 열리는 명소" },
      { name: "클럽 빵", region: "마포구 서교동", memo: "역사 깊은 인디 라이브 클럽" },
      { name: "절두산순교성지", region: "마포구 합정동", memo: "한강뷰로 마무리" },
    ],
  },

  // ─── 청담/압구정 (1) ───
  {
    slug: "cheongdam-luxury-walk-v1",
    title: "청담 명품거리 산책",
    description: "명품 플래그십과 고급 디저트, 갤러리가 늘어선 청담동 워크",
    region: "청담",
    tags: ["트렌디", "예술", "디저트"],
    places: [
      { name: "청담동 명품거리", region: "강남구 청담동", memo: "플래그십 스토어 거리" },
      { name: "House of Dior 청담", region: "강남구 청담동", memo: "건축이 멋진 플래그십" },
      { name: "송은아트스페이스", region: "강남구 청담동", memo: "현대미술 전시 공간" },
      { name: "분더샵 청담", region: "강남구 청담동", memo: "편집숍 쇼핑" },
    ],
  },

  // ─── 서울숲/뚝섬 (1) ───
  {
    slug: "seoulforest-green-date-v1",
    title: "서울숲 자연 데이트",
    description: "도심 속 숲과 사슴 방사장, 카페거리를 잇는 초록 데이트",
    region: "서울숲",
    tags: ["자연", "산책", "데이트"],
    places: [
      { name: "서울숲", region: "성동구 성수동1가", memo: "사슴 방사장과 너른 잔디밭" },
      { name: "언더스탠드에비뉴", region: "성동구 성수동1가", memo: "컨테이너 복합 공간" },
      { name: "성수연방", region: "성동구 성수동2가", memo: "옥상정원이 있는 카페" },
      { name: "뚝섬한강공원", region: "성동구 자양동", memo: "한강 자전거 산책" },
    ],
  },

  // ─── 여의도 (1) ───
  {
    slug: "yeouido-river-night-v1",
    title: "여의도 한강 야경 코스",
    description: "더현대 쇼핑부터 한강공원 야경까지 즐기는 여의도 코스",
    region: "여의도",
    tags: ["야경", "산책", "데이트"],
    places: [
      { name: "더현대 서울", region: "영등포구 여의도동", memo: "사운즈포레스트 실내 정원" },
      { name: "여의도한강공원", region: "영등포구 여의도동", memo: "야경과 치맥 명소" },
      { name: "물빛광장", region: "영등포구 여의도동", memo: "분수쇼가 열리는 광장" },
      { name: "63스퀘어", region: "영등포구 여의도동", memo: "전망대에서 보는 한강" },
    ],
  },
]
