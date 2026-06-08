import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/layout/TopAppBar'
import BottomNavBar from '../components/layout/BottomNavBar'

/**
 * HomePage - 1번 화면 (홈)
 * [여행 시작하기] 버튼 → /plan/step1 이동
 */
function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      <TopAppBar />

      <main className="pt-24 pb-28 px-5 md:px-16 max-w-[1200px] mx-auto">

        {/* ─── Welcome Header ─── */}
        <section className="mb-8 animate-slide-up">
          <p className="text-[10px] font-extrabold text-primary tracking-[0.2em] uppercase mb-1">
            당신만을 위한 퍼스널 컨시어지
          </p>
          <h2 className="text-3xl font-extrabold text-on-surface leading-tight">
            반가워요, 여행자님!
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
            다음 모험을 떠날 준비가 되셨나요? 인공지능이 당신을 위한 완벽한 여정을 설계해 드립니다.
          </p>
        </section>

        {/* ─── CTA: 여행 시작하기 버튼 ─── */}
        <section className="mb-8">
          <button
            onClick={() => navigate('/plan/step1')}
            className="group relative w-full h-44 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-300 bg-primary text-on-primary cursor-pointer"
          >
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="white" />
                <circle cx="10" cy="90" r="40" fill="white" />
              </svg>
            </div>
            {/* 내용 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="mb-4 bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  rocket_launch
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">여행 시작하기</span>
              <span className="text-sm opacity-90 mt-1 font-medium">AI와 함께 특별한 이야기를 만들어보세요</span>
            </div>
          </button>
        </section>

        {/* ─── 나의 최근 여행 ─── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-on-surface">나의 최근 여행</h3>
            <button className="text-primary text-sm font-bold hover:underline underline-offset-4">
              전체보기
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 카드 1: 도쿄 */}
            <div className="clean-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
              <div className="h-44 relative">
                <img
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80"
                  alt="도쿄"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    맛집 탐방
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  도쿄 먹거리 여행
                </h4>
                <p className="text-on-surface-variant text-xs mb-5 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  2024.10.12 - 10.18
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-[10px] font-bold text-primary">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+2</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 2: 오사카 */}
            <div className="clean-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
              <div className="h-44 relative">
                <img
                  src="https://images.unsplash.com/photo-1589307007408-3143ff50b4d5?w=600&q=80"
                  alt="오사카"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                    가족 여행
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  오사카 가족 어드벤처
                </h4>
                <p className="text-on-surface-variant text-xs mb-5 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  2024.11.05 - 11.12
                </p>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full border border-surface-variant bg-surface flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── AI 추천 여행지 ─── */}
        <section className="mt-8 pb-10">
          <h3 className="text-xl font-bold text-on-surface mb-4">AI가 추천하는 여행지</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {[
              { name: '아그라', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&q=80', alt: '인도 아그라 타지마할' },
              { name: '그리스', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&q=80', alt: '그리스 산토리니' },
              { name: '시드니', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&q=80', alt: '호주 시드니' },
              { name: '파리', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&q=80', alt: '프랑스 파리' },
            ].map((dest) => (
              <div
                key={dest.name}
                className="flex-shrink-0 w-32 h-44 rounded-2xl relative overflow-hidden cursor-pointer group shadow-md shadow-black/5"
              >
                <img
                  src={dest.img}
                  alt={dest.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute bottom-4 left-3 text-white text-xs font-bold tracking-tight">
                  {dest.name}
                </span>
              </div>
            ))}
            <div className="flex-shrink-0 w-32 h-44 rounded-2xl bg-primary-container flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-primary/10 transition-colors border border-dashed border-primary/40">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">add_circle</span>
              <span className="text-primary text-[11px] font-bold">더 보기</span>
            </div>
          </div>
        </section>
      </main>

      {/* 플로팅 AI 버튼 */}
      <button className="fixed right-6 bottom-24 bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </button>

      <BottomNavBar />
    </div>
  )
}

export default HomePage
