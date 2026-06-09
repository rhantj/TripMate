/* src/pages/Signup.jsx */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useModal } from '../components/ModalProvider';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const { showAlert } = useModal();

  // 입력 필드 상태 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  // 로딩 및 성공 오버레이 상태 관리
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // 개별 필드 포커스 감지 상태 (포커스 애니메이션용)
  const [focusedField, setFocusedField] = useState(null);

  // 회원가입 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 기본 비밀번호 일치 여부 체크
    if (password !== confirmPassword) {
      showAlert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 약관 동의 체크 여부 확인
    if (!terms) {
      showAlert('서비스 이용약관 및 개인정보 처리방침에 동의하셔야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // Supabase Auth 계정 생성 API 호출
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // 사용자 추가 메타데이터로 이름 저장
          },
        },
      });

      if (error) {
        throw error;
      }

      // 성공 시 성공 피드백 오버레이(모달)를 표시
      setShowSuccessOverlay(true);
    } catch (err) {
      console.error('회원가입 에러:', err);
      let userFriendlyMessage = '회원가입 처리 중 알 수 없는 문제가 발생했습니다. 다시 시도해 주세요.';
      
      if (err.message.includes('User already registered')) {
        userFriendlyMessage = '이미 가입된 이메일 주소입니다. 다른 이메일을 입력하거나 로그인해 주세요.';
      } else if (err.message.includes('Password should be')) {
        userFriendlyMessage = '비밀번호는 최소 6자 이상이어야 보안상 안전합니다.';
      } else if (err.message.includes('valid email')) {
        userFriendlyMessage = '입력하신 이메일의 형식이 잘못되었습니다. 다시 확인해 주세요.';
      } else if (err.message.includes('rate limit')) {
        userFriendlyMessage = '짧은 시간 동안 너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.';
      }
      
      showAlert(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // 구글 소셜 로그인 연동 함수
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      console.error('구글 소셜 로그인 에러:', err);
      showAlert('구글 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // 카카오 소셜 로그인 연동 함수
  const handleKakaoSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
      });
      if (error) throw error;
    } catch (err) {
      console.error('카카오 소셜 로그인 에러:', err);
      showAlert('카카오 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="w-full max-w-[400px] px-margin-mobile z-10 py-6" style={{ position: 'relative' }}>
        
        {/* Logo & Branding Area */}
        <div className="flex flex-col items-center mb-lg" style={{ textAlign: 'center' }}>
          <div className="login-logo-box">
            <span className="material-symbols-outlined !text-[28px]">explore</span>
          </div>
          <h1 className="brand-name" style={{ marginTop: '12px', fontSize: '20px', color: 'var(--color-primary)' }}>TripMate AI</h1>
        </div>

        {/* Sign Up Form Card */}
        <div className="auth-card p-md rounded-xl">
          <div style={{ marginBottom: '20px' }}>
            <h2 className="step3-card-title" style={{ fontSize: '22px', marginBottom: 0 }}>계정 생성하기</h2>
            <p className="step3-card-desc" style={{ fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>여행의 모든 순간을 AI와 함께 기록하세요.</p>
          </div>

          <form className="step-form" onSubmit={handleSubmit}>
            
            {/* Name Field */}
            <div className="form-group" style={{ transform: focusedField === 'name' ? 'scale(1.01)' : 'none', transition: 'transform 0.2s' }}>
              <label className="form-label" htmlFor="name">이름</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ color: focusedField === 'name' ? 'var(--color-primary)' : 'var(--color-outline)' }}>person</span>
                <input 
                  className="form-input" 
                  id="name" 
                  placeholder="홍길동" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group" style={{ transform: focusedField === 'email' ? 'scale(1.01)' : 'none', transition: 'transform 0.2s' }}>
              <label className="form-label" htmlFor="email">이메일 주소</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ color: focusedField === 'email' ? 'var(--color-primary)' : 'var(--color-outline)' }}>mail</span>
                <input 
                  className="form-input" 
                  id="email" 
                  placeholder="example@tripmate.ai" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ transform: focusedField === 'password' ? 'scale(1.01)' : 'none', transition: 'transform 0.2s' }}>
              <label className="form-label" htmlFor="password">비밀번호</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ color: focusedField === 'password' ? 'var(--color-primary)' : 'var(--color-outline)' }}>lock</span>
                <input 
                  className="form-input" 
                  id="password" 
                  placeholder="8자 이상 입력" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Confirmation Field */}
            <div className="form-group" style={{ transform: focusedField === 'confirm_password' ? 'scale(1.01)' : 'none', transition: 'transform 0.2s' }}>
              <label className="form-label" htmlFor="confirm_password">비밀번호 확인</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ color: focusedField === 'confirm_password' ? 'var(--color-primary)' : 'var(--color-outline)' }}>lock</span>
                <input 
                  className="form-input" 
                  id="confirm_password" 
                  placeholder="비밀번호 재입력" 
                  required 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm_password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Terms of Service */}
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px', marginTop: '8px' }}>
              <input 
                id="terms" 
                required 
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', cursor: 'pointer', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>서비스 이용약관</span> 및 <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>개인정보 처리방침</span>에 동의합니다.
              </label>
            </div>

            {/* Create Account Button */}
            <button 
              className="submit-btn" 
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '16px' }}
            >
              <span>{loading ? '계정 생성 중...' : '계정 생성하기'}</span>
              {!loading && (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              )}
            </button>
          </form>

          {/* Social signup links */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
              이미 계정이 있으신가요?{' '}
              <Link className="view-all-btn" style={{ fontWeight: 'bold', marginLeft: '6px' }} to="/login">
                로그인
              </Link>
            </p>

            <div className="chip-grid" style={{ width: '100%' }}>
              <button 
                onClick={handleGoogleSignIn}
                type="button"
                className="chip-btn"
                style={{ padding: '10px 12px' }}
              >
                <img 
                  alt="Google" 
                  style={{ width: '18px', height: '18px', marginRight: '6px' }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeA0x1Wrot8ZF1PrI6nz-vQlNaOfA9BubPjsmP0U7tQ8R5E2cqGr0RPUaReJJsOJZrq2VOKB6uJE9qN5Gk5BQO3ihs9OrQvTnuBWTLQZw1NNzOC78A-PeS8pikERgfSLHhqbKv1epUwoeSx7EW3b0wH3ft4R1n1LxGV4H4jNhMOQ1X3v65p1Yl_PHFDcEu6nQSXlTZfw96spVW0bq3XXr2QlEJDYS-AM9CJEWI6UE46rNdeCROdnLUwh39K02kRUs2nnesMBm0akE"
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
        </div>
      </div>

      {/* Success Feedback Overlay */}
      {showSuccessOverlay && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-box">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3 className="step3-card-title" style={{ fontSize: '22px' }}>환영합니다!</h3>
            <p className="step3-card-desc" style={{ fontSize: '14px', marginTop: '4px', marginBottom: '24px' }}>계정이 성공적으로 생성되었습니다. 로그인 후 여행 계획을 시작해보세요.</p>
            <button 
              className="submit-btn" 
              style={{ width: '100%' }}
              onClick={() => {
                setShowSuccessOverlay(false);
                navigate('/login');
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
