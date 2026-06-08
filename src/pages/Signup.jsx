import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  // 입력 필드 상태 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  // 로딩 및 성공 오버레이 상태 관리
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // 개별 필드 포커스 감지 상태 (마크업 요구사항인 포커스 애니메이션 scale-[1.01] 구현용)
  const [focusedField, setFocusedField] = useState(null);

  // 회원가입 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 기본 유효성 검사 (비밀번호 일치 여부)
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 약관 동의 체크 여부 확인
    if (!terms) {
      alert('서비스 이용약관 및 개인정보 처리방침에 동의하셔야 합니다.');
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
      // 에러 메시지 분석을 통해 구체적인 원인을 설명하고 정중하게 경고 표시
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
      
      alert(userFriendlyMessage);
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
      alert('구글 로그인 연동 중 오류가 발생했습니다: ' + err.message);
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
      alert('카카오 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-full flex flex-col items-center relative w-full pb-8">
      {/* Top Navigation - 모바일 프레임 내부 고정을 위해 sticky 지정 */}
      <header className="sticky top-0 w-full h-16 flex items-center justify-between px-margin-mobile bg-surface/90 backdrop-blur-md z-10 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]" data-icon="explore">explore</span>
          <span className="font-headline-md text-headline-md font-bold text-primary">TripMate AI</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center p-margin-mobile mt-4">
        <div className="flex flex-col w-full items-center">
          
          {/* Sign Up Form Card */}
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="bg-surface-container-lowest auth-card p-md rounded-xl w-full border border-outline-variant/30">
              <div className="mb-lg">
                <h1 className="text-[24px] font-bold text-on-surface mb-1">계정 생성하기</h1>
                <p className="text-[13px] text-on-surface-variant">여행의 모든 순간을 AI와 함께 기록하세요.</p>
              </div>

              <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div 
                  className={`flex flex-col gap-xs transition-transform duration-200 ${focusedField === 'name' ? 'scale-[1.01]' : ''}`}
                >
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 block text-left w-full" htmlFor="name">이름</label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 px-4 bg-[#F1F3F5] border-none rounded-lg focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
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
                <div 
                  className={`flex flex-col gap-xs transition-transform duration-200 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}
                >
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 block text-left w-full" htmlFor="email">이메일 주소</label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 px-4 bg-[#F1F3F5] border-none rounded-lg focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
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
                <div 
                  className={`flex flex-col gap-xs transition-transform duration-200 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}
                >
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 block text-left w-full" htmlFor="password">비밀번호</label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 px-4 bg-[#F1F3F5] border-none rounded-lg focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
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
                <div 
                  className={`flex flex-col gap-xs transition-transform duration-200 ${focusedField === 'confirm_password' ? 'scale-[1.01]' : ''}`}
                >
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 block text-left w-full" htmlFor="confirm_password">비밀번호 확인</label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 px-4 bg-[#F1F3F5] border-none rounded-lg focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
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
                <div className="flex items-center gap-3 mt-2 w-full justify-start text-left">
                  <div className="flex items-center h-5">
                    <input 
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container cursor-pointer" 
                      id="terms" 
                      required 
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm">
                    <label className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer block text-left" htmlFor="terms">
                      <span className="text-primary hover:underline cursor-pointer">서비스 이용약관</span> 및 <span className="text-primary hover:underline cursor-pointer">개인정보 처리방침</span>에 동의합니다.
                    </label>
                  </div>
                </div>

                {/* Create Account Button */}
                <button 
                  className="w-full h-12 mt-lg bg-primary-container text-on-primary-container font-semibold text-[15px] rounded-xl active:scale-[0.98] active:translate-y-[1px] transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:opacity-95" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? '계정 생성 중...' : '계정 생성하기'}</span>
                  {!loading && (
                    <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform !text-lg" data-icon="arrow_forward">arrow_forward</span>
                  )}
                </button>
              </form>

              <div className="mt-lg pt-lg border-t border-outline-variant/30 flex flex-col items-center gap-md">
                <p className="font-label-md text-label-md text-on-surface-variant">
                  이미 계정이 있으신가요?{' '}
                  <Link className="text-primary font-bold hover:underline" to="/login">
                    로그인
                  </Link>
                </p>

                {/* Social Sign Up (Google, Kakao) */}
                <div className="grid grid-cols-2 gap-md w-full">
                  <button 
                    onClick={handleGoogleSignIn}
                    type="button"
                    className="flex items-center justify-center py-3 border border-outline-variant rounded-xl hover:bg-surface-variant transition-colors text-on-surface"
                  >
                    <img 
                      alt="Google" 
                      className="w-5 h-5 mr-2" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeA0x1Wrot8ZF1PrI6nz-vQlNaOfA9BubPjsmP0U7tQ8R5E2cqGr0RPUaReJJsOJZrq2VOKB6uJE9qN5Gk5BQO3ihs9OrQvTnuBWTLQZw1NNzOC78A-PeS8pikERgfSLHhqbKv1epUwoeSx7EW3b0wH3ft4R1n1LxGV4H4jNhMOQ1X3v65p1Yl_PHFDcEu6nQSXlTZfw96spVW0bq3XXr2QlEJDYS-AM9CJEWI6UE46rNdeCROdnLUwh39K02kRUs2nnesMBm0akE"
                    />
                    <span className="font-label-md text-label-md">Google</span>
                  </button>
                  <button 
                    onClick={handleKakaoSignIn}
                    type="button"
                    className="flex items-center justify-center py-3 border border-outline-variant rounded-xl hover:bg-surface-variant transition-colors text-on-surface"
                  >
                    <span className="material-symbols-outlined mr-2 !text-lg">forum</span>
                    <span className="font-label-md text-label-md">Kakao</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Success Feedback Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-300 ${showSuccessOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        id="successOverlay"
      >
        <div className="bg-surface-container-lowest p-xl rounded-xl max-w-sm w-full mx-4 text-center shadow-2xl border border-outline-variant/30">
          <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-lg">
            <span className="material-symbols-outlined text-primary-container text-4xl" data-icon="check_circle">check_circle</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">환영합니다!</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl">계정이 성공적으로 생성되었습니다. 여행 계획을 시작해보세요.</p>
          <button 
            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/95 transition-colors" 
            onClick={() => {
              setShowSuccessOverlay(false);
              navigate('/login');
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
