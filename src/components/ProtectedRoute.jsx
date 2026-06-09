/* src/components/ProtectedRoute.jsx */
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, currentUser }) {
  // 로그인 세션 상태가 없으면 로그인 페이지로 강제 리다이렉션
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // 로그인 세션이 존재하면 정상적으로 페이지 노출
  return children;
}
