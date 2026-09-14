const F = (name) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(name) + '?width=400';

const BASE_SPOTS = [
  // ── 홍콩섬 (센트럴/성완) ──
  { id:1, name:"빅토리아 피크 (스카이테라스)", lat:22.2711, lng:114.1499, color:"#e74c3c", must:true,
    desc:"홍콩 여행 1순위! 마천루+빅토리아항 파노라마 야경. 일몰~야경 타이밍 추천",
    tags:["피크트램","전망","아이★★★★"],
    img:F("Hong Kong Night Skyline.jpg") },
  { id:2, name:"피크트램", lat:22.2775, lng:114.1608, color:"#e74c3c", must:true,
    desc:"1888년부터 운행한 급경사 트램. 45도 기울어 오르는 체험 자체가 어트랙션!",
    tags:["센트럴","체험","아이★★★★★"],
    img:F("The Peak Tram, Hong Kong (Ank Kumar) 01.jpg") },
  { id:3, name:"미드레벨 에스컬레이터", lat:22.2837, lng:114.1550, color:"#e74c3c", must:false,
    desc:"세계 최장 야외 에스컬레이터(800m). 소호 카페/맛집 골목과 연결",
    tags:["도보","소호","아이★★★"],
    img:F("Central-Mid-levels escalator.jpg") },
  { id:4, name:"만모사원", lat:22.2839, lng:114.1502, color:"#e74c3c", must:false,
    desc:"천장 가득 나선형 향이 이색적인 도교 사원. 할리우드로드 골동품 거리 옆",
    tags:["도보","사원","아이★★"],
    img:F("Man Mo Temple, Hong Kong.jpg") },
  { id:5, name:"타이쿤", lat:22.2818, lng:114.1540, color:"#e74c3c", must:false,
    desc:"옛 경찰서+감옥을 개조한 복합문화공간. 전시/카페/포토스팟. 무료입장",
    tags:["도보","문화","아이★★★"],
    img:F("Tai Kwun 2021 03 11.jpg") },
  { id:6, name:"PMQ", lat:22.2834, lng:114.1519, color:"#e74c3c", must:false,
    desc:"옛 기혼경찰숙소를 개조한 디자이너 편집숍 몰. 기념품 사기 좋음",
    tags:["도보","쇼핑","아이★★"], img:null },
  { id:7, name:"란콰이퐁", lat:22.2807, lng:114.1554, color:"#8e44ad", must:false,
    desc:"홍콩 대표 나이트라이프 거리. 펍/바 밀집. 저녁 분위기 최고",
    tags:["저녁","바/펍","어른전용"],
    img:F("HK Central Lan Kwai Fong Bar nite a.jpg") },
  { id:8, name:"익청빌딩 (몬스터빌딩)", lat:22.2843, lng:114.2126, color:"#e74c3c", must:false,
    desc:"트랜스포머 촬영지. 아파트가 병풍처럼 둘러싼 압도적 인생샷 스팟",
    tags:["MTR쿼리베이","사진","아이★★"],
    img:F("Montane Mansion courtyard upward view Quarry Bay Hong Kong 2024 dllu.jpg") },

  // ── 구룡 (침사추이/몽콕) ──
  { id:9, name:"스타페리", lat:22.2937, lng:114.1685, color:"#3498db", must:true,
    desc:"침사추이↔센트럴 5분 페리. 배 타고 빅토리아항 건너기, 아이에게 최고 놀이!",
    tags:["이동수단","항구","아이★★★★★"],
    img:F("Star Ferry, Victoria Harbour (31002395685).jpg") },
  { id:10, name:"심포니 오브 라이츠", lat:22.2933, lng:114.1745, color:"#8e44ad", must:true,
    desc:"매일 저녁 8시, 빅토리아항 레이저+조명 쇼. 침사추이 해변 산책로에서 관람",
    tags:["저녁8시","무료","아이★★★★"],
    img:F("Symphony of Lights.jpg") },
  { id:11, name:"시계탑 & 스타의 거리", lat:22.2936, lng:114.1694, color:"#3498db", must:false,
    desc:"옛 기차역 시계탑+해변 산책로. 이소룡 동상, 홍콩섬 스카이라인 뷰",
    tags:["도보","산책","아이★★★"],
    img:F("Hong Kong Clock Tower.jpg") },
  { id:12, name:"하버시티", lat:22.2965, lng:114.1688, color:"#3498db", must:false,
    desc:"홍콩 최대 쇼핑몰. 에어컨 피난처+키즈존. 스타페리 선착장 바로 옆",
    tags:["쇼핑","실내","아이★★★"], img:null },
  { id:13, name:"스카이100 (ICC)", lat:22.3037, lng:114.1602, color:"#3498db", must:false,
    desc:"홍콩 최고층 ICC 100층 실내 전망대. 360도 뷰. 날씨 안 좋을 때 대안",
    tags:["MTR구룡역","전망대","아이★★★"],
    img:F("Hong Kong Sky100.jpg") },
  { id:14, name:"딤섬 맛집 투어", lat:22.2988, lng:114.1722, color:"#3498db", must:true,
    desc:"홍콩 왔으면 딤섬 필수! 팀호완(미슐랭 최저가)·딘타이펑·로컬 찻집",
    tags:["먹거리","미슐랭","아이★★★★"], img:null },
  { id:15, name:"레이디스 마켓 (몽콕)", lat:22.3196, lng:114.1705, color:"#8e44ad", must:false,
    desc:"몽콕 대표 노점 시장. 기념품/짝퉁/잡화. 흥정은 필수!",
    tags:["MTR몽콕","야시장","아이★★"],
    img:F("Tung Choi Street.jpg") },
  { id:16, name:"금붕어시장 & 꽃시장", lat:22.3247, lng:114.1699, color:"#3498db", must:false,
    desc:"비닐봉지에 담긴 금붕어가 주렁주렁! 아이들이 신기해하는 로컬 시장",
    tags:["MTR프린스에드워드","로컬","아이★★★★"], img:null },
  { id:17, name:"템플스트리트 야시장", lat:22.3049, lng:114.1703, color:"#8e44ad", must:true,
    desc:"홍콩 대표 야시장. 노점 먹거리+점집+기념품. 영화 촬영지 단골",
    tags:["저녁","먹거리","아이★★★"],
    img:F("Mercado en Temple St., Hong Kong, 2013-08-11, DD 01.JPG") },
  { id:26, name:"초이홍 아파트 (무지개)", lat:22.3355, lng:114.2100, color:"#3498db", must:false,
    desc:"무지개색 아파트+농구장 인생샷 스팟. 인스타 성지. 주민 배려 필수",
    tags:["MTR초이홍","사진","아이★★"],
    img:F("Choi Hung Estate.jpg") },

  // ── 근교/반나절 ──
  { id:18, name:"옹핑360 + 빅부다", lat:22.2540, lng:113.9050, color:"#27ae60", must:true,
    desc:"25분 케이블카(크리스탈 바닥!)로 산 넘어 세계 최대 야외 청동좌불. 반나절 코스",
    tags:["MTR텅충","케이블카","아이★★★★★"],
    img:F("Tian Tan Buddha.jpg") },
  { id:19, name:"타이오 수상가옥 마을", lat:22.2557, lng:113.8626, color:"#27ae60", must:false,
    desc:"'홍콩의 베네치아' 어촌마을. 수상가옥+보트투어+분홍돌고래. 옹핑에서 버스 20분",
    tags:["옹핑연계","보트","아이★★★★"],
    img:F("Tai O stilt houses.jpg") },
  { id:20, name:"홍콩 디즈니랜드", lat:22.3130, lng:114.0413, color:"#27ae60", must:false,
    desc:"세계에서 가장 컴팩트한 디즈니. 대기 짧은 편. 아이 있으면 하루 통째로",
    tags:["하루종일","테마파크","아이★★★★★"],
    img:F("Hong Kong Disneyland Castle.jpg") },
  { id:21, name:"오션파크", lat:22.2467, lng:114.1757, color:"#27ae60", must:false,
    desc:"수족관+동물원+놀이기구+케이블카. 판다 있음! 디즈니와 양자택일",
    tags:["하루종일","테마파크","아이★★★★★"],
    img:F("Ocean Park Hong Kong.jpg") },
  { id:22, name:"리펄스베이", lat:22.2360, lng:114.1970, color:"#27ae60", must:false,
    desc:"홍콩 부촌의 해변. 모래사장 산책+틴하우 사원. 버스로 남부 드라이브",
    tags:["버스","해변","아이★★★"],
    img:F("Repulse Bay, Hong Kong.jpg") },
  { id:23, name:"스탠리 마켓", lat:22.2189, lng:114.2118, color:"#27ae60", must:false,
    desc:"유러피안 감성 해변 마을+시장. 리펄스베이와 묶어 반나절 코스",
    tags:["버스","시장","아이★★"],
    img:F("Stanley Market.jpg") },
  { id:24, name:"난리안가든 & 치린수도원", lat:22.3402, lng:114.2028, color:"#27ae60", must:false,
    desc:"도심 속 당나라식 정원+사찰. 금색 파빌리온 인생샷. 무료입장",
    tags:["MTR다이아몬드힐","정원","아이★★"],
    img:F("Nan Lian Garden.jpg") },
  { id:25, name:"웡타이신 사원", lat:22.3427, lng:114.1935, color:"#27ae60", must:false,
    desc:"소원 잘 들어주기로 유명한 도교 사원. 점술 거리 구경도 재미",
    tags:["MTR웡타이신","사원","아이★★"], img:null },
  { id:39, name:"딩딩트램 (2층 트램)", lat:22.2776, lng:114.1750, color:"#e74c3c", must:true,
    desc:"120년 된 2층 트램, 단돈 500원! 2층 맨 앞자리에서 홍콩섬 관통. 체험 자체가 명물",
    tags:["이동수단","체험","아이★★★★★"],
    img:F("Hong Kong Tramways Double Decker Tram (Ank Kumar) 03.jpg") },
  { id:40, name:"M+ & 서구룡 문화지구", lat:22.3009, lng:114.1600, color:"#3498db", must:false,
    desc:"아시아 최대 현대미술관+하버뷰 잔디밭. 산책/피크닉 좋음. 스카이100 근처",
    tags:["MTR구룡역","미술관","아이★★★"],
    img:F("HK Kln West Museum Drive West Kowloon Cultural District M+ Plus Art Museum Cinema March 2025 R12S.jpg") },
  { id:41, name:"아쿠아루나 (붉은돛 정크선)", lat:22.2920, lng:114.1660, color:"#8e44ad", must:false,
    desc:"붉은 돛 전통 정크선으로 빅토리아항 45분 크루즈. 심포니 타임 배편이 인기",
    tags:["저녁추천","크루즈","아이★★★★"],
    img:F("Junk at victoria harbour.jpg") },
  { id:42, name:"드래곤스백 하이킹", lat:22.2461, lng:114.2367, color:"#27ae60", must:false,
    desc:"세계적으로 유명한 도심 근교 능선 트레일(2~3시간). 셱오 해변과 연계",
    tags:["반나절","하이킹","아이★★"],
    img:F("Dragon's Back - Trail Start, Hong Kong (Unsplash).jpg") },
  { id:43, name:"홍콩과학관", lat:22.3012, lng:114.1776, color:"#3498db", must:false,
    desc:"체험형 과학관. 아이 동반+비 오는 날 플랜B로 최적. 역사박물관 바로 옆",
    tags:["실내","박물관","아이★★★★"],
    img:F("Hong Kong Museum of History and Hong Kong Science Museum.JPG") },

  // ── 마카오 (반도) ──
  { id:27, name:"세나도 광장", lat:22.1934, lng:113.5398, color:"#16a085", must:true,
    desc:"물결무늬 포르투갈 타일 바닥의 세계문화유산 광장. 마카오 구시가 중심",
    tags:["도보","유산","아이★★★"],
    img:F("Senado Square, Macau - 20101117.jpg") },
  { id:28, name:"성 바울 성당 유적", lat:22.1975, lng:113.5410, color:"#16a085", must:true,
    desc:"마카오의 상징! 파사드만 남은 성당 유적. 세나도 광장에서 도보 8분, 육포거리 경유",
    tags:["도보","유산","아이★★★"],
    img:F("Ruins of St. Paul's.jpg") },
  { id:29, name:"몬테 요새", lat:22.1970, lng:113.5432, color:"#16a085", must:false,
    desc:"성 바울 유적 바로 옆 언덕 요새. 대포+마카오 시내 전망. 무료",
    tags:["도보","전망","아이★★★"],
    img:F("Fortaleza del Monte, Macao, 2013-08-08, DD 01.jpg") },
  { id:30, name:"기아 요새 & 등대", lat:22.1972, lng:113.5497, color:"#16a085", must:false,
    desc:"마카오 최고(最高)점. 케이블카로 올라가는 등대+요새. 전망 좋음",
    tags:["케이블카","전망","아이★★★"],
    img:F("Guia Lighthouse.jpg") },
  { id:31, name:"아마 사원", lat:22.1866, lng:113.5313, color:"#16a085", must:false,
    desc:"'마카오' 이름의 유래가 된 500년 사원. 바닷가 언덕의 도교 사원",
    tags:["버스","사원","아이★★"],
    img:F("A-Ma Temple (Macau) 01.JPG") },
  { id:32, name:"펠리시다데 거리 (육포거리)", lat:22.1927, lng:113.5375, color:"#16a085", must:false,
    desc:"붉은 창틀의 옛 거리. 육포/아몬드쿠키 시식 천국. 인디아나존스 촬영지",
    tags:["도보","먹거리","아이★★★"],
    img:F("\"Rua da Felicidade\" at night.jpg") },
  { id:33, name:"그랜드 리스보아 야경", lat:22.1898, lng:113.5432, color:"#8e44ad", must:false,
    desc:"연꽃 모양 황금 카지노 타워. 마카오 반도 야경의 중심. 밖에서 구경만도 충분",
    tags:["저녁","야경","아이★★"],
    img:F("Grand Lisboa.jpg") },
  { id:34, name:"마카오 타워", lat:22.1796, lng:113.5369, color:"#16a085", must:false,
    desc:"338m 타워. 세계 최고 높이 번지점프+스카이워크. 전망대만도 OK",
    tags:["버스","전망대","아이★★★"],
    img:F("Macau Tower.jpg") },

  // ── 마카오 (타이파/코타이) ──
  { id:35, name:"베네시안 마카오", lat:22.1454, lng:113.5636, color:"#16a085", must:true,
    desc:"실내 베네치아 운하+곤돌라! 하늘 천장 아래 쇼핑몰. 무료 셔틀버스 활용",
    tags:["무료셔틀","리조트","아이★★★★"],
    img:F("The Venetian Macao.jpg") },
  { id:36, name:"파리지앵 (에펠탑)", lat:22.1417, lng:113.5620, color:"#16a085", must:false,
    desc:"절반 크기 에펠탑! 전망대 탑승 가능. 밤 조명이 예쁨. 베네시안 도보 5분",
    tags:["도보","사진","아이★★★"],
    img:F("The Parisian Macao.jpg") },
  { id:37, name:"쿤하 거리 (타이파 빌리지)", lat:22.1538, lng:113.5578, color:"#16a085", must:true,
    desc:"타이파 먹자골목. 에그타르트/육포/세라두라 등 마카오 간식 총집합",
    tags:["도보","먹거리","아이★★★★"],
    img:F("Rua do Cunha.jpg") },
  { id:38, name:"콜로안 & 로드스토우 에그타르트", lat:22.1229, lng:113.5528, color:"#16a085", must:false,
    desc:"에그타르트 원조 로드스토우 본점! 파스텔톤 어촌마을 산책. 버스 30분",
    tags:["버스","먹거리","아이★★★"],
    img:F("Coloane Village, Macau (2051971111).jpg") },
  { id:44, name:"타이파 주택 박물관", lat:22.1533, lng:113.5610, color:"#16a085", must:false,
    desc:"민트색 콜로니얼 저택 5채. 마카오 대표 인생샷 스팟. 쿤하 거리 도보 5분",
    tags:["도보","사진","아이★★"],
    img:F("Taipa Houses Museum 01.JPG") },
  { id:45, name:"윈 팰리스 분수쇼 & 케이블카", lat:22.1466, lng:113.5657, color:"#16a085", must:false,
    desc:"무료 케이블카 타고 호수 위 한 바퀴+분수쇼! 공짜 어트랙션의 끝판왕",
    tags:["무료","분수쇼","아이★★★★"],
    img:F("Wynn Palace 02.jpg") },
  { id:46, name:"하우스 오브 댄싱 워터", lat:22.1497, lng:113.5602, color:"#8e44ad", must:false,
    desc:"시티오브드림스 대표 수중 서커스 쇼. 마카오 최고 공연. 예약 필수",
    tags:["예약필요","공연","아이★★★★"],
    img:F("The City of Dreams 200907.jpg") },
  { id:47, name:"마카오 과학관", lat:22.1847, lng:113.5495, color:"#16a085", must:false,
    desc:"펠레 설계 나선형 건물. 체험형 전시. 아이 동반+더위 피난처",
    tags:["실내","박물관","아이★★★★"],
    img:F("Macao Science Center 2011.JPG") },
];


