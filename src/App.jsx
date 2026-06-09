import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import PlanStep1Page from './pages/PlanStep1Page'
import PlanStep2Page from './pages/PlanStep2Page'
import PlanStep3Page from './pages/PlanStep3Page'
import ResultPage from './pages/ResultPage'
import Signup from './pages/Signup'

function SplashScreen() {
  return (
    <div className="relative flex h-full w-full select-none flex-col items-center justify-between overflow-hidden bg-[#0b0f19] py-16">
      <div className="pointer-events-none absolute right-[-10%] top-[-20%] h-[320px] w-[320px] rounded-full bg-primary-light/15 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[280px] w-[280px] rounded-full bg-secondary-container/15 blur-[70px]" />

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl bg-primary-light text-on-primary-container shadow-[0_20px_50px_rgba(0,174,239,0.3)]">
          <span className="material-symbols-outlined !text-[48px]">explore</span>
        </div>
        <div className="text-center">
          <h1 className="font-headline-lg text-[32px] font-bold tracking-wide text-primary-light">
            TripMate AI
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant/80">
            여행의 설렘을 AI와 함께
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 px-12">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[45%] animate-pulse rounded-full bg-primary-light" />
        </div>
        <span className="font-label-sm text-[11px] italic tracking-wide text-outline-variant">
          AI가 최적의 여행 경로를 찾는 중...
        </span>
      </div>
    </div>
  )
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto bg-[#0b0f19] p-0 md:p-8">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background text-on-surface transition-all duration-300 md:h-[844px] md:w-[390px] md:rounded-[50px] md:border-[12px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-0 z-50 hidden h-[30px] w-[110px] -translate-x-1/2 rounded-b-2xl bg-slate-900 md:block" />

        <div className="z-40 hidden select-none items-center justify-between bg-transparent px-8 pb-2 pt-4 text-[12px] font-semibold text-slate-800 md:flex">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined !text-[14px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined !text-[14px]">wifi</span>
            <span className="material-symbols-outlined !text-[16px]">battery_very_low</span>
          </div>
        </div>

        <div className="relative h-full w-full flex-1 overflow-y-auto">{children}</div>

        <div className="z-40 hidden select-none items-center justify-center bg-transparent pb-3 pt-1 md:flex">
          <div className="h-[5px] w-[130px] rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      <AppLayout>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/plan/step1" element={<PlanStep1Page />} />
            <Route path="/plan/step2" element={<PlanStep2Page />} />
            <Route path="/plan/step3" element={<PlanStep3Page />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
