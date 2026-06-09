/* src/pages/TripPlanStep3.jsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateItinerary } from '../services/gemini';
import { saveTrip } from '../services/supabase';
import { useModal } from '../components/ModalProvider';
import './TripPlanStep3.css';

// 목적지별 맞춤 추천 명소 데이터
const RECOMMEND_PLACES = {
  '도쿄': ['도쿄 타워', '센소지 사원', '신주쿠 교엔', '시부야 스카이'],
  '오사카': ['유니버셜 스튜디오', '오사카성', '도톤보리', '하루카스 300'],
  '파리': ['에펠탑', '루브르 박물관', '오르세 미술관', '몽마르뜨 언덕'],
  'default': ['현지 맛집', '전망대', '랜드마크', '전통 시장']
};

export default function TripPlanStep3({ tripData, setTripData, resetTripData }) {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // 목적지 분석하여 추천 장소 키 선택
  const getRecommendKey = () => {
    const dest = tripData.destination.toLowerCase();
    if (dest.includes('도쿄')) return '도쿄';
    if (dest.includes('오사카')) return '오사카';
    if (dest.includes('파리')) return '파리';
    return 'default';
  };

  const recommendKey = getRecommendKey();
  const recommendedList = RECOMMEND_PLACES[recommendKey];

  // 장소 태그 추가 핸들러
  const handleAddTag = (text) => {
    const cleanText = text.trim();
    if (cleanText && !tripData.places.includes(cleanText)) {
      setTripData(prev => ({
        ...prev,
        places: [...prev.places, cleanText]
      }));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput.trim());
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTripData(prev => ({
      ...prev,
      places: prev.places.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // 추가 요청사항 입력 핸들러
  const handleNotesChange = (e) => {
    setTripData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  // 일정 생성하기 (Gemini API & DB 저장 최종 실행)
  const handleGenerateItinerary = async () => {
    setIsLoading(true);
    setLoadingStep('AI 컨시어지가 데이터를 분석하는 중입니다...');

    try {
      // 1. Gemini AI 일정 생성 호출
      setLoadingStep('인공지능이 최적의 맞춤 동선을 설계하고 있습니다...');
      const itinerary = await generateItinerary(tripData);

      // 2. 일정 데이터를 추가하여 Supabase (Mock)에 저장
      setLoadingStep('완성된 여행 일정을 보관 저장소에 기록하는 중입니다...');
      const savedTrip = await saveTrip('user1', {
        ...tripData,
        itinerary: itinerary
      });

      // 3. 완료 후 결과 페이지로 이동 (ID 파라미터 전달)
      setIsLoading(false);
      resetTripData(); // 작성 데이터 초기화
      navigate(`/result?id=${savedTrip.id}`);
    } catch (error) {
      console.error('일정 생성 실패:', error);
      setIsLoading(false);
      showAlert('일정 생성 중 문제가 발생했습니다. 임시 일정으로 전환합니다.', () => {
        // 임시 결과로 이동
        resetTripData(); // 작성 데이터 초기화
        navigate('/result?id=mock-trip-1');
      });
    }
  };

  const handlePrevStep = () => {
    navigate('/plan-step2');
  };

  return (
    <div className="container plan-step-container">
      {/* Loading Overlay Screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-ring"></div>
          <p className="loading-title">나만의 완벽한 여행 설계 중</p>
          <p className="loading-desc">{loadingStep}</p>
        </div>
      )}

      {/* Top Header */}
      <header className="step-header">
        <div className="brand-area">
          <span className="material-symbols-outlined brand-logo">explore</span>
          <h1 className="brand-name">TripMate AI</h1>
        </div>
        <button className="close-btn" onClick={() => { showConfirm('취소하시겠습니까?', () => { resetTripData(); navigate('/'); }); }}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      {/* Progress Bar Section */}
      <section className="progress-section">
        <div className="progress-info">
          <span className="progress-step">3단계 중 3단계</span>
          <span className="progress-title">최종 세부사항</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill step-3"></div>
        </div>
      </section>

      {/* Layout Grid */}
      <div className="plan-grid animate-fade-in">

        {/* Left Column: Forms */}
        <div className="left-column">

          {/* Card: Places Validation & Addition */}
          <div className="step3-card">
            <h2 className="step3-card-title">반드시 방문하고 싶은 장소</h2>
            <p className="step3-card-desc">놓치고 싶지 않은 랜드마크, 식당 또는 경험을 최종 검토해 주세요.</p>

            <div className="tag-control-area">
              <div className="tag-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {tripData.places.map((place, idx) => (
                  <span key={idx} className="tag-badge">
                    {place}
                    <button type="button" className="tag-delete-btn" onClick={() => handleRemoveTag(idx)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="tag-input-raw"
                placeholder="장소 직접 추가..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
            </div>

            {/* Recommendations Tags list */}
            <div className="rec-suggestions">
              <span className="rec-sug-title">추천 장소:</span>
              {recommendedList.map((recPlace, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sug-badge-btn"
                  onClick={() => handleAddTag(recPlace)}
                >
                  {recPlace}
                </button>
              ))}
            </div>
          </div>

          {/* Card: Extra Requests */}
          <div className="step3-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>notes</span>
              <h2 className="step3-card-title" style={{ marginBottom: 0 }}>AI 추가 요청 사항</h2>
            </div>
            <textarea
              className="custom-textarea"
              placeholder="예: '대중교통보다는 걷는 것을 선호해요', '숨겨진 명소 위주로 추천해주세요', 또는 '아이와 함께 가기 좋은 식당이 필요해요'..."
              value={tripData.notes}
              onChange={handleNotesChange}
            />
          </div>

        </div>

        {/* Right Column: Visual Inspiration Info */}
        <div className="inspiration-side">
          <img
            className="inspiration-img"
            alt="European Street Scene"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdT6r1VtUpwTlhs-LmMzPhZec3ZLayuCaiWZdExS_OXV7rM8z9Lzix0T8QjqwZaj15y_QJSmL53XRTsbD3YJkzX6dF63sIo-v5mj50-qQ0TGHrjygnfTSW1nYoI0EPddM-ViN6jHASKVRGfkzUitJ9oZA0ecs3ozOukz65G1B8MktqvfU0mUAEEPb122RN1Wt1untpMPxTtYpshYSk7GKs0pEj8GX_nfzK8rTlu1uB_oYnjLiEPWSW44uOexIIn5Fh6fVKx4iDxbA"
          />
          <div className="inspiration-overlay">
            <div className="insight-glass-card">
              <div className="insight-header">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>AI 통찰</span>
              </div>
              <p>"구체적인 요청 사항을 적어주시면 여행지의 시간대별 혼잡도 및 이동 동선을 극대화하여 조율할 수 있습니다."</p>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed Footer Actions - No Cut Layout */}
      <div className="footer-nav-bar">
        <div className="footer-nav-content">
          <div className="actions-left-group">
            <button type="button" className="nav-link-btn" onClick={handlePrevStep}>
              <span className="material-symbols-outlined">arrow_back</span>
              2단계로 돌아가기
            </button>
            <div className="divider-line"></div>
            <button type="button" className="nav-action-icon-btn" onClick={() => showAlert('수정할 항목을 선택해 주세요.')}>
              <span className="material-symbols-outlined">edit</span>
              수정
            </button>
            <button type="button" className="nav-action-icon-btn" onClick={() => showAlert('공유 링크가 클립보드에 복사되었습니다.')}>
              <span className="material-symbols-outlined">share</span>
              공유
            </button>
            <button type="button" className="nav-action-icon-btn" onClick={() => showAlert('일정이 내 저장목록에 임시 추가되었습니다.')}>
              <span className="material-symbols-outlined">bookmark</span>
              저장
            </button>
          </div>

          <button type="button" className="submit-btn" onClick={handleGenerateItinerary}>
            일정 생성하기
            <span className="material-symbols-outlined">magic_button</span>
          </button>
        </div>
      </div>
    </div>
  );
}