const mtrLines = {
  tsuenwan: { color:"#e2231a", stations:[  // 췬완선 (레드)
    {name:"센트럴",lat:22.2819,lng:114.1582},{name:"애드미럴티",lat:22.2790,lng:114.1646},
    {name:"침사추이",lat:22.2975,lng:114.1722},{name:"조던",lat:22.3049,lng:114.1717},
    {name:"야우마테이",lat:22.3134,lng:114.1706},{name:"몽콕",lat:22.3193,lng:114.1694},
    {name:"프린스에드워드",lat:22.3245,lng:114.1684},{name:"삼수이포",lat:22.3308,lng:114.1622},
  ]},
  island: { color:"#0860a8", stations:[  // 아일랜드선 (블루)
    {name:"케네디타운",lat:22.2812,lng:114.1289},{name:"홍콩대",lat:22.2840,lng:114.1350},
    {name:"사이잉푼",lat:22.2855,lng:114.1428},{name:"성완",lat:22.2865,lng:114.1518},
    {name:"센트럴",lat:22.2819,lng:114.1582},{name:"애드미럴티",lat:22.2790,lng:114.1646},
    {name:"완차이",lat:22.2775,lng:114.1730},{name:"코즈웨이베이",lat:22.2801,lng:114.1850},
    {name:"틴하우",lat:22.2823,lng:114.1917},{name:"노스포인트",lat:22.2913,lng:114.2005},
    {name:"쿼리베이",lat:22.2880,lng:114.2097},{name:"타이쿠",lat:22.2848,lng:114.2166},
  ]},
  tungchung: { color:"#f7943e", stations:[  // 텅충선 (오렌지)
    {name:"홍콩역",lat:22.2849,lng:114.1584},{name:"구룡역",lat:22.3049,lng:114.1614},
    {name:"올림픽",lat:22.3178,lng:114.1602},{name:"남청",lat:22.3268,lng:114.1536},
    {name:"칭이",lat:22.3583,lng:114.1077},{name:"써니베이(디즈니환승)",lat:22.3316,lng:114.0290},
    {name:"텅충(옹핑360)",lat:22.2895,lng:113.9414},
  ]}
};
// 스타페리 항로 (점선)
const ferryRoute = [ [22.2937,114.1685], [22.2870,114.1610] ];
// 홍콩(성완 마카오페리터미널) ↔ 마카오(외항터미널) 페리 항로
const macauFerryRoute = [ [22.2886,114.1521], [22.2650,114.0200], [22.2200,113.7500], [22.1917,113.5593] ];

