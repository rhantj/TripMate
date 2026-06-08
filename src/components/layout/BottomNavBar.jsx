import { useLocation, useNavigate } from 'react-router-dom'

/**
 * BottomNavBar - 공통 하단 네비게이션 바 (모바일)
 * 홈, 내 여행, 검색, 프로필 탭
 */
function BottomNavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { icon: 'home', label: '홈', path: '/' },
    { icon: 'travel_explore', label: '내 여행', path: '/trips' },
    { icon: 'search', label: '검색', path: '/search' },
    { icon: 'person', label: '프로필', path: '/profile' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white/95 backdrop-blur-lg border-t border-surface-variant shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe">
      {tabs.map((tab) => {
        const active = isActive(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-colors ${
              active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-bold tracking-tight">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavBar
