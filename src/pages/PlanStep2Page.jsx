import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TopAppBar from '../components/layout/TopAppBar'

/**
 * PlanStep2Page - 3번 화면 (취향 설정 Step2)
 * [다음: 활동 선택하기] 버튼 → /plan/step3 이동
 * 
 * 파일 원본: 2.TripPlan1.txt
 */
function PlanStep2Page() {
  const navigate = useNavigate()
  const [activeChips, setActiveChips] = useState([])
  const [budget, setBudget] = useState('midrange')
  const [tags, setTags] = useState(['도쿄 스카이트리'])
  const [tagInput, setTagInput] = useState('')

  const travelStyles = [
    { id: 'restaurant', icon: 'restaurant', label: '맛집' },
    { id: 'cafe', icon: 'local_cafe', label: '카페' },
    { id: 'shopping', icon: 'shopping_bag', label: '쇼핑' },
    { id: 'nature', icon: 'forest', label: '자연' },
    { id: 'history', icon: 'history_edu', label: '역사/문화' },
    { id: 'photo', icon: 'photo_camera', label: '사진 스팟' },
    { id: 'relaxed', icon: 'spa', label: '여유로운 일정' },
  ]

  const budgetOptions = [
    { id: 'economy', icon: 'savings', label: '절약형' },
    { id: 'midrange', icon: 'account_balance_wallet', label: '표준형' },
    { id: 'luxury', icon: 'diamond', label: '고급형' },
  ]

  const toggleChip = (id) => {
    setActiveChips(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const value = tagInput.trim().replace(',', '')
      if (value && !tags.includes(value)) {
        setTags(prev => [...prev, value])
        setTagInput('')
      }
    }
  }

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      {/* 고정 상단 바 */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-surface-variant/30 flex justify-between items-center px-5 w-full h-16 fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">explore</span>
          <h1 className="text-xl font-black text-primary tracking-tight">TripMate AI</h1>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a href="/" className="text-primary font-bold font-label-md text-label-md hover:opacity-80 transition-opacity">홈</a>
          <a href="#" className="text-on-surface-variant font-label-md text-label-md hover:opacity-80 transition-opacity">내 여행</a>
          <a href="#" className="text-on-surface-variant font-label-md text-label-md hover:opacity-80 transition-opacity">검색</a>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[20px]">person</span>
          </div>
        </div>
        <button className="md:hidden text-primary">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <main className="flex-grow pt-24 pb-32 px-5 md:px-16 flex justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-8">

          {/* ─── 진행 표시바 ─── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="font-label-md text-label-md text-primary font-bold">3단계 중 2단계</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">나의 여행 취향</span>
            </div>
            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full relative overflow-hidden" style={{ width: '66%', transition: 'width 0.7s ease-out' }}>
                <div className="absolute inset-0 shimmer-bar" />
              </div>
            </div>
          </div>

          {/* ─── 인트로 헤더 ─── */}
          <div className="flex flex-col gap-1">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">
              취향을 알려주세요.
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              입력하신 정보를 바탕으로 당신만을 위한 맞춤 일정을 구성합니다.
            </p>
          </div>

          {/* ─── 폼 콘텐츠 ─── */}
          <div className="flex flex-col gap-6">

            {/* 여행 스타일 칩 */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">style</span>
                <h3 className="text-[18px] leading-6 font-bold">여행 스타일</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {travelStyles.map((style) => {
                  const isActive = activeChips.includes(style.id)
                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleChip(style.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95 ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-primary/5 hover:border-primary'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {style.icon}
                      </span>
                      <span className="font-label-md text-label-md">{style.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 꼭 가고 싶은 장소 태그 */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h3 className="text-[18px] leading-6 font-bold">꼭 가고 싶은 장소</h3>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary border border-transparent transition-all">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg font-label-md text-label-md animate-zoom-in"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 transition-colors ml-1"
                      >
                        <span className="material-symbols-outlined text-[14px] flex items-center">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="장소 추가 (예: 도쿄 스카이트리)"
                  className="flex-grow bg-transparent border-none focus:ring-0 p-0 text-body-md placeholder:text-outline h-8 min-w-[200px]"
                />
              </div>
              <p className="font-label-sm text-label-sm text-outline">
                엔터 키나 쉼표를 입력하여 놓치고 싶지 않은 명소를 추가하세요.
              </p>
            </section>

            {/* 예산 수준 */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="text-[18px] leading-6 font-bold">예산 수준</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {budgetOptions.map((opt) => (
                  <label key={opt.id} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="budget"
                      value={opt.id}
                      checked={budget === opt.id}
                      onChange={() => setBudget(opt.id)}
                      className="hidden"
                    />
                    <div className={`flex flex-col items-center gap-1 p-4 rounded-xl border transition-all ${
                      budget === opt.id
                        ? 'border-primary bg-primary-container text-on-primary-container'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant group-hover:bg-primary/5'
                    }`}>
                      <span className="material-symbols-outlined text-primary text-[24px]">{opt.icon}</span>
                      <span className="font-label-md text-label-md">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* AI 추천 가이드 인사이트 카드 */}
            <div className="p-6 bg-primary-container/20 border border-primary/10 rounded-xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary bg-white p-2 rounded-full shrink-0 shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div className="flex flex-col gap-1">
                <h4 className="font-label-md text-label-md text-primary font-bold uppercase">AI 추천 가이드</h4>
                <p className="text-body-md text-on-surface-variant italic">
                  "'사진 스팟'과 '역사/문화'를 함께 선택하면 멋진 '시네마틱 헤리티지' 루트가 완성됩니다. 랜드마크 방문 시 가장 사진이 잘 나오는 골든 아워를 우선적으로 고려할게요."
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── 고정 하단 액션 바 ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-surface-variant/30 px-5 py-4 z-50 flex justify-center">
        <div className="w-full max-w-2xl flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/plan/step1')}
            className="px-6 py-3 rounded-xl font-label-md text-label-md text-on-surface-variant font-bold hover:bg-surface-variant/30 transition-colors active:scale-95"
          >
            이전
          </button>
          <button
            onClick={() => navigate('/plan/step3')}
            className="flex-grow md:flex-initial px-10 py-3 rounded-xl bg-primary text-white font-bold font-label-md text-label-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            다음: 활동 선택하기
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanStep2Page