// 희수의 대화에서 확인한 지점만 추가합니다.
const HEESU_RESTAURANTS = [
  {
    "id": "heesu-dimdimsum",
    "name": "딤딤섬 · 조던점",
    "englishName": "DimDimSum",
    "address": "26-28 Man Wui Street, Jordan, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "딤섬"
    ],
    "verdict": "추천",
    "desc": "가장 무난한 딤섬집으로 추천.",
    "branchNote": "대화에서는 침사추이로 언급. 현재 주소가 확인되는 인근 조던점을 표시했으며 방문 지점은 미확정.",
    "source": "https://www.tripadvisor.co.uk/Restaurant_Review-g294217-d2437900-Reviews-DimDimSum_Dim_Sum_Specialty_Store_Jordan-Hong_Kong.html",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.30717,
    "lng": 114.16597,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=26%20MAN%20WUI%20STREET&n=3"
  },
  {
    "id": "heesu-onedimsum",
    "name": "원딤섬 · 침사추이점",
    "englishName": "One Dim Sum",
    "address": "G/F, The Hart, 4 Hart Avenue, Tsim Sha Tsui, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "딤섬"
    ],
    "verdict": "추천",
    "desc": "딤딤섬과 함께 무난한 선택으로 추천.",
    "branchNote": "지점 미지정. 공식 홈페이지에서 확인되는 침사추이점을 선택.",
    "source": "https://onedimsum.hk/%E8%81%AF%E7%B5%A1%E6%88%91%E5%80%91/?lang=en",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.29795,
    "lng": 114.17464,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=4%20HART%20AVENUE&n=3"
  },
  {
    "id": "heesu-yat",
    "name": "얏퉁힌 · Yat Tung Heen",
    "englishName": "Yat Tung Heen",
    "address": "B2, Eaton HK, 380 Nathan Road, Jordan, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "점심 딤섬"
    ],
    "verdict": "강추",
    "desc": "조금 비싸도 강하게 추천한 딤섬. 방문 전 예약 추천.",
    "branchNote": "",
    "source": "https://www.yattungheen.com",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.30804,
    "lng": 114.17182,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=EATON%20HOTEL%20380%20NATHAN%20ROAD&n=3"
  },
  {
    "id": "heesu-mott",
    "name": "Mott 32 · 홍콩",
    "englishName": "Mott 32",
    "address": "B/F, Standard Chartered Bank Building, 4-4A Des Voeux Road Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "북경오리",
      "차슈"
    ],
    "verdict": "강추",
    "desc": "분위기 좋은 식사. 북경오리와 차슈는 미리 예약해 두라는 추천.",
    "branchNote": "",
    "source": "https://mott32.com/hong-kong/",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28026,
    "lng": 114.15894,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=STANDARD%20CHARTERED%20BANK%20BUILDING&n=3"
  },
  {
    "id": "heesu-peking",
    "name": "Peking Garden · 센트럴",
    "englishName": "Peking Garden",
    "address": "B1, Alexandra House, 16-20 Chater Road, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "북경오리"
    ],
    "verdict": "추천",
    "desc": "Mott 32보다 부담이 덜한 북경오리 선택지로 추천.",
    "branchNote": "",
    "source": "https://www.discoverhongkong.com/eng/travel-guide/qts/restaurants-results/restaurants-details.id2421.peking-garden.html",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28151,
    "lng": 114.15836,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=ALEXANDRA%20HOUSE&n=3"
  },
  {
    "id": "heesu-golden",
    "name": "골든피닉스 · 프린스에드워드",
    "englishName": "Golden Phoenix Restaurant",
    "address": "G/F, 102 Lai Chi Kok Road, Prince Edward, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "홍콩식 미국산 스테이크"
    ],
    "verdict": "강추",
    "desc": "프린스에드워드 지점을 지정해 추천. 철판 스테이크와 로컬 분위기.",
    "branchNote": "",
    "source": "https://www.timeout.com/hong-kong/restaurants/golden-phoenix-restaurant",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.32477,
    "lng": 114.1658,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=102%20LAI%20CHI%20KOK%20ROAD&n=3"
  },
  {
    "id": "heesu-lao",
    "name": "라오장궤 동베이 · 타이콕추이",
    "englishName": "Lao Zhang Gui Dongbei Restaurant",
    "address": "Shops G708-G709, G/F, Cetus Square Mile, 18 Ka Shin Street, Tai Kok Tsui, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "생선 탕수",
      "동북요리"
    ],
    "verdict": "추천",
    "desc": "가격이 부담 없고 맛있다고 추천. 사진 속 생선 탕수를 특히 좋아함.",
    "branchNote": "대화의 침사추이 지점은 확인되지 않음. 현재 확인된 타이콕추이 지점의 참고 위치이며, 희수 방문 지점은 재확인 필요.",
    "source": "https://www.foodpanda.hk/chain/cx8of/lao-zhang-gui-dongbei-restaurant",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.32016,
    "lng": 114.16116,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=18%20KA%20SHIN%20STREET&n=3"
  },
  {
    "id": "heesu-yu",
    "name": "Yu Chuan Club · 완차이",
    "englishName": "Yu Chuan Club",
    "address": "Room B, 1/F, Hundred City Centre, 7-17 Amoy Street, Wan Chai, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "사천식 콜드누들",
      "사천요리"
    ],
    "verdict": "강추",
    "desc": "콜드누들을 와인과 먹는 조합 추천. 와인 반입 가능 여부와 현재 콜키지는 예약 시 확인.",
    "branchNote": "",
    "source": "https://www.openrice.com/en/hongkong/r-yu-chuan-club-wan-chai-sichuan-r25362",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.27557,
    "lng": 114.17181,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=HUNDRED%20CITY%20CENTRE&n=3"
  },
  {
    "id": "heesu-tea",
    "name": "My Cup of Tea · 완차이",
    "englishName": "My Cup of Tea",
    "address": "Shop 1, G/F, Wing Hing Building, 6-12 Spring Garden Lane, Wan Chai, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "밀크티",
      "프렌치토스트"
    ],
    "verdict": "추천",
    "desc": "밀크티와 프렌치토스트를 먹을 차찬텡으로 추천.",
    "branchNote": "지점 미지정. 주소가 확인되는 완차이점을 선택.",
    "source": "https://sourcing.hktdc.com/en/Supplier-Store-Directory/My-Cup-of-Tea/1S00OLCSC",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.2761,
    "lng": 114.17289,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=6%20SPRING%20GARDEN%20LANE&n=3"
  },
  {
    "id": "heesu-lan",
    "name": "란퐁유엔 · 센트럴",
    "englishName": "Lan Fong Yuen",
    "address": "G/F, 2 Gage Street, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "밀크티",
      "프렌치토스트"
    ],
    "verdict": "추천",
    "desc": "My Cup of Tea와 함께 차찬텡 선택지로 추천.",
    "branchNote": "지점 미지정. 센트럴 본점을 표시.",
    "source": "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-lan-fong-yuen.html",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "추천"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28261,
    "lng": 114.15362,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=2%20GAGE%20STREET&n=3"
  },
  {
    "id": "heesu-hashtag",
    "name": "Hashtag B · 침사추이",
    "englishName": "Hashtag B",
    "address": "Shop C, G/F, Savoy Mansion, 49 Carnarvon Road, Tsim Sha Tsui, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "Napoleon Tart · 나폴레옹 타르트"
    ],
    "verdict": "강추",
    "desc": "에그타르트는 베이크하우스보다 이곳의 나폴레옹 타르트를 강하게 추천.",
    "branchNote": "지점 미지정. 침사추이점을 선택.",
    "source": "https://www.whatsonhongkong.com/listings/hashtag-b-tst",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.29954,
    "lng": 114.17363,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=49%20CARNARVON%20ROAD&n=3"
  },
  {
    "id": "heesu-messina",
    "name": "Messina · 센트럴",
    "englishName": "Gelato Messina",
    "address": "37-43 Pottinger Street, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "젤라토"
    ],
    "verdict": "강추",
    "desc": "센트럴에서 꼭 먹어보라고 추천한 젤라토. 특정 맛은 언급하지 않음.",
    "branchNote": "",
    "source": "https://www.gelatomessina.com.hk/stores",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28233,
    "lng": 114.15446,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=37%20POTTINGER%20STREET&n=3"
  },
  {
    "id": "heesu-fuel",
    "name": "Fuel Espresso · IFC",
    "englishName": "Fuel Espresso",
    "address": "Shop 3023, 3/F, IFC Mall, 8 Finance Street, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "커피"
    ],
    "verdict": "강추",
    "desc": "산미 있는 커피를 좋아하는 희수의 최애 카페.",
    "branchNote": "대화의 Fuel Coffee를 Fuel Espresso로 해석. 센트럴 내 지점 미지정으로 IFC점을 선택.",
    "source": "https://fuelespresso.com/locations/",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28475,
    "lng": 114.15802,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=IFC%20MALL&n=3"
  },
  {
    "id": "heesu-basehall",
    "name": "BaseHall · 센트럴",
    "englishName": "BaseHall",
    "address": "LG/F, Jardine House, 1 Connaught Place, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "락사 · Laksa"
    ],
    "verdict": "강추",
    "desc": "자주 방문했던 푸드홀. 코코넛 베이스의 락사를 특히 추천.",
    "branchNote": "대화에 입점 식당명은 없음. 현재 Return of Lemak에서 Nyonya Laksa를 판매하는 것을 확인.",
    "source": "https://www.returnoflemak.com/",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "강추"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.2831,
    "lng": 114.15918,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=JARDINE%20HOUSE&n=3"
  },
  {
    "id": "heesu-sister",
    "name": "시스터와 · 틴하우",
    "englishName": "Sister Wah",
    "address": "G/F, 13A Electric Road, Tin Hau, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "맑은 소고기 국수"
    ],
    "verdict": "참고",
    "desc": "사진의 SISTER WAH 간판으로 식별. 맛있지만 오래 줄 설 정도는 아니었다는 평가.",
    "branchNote": "",
    "source": "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-sister-wah.html",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "참고"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28345,
    "lng": 114.19157,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=13%20ELECTRIC%20ROAD&n=3"
  },
  {
    "id": "heesu-bake",
    "name": "Bakehouse · 소호",
    "englishName": "Bakehouse",
    "address": "G/F, 5 Staunton Street, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "에그타르트"
    ],
    "verdict": "취향 아님",
    "desc": "유명하지만 희수 취향에는 별로. 대신 Hashtag B를 추천함.",
    "branchNote": "지점 미지정. 비교 참고용으로 소호점을 표시.",
    "source": "https://www.bakehouse.hk/locations",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "취향 아님"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.28169,
    "lng": 114.15323,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=5%20STAUNTON%20STREET&n=3"
  },
  {
    "id": "heesu-oi",
    "name": "애문생 · 삼수이포",
    "englishName": "Oi Man Sang",
    "address": "Shops B-C, G/F, 1 Shek Kip Mei Street, Sham Shui Po, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "볶음요리 · 다이파이동"
    ],
    "verdict": "로컬 체험",
    "desc": "로컬 분위기를 경험하고 싶을 때의 선택지로 언급.",
    "branchNote": "대화에 구체적인 메뉴는 없음. 볶음요리 업종 설명은 홍콩관광청 기준.",
    "source": "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-oi-man-sang.html",
    "heesu": true,
    "tags": [
      "희수의 맛집",
      "로컬 체험"
    ],
    "checkedAt": "2026-09-14",
    "lat": 22.32678,
    "lng": 114.1623,
    "coordinateNote": "홍콩 정부 주소 조회 기준 건물 위치. 층·호수는 주소를 확인하세요.",
    "coordinateSource": "https://www.als.gov.hk/lookup?q=1%20SHEK%20KIP%20MEI%20STREET&n=3"
  }
];

