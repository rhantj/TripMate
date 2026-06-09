/* src/pages/Home.jsx */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentTrips } from '../services/supabase';
import ChatbotPopup from '../components/ChatbotPopup';
import { useModal } from '../components/ModalProvider';
import './Home.css';

export default function Home({ currentUser, onLogout, resetTripData }) {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  const [recentTrips, setRecentTrips] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const currentUserId = currentUser?.id || 'user1';

  useEffect(() => {
    const fetchTrips = async () => {
      // 로그인한 실제 사용자의 ID에 따라 데이터 조회
      const trips = await getRecentTrips(currentUserId);
      setRecentTrips(trips);
    };
    fetchTrips();
  }, [currentUserId]);

  const handleTripCardClick = (tripId) => {
    navigate(`/result?id=${tripId}`);
  };

  const handleStartTrip = () => {
    resetTripData(); // 이전 작성 중이던 데이터 강제 소거
    navigate('/plan-step1');
  };

  const handleLogoutConfirm = () => {
    showConfirm('로그아웃 하시겠습니까?', () => {
      onLogout();
      navigate('/login');
    });
  };

  // companion에 따른 아이콘 매핑
  const getCompanionIcon = (companion) => {
    switch (companion) {
      case 'alone': return 'person';
      case 'friends': return 'group';
      case 'couple': return 'favorite';
      case 'family': return 'family_restroom';
      default: return 'person';
    }
  };

  // companion 한글명 매핑
  const getCompanionLabel = (companion) => {
    switch (companion) {
      case 'alone': return '나홀로 여행';
      case 'friends': return '친구와 여행';
      case 'couple': return '커플 여행';
      case 'family': return '가족 여행';
      default: return '자유 여행';
    }
  };

  // 동반자별 대표 이미지 매핑
  const getTripImage = (destination, companion) => {
    if (destination.includes('오사카')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuARu9gRc0w9ZoujuNEUK8ud98haK7tfz0cxaG8GwIkhtrMuUfv7Attw0jeV_RBbiLUHeGYvszUgaID_dD7uHZYZu1KvAG2O-qPhUGMKsb8HqcJl8EyTGdiEn-jYqtnXTv3vycc0MIePFJnhDZXaorQrZXwfnciqzZEhvVoFx9MtUiMUXXh_729a3K5vfjBwQO9F0IwbwQiicd4bYv3JVqj62bbwsSLu375X3Y-OaWrpsy1MhNCZIJq4nq62xDMqzq3RwIJEOjSD2kU';
    }
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWwaT6yvcSZZqChzslpAIM-mXP8HAwO9RMpNMpU7_5xZGThfsEePx0ScT3Qo0nX7SFSzH7HMHO3geh1p8DFWH9aDwH34TftFrWmxX3ddCs4Cep4uebO_YQCf4JYEEtYXSzj774RBfZMXnBNjImFCGNSEw61WdvtDLNmKNZ9PASDjeS6f-mmWoUdx7Ernoow4EJzBEGMnr9WpRC7zd7hLmk82gAxqi89dziKBSB17y5_hBkGyNm79guUxhg3YQ7Zvvxmm70aFmc0NE';
  };

  // 사용자 이름에서 이니셜 추출 (예: '홍길동' -> '홍')
  const getUserInitial = () => {
    const userName = currentUser?.user_metadata?.name || '대표';
    return userName.charAt(0);
  };

  return (
    <div className="container home-container">
      {/* Top App Bar */}
      <header className="home-header">
        <div className="brand-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span className="material-symbols-outlined brand-logo">explore</span>
          <h1 className="brand-name">TripMate AI</h1>
        </div>
        <div className="header-actions">
          {/* 로그인한 사용자 닉네임 표기 */}
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-on-surface-variant)' }}>
            {currentUser?.user_metadata?.name || '대표'}님
          </span>
          {/* 로그아웃 버튼 */}
          <button className="noti-btn" title="로그아웃" onClick={handleLogoutConfirm}>
            <span className="material-symbols-outlined">logout</span>
          </button>
          <div className="profile-avatar" style={{ backgroundColor: 'var(--color-primary-container-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {getUserInitial()}
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <section className="welcome-section animate-fade-in">
        <p className="welcome-badge">당신만을 위한 퍼스널 컨시어지</p>
        <h2 className="welcome-title">반가워요, {currentUser?.user_metadata?.name || '대표'}님!</h2>
        <p className="welcome-desc">다음 모험을 떠날 준비가 되셨나요? 인공지능이 당신을 위한 완벽한 여정을 설계해 드립니다.</p>
      </section>

      {/* CTA Section: Start Travel */}
      <section className="cta-section animate-fade-in">
        <button className="cta-button" onClick={handleStartTrip}>
          <div className="cta-svg-bg">
            <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
              <circle cx="90" cy="10" fill="white" r="30"></circle>
              <circle cx="10" cy="90" fill="white" r="40"></circle>
            </svg>
          </div>
          <div className="cta-content">
            <div className="cta-icon-container">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <span className="cta-text-main">여행 시작하기</span>
            <span className="cta-text-sub">AI와 함께 특별한 이야기를 만들어보세요</span>
          </div>
        </button>
      </section>

      {/* Recent Trips Section */}
      <section className="recent-trips-section animate-fade-in">
        <div className="section-header">
          <h3>나의 최근 여행</h3>
          <button className="view-all-btn" onClick={() => showAlert('전체보기 기능은 준비 중입니다.')}>전체보기</button>
        </div>

        {recentTrips.length === 0 ? (
          <div className="clean-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            아직 기록된 여행이 없습니다. 첫 여행을 시작해보세요!
          </div>
        ) : (
          <div className="trips-grid">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="clean-card trip-card"
                onClick={() => handleTripCardClick(trip.id)}
              >
                <div className="trip-img-container">
                  <img
                    alt={trip.destination}
                    className="trip-img"
                    src={getTripImage(trip.destination, trip.companion)}
                  />
                  <div className="trip-tag-overlay">
                    <span className="trip-tag-pill">
                      <span className="material-symbols-outlined">{getCompanionIcon(trip.companion)}</span>
                      {getCompanionLabel(trip.companion)}
                    </span>
                  </div>
                </div>
                <div className="trip-info">
                  <h4 className="trip-title-text">{trip.title}</h4>
                  <p className="trip-date-text">
                    <span className="material-symbols-outlined">calendar_today</span>
                    {trip.startDate.replace(/-/g, '.')} - {trip.endDate.replace(/-/g, '.')}
                  </p>
                  <div className="trip-footer">
                    <div className="members-avatars">
                      <div className="avatar-badge avatar-blue">{getUserInitial()}D</div>
                      {trip.companion !== 'alone' && <div className="avatar-badge avatar-primary">+2</div>}
                    </div>
                    <div className="card-action-btn">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Destinations (UI ONLY) */}
      <section className="recommended-section animate-fade-in">
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>AI가 추천하는 여행지</h3>
        <div className="recommended-scroll scrollbar-hide">
          <div className="rec-card">
            <img alt="India" className="rec-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq9Su726AF_twzwJlODc2ntNSDkXuNnrNhYMUDkqCwMZBXG4zSjwRBpaTtoz2dFVg8UqH3MqN8FOOeAS5lAiiy4NseIsIiOzt7XeVOYZORAsEZo4C5wU0OltItKAGISZswWT-2VgVeOOp3P4AT1Bx8-2UQ53eNr0RGMznfQGmZARcchMseIsj42ABVjKZ-5LHMoxRb6nMuV8uHtd4XFChGbZTiVI83SKnlTkD6JlqJmbVr4Rd1nNYcley92p1vqXYm4OBYvaK-dbk" />
            <div className="rec-overlay"></div>
            <span className="rec-title">아그라</span>
          </div>
          <div className="rec-card">
            <img alt="Santorini" className="rec-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpmXgthdPzJEE8zAcUJMFyGCDxK58TlpVdo5SCPRfTJGqSvWVioTtkZktlc7NoZVR67M4R5SQgWpeggw4fNnUNE2cO9cQOIj0Or1IlroOFRftmyWmE58kwCPbK-4QdjQaOM1HlcRbNclZ1lgcr1OEVnWbNPQjxPec4n_qxJyEEavuWoIp_223gm70Q3NUu2-s3Q1O3ReoszWT8JMjemb1hokyedaUgckuOl4rmX2ycRUqE8B-yqx0C8HDmV-bnRp_wyeUisuka3o" />
            <div className="rec-overlay"></div>
            <span className="rec-title">그리스</span>
          </div>
          <div className="rec-card">
            <img alt="Sydney" className="rec-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByuyUplUWJ7iV_aYBIWAU5cxsOmj_v58O2aXbidrUkKu0F5QPnvEWUyAuId1fF2krcDnu1ulVIinoSNTvJyr0XupMFj1Eqon3aPwaLMYOWUIgeBnewe_jubcZdQbhIfkVJybV74lyU99x22-C7aFiyN3kfoM6cTEPDOwN_SYdLhtujVM-N1--4enzcik5qwmdNfzJTDbIaLPmlpN0HaNyTbUkB1cy2r22WEBIOla-rygteFr3KYlG-9jHpk4KVw6pIBkQO4R-7uoU" />
            <div className="rec-overlay"></div>
            <span className="rec-title">시드니</span>
          </div>
          <div className="rec-more-card" onClick={() => showAlert('추천 여행지는 순차적으로 오픈될 예정입니다.')}>
            <span className="material-symbols-outlined">add_circle</span>
            <span className="rec-more-text">더 보기</span>
          </div>
        </div>
      </section>

      {/* Floating AI Chatbot Button */}
      <button className="chatbot-fab" onClick={() => setIsChatbotOpen(true)}>
        <span className="material-symbols-outlined">smart_toy</span>
      </button>

      {/* Bottom Nav Bar (UI ONLY) */}
      <nav className="bottom-nav">
        <a className="nav-item active" href="#">
          <span className="material-symbols-outlined">home</span>
          홈
        </a>
        <a className="nav-item" href="#mytrips" onClick={(e) => { e.preventDefault(); showAlert('내 여행 목록 페이지는 준비 중입니다.'); }}>
          <span className="material-symbols-outlined">travel_explore</span>
          내 여행
        </a>
        <a className="nav-item" href="#search" onClick={(e) => { e.preventDefault(); showAlert('검색 기능은 준비 중입니다.'); }}>
          <span className="material-symbols-outlined">search</span>
          검색
        </a>
        <a className="nav-item" href="#profile" onClick={(e) => { e.preventDefault(); showAlert('프로필 관리 페이지는 준비 중입니다.'); }}>
          <span className="material-symbols-outlined">person</span>
          프로필
        </a>
      </nav>

      {/* Chatbot Popup Modal */}
      <ChatbotPopup isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
