/* src/components/GlobalModal.jsx */
import React from 'react';
import { useModal } from './ModalProvider';
import './GlobalModal.css';

export default function GlobalModal() {
  const { modalConfig } = useModal();
  const { isOpen, type, message, onConfirm, onCancel } = modalConfig;

  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // alert 타입인 경우 바깥 영역을 클릭했을 때도 '확인' 처리되도록 함
  const handleOverlayClick = () => {
    if (type === 'alert' && onConfirm) {
      onConfirm();
    }
  };

  const isConfirm = type === 'confirm';

  return (
    <div className="global-modal-overlay" onClick={handleOverlayClick}>
      <div className="global-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* 타입별 아이콘 렌더링 */}
        <div className={`global-modal-icon-box ${isConfirm ? 'confirm-type' : 'alert-type'}`}>
          <span className="material-symbols-outlined">
            {isConfirm ? 'help' : 'warning'}
          </span>
        </div>
        
        {/* 모달 본문 메시지 */}
        <div className="global-modal-body">
          <p className="global-modal-text">{message}</p>
        </div>
        
        {/* 모달 하단 버튼 영역 */}
        <div className="global-modal-footer">
          {isConfirm ? (
            <div className="global-modal-btn-group">
              <button className="global-modal-btn cancel-btn" onClick={onCancel}>
                취소
              </button>
              <button className="global-modal-btn confirm-btn" onClick={onConfirm}>
                확인
              </button>
            </div>
          ) : (
            <button className="global-modal-btn ok-btn" onClick={onConfirm}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
