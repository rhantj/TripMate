import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

/**
 * PlanStep3Page - 4번 화면 (세부 사항 Step3: 방문 장소 & AI 요청)
 * [일정 생성하기] 버튼 → /result 이동
 * 
 * 파일 원본: 4.TripPlan3.txt
 */
function PlanStep3Page() {
  const navigate = useNavigate()
  const [tags, setTags] = useState(['루브르 박물관', '에펠탑'])
  const [tagInput, setTagInput] = useState('')
  const [aiNote, setAiNote] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const recommendedPlaces = ['세느강 크루즈', '몽마르뜨 언덕', '현지 빵집']

  const addTag = (text) => {
    if (!text.trim() || tags.includes(text.trim())) return
    setTags(prev => [...prev, text.trim()])
    setTagInput('')
  }

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // 로딩 애니메이션 후 결과 페이지로 이동
    setTimeout(() => {
      navigate('/result')
    }, 1800)
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">

      {/* ─── TopAppBar ─── */}
      <header className="bg-surface border-b border-outline-variant/30 flex justify-between items-center px-5 w-full h-16 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">explore</span>
          <h1 className="text-headline-md font-headline-md font-bold text-primary">TripMate AI</h1>
        </div>
        <div className="hidden md:flex gap-6">
          <a href="/" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">홈</a>
          <a href="#" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">내 여행</a>
          <a href="#" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">검색</a>
          <a href="#" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">프로필</a>
        </div>
        <button className="md:hidden p-2 active:scale-95 duration-100">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 md:py-8">

        {/* 진행 표시 */}
        <div className="mb-8 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest">3단계 중 3단계</span>
            <span className="font-label-md text-label-md text-on-surface-variant">최종 세부사항</span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-light h-full transition-all duration-1000 ease-out rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ─── 왼쪽: 입력 폼 ─── */}
          <div className="lg:col-span-7 space-y-4">

            {/* 방문 장소 태그 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">반드시 방문하고 싶은 장소</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                놓치고 싶지 않은 랜드마크, 식당 또는 경험을 태그로 추가해 주세요.
              </p>

              {/* 태그 입력 영역 */}
              <div className="relative mb-4">
                <div className="flex flex-wrap gap-2 p-2 bg-surface-container-low rounded-lg border-2 border-transparent focus-within:border-primary-light focus-within:bg-surface-container-lowest transition-all">
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md whitespace-nowrap animate-zoom-in"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="material-symbols-outlined text-[16px] hover:text-red-500 transition-colors"
                        >
                          close
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="장소 추가..."
                    className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-on-surface p-0"
                  />
                </div>
              </div>

              {/* 추천 장소 빠른 추가 */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant py-1">추천 장소:</span>
                {recommendedPlaces.map((place) => (
                  <button
                    key={place}
                    onClick={() => addTag(place)}
                    className="px-3 py-1 border border-outline-variant rounded-full font-label-sm text-label-sm hover:bg-primary-container/10 hover:border-primary-light transition-colors"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>

            {/* AI 추가 요청 사항 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">notes</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">AI 추가 요청 사항</h2>
              </div>
              <textarea
                value={aiNote}
                onChange={(e) => setAiNote(e.target.value)}
                placeholder="예: '대중교통보다는 걷는 것을 선호해요', '숨겨진 명소 위주로 추천해주세요', 또는 '아이와 함께 가기 좋은 식당이 필요해요'..."
                className="w-full h-40 bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-light focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline resize-none"
              />
            </div>
          </div>

          {/* ─── 오른쪽: 영감 이미지 ─── */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
                alt="파리 거리 풍경"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="glass-card p-4 rounded-xl text-on-surface-variant">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="font-label-md text-label-md uppercase tracking-wider">AI 통찰</span>
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface">
                    "구체적인 메모를 추가해 주시면 파리의 혼잡한 시간대를 피해 일정을 맞춤화해 드릴 수 있습니다."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 하단 액션 바 ─── */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container-high/50 p-6 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => navigate('/plan/step2')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-primary hover:bg-primary/5 transition-colors font-label-md text-label-md whitespace-nowrap"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              2단계로 돌아가기
            </button>
            <div className="h-6 w-[1px] bg-outline-variant hidden md:block" />
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors font-label-sm text-label-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">edit</span>
              수정
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors font-label-sm text-label-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">share</span>
              공유
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors font-label-sm text-label-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              저장
            </button>
          </div>

          {/* 일정 생성하기 메인 CTA */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(0,101,141,0.3)] hover:shadow-[0_8px_20px_rgba(0,101,141,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap ${
              isGenerating ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                마법을 부리는 중...
              </>
            ) : (
              <>
                일정 생성하기
                <span className="material-symbols-outlined">magic_button</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* ─── 모바일 하단 네비 ─── */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <a href="/" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-label-sm">홈</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200">
          <span className="material-symbols-outlined">travel_explore</span>
          <span className="font-label-sm text-label-sm">내 여행</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm">검색</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm">프로필</span>
        </a>
      </nav>
    </div>
  )
}

export default PlanStep3Page
