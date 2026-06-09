/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';

// Pages Import
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TripPlanStep1 from './pages/TripPlanStep1';
import TripPlanStep2 from './pages/TripPlanStep2';
import TripPlanStep3 from './pages/TripPlanStep3';
import TripResult from './pages/TripResult';

// Components Import
import ProtectedRoute from './components/ProtectedRoute';
import { ModalProvider } from './components/ModalProvider';
import GlobalModal from './components/GlobalModal';

// Styles Import
import './styles/common.css';

const INITIAL_TRIP_DATA = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  companion: '', 
  style: [], 
  places: [], 
  notes: '' 
};

// 1. 앱 브랜드 스플래시 (로딩) 화면 컴포넌트 - 전체 브라우저 화면 가득 채움
function SplashScreen() {
  return (
    <div className="splash-container select-none" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* 장식용 그라데이션 광원 */}
      <div className="splash-orbs">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '24px', zIndex: 10 }}>
        {/* 심볼 로고 애니메이션 */}
        <div className="splash-logo-box animate-pulse">
          <span className="material-symbols-outlined !text-[48px]">explore</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 className="welcome-title" style={{ fontSize: '32px', color: 'var(--color-primary)', letterSpacing: '1px' }}>TripMate AI</h1>
          <p className="welcome-desc" style={{ color: 'var(--color-outline-variant)' }}>여행의 설렘을 AI와 함께</p>
        </div>
      </div>

      {/* 하단 로딩 바 */}
      <div className="splash-loading-bar-wrapper">
        <div className="splash-loading-track">
          <div className="splash-loading-bar"></div>
        </div>
        <span className="action-tip" style={{ color: 'var(--color-outline-variant)', fontStyle: 'italic' }}>
          AI가 최적의 여행 경로를 찾는 중...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [tripData, setTripData] = useState(INITIAL_TRIP_DATA);

  // 스플래시 화면 2.5초 지연 제어 및 세션 체크
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        setCurrentUser(data.session);
      }
    };
    checkSession();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setTripData(INITIAL_TRIP_DATA); // 로그아웃 시 기존 계획 작성중 데이터 소거
  };

  // 새 여행 시작 시 데이터 초기화하는 함수
  const resetTripData = () => {
    setTripData(INITIAL_TRIP_DATA);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ModalProvider>
      <Router>
        <Routes>
          {/* 로그인 화면 (껍데기 없는 풀 브라우저 반응형) */}
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            } 
          />

          {/* 회원가입 화면 (껍데기 없는 풀 브라우저 반응형) */}
          <Route 
            path="/signup" 
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Signup />
              )
            } 
          />

          {/* 홈 화면 (ProtectedRoute 보호, 전체화면) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Home currentUser={currentUser} onLogout={handleLogout} resetTripData={resetTripData} />
              </ProtectedRoute>
            } 
          />
          
          {/* 계획 1단계 */}
          <Route 
            path="/plan-step1" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TripPlanStep1 tripData={tripData} setTripData={setTripData} resetTripData={resetTripData} />
              </ProtectedRoute>
            } 
          />
          
          {/* 계획 2단계 */}
          <Route 
            path="/plan-step2" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TripPlanStep2 tripData={tripData} setTripData={setTripData} resetTripData={resetTripData} />
              </ProtectedRoute>
            } 
          />
          
          {/* 계획 3단계 */}
          <Route 
            path="/plan-step3" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TripPlanStep3 tripData={tripData} setTripData={setTripData} resetTripData={resetTripData} />
              </ProtectedRoute>
            } 
          />
          
          {/* 결과 화면 */}
          <Route 
            path="/result" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TripResult />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route 
            path="*" 
            element={<Navigate to={currentUser ? "/" : "/login"} replace />} 
          />
        </Routes>
        <GlobalModal />
      </Router>
    </ModalProvider>
  );
}
