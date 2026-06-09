/* src/services/supabase.js */
import { createClient } from '@supabase/supabase-js';

// 1. Supabase 클라이언트 초기화 (추후 DB 구축 시 활성화)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock Auth API 구현
const createMockAuth = () => {
  return {
    signUp: async ({ email, password, options }) => {
      // 1.5초 로딩 표현
      await new Promise(resolve => setTimeout(resolve, 1500));

      const name = options?.data?.name || '가입유저';
      const usersJson = localStorage.getItem('tripmate_users') || '[]';
      const users = JSON.parse(usersJson);

      // 이메일 중복 체크
      if (users.some(u => u.email === email)) {
        return { data: { user: null }, error: { message: 'User already registered' } };
      }

      // 비밀번호 길이 체크
      if (password.length < 6) {
        return { data: { user: null }, error: { message: 'Password should be at least 6 characters' } };
      }

      users.push({ email, password, name });
      localStorage.setItem('tripmate_users', JSON.stringify(users));

      const mockUser = { id: `user-${Date.now()}`, email: email, user_metadata: { name } };
      return { data: { user: mockUser }, error: null };
    },

    signInWithPassword: async ({ email, password }) => {
      // 1초 로딩 표현
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersJson = localStorage.getItem('tripmate_users') || '[]';
      const users = JSON.parse(usersJson);

      // 사용자 정보 조회
      const user = users.find(u => u.email === email);
      if (!user || user.password !== password) {
        return { data: { user: null }, error: { message: 'Invalid login credentials' } };
      }

      const mockUser = {
        id: 'user1', // 여행 샘플 아이디 'user1'과 자동 매칭
        email: email,
        user_metadata: { name: user.name }
      };

      localStorage.setItem('tripmate_session', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    },

    signInWithOAuth: async ({ provider }) => {
      const mockUser = { id: 'user1', email: 'social@tripmate.ai', user_metadata: { name: `${provider} 유저` } };
      localStorage.setItem('tripmate_session', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('tripmate_session');
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem('tripmate_session');
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    },

    getUser: async () => {
      const session = localStorage.getItem('tripmate_session');
      return { data: { user: session ? JSON.parse(session) : null }, error: null };
    }
  };
};

const createSupabaseClient = () => {
  // 만약 환경 변수에 실제 Supabase URL과 Key가 제공되면 실제 클라이언트를 만들고
  // 특정 Mock 계정(test@tripmate.ai) 로그인 요청 시나 세션에 대해 Interceptor(가로채기)를 적용합니다.
  if (supabaseUrl && supabaseAnonKey) {
    const client = createClient(supabaseUrl, supabaseAnonKey);

    // 1. signInWithPassword 인터셉트
    const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth);
    client.auth.signInWithPassword = async ({ email, password }) => {
      if (email === 'test@tripmate.ai' && password === 'password123') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'user1',
          email: 'test@tripmate.ai',
          user_metadata: { name: '테스터' }
        };
        localStorage.setItem('tripmate_session', JSON.stringify(mockUser));
        return { data: { user: mockUser, session: { user: mockUser } }, error: null };
      }
      return originalSignInWithPassword({ email, password });
    };

    // 2. getSession 인터셉트
    const originalGetSession = client.auth.getSession.bind(client.auth);
    client.auth.getSession = async () => {
      const localSession = localStorage.getItem('tripmate_session');
      if (localSession) {
        const user = JSON.parse(localSession);
        if (user.email === 'test@tripmate.ai') {
          return { data: { session: { user } }, error: null };
        }
      }
      return originalGetSession();
    };

    // 3. getUser 인터셉트
    const originalGetUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = async () => {
      const localSession = localStorage.getItem('tripmate_session');
      if (localSession) {
        const user = JSON.parse(localSession);
        if (user.email === 'test@tripmate.ai') {
          return { data: { user }, error: null };
        }
      }
      return originalGetUser();
    };

    // 4. signOut 인터셉트
    const originalSignOut = client.auth.signOut.bind(client.auth);
    client.auth.signOut = async () => {
      const localSession = localStorage.getItem('tripmate_session');
      if (localSession) {
        const user = JSON.parse(localSession);
        if (user.email === 'test@tripmate.ai') {
          localStorage.removeItem('tripmate_session');
          return { error: null };
        }
      }
      return originalSignOut();
    };

    return client;
  } else {
    // 환경 변수가 없으면 전체를 로컬 스토리지 기반 mock으로 동작시킴
    return {
      auth: createMockAuth(),
    };
  }
};

export const supabase = createSupabaseClient();

