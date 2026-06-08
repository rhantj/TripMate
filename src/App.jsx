import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlanStep1Page from './pages/PlanStep1Page'
import PlanStep2Page from './pages/PlanStep2Page'
import PlanStep3Page from './pages/PlanStep3Page'
import ResultPage from './pages/ResultPage'

/**
 * App.jsx - 루트 라우터 설정
 * 
 * 화면 흐름:
 * 1. / (홈) → [여행 시작하기] →
 * 2. /plan/step1 (기본 정보) → [일정 생성하기] →
 * 3. /plan/step2 (취향 설정) → [다음: 활동 선택하기] →
 * 4. /plan/step3 (세부 사항) → [일정 생성하기] →
 * 5. /result (여행 결과)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan/step1" element={<PlanStep1Page />} />
        <Route path="/plan/step2" element={<PlanStep2Page />} />
        <Route path="/plan/step3" element={<PlanStep3Page />} />
        <Route path="/result" element={<ResultPage />} />
        {/* 존재하지 않는 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
