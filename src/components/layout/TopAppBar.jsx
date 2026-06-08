import { useNavigate, useLocation } from 'react-router-dom'

/**
 * TopAppBar - 공통 상단 네비게이션 바
 * @param {object} props
 * @param {boolean} props.showBack - 뒤로가기 버튼 표시 여부
 * @param {function} props.onBack - 뒤로가기 콜백 (없으면 navigate(-1))
 * @param {boolean} props.showClose - 닫기(X) 버튼 표시 여부
 * @param {function} props.onClose - 닫기 콜백
 */
function TopAppBar({ showBack = false, onBack, showClose = false, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  const handleClose = () => {
    if (onClose) onClose()
    else navigate('/')
  }

  return (
    <header className="bg-white/90 backdrop-blur-md flex justify-between items-center px-5 w-full h-16 fixed top-0 z-40 border-b border-surface-variant">
      {/* 왼쪽: 로고 또는 뒤로가기 */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        ) : null}
        <span className="material-symbols-outlined text-primary text-2xl icon-filled">explore</span>
        <h1 className="text-xl font-extrabold text-on-surface tracking-tight">TripMate AI</h1>
      </div>

      {/* 오른쪽: 데스크탑 네비 또는 닫기 버튼 */}
      <div className="flex items-center gap-4">
        {/* 데스크탑 메뉴 (md 이상에서 표시) */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">홈</a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">내 여행</a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">검색</a>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[20px]">person</span>
          </div>
        </nav>

        {/* 알림 버튼 (홈에서만) */}
        {!showBack && !showClose && (
          <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        )}

        {/* 닫기 버튼 */}
        {showClose && (
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}

        {/* 모바일 햄버거 (플로우 페이지에서) */}
        {showBack && (
          <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}

        {/* 프로필 아바타 (홈) */}
        {!showBack && !showClose && (
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              src="https://api.dicebear.com/8.x/thumbs/svg?seed=tripmate&backgroundColor=00aeef&shapeColor=ffffff"
              alt="사용자 프로필"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2300aeef'/%3E%3Ctext x='50%25' y='50%25' dy='.35em' text-anchor='middle' fill='white' font-size='16' font-family='sans-serif'%3E여%3C/text%3E%3C/svg%3E"
              }}
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default TopAppBar
