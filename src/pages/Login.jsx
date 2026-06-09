/* src/pages/Login.jsx */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useModal } from '../components/ModalProvider';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { showAlert } = useModal();

  // 입력 필드 및 로딩 상태 관리 (기본 테스터 계정 자동 주입)
  const [email, setEmail] = useState('test@tripmate.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  // 개별 필드 포커스 감지 상태 (아이콘 활성화 전환용)
  const [focusedField, setFocusedField] = useState(null);

  // 로그인 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showAlert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // Supabase 이메일/비밀번호 로그인 API 호출
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      showAlert(`${data.user.user_metadata.name || '사용자'}님, 반갑습니다! 성공적으로 로그인되었습니다.`, () => {
        // 상위 세션 상태 갱신 및 홈으로 이동
        onLoginSuccess(data.user);
        navigate('/');
      });
    } catch (err) {
      console.error('로그인 에러:', err);
      let userFriendlyMessage = '로그인 처리 중 알 수 없는 문제가 발생했습니다. 다시 시도해 주세요.';
      
      if (err.message.includes('Invalid login credentials')) {
        userFriendlyMessage = '이메일 주소 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.';
      } else if (err.message.includes('Email not confirmed')) {
        userFriendlyMessage = '이메일 인증이 완료되지 않았습니다. 메일 수신함을 확인해 인증을 진행해 주세요.';
      } else if (err.message.includes('rate limit')) {
        userFriendlyMessage = '로그인 시도가 너무 빈번했습니다. 보안상 잠시 후 다시 시도해 주세요.';
      }
      
      showAlert(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 처리 (Google)
  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      if (data && data.user) {
        onLoginSuccess(data.user);
        navigate('/');
      }
    } catch (err) {
      console.error('구글 소셜 로그인 에러:', err);
      showAlert('Google 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // 소셜 로그인 처리 (Kakao)
  const handleKakaoSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
      });
      if (error) throw error;
      if (data && data.user) {
        onLoginSuccess(data.user);
        navigate('/');
      }
    } catch (err) {
      console.error('카카오 소셜 로그인 에러:', err);
      showAlert('Kakao 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="w-full max-w-[400px] px-margin-mobile z-10 py-6" style={{ position: 'relative' }}>
        
        {/* Logo & Branding Area */}
        <div className="flex flex-col items-center mb-lg" style={{ textAlign: 'center' }}>
          <div className="login-logo-box">
            <span className="material-symbols-outlined !text-[36px]">explore</span>
          </div>
          <h1 className="summary-title" style={{ marginTop: '16px', color: 'var(--color-primary)' }}>TripMate AI</h1>
          <p className="welcome-desc" style={{ marginTop: '4px', textAlign: 'center' }}>여행의 설렘을 AI와 함께</p>
        </div>

        {/* Login Card */}
        <div className="login-card rounded-xl p-md">
          <form className="step-form" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">이메일 주소</label>
              <div className="input-wrapper">
                <span 
                  className={`material-symbols-outlined input-icon transition-colors ${
                    focusedField === 'email' ? 'text-primary' : ''
                  }`}
                  style={{ color: focusedField === 'email' ? 'var(--color-primary)' : 'var(--color-outline)' }}
                >
                  mail
                </span>
                <input 
                  className="form-input" 
                  id="email" 
                  required
                  type="email"
                  placeholder="example@tripmate.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>비밀번호</label>
                <a 
                  className="action-tip" 
                  style={{ color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showAlert('비밀번호 재설정 기능은 현재 준비 중입니다.');
                  }}
                >
                  비밀번호 분실?
                </a>
              </div>
              <div className="input-wrapper">
                <span 
                  className={`material-symbols-outlined input-icon transition-colors ${
                    focusedField === 'password' ? 'text-primary' : ''
                  }`}
                  style={{ color: focusedField === 'password' ? 'var(--color-primary)' : 'var(--color-outline)' }}
                >
                  lock
                </span>
                <input 
                  className="form-input" 
                  id="password" 
                  required
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              className="submit-btn" 
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <span>{loading ? '로그인 중...' : '로그인'}</span>
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flexGrow: 1, borderTop: '1px solid var(--color-outline-variant)' }}></div>
            <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--color-outline)' }}>또는</span>
            <div style={{ flexGrow: 1, borderTop: '1px solid var(--color-outline-variant)' }}></div>
          </div>

          {/* Social Login Options */}
          <div className="chip-grid">
            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className="chip-btn"
              style={{ padding: '10px 12px' }}
            >
              <img 
                alt="Google" 
                className="w-5 h-5 mr-sm" 
                style={{ width: '18px', height: '18px', marginRight: '6px' }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaTjYL4rkh-OgdGjmu9VM0Z14pCSLD1vHa0cqX33bB87SB3fYSXYc4Gr5iDU6jQJIH29eRJ7FyrxLyz0X1rRsiTodjvEL0LU8E1DWyFaNJd-oOSsvLb_VQo9g9w4NO9NRIXyB4aWyEo9SHQC9-lGvh63euCSrI6ym0OnxZq7ajMpSHmnHzFuiu2HHLmNt7_SJ7309MYDtXkM-ROb75EgyC7NW4nwSl1oHutyqdG875onO3M6BPCRwbX9ZUd3YUVLG6fX6yiBcGGak"
              />
              <span>Google</span>
            </button>
            <button 
              onClick={handleKakaoSignIn}
              type="button"
              className="chip-btn"
              style={{ padding: '10px 12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>forum</span>
              <span>Kakao</span>
            </button>
          </div>

        </div>

        {/* Signup Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
            아직 계정이 없으신가요? 
            <Link className="view-all-btn" style={{ marginLeft: '6px', fontWeight: 'bold' }} to="/signup">
              회원가입
            </Link>
          </p>
        </div>

        {/* Footer / Illustration Placeholder Area */}
        <div style={{ marginTop: '32px', textAlign: 'center', opacity: 0.8 }}>
          <p style={{ fontSize: '12px', color: 'var(--color-outline-variant)', fontStyle: 'italic', lineHeight: 1.5 }}>
            AI가 제안하는 완벽한 여행 일정을<br />지금 바로 경험해보세요.
          </p>
        </div>

      </div>

      {/* Atmospheric backgrounds */}
      <div className="atmosphere-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>
    </div>
  );
}
