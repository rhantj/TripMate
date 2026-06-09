/* src/pages/TripPlanStep1.jsx */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../components/ModalProvider';
import './TripPlanStep1.css';

// 자동완성 모의 데이터
const DESTINATIONS = [
  { main: '도쿄', sub: '일본' },
  { main: '오사카', sub: '일본' },
  { main: '교토', sub: '일본' },
  { main: '파리', sub: '프랑스' },
  { main: '시드니', sub: '호주' },
  { main: '서울', sub: '대한민국' },
  { main: '제주', sub: '대한민국' }
];

export default function TripPlanStep1({ tripData, setTripData, resetTripData }) {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  // 인풋 포커스 이동을 위한 Refs
  const titleRef = useRef(null);
  const destinationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // 엔터 키 입력 시 다음 인풋 필드로 포커스를 넘기고 폼 제출 방지
  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  // 모든 필수 입력 항목이 기입 완료되었는지 판별
  const isFormComplete =
    tripData.title?.trim() !== '' &&
    tripData.destination?.trim() !== '' &&
    tripData.startDate !== '' &&
    tripData.endDate !== '' &&
    tripData.companion !== '';

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }));

    // 목적지 자동완성 필터링
    if (field === 'destination') {
      if (value.trim().length > 0) {
        const filtered = DESTINATIONS.filter(item =>
          item.main.includes(value) || item.sub.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDestinations(filtered);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleSelectDestination = (dest) => {
    setTripData(prev => ({
      ...prev,
      destination: `${dest.main}, ${dest.sub}`
    }));
    setShowDropdown(false);
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    // 1. 유효성 검사 (커스텀 알림 모달 적용)
    if (!tripData.title.trim()) {
      showAlert('여행 이름을 입력해 주세요.');
      return;
    }
    if (!tripData.destination.trim()) {
      showAlert('목적지를 입력해 주세요.');
      return;
    }
    if (!tripData.startDate) {
      showAlert('여행 시작 날짜를 입력해 주세요.');
      return;
    }
    if (!tripData.endDate) {
      showAlert('여행 종료 날짜를 입력해 주세요.');
      return;
    }
    // 날짜 논리 오류 검출
    if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
      showAlert('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }
    if (!tripData.companion) {
      showAlert('누구와 함께하는지 동반자를 선택해 주세요.');
      return;
    }

    // 2단계로 이동
    navigate('/plan-step2');
  };

  const handleClose = () => {
    showConfirm('작성 중인 여행 정보가 저장되지 않습니다. 나가시겠습니까?', () => {
      resetTripData(); // 작성 중이던 데이터 소거
      navigate('/');
    });
  };

  return (
    <div className="container plan-step-container">
      {/* Header */}
      <header className="step-header">
        <div className="brand-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span className="material-symbols-outlined brand-logo">explore</span>
          <h1 className="brand-name">TripMate AI</h1>
        </div>
        <button className="close-btn" onClick={handleClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-info">
          <span className="progress-step">1 / 3 단계</span>
          <span className="progress-title">기본 정보 & 분위기</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill step-1"></div>
          <div className="progress-bar-fill step-rest"></div>
          <div className="progress-bar-fill step-rest"></div>
        </div>
      </section>

      {/* Prompt Intro */}
      <section className="prompt-header">
        <h2 className="prompt-title">
          <span>꿈꾸던 여행</span>을 시작해보세요.
        </h2>
        <p className="prompt-desc">기본 정보를 입력해주시면 AI가 맞춤 일정을 제안해 드립니다.</p>
      </section>

      {/* Form Content */}
      <form className="step-form" onSubmit={handleNextStep}>

        {/* Field: Trip Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="trip-title">여행 이름</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">edit_note</span>
            <input
              ref={titleRef}
              className="form-input"
              id="trip-title"
              placeholder="예: 아말피 해안에서의 여름"
              type="text"
              value={tripData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, destinationRef)}
            />
          </div>
        </div>

        {/* Field: Destination */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label" htmlFor="destination">목적지</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">location_on</span>
            <input
              ref={destinationRef}
              className="form-input"
              id="destination"
              placeholder="도시 또는 국가를 입력하세요..."
              type="text"
              value={tripData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onKeyDown={(e) => handleKeyDown(e, startDateRef)}
            />
            <span className="material-symbols-outlined input-icon-right" onClick={() => handleInputChange('destination', '도쿄, 일본')}>my_location</span>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && filteredDestinations.length > 0 && (
            <div className="autocomplete-dropdown scrollbar-hide">
              {filteredDestinations.map((dest, idx) => (
                <div
                  key={idx}
                  className="autocomplete-item"
                  onMouseDown={() => handleSelectDestination(dest)}
                >
                  <span className="material-symbols-outlined">location_on</span>
                  <div>
                    <strong>{dest.main}</strong> <small style={{ color: 'var(--color-text-sub)' }}>({dest.sub})</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field: Date Selector */}
        <div className="form-group">
          <label className="form-label">여행 일정</label>
          <div className="date-input-wrapper">
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">calendar_month</span>
              <input
                ref={startDateRef}
                className="form-input date-field"
                type="date"
                value={tripData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, endDateRef)}
              />
            </div>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">calendar_month</span>
              <input
                ref={endDateRef}
                className="form-input date-field"
                type="date"
                value={tripData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur(); // 종료 날짜 엔터 시 포커스 해제
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Field: Companion Chips */}
        <div className="form-group">
          <label className="form-label">누구와 함께하시나요?</label>
          <div className="chip-grid">
            <button
              className={`chip-btn ${tripData.companion === 'alone' ? 'active' : ''}`}
              type="button"
              onClick={() => handleInputChange('companion', 'alone')}
            >
              <span className="material-symbols-outlined">person</span>
              <span>혼자</span>
            </button>
            <button
              className={`chip-btn ${tripData.companion === 'friends' ? 'active' : ''}`}
              type="button"
              onClick={() => handleInputChange('companion', 'friends')}
            >
              <span className="material-symbols-outlined">group</span>
              <span>친구</span>
            </button>
            <button
              className={`chip-btn ${tripData.companion === 'couple' ? 'active' : ''}`}
              type="button"
              onClick={() => handleInputChange('companion', 'couple')}
            >
              <span className="material-symbols-outlined">favorite</span>
              <span>커플</span>
            </button>
            <button
              className={`chip-btn ${tripData.companion === 'family' ? 'active' : ''}`}
              type="button"
              onClick={() => handleInputChange('companion', 'family')}
            >
              <span className="material-symbols-outlined">family_restroom</span>
              <span>가족</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="action-area">
          <button className="next-btn" type="submit" disabled={!isFormComplete}>
            <span>다음: 활동 선택하기</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <p className="action-tip">거의 다 왔어요! 다음 두 단계에서 관심사를 구체화합니다.</p>
        </div>

      </form>
    </div>
  );
}