// Yoonhwan: user-supplied Google Maps branches, addresses checked 2026-09-14.
globalThis.YOONHWAN_RESTAURANTS=[
  {
    "id": "yoon-my-kitchen",
    "name": "MY KITCHEN TIBETAN HALAL RESTAURANT",
    "lat": 22.30743,
    "lng": 114.16994,
    "address": "G/F, 2H Saigon Street, Yau Ma Tei, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "모모 · 티베트식 만두"
    ],
    "desc": "티베트 요리를 맛볼 수 있는 식당. 대표 메뉴는 매장 소개 기준이며 윤환의 주문 메뉴는 별도로 전달되지 않았어요.",
    "googleUrl": "https://maps.app.goo.gl/Jpst8zfg4L2Bz9Px6?g_st=akt",
    "source": "https://www.tripadvisor.com/Restaurant_Review-g294217-d34495929-Reviews-My_Kitchen-Hong_Kong.html",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  },
  {
    "id": "yoon-wing-fat",
    "name": "Wing Fat Seafood Restaurant · 榮發大排檔",
    "lat": 22.30771,
    "lng": 114.17053,
    "address": "Shops 6–8, G/F, Temporary Cooked Food Hawker Bazaar, 29–39 Woosung Street, Jordan, Kowloon, Hong Kong",
    "region": "구룡",
    "menus": [
      "해산물 요리",
      "광둥식 볶음 요리"
    ],
    "desc": "우쑹 스트리트 숙식시장의 다이파이동. 세부 추천 메뉴는 미지정으로, 요리 종류를 표시했어요.",
    "googleUrl": "https://maps.app.goo.gl/Wc8Y4gyFX88mne2E7?g_st=akt",
    "source": "https://sg.openrice.com/en/hongkong/r-wing-fat-seafood-jordan-guangdong-seafood-r705184",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  },
  {
    "id": "yoon-keung-kee",
    "name": "Keung Kee Roasted Meat Restaurant · 強記飯店",
    "lat": 22.27825,
    "lng": 114.17986,
    "address": "Shops A & B, G/F, Siu Fung Building, 9–17 Tin Lok Lane, Wan Chai, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "광둥식 로스트미트",
      "더블보일드 수프"
    ],
    "desc": "완차이 틴록레인의 로스트미트 식당. 메뉴 종류는 공개 상품 안내를 참고했어요.",
    "googleUrl": "https://maps.app.goo.gl/uPe5ettqafzm21EK9?g_st=akt",
    "source": "https://www.klook.com/activity/18791-keung-kee-meat-shop-hong-kong/",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  },
  {
    "id": "yoon-stadium",
    "name": "Wanchai Stadium · 스포츠바",
    "lat": 22.27776,
    "lng": 114.17142,
    "address": "Shop A3, G/F, Hay Wah Building, 72–86 Lockhart Road, Wan Chai, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "맥주 · 바 음식",
      "상세 추천 메뉴 미지정"
    ],
    "desc": "록하트 로드의 스포츠바. 윤환이 보내준 링크의 Shop A3 지점입니다.",
    "googleUrl": "https://maps.app.goo.gl/ZN2RrrvZggFFxaSm9?g_st=akt",
    "source": "https://www.tripadvisor.com.sg/Restaurant_Review-g294217-d13485366-Reviews-Wan_Chai_Stadium-Hong_Kong.html",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  },
  {
    "id": "yoon-samsen-central",
    "name": "Samsen · 센트럴",
    "lat": 22.2806,
    "lng": 114.1567,
    "address": "G/F, 18 On Lan Street, Central, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "와규 보트 누들",
      "타이거프론 팟타이",
      "굴 오믈렛"
    ],
    "desc": "온란 스트리트의 태국 음식점. 메뉴는 센트럴 지점 공식 메뉴를 참고했어요.",
    "googleUrl": "https://maps.app.goo.gl/X5C5LB7o7DALZ3mS7?g_st=akt",
    "source": "https://www.samsen-hk.com/samsen-central",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  },
  {
    "id": "yoon-sang-kee",
    "name": "상기콘지 · Sang Kee Congee Shop",
    "englishName": "Sang Kee Congee Shop",
    "lat": 22.28527,
    "lng": 114.15166,
    "address": "G/F, 7 Burd Street, Sheung Wan, Hong Kong",
    "region": "홍콩섬",
    "menus": [
      "콘지 · 홍콩식 죽"
    ],
    "desc": "윤환이 추천한 셩완 버드 스트리트의 죽 전문점. 구체적인 주문 메뉴는 따로 전달되지 않았어요.",
    "googleUrl": "https://maps.app.goo.gl/9P5NE2vrwdhZcVPH9?g_st=akt",
    "source": "https://www.openrice.com/en/hongkong/r-sang-kee-congee-shop-sheung-wan-guangdong-congee-r3023/menus",
    "heesu": true,
    "recommender": "윤환",
    "verdict": "추천",
    "tags": [
      "먹거리",
      "윤환 추천"
    ],
    "coordinateNote": "핀은 홍콩 정부 주소 조회의 건물 위치 기준입니다. 정확한 매장 입구는 구글지도에서 확인하세요."
  }
];
