import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  // 입력 필드 및 로딩 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 개별 필드 포커스 감지 상태 (마크업 요구사항인 아이콘 활성화 전환용)
  const [focusedField, setFocusedField] = useState(null);

  // 로그인 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
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

      alert('성공적으로 로그인되었습니다!');
      // 로그인 성공 시 이후 메인 화면이나 대시보드로 이동이 가능하도록 구성
    } catch (err) {
      console.error('로그인 에러:', err);
      // 에러 메시지 분석을 통해 구체적인 원인을 설명하고 정중하게 경고 표시
      let userFriendlyMessage = '로그인 처리 중 알 수 없는 문제가 발생했습니다. 다시 시도해 주세요.';
      
      if (err.message.includes('Invalid login credentials')) {
        userFriendlyMessage = '이메일 주소 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.';
      } else if (err.message.includes('Email not confirmed')) {
        userFriendlyMessage = '이메일 인증이 완료되지 않았습니다. 메일 수신함을 확인해 인증을 진행해 주세요.';
      } else if (err.message.includes('rate limit')) {
        userFriendlyMessage = '로그인 시도가 너무 빈번했습니다. 보안상 잠시 후 다시 시도해 주세요.';
      }
      
      alert(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 처리 (Google)
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      console.error('구글 소셜 로그인 에러:', err);
      alert('Google 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // 소셜 로그인 처리 (Kakao)
  const handleKakaoSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
      });
      if (error) throw error;
    } catch (err) {
      console.error('카카오 소셜 로그인 에러:', err);
      alert('Kakao 로그인 연동 중 오류가 발생했습니다: ' + err.message);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-full flex flex-col items-center justify-center relative w-full overflow-y-auto pb-8">
      <div className="w-full max-w-[400px] px-margin-mobile z-10 py-6">
        
        {/* Logo & Branding Area */}
        <div className="flex flex-col items-center mb-lg">
          <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center mb-sm text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined !text-[36px]" data-icon="explore">explore</span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">TripMate AI</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">여행의 설렘을 AI와 함께</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest login-card rounded-xl p-md border border-outline-variant/30">
          <form className="space-y-lg" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface block text-left w-full" htmlFor="email">이메일 주소</label>
              <div className="relative group">
                <span 
                  className={`material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 transition-colors ${
                    focusedField === 'email' ? 'text-primary' : 'text-outline'
                  }`}
                >
                  mail
                </span>
                <input 
                  className="w-full pl-12 pr-md py-md bg-surface-container-low border-0 rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
                  id="email" 
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
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface block text-left" htmlFor="password">비밀번호</label>
                <a 
                  className="font-label-sm text-label-sm text-primary hover:underline" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('비밀번호 재설정 기능은 현재 준비 중입니다.');
                  }}
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>
              <div className="relative group">
                <span 
                  className={`material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 transition-colors ${
                    focusedField === 'password' ? 'text-primary' : 'text-outline'
                  }`}
                >
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-md py-md bg-surface-container-low border-0 rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-on-surface" 
                  id="password" 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              className="w-full bg-primary-container text-on-primary-container font-headline-md text-[18px] py-md rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              <span>{loading ? '로그인 중...' : '로그인'}</span>
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-lg flex items-center">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-md font-label-sm text-label-sm text-outline">또는</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Social/Simple Login Options */}
          <div className="grid grid-cols-2 gap-md">
            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center py-sm border border-outline-variant rounded-lg hover:bg-surface-variant/30 transition-colors text-on-surface"
            >
              <img 
                alt="Google" 
                className="w-5 h-5 mr-sm" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaTjYL4rkh-OgdGjmu9VM0Z14pCSLD1vHa0cqX33bB87SB3fYSXYc4Gr5iDU6jQJIH29eRJ7FyrxLyz0X1rRsiTodjvEL0LU8E1DWyFaNJd-oOSsvLb_VQo9g9w4NO9NRIXyB4aWyEo9SHQC9-lGvh63euCSrI6ym0OnxZq7ajMpSHmnHzFuiu2HHLmNt7_SJ7309MYDtXkM-ROb75EgyC7NW4nwSl1oHutyqdG875onO3M6BPCRwbX9ZUd3YUVLG6fX6yiBcGGak"
              />
              <span className="font-label-md text-label-md">Google</span>
            </button>
            <button 
              onClick={handleKakaoSignIn}
              type="button"
              className="flex items-center justify-center py-sm border border-outline-variant rounded-lg hover:bg-surface-variant/30 transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined mr-sm !text-lg">forum</span>
              <span className="font-label-md text-label-md">Kakao</span>
            </button>
          </div>

        </div>

        {/* Signup Link */}
        <div className="mt-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            아직 계정이 없으신가요? 
            <Link className="text-primary font-bold hover:underline ml-xs" to="/signup">
              회원가입
            </Link>
          </p>
        </div>

        {/* Footer / Illustration Placeholder Area */}
        <div className="mt-xl opacity-80 flex justify-center">
          <div className="text-center max-w-[320px]">
            <p className="font-label-sm text-label-sm text-outline-variant italic leading-relaxed text-center">
              AI가 제안하는 완벽한 여행 일정을<br />지금 바로 경험해보세요.
            </p>
          </div>
        </div>

      </div>

      {/* Background Atmospheric Effect - absolute로 변경하여 모바일 프레임 내에 종속시킴 */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
}

export default Login;

