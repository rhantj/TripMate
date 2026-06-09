/* src/pages/TripResult.jsx */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../services/supabase';
import ChatbotPopup from '../components/ChatbotPopup';
import { useModal } from '../components/ModalProvider';
import './TripResult.css';

export default function TripResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const tripId = searchParams.get('id');

  const [tripData, setTripData] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (tripId) {
        const data = await getTripById(tripId);
        if (data) {
          setTripData(data);
          return;
        }
      }
      // ID가 없거나 조회가 실패했을 때 샘플 로딩 (Fallback)
      const defaultData = await getTripById('mock-trip-1');
      setTripData(defaultData);
    };
    fetchTrip();
  }, [tripId]);

  if (!tripData) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner-ring" style={{ width: '48px', height: '48px' }}></div>
        <p style={{ color: 'var(--color-text-sub)' }}>여행 일정을 불러오는 중입니다...</p>
      </div>
    );
  }

  const { title, destination, startDate, endDate, companion, itinerary } = tripData;
  const formattedStartDate = startDate.replace(/-/g, '.');
  const formattedEndDate = endDate.replace(/-/g, '.');

  // 일정 타임라인 노드 아이콘 구하기
  const getNodeIcon = (item) => {
    if (item.isSecondary) return 'restaurant';

    // 키워드 매칭을 통한 대표 아이콘 매핑
    const activityTitle = item.title;
    if (activityTitle.includes('도착') || activityTitle.includes('공항')) return 'flight_land';
    if (activityTitle.includes('쇼핑') || activityTitle.includes('아울렛')) return 'shopping_bag';
    if (activityTitle.includes('카페') || activityTitle.includes('커피')) return 'local_cafe';
    if (activityTitle.includes('체크인') || activityTitle.includes('호텔')) return 'hotel';
    if (activityTitle.includes('전통') || activityTitle.includes('사원') || activityTitle.includes('박물관')) return 'history_edu';

    return 'explore'; // 기본값
  };

  // 구글 맵 임베드 URL 생성
  const mapSearchQuery = encodeURIComponent(destination);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container result-container">
      {/* Top Header Bar */}
      <header className="result-header">
        <div className="brand-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span className="material-symbols-outlined brand-logo" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          <h1 className="brand-name">TripMate AI</h1>
        </div>
        <div className="header-actions">
          <button className="close-btn" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      {/* Hero Summary Info */}
      <section className="hero-summary animate-fade-in">
        <div>
          <span className="summary-badge">나만의 {destination} 여행 플랜</span>
          <h2 className="summary-title">{itinerary.title}</h2>
          <p className="summary-desc">{itinerary.description}</p>
        </div>

        {/* Actions Button Bar */}
        <div className="summary-actions">
          <button className="action-pill-btn gray" onClick={() => navigate('/plan-step3')}>
            <span className="material-symbols-outlined">edit</span>
            수정하기
          </button>
          <button className="action-pill-btn gray" onClick={() => showAlert('공유 링크가 클립보드에 저장되었습니다.')}>
            <span className="material-symbols-outlined">share</span>
            공유하기
          </button>
          <button className="action-pill-btn primary-color" onClick={() => showAlert('내 보관함에 안전하게 저장되었습니다.')}>
            <span className="material-symbols-outlined">bookmark</span>
            저장하기
          </button>
        </div>
      </section>

      {/* Main Responsive Grid Layout */}
      <div className="result-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>

        {/* Left Panel: Map & Tips */}
        <div className="left-panel">

          {/* Google Maps Card Wrapper */}
          <div className="map-card-wrapper">
            <iframe
              title="Google Map"
              className="map-iframe"
              src={mapEmbedUrl}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <div className="map-footer-overlay">
              <div className="map-label">
                <span className="material-symbols-outlined">location_on</span>
                <span>{destination} 일대</span>
              </div>
              <a
                className="map-expand-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                지도로 보기
              </a>
            </div>
          </div>

          {/* AI Tips Card */}
          <div className="tip-card">
            <h3 className="tip-title">AI 여행 팁</h3>
            <div className="tip-content">
              <div className="tip-icon-box">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <p className="tip-text">
                대표, 선택하신 {destination} 일정은 이동 동선을 고려해 밀집 구역별로 설계되었습니다. 오후 야외활동 시 자외선 차단 및 기후 변화를 가볍게 체크해주세요.
              </p>
            </div>
          </div>

        </div>

        {/* Right Panel: timeline-track */}
        <div className="right-panel">
          {/* Vertical central line (hidden on mob) */}
          <div className="timeline-track-line"></div>

          <div className="timeline-items-list">
            {itinerary.timeline.map((item, idx) => {
              const nodeIcon = getNodeIcon(item);
              const isCoral = item.isSecondary; // Secondary Coral 강조

              return (
                <div key={idx} className="timeline-item-wrapper">

                  {/* Timeline Node Area */}
                  <div className="timeline-node-area">
                    <div className={`timeline-node-icon ${isCoral ? 'secondary-coral' : 'primary'}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: isCoral ? "'FILL' 1" : "'FILL' 0" }}>
                        {nodeIcon}
                      </span>
                    </div>
                    <span className="mobile-time-label">{item.time}</span>
                    <span className="desktop-time-label">{item.time.split(' ')[1]}</span>
                  </div>

                  {/* Activity Content Card */}
                  <div className="activity-card-body">
                    <div className="activity-card-header">
                      <h3 className="activity-title">{item.title}</h3>
                      <span className="activity-desktop-time">{item.time}</span>
                    </div>

                    {/* Image Attachment (If exist) */}
                    {item.image && (
                      <div className="activity-image-wrapper">
                        <img className="activity-image" alt={item.title} src={item.image} />
                      </div>
                    )}

                    <p className="activity-desc">{item.desc}</p>

                    <div className="activity-tags-list">
                      {/* 필수방문 하이라이트 뱃지 분기 */}
                      {isCoral && (
                        <span className="activity-tag coral-tag">필수 방문</span>
                      )}
                      {item.tags && item.tags.map((t, tIdx) => (
                        <span key={tIdx} className="activity-tag outline-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Chatbot FAB */}
      <button className="result-fab" onClick={() => setIsChatbotOpen(true)}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </button>

      {/* Chatbot Popup */}
      <ChatbotPopup isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
