import { useNavigate } from 'react-router-dom'

/**
 * ResultPage - 5번 화면 (여행 결과)
 * AI가 생성한 여행 일정 타임라인 표시
 * 
 * 파일 원본: 5.TripResult.txt
 */
function ResultPage() {
  const navigate = useNavigate()

  // 일정 데이터 (추후 API 연동 예정)
  const itinerary = [
    {
      id: 1,
      time: '오전 10:00',
      title: '도착 및 체크인',
      description: '나리타 국제공항 도착 후 시내 호텔로 이동하여 짐을 맡깁니다. 긴 여정 후의 간단한 휴식을 권장합니다.',
      icon: 'flight_land',
      color: 'bg-primary',
      tags: ['#나리타공항', '#수하물보관'],
      img: null,
    },
    {
      id: 2,
      time: '오후 12:00',
      title: '츠키지 시장 점심 식사',
      description: '세계 최대 규모의 어시장에서 신선한 초밥과 길거리 음식을 즐겨보세요. 카이센동을 강력 추천합니다.',
      icon: 'restaurant',
      color: 'bg-secondary-container',
      tags: ['필수 방문', '#로컬맛집'],
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80',
      imgAlt: '신선한 초밥 플래터',
      highlight: true,
    },
    {
      id: 3,
      time: '오후 02:00',
      title: '긴자 쇼핑 및 카페 투어',
      description: '일본에서 가장 화려한 쇼핑가 긴자를 산책합니다. 긴자 식스(GINZA SIX)의 루프탑 정원과 츠타야 서점은 꼭 들러보세요.',
      icon: 'shopping_bag',
      color: 'bg-primary',
      tags: ['#명품거리', '#디자인', '#전시회'],
      img: null,
    },
  ]

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24">

      {/* ─── TopAppBar ─── */}
      <header className="bg-surface flex justify-between items-center px-5 w-full h-16 sticky top-0 z-40 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary font-bold">explore</span>
          <h1 className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">TripMate AI</h1>
        </div>
        <div className="hidden md:flex gap-6">
          <a href="/" className="font-label-md text-label-md text-primary font-bold">홈</a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:opacity-80 transition-opacity">나의 여행</a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:opacity-80 transition-opacity">검색</a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:opacity-80 transition-opacity">프로필</a>
        </div>
        <button className="md:hidden text-primary">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 pt-8">

        {/* ─── Hero Header ─── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-label-md tracking-wider">나만의 일본 도쿄 여행</span>
            <h2 className="font-headline-lg text-headline-lg mt-2">1일차: 도쿄의 아침과 예술</h2>
            <p className="text-on-surface-variant mt-2 max-w-xl">
              AI가 선별한 오늘의 코스입니다. 전통 시장의 활기와 긴자의 현대적인 화려함을 동시에 느껴보세요.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
            <button className="flex items-center justify-center gap-1.5 bg-surface-container-high px-3 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-variant transition-colors active:scale-95 whitespace-nowrap flex-1 md:flex-none min-w-fit">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              수정하기
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-surface-container-high px-3 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-variant transition-colors active:scale-95 whitespace-nowrap flex-1 md:flex-none min-w-fit">
              <span className="material-symbols-outlined text-[18px]">share</span>
              공유하기
            </button>
            <button className="flex items-center justify-center gap-1.5 bg-primary-light px-3 py-2.5 rounded-xl text-on-primary-container font-label-md shadow-md hover:opacity-90 transition-all active:scale-95 whitespace-nowrap flex-1 md:flex-none min-w-fit">
              <span className="material-symbols-outlined text-[18px]">bookmark</span>
              저장하기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* ─── 왼쪽: 지도 & AI 팁 ─── */}
          <div className="md:col-span-4 space-y-6">
            {/* 지도 */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80"
                alt="도쿄 도시 지도"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">location_on</span>
                  <span className="font-label-md">도쿄 시내</span>
                </div>
                <button className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[12px] font-label-md">
                  지도 보기
                </button>
              </div>
            </div>

            {/* AI 여행 팁 */}
            <div className="bg-white p-6 rounded-3xl border border-surface-variant shadow-sm space-y-4">
              <h3 className="font-label-md text-label-md text-primary">AI 여행 팁</h3>
              <div className="flex gap-4 items-start">
                <div className="bg-primary-container/20 p-2 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                </div>
                <p className="text-label-sm leading-relaxed text-on-surface-variant">
                  오후 긴자 쇼핑 시 주말에는 '보행자 천국'이 운영되어 도로 전체를 자유롭게 거닐 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* ─── 오른쪽: 타임라인 일정 ─── */}
          <div className="md:col-span-8 relative">
            {/* 수직선 */}
            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] timeline-line hidden sm:block" />

            <div className="space-y-8">
              {itinerary.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 relative group">
                  {/* 아이콘 */}
                  <div className="flex items-start gap-4 sm:w-16">
                    <div className={`z-10 w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg ring-4 ring-background shrink-0`}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: item.highlight ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <span className="sm:hidden font-label-md text-primary font-bold self-center">
                      {item.time}
                    </span>
                  </div>

                  {/* 시간 (데스크탑) */}
                  <div className="hidden sm:block absolute left-0 -top-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary font-bold font-label-sm">
                    {item.time.split(' ')[1]}
                  </div>

                  {/* 카드 */}
                  <div className="flex-1 bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container-high hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-on-surface">{item.title}</h3>
                      <span className="hidden sm:block text-primary font-label-md">{item.time}</span>
                    </div>

                    {/* 이미지가 있는 카드 */}
                    {item.img ? (
                      <div className="flex gap-4 items-center mb-4">
                        <img
                          src={item.img}
                          alt={item.imgAlt}
                          className="w-24 h-24 rounded-2xl object-cover shrink-0"
                        />
                        <p className="text-on-surface-variant flex-1">{item.description}</p>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant mb-4">{item.description}</p>
                    )}

                    {/* 태그 */}
                    <div className="flex gap-2 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-label-sm ${
                            item.highlight && tag === '필수 방문'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── 모바일 하단 네비 ─── */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden rounded-t-xl">
        <a href="/" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-label-sm mt-1">홈</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 transition-transform duration-200">
          <span className="material-symbols-outlined">travel_explore</span>
          <span className="font-label-sm text-label-sm mt-1">나의 여행</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm mt-1">검색</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm mt-1">프로필</span>
        </a>
      </nav>

      {/* ─── 플로팅 AI 버튼 ─── */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-40">
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </button>
    </div>
  )
}

export default ResultPage
