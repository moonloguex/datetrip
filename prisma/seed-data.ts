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
    description: "연트럴파크와 골목 카페를 거닐며 홍대까지 이어지는 여유로운 산책 코스",
    region: "연남",
    tags: ["산책", "조용한", "카페"],
    places: [
      { name: "경의선숲길", region: "마포구 연남동", memo: "일명 연트럴파크. 연남동의 허파 같은 산책로", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gyeongui_Line_Forest_Park_Seoul_Korea_2019.jpg/960px-Gyeongui_Line_Forest_Park_Seoul_Korea_2019.jpg" },
      { name: "연남방앗간", region: "마포구 연남동", memo: "연남동 명물 모찌 카페. 달콤한 쉬어가기", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gyeongui_Line_Forest_Park_Seoul_Korea_2019.jpg/960px-Gyeongui_Line_Forest_Park_Seoul_Korea_2019.jpg" },
      { name: "홍대 걷고싶은거리", region: "마포구 서교동", memo: "거리 공연과 아기자기한 가게들. 연남에서 이어지는 활기찬 골목", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Street_hongdae_Seoul.jpg/960px-Street_hongdae_Seoul.jpg" },
      { name: "합정역", region: "마포구 합정동", memo: "한강과 망원 방면으로 이어지는 요충지", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
    ],
  },
  {
    slug: "yeonhui-bookstore-date",
    title: "연희 책방 데이트",
    description: "독립서점과 문학창작촌이 모인 연희동의 조용한 인문 산책 코스",
    region: "연희",
    tags: ["조용한", "책", "데이트"],
    places: [
      { name: "사러가쇼핑센터", region: "서대문구 연희동", memo: "연희동 주민들의 오랜 랜드마크. 출발점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
      { name: "연희문학창작촌", region: "서대문구 연희동", memo: "작가들의 작업 공간. 고즈넉한 산책길", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
      { name: "책방 이상한나라", region: "마포구 성산동", memo: "연희·성산동 경계의 독립 헌책방. 낡은 책 냄새와 함께", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
      { name: "폴앤폴리나 연희동점", region: "서대문구 연희동", memo: "연희동 대표 베이커리 카페. 책 읽기 딱 좋은 분위기", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
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
      { name: "도산공원", region: "강남구 신사동", memo: "산책 시작점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Korea-Seoul-Dosan_Park-06.jpg/960px-Korea-Seoul-Dosan_Park-06.jpg" },
      { name: "누데이크 도산", region: "강남구 신사동", memo: "디저트의 정점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Korea-Seoul-Dosan_Park-06.jpg/960px-Korea-Seoul-Dosan_Park-06.jpg" },
      { name: "런던베이글뮤지엄 도산", region: "강남구 신사동", memo: "런던식 베이글", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/%EB%9F%B0%EB%8D%98%EB%B2%A0%EC%9D%B4%EA%B8%80%EB%AE%A4%EC%A7%80%EC%97%84_%EC%9E%A0%EC%8B%A4%EC%A0%90_%EA%B0%88%EB%A6%AD_%EB%B2%A0%EC%9D%B4%EA%B8%80.jpg/960px-%EB%9F%B0%EB%8D%98%EB%B2%A0%EC%9D%B4%EA%B8%80%EB%AE%A4%EC%A7%80%EC%97%84_%EC%9E%A0%EC%8B%A4%EC%A0%90_%EA%B0%88%EB%A6%AD_%EB%B2%A0%EC%9D%B4%EA%B8%80.jpg" },
      { name: "젠틀몬스터 하우스 도산", region: "강남구 신사동", memo: "플래그십 스토어", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Gentlemonster_LA.jpg/960px-Gentlemonster_LA.jpg" },
    ],
  },
  {
    slug: "gangnam-date-course",
    title: "강남 데이트 코스",
    description: "코엑스 별마당 도서관과 봉은사를 잇는 도심 데이트",
    region: "강남",
    tags: ["데이트", "도심", "산책"],
    places: [
      { name: "코엑스", region: "강남구 삼성동", memo: "쇼핑·식사", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Seoul_COEX_Mall.jpg/960px-Seoul_COEX_Mall.jpg" },
      { name: "별마당 도서관", region: "강남구 삼성동", memo: "랜드마크 도서관", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Starfield_Library_COEX_20240218.jpg/960px-Starfield_Library_COEX_20240218.jpg" },
      { name: "봉은사", region: "강남구 삼성동", memo: "도심 속 사찰", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Bongeunsa_Seoul_8.jpg/960px-Bongeunsa_Seoul_8.jpg" },
      { name: "선릉공원", region: "강남구 삼성동", memo: "조용한 산책로", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Seolleung_and_Jeongneung_Royal_Tombs_2.jpg/960px-Seolleung_and_Jeongneung_Royal_Tombs_2.jpg" },
    ],
  },
  {
    slug: "sinsa-dessert-tour",
    title: "신사동 디저트 투어",
    description: "가로수길과 신사동의 인기 디저트 가게를 차례로 도는 단 코스",
    region: "강남",
    tags: ["디저트", "카페", "트렌디"],
    places: [
      { name: "가로수길", region: "강남구 신사동", memo: "쇼핑 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garosu-gil_at_night.jpg/960px-Garosu-gil_at_night.jpg" },
      { name: "노티드 압구정", region: "강남구 압구정동", memo: "도넛과 케이크", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garosu-gil_at_night.jpg/960px-Garosu-gil_at_night.jpg" },
      { name: "도산공원", region: "강남구 신사동", memo: "디저트 후 산책", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Korea-Seoul-Dosan_Park-06.jpg/960px-Korea-Seoul-Dosan_Park-06.jpg" },
      { name: "카페 레이어드 신사", region: "강남구 신사동", memo: "스콘이 유명", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garosu-gil_at_night.jpg/960px-Garosu-gil_at_night.jpg" },
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
      { name: "홍대 걷고싶은거리", region: "마포구 서교동", memo: "거리 공연 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Street_hongdae_Seoul.jpg/960px-Street_hongdae_Seoul.jpg" },
      { name: "산울림소극장", region: "마포구 서교동", memo: "전통 있는 소극장", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Street_hongdae_Seoul.jpg/960px-Street_hongdae_Seoul.jpg" },
      { name: "카페 노티드 홍대", region: "마포구 서교동", memo: "도넛 명가", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Street_hongdae_Seoul.jpg/960px-Street_hongdae_Seoul.jpg" },
      { name: "홍대입구역", region: "마포구 서교동", memo: "9번 출구 약속 장소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/%ED%99%8D%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD_6%EB%B2%88_%EC%B6%9C%EC%9E%85%EA%B5%AC_-_Hongik_University_Station_Exit_6.jpg/960px-%ED%99%8D%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD_6%EB%B2%88_%EC%B6%9C%EC%9E%85%EA%B5%AC_-_Hongik_University_Station_Exit_6.jpg" },
    ],
  },
  {
    slug: "hapjeong-book-tour",
    title: "합정 책방 산책",
    description: "한강을 끼고 책방과 카페를 도는 차분한 합정 산책",
    region: "합정",
    tags: ["조용한", "책", "산책"],
    places: [
      { name: "메세나폴리스", region: "마포구 합정동", memo: "쇼핑·식사", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg/960px-Seoul_Cityscape_From_the_Sky_Park_%286907573433%29.jpg" },
      { name: "더북소사이어티", region: "마포구 합정동", memo: "독립서점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg/960px-Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg" },
      { name: "절두산순교성지", region: "마포구 합정동", memo: "한강뷰 산책로", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg/960px-Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg" },
      { name: "양화진외국인선교사묘원", region: "마포구 합정동", memo: "고즈넉한 공간", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/YanghwajinHulbert.JPG/960px-YanghwajinHulbert.JPG" },
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
      { name: "리움미술관", region: "용산구 한남동", memo: "삼성문화재단의 컬렉션. 현대 미술의 정점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Leeum%2C_Samsung_Museum_of_Art.jpg/960px-Leeum%2C_Samsung_Museum_of_Art.jpg" },
      { name: "갤러리바톤", region: "용산구 한남동", memo: "한남동 대표 현대미술 갤러리. 무료 입장", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Leeum%2C_Samsung_Museum_of_Art.jpg/960px-Leeum%2C_Samsung_Museum_of_Art.jpg" },
      { name: "사운즈 한남", region: "용산구 한남동", memo: "트렌디한 복합 문화 공간. 쇼핑·카페 한번에", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Leeum%2C_Samsung_Museum_of_Art.jpg/960px-Leeum%2C_Samsung_Museum_of_Art.jpg" },
      { name: "현대카드 스토리지", region: "용산구 한남동", memo: "희귀 레코드와 아트 북. 감각적인 공간", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Leeum%2C_Samsung_Museum_of_Art.jpg/960px-Leeum%2C_Samsung_Museum_of_Art.jpg" },
    ],
  },
  {
    slug: "itaewon-foodie-walk",
    title: "이태원 미식 산책",
    description: "경리단길과 해방촌의 다국적 음식과 골목 분위기",
    region: "이태원",
    tags: ["미식", "이국적", "활기찬"],
    places: [
      { name: "경리단길", region: "용산구 이태원동", memo: "다국적 음식 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Itaewon_Gyeongnidan-gil.JPG/960px-Itaewon_Gyeongnidan-gil.JPG" },
      { name: "해방촌", region: "용산구 용산동2가", memo: "골목 카페", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Seoul_Yongsan_Haebangchon_20250206.jpg/960px-Seoul_Yongsan_Haebangchon_20250206.jpg" },
      { name: "이태원 우사단로", region: "용산구 이태원동", memo: "이슬람 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Itaewon_Gyeongnidan-gil.JPG/960px-Itaewon_Gyeongnidan-gil.JPG" },
      { name: "남산공원", region: "용산구 한남동", memo: "야경 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/South_View_of_Seoul_from_Namsan_Park%2C_Korea.jpg/960px-South_View_of_Seoul_from_Namsan_Park%2C_Korea.jpg" },
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
      { name: "석촌호수", region: "송파구 잠실동", memo: "한 바퀴 약 2.5km", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Seokchon_Lake_in_Seoul.jpg/960px-Seokchon_Lake_in_Seoul.jpg" },
      { name: "롯데월드 어드벤처", region: "송파구 잠실동", memo: "테마파크", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Lotte_World_day_view_5.jpg/960px-Lotte_World_day_view_5.jpg" },
      { name: "송리단길", region: "송파구 송파동", memo: "골목 카페 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Seokchon_Lake_in_Seoul.jpg/960px-Seokchon_Lake_in_Seoul.jpg" },
      { name: "잠실역", region: "송파구 잠실동", memo: "교통 허브", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Jamsil_Station_20241102_001.jpg/960px-Jamsil_Station_20241102_001.jpg" },
    ],
  },
  {
    slug: "lotte-tower-night",
    title: "롯데타워 야경 코스",
    description: "서울스카이에서 보는 야경과 쇼핑, 호수 산책을 합친 코스",
    region: "잠실",
    tags: ["야경", "전망", "데이트"],
    places: [
      { name: "롯데월드타워 서울스카이", region: "송파구 신천동", memo: "555m 전망대", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Purple_sky_of_Seoul_and_Lotte_World_Tower.jpg/960px-Purple_sky_of_Seoul_and_Lotte_World_Tower.jpg" },
      { name: "롯데월드몰", region: "송파구 신천동", memo: "식사와 쇼핑", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Lotte_World_Mall_in_Seoul.jpg/960px-Lotte_World_Mall_in_Seoul.jpg" },
      { name: "석촌호수", region: "송파구 잠실동", memo: "야경 산책", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Seokchon_Lake_in_Seoul.jpg/960px-Seokchon_Lake_in_Seoul.jpg" },
      { name: "잠실종합운동장", region: "송파구 잠실동", memo: "공연·경기", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Seoul_Sports_Complex.jpg/960px-Seoul_Sports_Complex.jpg" },
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
      { name: "북촌한옥마을", region: "종로구 가회동", memo: "한옥 골목 사진 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Bukchon-ro_11-gil_street_with_hanok_houses_at_blue_hour_in_Bukchon_Hanok_Village_Seoul.jpg/960px-Bukchon-ro_11-gil_street_with_hanok_houses_at_blue_hour_in_Bukchon_Hanok_Village_Seoul.jpg" },
      { name: "가회동성당", region: "종로구 가회동", memo: "한옥 양식 성당", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Korea_Gaheedong_Catholic_Church_20140424_07_%2814062441743%29.jpg/960px-Korea_Gaheedong_Catholic_Church_20140424_07_%2814062441743%29.jpg" },
      { name: "안국역", region: "종로구 안국동", memo: "북촌·인사동 접근점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Anguk_Station_20230402_001.jpg/960px-Anguk_Station_20230402_001.jpg" },
      { name: "인사동", region: "종로구 인사동", memo: "전통 공예 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Insa-dong_%EC%9D%B8%EC%82%AC%EB%8F%99_October_1_2020_12.jpg/960px-Insa-dong_%EC%9D%B8%EC%82%AC%EB%8F%99_October_1_2020_12.jpg" },
    ],
  },
  {
    slug: "seochon-art-walk",
    title: "서촌 산책 코스",
    description: "갤러리와 옛 가옥, 시장이 어우러진 서촌의 차분한 산책",
    region: "서촌",
    tags: ["예술", "전통", "산책"],
    places: [
      { name: "통의동 보안여관", region: "종로구 통의동", memo: "복합 문화 공간", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Daelim_Museum.jpg/960px-Daelim_Museum.jpg" },
      { name: "대림미술관", region: "종로구 통의동", memo: "사진·디자인 전시", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Daelim_Museum.jpg/960px-Daelim_Museum.jpg" },
      { name: "통인시장", region: "종로구 통인동", memo: "도시락 카페로 유명", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Korea_Tongin_Market_01_%2812920987714%29.jpg/960px-Korea_Tongin_Market_01_%2812920987714%29.jpg" },
      { name: "윤동주문학관", region: "종로구 청운동", memo: "시인의 자취", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Yoon_Dongju_11_%287869277926%29.jpg/960px-Yoon_Dongju_11_%287869277926%29.jpg" },
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
      { name: "을지로3가역", region: "중구 을지로3가", memo: "힙지로 탐방의 출발점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Euljiro_3-ga_Station_20240929_001.jpg/960px-Euljiro_3-ga_Station_20240929_001.jpg" },
      { name: "을지면옥", region: "중구 주교동", memo: "노포 평양냉면의 정석", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Euljiro_3-ga_Station_20240929_001.jpg/960px-Euljiro_3-ga_Station_20240929_001.jpg" },
      { name: "호프", region: "중구 을지로3가", memo: "골목 안 숨은 맥주집 분위기", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Euljiro_3-ga_Station_20240929_001.jpg/960px-Euljiro_3-ga_Station_20240929_001.jpg" },
      { name: "을지로 노가리골목", region: "중구 을지로3가", memo: "저녁이면 활기찬 노상", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Euljiro_3-ga_Station_20240929_001.jpg/960px-Euljiro_3-ga_Station_20240929_001.jpg" },
      { name: "청계천", region: "중구 장교동", memo: "야경 산책으로 마무리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cheonggyecheon_Stream_in_sunset.jpg/960px-Cheonggyecheon_Stream_in_sunset.jpg" },
    ],
  },
  {
    slug: "ikseon-hanok-date-v1",
    title: "익선동 한옥 데이트",
    description: "좁은 한옥 골목에 모인 감성 카페와 소품숍을 둘러보는 데이트",
    region: "익선동",
    tags: ["전통", "카페", "데이트"],
    places: [
      { name: "익선동 한옥거리", region: "종로구 익선동", memo: "한옥 개조 카페 골목", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_5.jpg/960px-Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_5.jpg" },
      { name: "낙원악기상가", region: "종로구 낙원동", memo: "옥상정원과 예술영화관", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_5.jpg/960px-Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_5.jpg" },
      { name: "창덕궁", region: "종로구 와룡동", memo: "후원이 아름다운 궁궐", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Exterior_front_view_of_the_pavilion_Samsamwa_with_blue_sky_at_Changdeokgung_Palace_in_Seoul.jpg/960px-Exterior_front_view_of_the_pavilion_Samsamwa_with_blue_sky_at_Changdeokgung_Palace_in_Seoul.jpg" },
      { name: "익선동 거리", region: "종로구 익선동", memo: "한옥 사이 소품숍 골목", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_3.jpg/960px-Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_3.jpg" },
    ],
  },
  {
    slug: "gwangjang-market-food-v1",
    title: "광장시장 먹거리 투어",
    description: "빈대떡과 마약김밥, 육회까지 전통시장의 먹거리를 정복하는 코스",
    region: "종로",
    tags: ["미식", "전통", "활기찬"],
    places: [
      { name: "광장시장", region: "종로구 예지동", memo: "먹거리 투어의 중심", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Gwangjang_Market%2C_Seoul_01.jpg/960px-Gwangjang_Market%2C_Seoul_01.jpg" },
      { name: "광장시장 마약김밥", region: "종로구 예지동", memo: "줄 서서 먹는 명물", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gwangjang_Market%2C_Seoul_02.jpg/960px-Gwangjang_Market%2C_Seoul_02.jpg" },
      { name: "부촌육회", region: "종로구 예지동", memo: "신선한 생육회", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Yukhoe_in_Gwangjang_Market%2C_Seoul.jpg/960px-Yukhoe_in_Gwangjang_Market%2C_Seoul.jpg" },
      { name: "방산시장", region: "중구 을지로5가", memo: "식후 구경거리 골목", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EB%B0%A9%EC%82%B0%EC%8B%9C%EC%9E%A5.jpg/960px-%EB%B0%A9%EC%82%B0%EC%8B%9C%EC%9E%A5.jpg" },
      { name: "청계천", region: "종로구 장사동", memo: "산책으로 소화", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cheonggyecheon_Stream_in_sunset.jpg/960px-Cheonggyecheon_Stream_in_sunset.jpg" },
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
      { name: "망원시장", region: "마포구 망원동", memo: "고로케·닭강정으로 유명", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mercado_Mangwon_en_Se%C3%BAl.jpg/960px-Mercado_Mangwon_en_Se%C3%BAl.jpg" },
      { name: "포비 망원", region: "마포구 망원동", memo: "베이글과 커피", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mercado_Mangwon_en_Se%C3%BAl.jpg/960px-Mercado_Mangwon_en_Se%C3%BAl.jpg" },
      { name: "망원한강공원", region: "마포구 망원동", memo: "노을 명소 한강뷰", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Mangwon_Hangang_Park.png/960px-Mangwon_Hangang_Park.png" },
      { name: "카페 망리단길", region: "마포구 망원동", memo: "망리단길 감성 카페거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mercado_Mangwon_en_Se%C3%BAl.jpg/960px-Mercado_Mangwon_en_Se%C3%BAl.jpg" },
    ],
  },
  {
    slug: "sangsu-indie-night-v1",
    title: "상수 인디 음악 코스",
    description: "상수동의 라이브 클럽과 골목 카페로 채우는 인디 감성 저녁",
    region: "상수",
    tags: ["활기찬", "예술", "카페"],
    places: [
      { name: "상수역", region: "마포구 상수동", memo: "골목 탐방의 시작", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Seoul-metro-623-Sangsu-station-entrance-3-20191022-075652.jpg/960px-Seoul-metro-623-Sangsu-station-entrance-3-20191022-075652.jpg" },
      { name: "제비다방", region: "마포구 상수동", memo: "인디 공연이 열리는 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Seoul-metro-623-Sangsu-station-entrance-3-20191022-075652.jpg/960px-Seoul-metro-623-Sangsu-station-entrance-3-20191022-075652.jpg" },
      { name: "클럽 빵", region: "마포구 서교동", memo: "역사 깊은 인디 라이브 클럽", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Street_hongdae_Seoul.jpg/960px-Street_hongdae_Seoul.jpg" },
      { name: "절두산순교성지", region: "마포구 합정동", memo: "한강뷰로 마무리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg/960px-Jeoldusan_Martyr%27s_Grounds%2C_Seoul%2C_Korea_%2814521171947%29.jpg" },
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
      { name: "청담동 명품거리", region: "강남구 청담동", memo: "플래그십 스토어 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cheongdam-dong.jpg" },
      { name: "House of Dior 청담", region: "강남구 청담동", memo: "건축이 멋진 플래그십", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cheongdam-dong.jpg" },
      { name: "송은아트스페이스", region: "강남구 청담동", memo: "현대미술 전시 공간", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cheongdam-dong.jpg" },
      { name: "분더샵 청담", region: "강남구 청담동", memo: "편집숍 쇼핑", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cheongdam-dong.jpg" },
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
      { name: "서울숲", region: "성동구 성수동1가", memo: "사슴 방사장과 너른 잔디밭", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seoul_Forest_in_May_2022_%281%29.jpg/960px-Seoul_Forest_in_May_2022_%281%29.jpg" },
      { name: "언더스탠드에비뉴", region: "성동구 성수동1가", memo: "컨테이너 복합 공간", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seoul_Forest_in_May_2022_%281%29.jpg/960px-Seoul_Forest_in_May_2022_%281%29.jpg" },
      { name: "성수연방", region: "성동구 성수동2가", memo: "옥상정원이 있는 카페", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seoul_Forest_in_May_2022_%281%29.jpg/960px-Seoul_Forest_in_May_2022_%281%29.jpg" },
      { name: "뚝섬한강공원", region: "성동구 자양동", memo: "한강 자전거 산책", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Ttukseom_Hangang_Park_20260416_2.jpg/960px-Ttukseom_Hangang_Park_20260416_2.jpg" },
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
      { name: "더현대 서울", region: "영등포구 여의도동", memo: "사운즈포레스트 실내 정원", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/The_Hyundai_Seoul_Yeoui-dong_3.jpg/960px-The_Hyundai_Seoul_Yeoui-dong_3.jpg" },
      { name: "여의도한강공원", region: "영등포구 여의도동", memo: "야경과 치맥 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Yeouido_Hangang_Park_seen_from_Dangsan_Railway_Bridge.jpg/960px-Yeouido_Hangang_Park_seen_from_Dangsan_Railway_Bridge.jpg" },
      { name: "물빛광장", region: "영등포구 여의도동", memo: "분수쇼가 열리는 광장", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Yeouido_Park_230722.jpg/960px-Yeouido_Park_230722.jpg" },
      { name: "63스퀘어", region: "영등포구 여의도동", memo: "전망대에서 보는 한강", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/63_Building.jpg/960px-63_Building.jpg" },
    ],
  },

  // ─── 반포 (1) ───
  {
    slug: "banpo-night-walk-v1",
    title: "반포 야경 한강 산책",
    description: "달빛무지개분수와 세빛섬 야경을 따라 걷는 반포 나이트 코스",
    region: "반포",
    tags: ["야경", "산책", "데이트"],
    places: [
      { name: "반포한강공원", region: "서초구 반포동", memo: "치맥과 피크닉의 성지. 한강뷰 명소", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Banpo_Hangang_Park_%28%EC%84%9C%EC%B4%88%EA%B5%AC_2020%29.jpg/960px-Banpo_Hangang_Park_%28%EC%84%9C%EC%B4%88%EA%B5%AC_2020%29.jpg" },
      { name: "달빛무지개분수", region: "서초구 반포동", memo: "세계 최장 교량 분수. 야간 분수 쇼가 장관", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Banpo_Bridge_Moonlight_Rainbow_Fountain_02.jpg/960px-Banpo_Bridge_Moonlight_Rainbow_Fountain_02.jpg" },
      { name: "세빛섬", region: "서초구 반포동", memo: "한강 위 세 개 인공섬. 야경이 특히 아름다움", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sevit-do_Island_in_Seoul_Korea.jpg/960px-Sevit-do_Island_in_Seoul_Korea.jpg" },
      { name: "잠수교", region: "서초구 반포동", memo: "걸어서 한강 위를 건너는 색다른 경험", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Banpo_Hangang_Park_%28%EC%84%9C%EC%B4%88%EA%B5%AC_2020%29.jpg/960px-Banpo_Hangang_Park_%28%EC%84%9C%EC%B4%88%EA%B5%AC_2020%29.jpg" },
    ],
  },

  // ─── 광화문 (1) ───
  {
    slug: "gyeongbokgung-history-v1",
    title: "경복궁·광화문 역사 데이트",
    description: "조선 정궁 경복궁부터 광화문광장, 청와대까지 역사와 현재가 공존하는 코스",
    region: "광화문",
    tags: ["전통", "산책", "예술"],
    places: [
      { name: "경복궁", region: "종로구 세종로", memo: "조선의 법궁. 아침 수문장 교대식도 놓치지 말 것", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%EA%B2%BD%EB%B3%B5%EA%B6%81.jpg/960px-%EA%B2%BD%EB%B3%B5%EA%B6%81.jpg" },
      { name: "국립민속박물관", region: "종로구 세종로", memo: "경복궁 내 무료 입장 민속 박물관", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/National_Folk_Museum_of_Korea.jpg/960px-National_Folk_Museum_of_Korea.jpg" },
      { name: "청와대", region: "종로구 청와대로", memo: "2022년 이후 전면 개방. 잔디밭과 본관이 볼거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Cheong_Wa_Dae_main_building.jpg/960px-Cheong_Wa_Dae_main_building.jpg" },
      { name: "광화문광장", region: "종로구 세종로", memo: "이순신 장군상·세종대왕상 앞에서 산책 마무리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seoul_Gwanghwamun_Square_20230401.jpg/960px-Seoul_Gwanghwamun_Square_20230401.jpg" },
    ],
  },

  // ─── 대학로 (1) ───
  {
    slug: "daehangno-theater-date-v1",
    title: "대학로 연극·낙산 데이트",
    description: "소극장 공연 전후로 마로니에공원과 낙산 성곽길을 걷는 문화 데이트",
    region: "대학로",
    tags: ["예술", "활기찬", "산책"],
    places: [
      { name: "혜화역", region: "종로구 혜화동", memo: "대학로 탐방의 시작점. 4번 출구에서 바로 대학로", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marronnier_Park%2C_Seoul.jpg/960px-Marronnier_Park%2C_Seoul.jpg" },
      { name: "마로니에공원", region: "종로구 동숭동", memo: "대학로의 심장. 주말엔 거리 공연이 열림", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marronnier_Park%2C_Seoul.jpg/960px-Marronnier_Park%2C_Seoul.jpg" },
      { name: "서울시립대학교", region: "동대문구 전농동", memo: "낙산 성곽으로 이어지는 연결 지점", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marronnier_Park%2C_Seoul.jpg/960px-Marronnier_Park%2C_Seoul.jpg" },
      { name: "이화동 벽화마을", region: "종로구 이화동", memo: "알록달록 골목 벽화. 포토 스팟으로 인기", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Marronnier_Park%2C_Seoul.jpg/960px-Marronnier_Park%2C_Seoul.jpg" },
    ],
  },

  // ─── 이촌 (1) ───
  {
    slug: "ichon-museum-walk-v1",
    title: "이촌 박물관 데이트",
    description: "국립중앙박물관부터 한강까지, 지적 자극과 자연을 함께 즐기는 반나절 코스",
    region: "이촌",
    tags: ["전통", "예술", "조용한"],
    places: [
      { name: "국립중앙박물관", region: "용산구 용산동6가", memo: "한국 최대 박물관. 상설 전시만도 반나절", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/National_Museum_of_Korea.jpg/960px-National_Museum_of_Korea.jpg" },
      { name: "국립한글박물관", region: "용산구 용산동6가", memo: "국립중앙박물관 옆 무료 입장. 콘텐츠가 풍부", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/National_Museum_of_Korea.jpg/960px-National_Museum_of_Korea.jpg" },
      { name: "이촌한강공원", region: "용산구 이촌동", memo: "박물관 관람 후 걷기 좋은 한강변", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Yeouido_Hangang_Park_seen_from_Dangsan_Railway_Bridge.jpg/960px-Yeouido_Hangang_Park_seen_from_Dangsan_Railway_Bridge.jpg" },
    ],
  },

  // ─── 강동 (1) ───
  {
    slug: "olympic-park-nature-v1",
    title: "올림픽공원 자연 데이트",
    description: "소마미술관과 88호수, 몽촌토성을 잇는 드넓은 공원 피크닉 코스",
    region: "강동",
    tags: ["자연", "산책", "예술"],
    places: [
      { name: "올림픽공원", region: "송파구 방이동", memo: "100만 평 너른 공원. 들꽃과 조각 작품이 가득", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Seoul_Olympic_Park_20240929.jpg/960px-Seoul_Olympic_Park_20240929.jpg" },
      { name: "소마미술관", region: "송파구 방이동", memo: "올림픽공원 내 조각 공원과 연결된 미술관", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Seoul_Olympic_Park_20240929.jpg/960px-Seoul_Olympic_Park_20240929.jpg" },
      { name: "몽촌토성", region: "송파구 방이동", memo: "백제 시대 토성. 공원 안에서 역사 산책", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Seoul_Olympic_Park_20240929.jpg/960px-Seoul_Olympic_Park_20240929.jpg" },
      { name: "올림픽공원 88호수", region: "송파구 올림픽로", memo: "공원 중앙 호수. 오리배 타기 가능", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Seoul_Olympic_Park_20240929.jpg/960px-Seoul_Olympic_Park_20240929.jpg" },
    ],
  },

  // ─── 수원 (1) ───
  {
    slug: "suwon-hwaseong-v1",
    title: "수원 화성 역사 투어",
    description: "유네스코 세계문화유산 수원화성 성곽길과 행궁동 골목, 팔달문 시장을 잇는 코스",
    region: "수원",
    tags: ["전통", "산책", "자연"],
    places: [
      { name: "수원화성", region: "수원시 팔달구 매향동", memo: "유네스코 세계문화유산. 성곽 일주 약 5.7km", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Korea-Suwon-Hwaseong-01.jpg/960px-Korea-Suwon-Hwaseong-01.jpg" },
      { name: "화홍문", region: "수원시 팔달구 북수동", memo: "수원천 위에 세운 수문. 사진 찍기 좋은 포인트", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Hwahongmun_at_Hwaseong_Fortress%2C_Suwon.jpg/960px-Hwahongmun_at_Hwaseong_Fortress%2C_Suwon.jpg" },
      { name: "행궁동 벽화마을", region: "수원시 팔달구 행궁동", memo: "수원화성 옆 감성 골목. 카페와 벽화가 가득", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Korea-Suwon-Hwaseong-01.jpg/960px-Korea-Suwon-Hwaseong-01.jpg" },
      { name: "팔달문시장", region: "수원시 팔달구 팔달로2가", memo: "수원 최대 전통시장. 순대국·족발이 명물", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Korea-Suwon-Hwaseong-01.jpg/960px-Korea-Suwon-Hwaseong-01.jpg" },
    ],
  },

  // ─── 인천 (1) ───
  {
    slug: "incheon-gaehangro-v1",
    title: "인천 개항로 감성 투어",
    description: "개화기 건축과 차이나타운, 신포시장이 어우러진 인천의 타임슬립 코스",
    region: "인천",
    tags: ["트렌디", "전통", "미식"],
    places: [
      { name: "인천개항박물관", region: "인천 중구 중앙동1가", memo: "개항기 역사가 담긴 박물관. 건물 자체가 볼거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Incheon_Open_Port_Museum.jpg/960px-Incheon_Open_Port_Museum.jpg" },
      { name: "인천 차이나타운", region: "인천 중구 북성동1가", memo: "짜장면 발상지. 100년 넘은 화교 거리", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Incheon_Chinatown_2019.jpg/960px-Incheon_Chinatown_2019.jpg" },
      { name: "자유공원", region: "인천 중구 자유공원로", memo: "인천 최초의 공원. 항구 전망이 좋음", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Incheon_Chinatown_2019.jpg/960px-Incheon_Chinatown_2019.jpg" },
      { name: "신포국제시장", region: "인천 중구 신포동", memo: "닭강정과 만두가 유명한 인천 대표 전통시장", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Incheon_Chinatown_2019.jpg/960px-Incheon_Chinatown_2019.jpg" },
    ],
  },

  // ─── 성북 (1) ───
  {
    slug: "seongbuk-culture-walk-v1",
    title: "성북동 문화 산책",
    description: "간송미술관과 한용운 가옥 심우장, 한옥 찻집 수연산방을 잇는 고즈넉한 성북동 산책",
    region: "성북",
    tags: ["조용한", "예술", "전통"],
    places: [
      { name: "간송미술관", region: "성북구 성북동", memo: "한국 최초 사립미술관. 봄·가을 기획전 기간에 개방", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gansong_Museum.jpg/960px-Gansong_Museum.jpg" },
      { name: "심우장", region: "성북구 성북동", memo: "독립운동가 한용운 선생의 가옥. 등록문화재", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gansong_Museum.jpg/960px-Gansong_Museum.jpg" },
      { name: "수연산방", region: "성북구 성북동", memo: "소설가 이태준 옛집을 개조한 한옥 찻집", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gansong_Museum.jpg/960px-Gansong_Museum.jpg" },
      { name: "성북동 문화재마을", region: "성북구 성북동", memo: "대사관과 근현대 문화재가 공존하는 조용한 골목", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gansong_Museum.jpg/960px-Gansong_Museum.jpg" },
    ],
  },
]
