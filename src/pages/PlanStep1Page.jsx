import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TopAppBar from '../components/layout/TopAppBar'

/**
 * PlanStep1Page - 2번 화면 (일정 생성 Step1: 기본 정보 & 분위기)
 * [일정 생성하기] 버튼 → /plan/step2 이동
 * 
 * 파일 원본: 3.TripPlan2.txt
 */
function PlanStep1Page() {
  const navigate = useNavigate()
  const [selectedCompanion, setSelectedCompanion] = useState(null)

  const companions = [
    { id: 'solo', icon: 'person', label: '혼자' },
    { id: 'friends', icon: 'group', label: '친구' },
    { id: 'couple', icon: 'favorite', label: '커플' },
    { id: 'family', icon: 'family_restroom', label: '가족' },
  ]

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <TopAppBar showClose={true} />

      <main className="flex-1 flex flex-col items-center justify-start px-5 py-6 pt-24">
        <div className="w-full max-w-[600px] space-y-8">

          {/* ─── 진행 표시바 ─── */}
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-2">
              <span className="font-label-md text-label-md text-primary font-bold">1 / 3 단계</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">기본 정보 &amp; 분위기</span>
            </div>
            <div className="flex gap-2 h-1.5 w-full">
              {/* 1단계 활성 */}
              <div className="h-full bg-primary rounded-full" style={{ width: '48px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
              <div className="h-full flex-1 bg-surface-variant rounded-full" />
              <div className="h-full flex-1 bg-surface-variant rounded-full" />
            </div>
          </div>

          {/* ─── Hero Prompt ─── */}
          <div className="space-y-2">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">
              <span className="text-primary">꿈꾸던 여행</span>을 시작해보세요.
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              기본 정보를 입력해주시면 AI가 맞춤 일정을 제안해 드립니다.
            </p>
          </div>

          {/* ─── 폼 콘텐츠 ─── */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

            {/* 여행 이름 */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="trip-title">
                여행 이름
              </label>
              <div className="relative flex items-center bg-surface-variant rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-light transition-all">
                <span className="material-symbols-outlined absolute left-4 text-outline">edit_note</span>
                <input
                  id="trip-title"
                  type="text"
                  placeholder="예: 아말피 해안에서의 여름"
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 rounded-xl focus:ring-0 text-on-surface font-body-md placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* 목적지 */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="destination">
                목적지
              </label>
              <div className="relative flex items-center bg-surface-variant rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-light transition-all">
                <span className="material-symbols-outlined absolute left-4 text-outline">location_on</span>
                <input
                  id="destination"
                  type="text"
                  placeholder="도시 또는 국가를 검색하세요..."
                  className="w-full bg-transparent border-none py-4 pl-12 pr-12 rounded-xl focus:ring-0 text-on-surface font-body-md placeholder:text-outline-variant"
                />
                <span className="material-symbols-outlined absolute right-4 text-outline cursor-pointer hover:text-primary">my_location</span>
              </div>
            </div>

            {/* 여행 일정 */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                여행 일정
              </label>
              <div className="relative flex items-center bg-surface-variant rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-light transition-all">
                <span className="material-symbols-outlined absolute left-4 text-outline">calendar_month</span>
                <input
                  type="text"
                  placeholder="날짜 선택"
                  readOnly
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 rounded-xl focus:ring-0 text-on-surface font-body-md cursor-pointer placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* 동행자 선택 */}
            <div className="space-y-4">
              <label className="block font-label-md text-label-md text-on-surface-variant">
                누구와 함께하시나요?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {companions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCompanion(c.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 ${
                      selectedCompanion === c.id
                        ? 'bg-primary-container text-on-primary-container border-primary'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                    <span className="font-label-md">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* ─── 하단 액션 ─── */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <button
              onClick={() => navigate('/plan/step2')}
              className="w-full bg-primary text-white py-4 px-8 rounded-full font-label-md shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 group"
            >
              <span>일정 생성하기</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-on-surface-variant font-label-sm text-center px-4">
              거의 다 왔어요! 다음 두 단계에서 관심사를 구체화합니다.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-outline-variant/10">
        <div className="flex justify-center gap-6 text-outline-variant">
          <span className="font-label-sm text-label-sm">개인정보 처리방침</span>
          <span className="font-label-sm text-label-sm">이용 약관</span>
        </div>
      </footer>
    </div>
  )
}

export default PlanStep1Page