// 2. Mock Data (최초 접속 시 보여줄 기본 최근 여행 샘플)
const SAMPLE_TRIPS = [
  {
    id: 'mock-trip-1',
    user_id: 'user1',
    title: '도쿄 먹거리 여행',
    destination: '도쿄',
    startDate: '2024-10-12',
    endDate: '2024-10-18',
    companion: 'friends',
    style: ['맛집', '카페'],
    places: ['츠키지 시장', '긴자 식스', '센소지'],
    budget: 'midrange',
    notes: '일정을 느긋하게 짜주세요',
    created_at: new Date('2024-10-10').toISOString(),
    itinerary: {
      title: '도쿄의 아침과 미술',
      description: 'AI가 특별히 엄선한 코스입니다. 전통 시장의 열기와 긴자의 세련된 매력을 동시에 느껴보세요.',
      timeline: [
        { date: '2024-10-12', time: '오전 10:00', title: '도착 및 체크인', desc: '나리타 국제공항 도착 후 시내 호텔로 이동하여 짐을 맡깁니다. 본 일정 전 간단한 휴식을 권장합니다.', tags: ['나리타공항', '수하물보관'], isPrimary: true },
        { date: '2024-10-12', time: '오후 12:00', title: '츠키지 시장 점심 식사', desc: '세계 최대 규모의 수산시장에서 신선한 초밥과 길거리 음식을 즐겨보세요. 카이센동을 강력 추천합니다.', tags: ['로컬맛집', '필수방문'], isSecondary: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBllgP_UuFlsuNLoH173ZzuFyP9PZaJq5OUAmeY5Ooz6fWjhkQQBNXQ1DEOmqu9c3gCL38VPDPvIVC3w990VWNSZXB_LQPtJHm7fcSoLlE8HreOLiMXg530fU9EkkxE_fXyS4BEDSQiH4pCEL6YfkWlL-4Gx_fSWD3fc8goz7GSS9dgKBJ1SXUeJNt6rKisTmGzr49QFoDLUthI2WefckMbyYnwyD5sjQ_GkOsguLThMZP7Z90zFtWXj_rZyL1fzcTMqBe_Q7WHuhc' },
        { date: '2024-10-13', time: '오전 10:00', title: '센소지 사원 탐방', desc: '도쿄에서 가장 오래된 불교 사원인 아사쿠사 센소지에서 향을 피우며 여행의 안녕을 빌어보세요.', tags: ['역사문화', '전통체험'], isPrimary: true },
        { date: '2024-10-13', time: '오후 02:00', title: '긴자 쇼핑 및 카페 투어', desc: '일본에서 가장 화려한 쇼핑가 긴자를 산책합니다. 긴자 식스의 루프탑 정원과 츠타야 서점을 둘러보세요.', tags: ['명품거리', '디자인', '휴식'], isPrimary: true }
      ]
    }
  },
  {
    id: 'mock-trip-2',
    user_id: 'user1',
    title: '오사카 가족 어드벤처',
    destination: '오사카',
    startDate: '2024-11-05',
    endDate: '2024-11-12',
    companion: 'family',
    style: ['자연', '여유로운 일정'],
    places: ['유니버셜 스튜디오', '오사카성'],
    budget: 'luxury',
    notes: '가족을 배려해서 동선을 짧게 짜주세요.',
    created_at: new Date('2024-11-01').toISOString(),
    itinerary: {
      title: '오사카 힐링 투어',
      description: '가족 모두가 편안하게 즐길 수 있는 오사카 중심의 여유로운 일정입니다.',
      timeline: [
        { date: '2024-11-05', time: '오전 11:00', title: '오사카성 산책', desc: '아름다운 천수각 주위를 가볍게 걸으며 가족사진을 찍고 힐링하는 시간입니다.', tags: ['가족여행', '자연'], isPrimary: true },
        { date: '2024-11-05', time: '오후 01:00', title: '도톤보리 점심 식사', desc: '유명한 글리코상 앞에서 기념 촬영을 한 후, 도톤보리의 타코야키와 오코노미야키 맛집을 방문합니다.', tags: ['맛집체험', '도톤보리'], isSecondary: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARu9gRc0w9ZoujuNEUK8ud98haK7tfz0cxaG8GwIkhtrMuUfv7Attw0jeV_RBbiLUHeGYvszUgaID_dD7uHZYZu1KvAG2O-qPhUGMKsb8HqcJl8EyTGdiEn-jYqtnXTv3vycc0MIePFJnhDZXaorQrZXwfnciqzZEhvVoFx9MtUiMUXXh_729a3K5vfjBwQO9F0IwbwQiicd4bYv3JVqj62bbwsSLu375X3Y-OaWrpsy1MhNCZIJq4nq62xDMqzq3RwIJEOjSD2kU' }
      ]
    }
  }
];

// 로컬 스토리지 초기 설정
const initLocalStorage = () => {
  if (!localStorage.getItem('tripmate_trips')) {
    localStorage.setItem('tripmate_trips', JSON.stringify(SAMPLE_TRIPS));
  }

  // 기본 테스트 계정 주입
  if (!localStorage.getItem('tripmate_users')) {
    const defaultUsers = [
      { email: 'test@tripmate.ai', password: 'password123', name: '테스터' }
    ];
    localStorage.setItem('tripmate_users', JSON.stringify(defaultUsers));
  }
};
initLocalStorage();

// 3. 데이터 로직 함수 (로컬스토리지 우선 + Supabase 백업 구조)

export const getRecentTrips = async (userId = 'user1') => {
  // 1. Supabase에서 조회 시도
  if (supabaseUrl && supabaseAnonKey && supabase.from) {
    try {
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // DB에서 가져온 데이터를 프론트엔드 카멜케이스에 맞게 변환하여 반환
        return data.map(item => ({
          ...item,
          startDate: item.start_date || item.startDate,
          endDate: item.end_date || item.endDate
        }));
      }
    } catch (dbError) {
      console.error('Supabase getRecentTrips 에러:', dbError);
    }
  }

  // 2. 실패 또는 연동되지 않은 경우 LocalStorage 폴백
  const tripsJson = localStorage.getItem('tripmate_trips');
  const allTrips = tripsJson ? JSON.parse(tripsJson) : [];
  return allTrips.filter(trip => trip.user_id === userId);
};

export const getTripById = async (tripId) => {
  // 1. Supabase에서 조회 시도
  if (supabaseUrl && supabaseAnonKey && supabase.from) {
    try {
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('id', tripId)
        .single();

      if (!error && data) {
        return {
          ...data,
          startDate: data.start_date || data.startDate,
          endDate: data.end_date || data.endDate
        };
      }
    } catch (dbError) {
      console.error('Supabase getTripById 에러:', dbError);
    }
  }

  // 2. 실패 또는 연동되지 않은 경우 LocalStorage 폴백
  const tripsJson = localStorage.getItem('tripmate_trips');
  const allTrips = tripsJson ? JSON.parse(tripsJson) : [];
  return allTrips.find(trip => trip.id === tripId) || null;
};

export const saveTrip = async (userId = 'user1', tripData) => {
  const newTrip = {
    id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    title: tripData.title || `${tripData.destination} 여행`,
    destination: tripData.destination,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    companion: tripData.companion,
    style: tripData.style || [],
    places: tripData.places || [],
    budget: tripData.budget || 'midrange',
    notes: tripData.notes || '',
    created_at: new Date().toISOString(),
    itinerary: tripData.itinerary
  };

  // 1. LocalStorage 우선 저장 (오프라인 지원 및 캐시 역할)
  try {
    const tripsJson = localStorage.getItem('tripmate_trips');
    const allTrips = tripsJson ? JSON.parse(tripsJson) : [];
    allTrips.unshift(newTrip);
    localStorage.setItem('tripmate_trips', JSON.stringify(allTrips));
  } catch (e) {
    console.error('LocalStorage 저장 실패:', e);
  }

  // 2. Supabase DB 연동 저장 시도
  if (supabaseUrl && supabaseAnonKey && supabase.from) {
    try {
      // 2-1. 스네이크 케이스가 기본인 데이터베이스 관례에 따라 저장 시도
      const { data, error } = await supabase
        .from('travel_plans')
        .insert([
          {
            id: newTrip.id,
            user_id: newTrip.user_id,
            title: newTrip.title,
            destination: newTrip.destination,
            start_date: newTrip.startDate,
            end_date: newTrip.endDate,
            companion: newTrip.companion,
            style: newTrip.style,
            places: newTrip.places,
            budget: newTrip.budget,
            notes: newTrip.notes,
            itinerary: newTrip.itinerary,
            created_at: newTrip.created_at
          }
        ])
        .select();

      if (error) {
        console.warn('Supabase 스네이크 케이스 저장 시 에러 감지. 카멜 케이스로 재시도합니다:', error);

        // 2-2. 혹시 스키마가 카멜 케이스로 만들어져 있을 경우를 대비한 재시도 로직
        const { error: camelError } = await supabase
          .from('travel_plans')
          .insert([
            {
              id: newTrip.id,
              user_id: newTrip.user_id,
              title: newTrip.title,
              destination: newTrip.destination,
              startDate: newTrip.startDate,
              endDate: newTrip.endDate,
              companion: newTrip.companion,
              style: newTrip.style,
              places: newTrip.places,
              budget: newTrip.budget,
              notes: newTrip.notes,
              itinerary: newTrip.itinerary,
              created_at: newTrip.created_at
            }
          ]);

        if (camelError) {
          console.error('Supabase DB 카멜 케이스 재시도 최종 실패:', camelError);
        } else {
          console.log('Supabase DB 카멜 케이스 저장 성공');
        }
      } else {
        console.log('Supabase DB 저장 성공:', data);
      }
    } catch (dbError) {
      console.error('Supabase DB 통신 에러:', dbError);
    }
  }

  return newTrip;
};
