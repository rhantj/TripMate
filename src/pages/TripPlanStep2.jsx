/* src/pages/TripPlanStep2.jsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../components/ModalProvider';
import './TripPlanStep2.css';

const STYLE_OPTIONS = [
  { value: '맛집', icon: 'restaurant' },
  { value: '카페', icon: 'local_cafe' },
  { value: '쇼핑', icon: 'shopping_bag' },
  { value: '자연', icon: 'forest' },
  { value: '역사/문화', icon: 'history_edu' },
  { value: '사진 스팟', icon: 'photo_camera' },
  { value: '여유로운 일정', icon: 'spa' }
];

export default function TripPlanStep2({ tripData, setTripData, resetTripData }) {
  const navigate = useNavigate();
  const { showConfirm } = useModal();
  const [tagInput, setTagInput] = useState('');

  // 1. 여행 스타일 토글
  const handleStyleToggle = (styleName) => {
    const isSelected = tripData.style.includes(styleName);
    const updatedStyles = isSelected 
      ? tripData.style.filter(s => s !== styleName)
      : [...tripData.style, styleName];

    setTripData(prev => ({
      ...prev,
      style: updatedStyles
    }));
  };

  // 2. 꼭 가고 싶은 장소 태그 핸들러
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = tagInput.trim().replace(/,/g, '');
      if (value) {
        // 중복 방지
        if (!tripData.places.includes(value)) {
          setTripData(prev => ({
            ...prev,
            places: [...prev.places, value]
          }));
        }
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

  // 3. 예산 라디오 체인지
  const handleBudgetChange = (value) => {
    setTripData(prev => ({
      ...prev,
      budget: value
    }));
  };

  const handleNextStep = () => {
    // 2단계 데이터는 필수 검증은 생략 가능하나, 최소한 스타일이나 예산 등 기본값이 바인딩되어 있으므로 다음 단계로 진행합니다.
    navigate('/plan-step3');
  };

  const handlePrevStep = () => {
    navigate('/plan-step1');
  };

  return (
    <div className="container plan-step-container">
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
          <span className="progress-step">3단계 중 2단계</span>
          <span className="progress-title">나의 여행 취향</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill step-2">
            <div className="shimmer"></div>
          </div>
        </div>
      </section>

      {/* Intro Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="prompt-title">취향을 알려주세요.</h2>
        <p className="prompt-desc">입력하신 정보를 바탕으로 당신만을 위한 맞춤 일정을 구성합니다.</p>
      </div>

      {/* Style Chips Section */}
      <section className="plan-section">
        <div className="section-title">
          <span className="material-symbols-outlined">style</span>
          <h3>여행 스타일</h3>
        </div>
        <div className="style-chips-container">
          {STYLE_OPTIONS.map((opt) => {
            const isActive = tripData.style.includes(opt.value);
            return (
              <button 
                key={opt.value}
                type="button" 
                className={`style-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleStyleToggle(opt.value)}
              >
                <span className="material-symbols-outlined">{opt.icon}</span>
                {opt.value}
              </button>
            );
          })}
        </div>
      </section>

      {/* Must-visit Places Tags Section */}
      <section className="plan-section">
        <div className="section-title">
          <span className="material-symbols-outlined">location_on</span>
          <h3>꼭 가고 싶은 장소</h3>
        </div>
        <div className="tag-input-container">
          <div className="tag-list">
            {tripData.places.map((tag, idx) => (
              <div key={idx} className="tag-badge">
                <span>{tag}</span>
                <button type="button" className="tag-delete-btn" onClick={() => handleRemoveTag(idx)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
          </div>
          <input 
            type="text" 
            className="tag-input-field" 
            placeholder={tripData.places.length === 0 ? "장소 추가 (예: 도쿄 스카이트리)" : "장소 추가..."}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
          />
        </div>
        <p className="tag-tip">엔터 키나 쉼표를 입력하여 놓치고 싶지 않은 명소를 추가하세요.</p>
      </section>

      {/* Budget Selector Section */}
      <section className="plan-section">
        <div className="section-title">
          <span className="material-symbols-outlined">payments</span>
          <h3>예산 수준</h3>
        </div>
        <div className="budget-grid">
          <label className="budget-card">
            <input 
              type="radio" 
              name="budget" 
              checked={tripData.budget === 'economy'}
              onChange={() => handleBudgetChange('economy')}
            />
            <div className="budget-card-content">
              <span className="material-symbols-outlined">savings</span>
              <span className="budget-label">절약형</span>
            </div>
          </label>
          <label className="budget-card">
            <input 
              type="radio" 
              name="budget" 
              checked={tripData.budget === 'midrange'}
              onChange={() => handleBudgetChange('midrange')}
            />
            <div className="budget-card-content">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className="budget-label">표준형</span>
            </div>
          </label>
          <label className="budget-card">
            <input 
              type="radio" 
              name="budget" 
              checked={tripData.budget === 'luxury'}
              onChange={() => handleBudgetChange('luxury')}
            />
            <div className="budget-card-content">
              <span className="material-symbols-outlined">diamond</span>
              <span className="budget-label">고급형</span>
            </div>
          </label>
        </div>
      </section>

      {/* AI Recommendation Insight Card */}
      <div className="ai-insight-card" style={{ marginBottom: '32px' }}>
        <div className="ai-icon-box">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div className="ai-text-box">
          <h4>AI 추천 가이드</h4>
          <p>"'사진 스팟'과 '역사/문화'를 함께 선택하면 멋진 '시네마틱 헤리티지' 루트가 완성됩니다. 랜드마크 방문 시 가장 사진이 잘 나오는 골든 아워를 우선적으로 고려할게요."</p>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar">
        <div className="action-bar-content">
          <button type="button" className="back-btn" onClick={handlePrevStep}>
            이전
          </button>
          <button type="button" className="generate-btn" onClick={handleNextStep}>
            일정 생성하기
            <span className="material-symbols-outlined">auto_fix_high</span>
          </button>
        </div>
      </div>
    </div>
  );
}
