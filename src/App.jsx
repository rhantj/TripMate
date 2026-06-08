import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';

// 모바일 앱 브랜드 스플래시 (로딩) 화면 컴포넌트
function SplashScreen() {
  return (
    <div className="w-full h-full bg-[#0b0f19] flex flex-col items-center justify-between py-16 relative select-none overflow-hidden">
      {/* 장식용 그라데이션 광원 */}
      <div className="absolute top-[-20%] right-[-10%] w-[320px] h-[320px] bg-primary-container/15 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[280px] h-[280px] bg-secondary-container/15 rounded-full blur-[70px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* 심볼 로고 애니메이션 */}
        <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container shadow-[0_20px_50px_rgba(0,174,239,0.3)] animate-pulse">
          <span className="material-symbols-outlined !text-[48px]" data-icon="explore">explore</span>
        </div>
        <div className="text-center">
          <h1 className="font-headline-lg text-[32px] font-bold text-primary tracking-wide">TripMate AI</h1>
          <p className="font-body-md text-body-md text-on-surface-variant/80 mt-1">여행의 설렘을 AI와 함께</p>
        </div>
      </div>

      {/* 하단 로딩 바 */}
      <div className="w-full px-12 flex flex-col items-center gap-3">
        <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary-container rounded-full w-[45%] animate-pulse"></div>
        </div>
        <span className="font-label-sm text-[11px] text-outline-variant italic tracking-wide">AI가 최적의 여행 경로를 찾는 중...</span>
      </div>
    </div>
  );
}

// 모바일 앱 시뮬레이터 목업 래퍼 컴포넌트
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-0 md:p-8 overflow-y-auto">
      {/* 데스크톱일 때는 스마트폰 형상의 고정 비율 프레임, 모바일 접속 시에는 전체 화면 풀스크린 */}
      <div className="relative w-full h-screen md:w-[390px] md:h-[844px] md:rounded-[50px] md:border-[12px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-[#f8f9fa] text-[#191c1d] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* 스마트폰 상단 Notch (Dynamic Island 시뮬레이션) - 데스크톱에서만 노출 */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-slate-900 rounded-b-2xl z-50"></div>
        
        {/* 스마트폰 상단 정보바 (Status Bar) - 데스크톱에서만 노출 */}
        <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-2 text-[12px] font-semibold text-slate-800 bg-transparent z-40 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined !text-[14px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined !text-[14px]">wifi</span>
            <span className="material-symbols-outlined !text-[16px]">battery_very_low</span>
          </div>
        </div>

        {/* 렌더링될 실제 내부 화면 (가득 차고 스크롤 가능하도록 구성) */}
        <div className="flex-1 overflow-y-auto w-full h-full relative">
          {children}
        </div>

        {/* 스마트폰 하단 홈바 (Home Indicator) - 데스크톱에서만 노출 */}
        <div className="hidden md:flex justify-center items-center pb-3 pt-1 z-40 bg-transparent select-none">
          <div className="w-[130px] h-[5px] bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5초간 노출 후 스플래시 해제
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AppLayout>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;




