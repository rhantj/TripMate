/* src/components/ModalProvider.jsx */
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

/**
 * 전역 모달을 사용하기 위한 Custom Hook
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal은 ModalProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}

/**
 * 전역 모달 상태를 관리하는 Provider
 */
export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  // 경고창(Alert) 열기
  const showAlert = (message, onConfirm) => {
    setModalConfig({
      isOpen: true,
      type: 'alert',
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: null,
    });
  };

  // 확인창(Confirm) 열기
  const showConfirm = (message, onConfirm, onCancel) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        closeModal();
      },
    });
  };

  // 모달 닫기
  const closeModal = () => {
    setModalConfig((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal, modalConfig }}>
      {children}
    </ModalContext.Provider>
  );
}
