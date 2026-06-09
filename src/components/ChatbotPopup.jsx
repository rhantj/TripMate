/* src/components/ChatbotPopup.jsx */
import React from 'react';
import './ChatbotPopup.css';

export default function ChatbotPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span className="material-symbols-outlined icon-fill">smart_toy</span>
            <h3>TripMate AI 어시스턴트</h3>
          </div>
          <button className="chatbot-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="chatbot-body">
          <div className="chatbot-status-icon">
            <span className="material-symbols-outlined">construction</span>
          </div>
          <p className="chatbot-message-main">현재 서비스 준비 중입니다!</p>
          <p className="chatbot-message-sub">
            대표, 현재 AI 1:1 상담 챗봇 기능은 개발 중에 있습니다. 보다 스마트하고 편리한 컨시어지 서비스를 제공해드리기 위해 열심히 준비하고 있으니 조금만 기다려주세요!
          </p>
        </div>

        <div className="chatbot-footer">
          <button className="chatbot-confirm-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
