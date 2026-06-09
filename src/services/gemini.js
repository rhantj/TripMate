/* src/services/gemini.js */
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Gemini API 초기화
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 2. 목적지별 기본 대체(Fallback) Mock 데이터 정의
const getMockItinerary = (destination, style = [], places = [], notes = '') => {
  const destName = destination || '선택한 목적지';
  
  // 일본 계열 (도쿄, 오사카 등)
  if (destName.includes('도쿄') || destName.includes('Tokyo') || destName.includes('일본')) {
    return {
      title: '도쿄의 전통과 현대적 화려함',
      description: `AI가 선별한 ${destName} 맞춤형 코스입니다. 로컬 시장의 활기와 현대 예술을 동시에 즐길 수 있습니다.`,
      timeline: [
        { 
          time: '오전 09:30', 
          title: '센소지 사원 탐방', 
          desc: '도쿄에서 가장 오래된 불교 사원인 아사쿠사 센소지에서 향을 피우며 여행의 안녕을 빌어보세요. 나카미세 거리에서 전통 기념품을 구경하는 재미가 쏠쏠합니다.', 
          tags: ['전통문화', '아사쿠사'], 
          isPrimary: true 
        },
        { 
          time: '오후 12:30', 
          title: '츠키지 장외시장 점심 식사', 
          desc: `요청하신 명소[${places.join(', ') || '로컬 맛집'}]의 신선한 해산물을 맛봅니다. 현장에서 바로 떠주는 신선한 참치 초밥과 달콤한 일본식 계란말이를 권장합니다.`, 
          tags: ['필수방문', '해산물맛집'], 
          isSecondary: true, 
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBllgP_UuFlsuNLoH173ZzuFyP9PZaJq5OUAmeY5Ooz6fWjhkQQBNXQ1DEOmqu9c3gCL38VPDPvIVC3w990VWNSZXB_LQPtJHm7fcSoLlE8HreOLiMXg530fU9EkkxE_fXyS4BEDSQiH4pCEL6YfkWlL-4Gx_fSWD3fc8goz7GSS9dgKBJ1SXUeJNt6rKisTmGzr49QFoDLUthI2WefckMbyYnwyD5sjQ_GkOsguLThMZP7Z90zFtWXj_rZyL1fzcTMqBe_Q7WHuhc' 
        },
        { 
          time: '오후 03:00', 
          title: '긴자 쇼핑 및 카페 투어', 
          desc: `도쿄 최대의 명품 및 패션 거리인 긴자를 산책합니다. 긴자 식스 루프탑 정원에서 빌딩 숲 전경을 감상하고, 트렌디한 카페에서 커피 타임을 갖습니다. ${notes ? `*참고사항 반영: ${notes}` : ''}`, 
          tags: ['쇼핑', '힐링카페'], 
          isPrimary: true 
        }
      ]
    };
  }

  // 유럽 계열 (파리, 런던 등)
  if (destName.includes('파리') || destName.includes('Paris') || destName.includes('프랑스')) {
    return {
      title: '낭만적인 파리의 예술적인 하루',
      description: `예술과 낭만의 도시 ${destName}에서의 완벽한 여정입니다. 역사적인 건축물과 현지 디저트를 함께 즐겨보세요.`,
      timeline: [
        { 
          time: '오전 10:00', 
          title: '루브르 박물관 관람', 
          desc: '세계 최대 규모의 박물관에서 모나리자와 비너스 조각상 등 대표 걸작들을 관람합니다. 피라미드 광장 앞에서의 인증샷은 필수입니다.', 
          tags: ['예술작품', '세계문화유산'], 
          isPrimary: true 
        },
        { 
          time: '오후 01:00', 
          title: '센강 뷰 레스토랑 점심 식사', 
          desc: `센강변에 위치한 감성적인 레스토랑에서 프렌치 어니언 스프와 정통 부프 부르기뇽을 맛봅니다. 디저트로 갓 구운 마카롱과 크렘 브륄레를 곁들입니다.`, 
          tags: ['미식여행', '센강전망'], 
          isSecondary: true, 
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdT6r1VtUpwTlhs-LmMzPhZec3ZLayuCaiWZdExS_OXV7rM8z9Lzix0T8QjqwZaj15y_QJSmL53XRTsbD3YJkzX6dF63sIo-v5mj50-qQ0TGHrjygnfTSW1nYoI0EPddM-ViN6jHASKVRGfkzUitJ9oZA0ecs3ozOukz65G1B8MktqvfU0mUAEEPb122RN1Wt1untpMPxTtYpshYSk7GKs0pEj8GX_nfzK8rTlu1uB_oYnjLiEPWSW44uOexIIn5Fh6fVKx4iDxbA'
        },
        { 
          time: '오후 04:00', 
          title: '에펠탑 및 마르스 광장 산책', 
          desc: `파리의 상징 에펠탑 밑 잔디밭 마르스 광장에서 돗자리를 깔고 파리지앵처럼 피크닉을 즐겨보세요. ${notes ? `*추가 요청사항: ${notes}` : ''}`, 
          tags: ['랜드마크', '피크닉'], 
          isPrimary: true 
        }
      ]
    };
  }

  // 기본 기타 도시 Fallback
  return {
    title: `${destName} 맞춤형 힐링 여행`,
    description: `AI 컨시어지가 설계한 ${destName} 하루 코스입니다. 당신이 선택한 테마에 맞추어 동선을 최적화했습니다.`,
    timeline: [
      { 
        time: '오전 09:30', 
        title: '도심 속 랜드마크 방문', 
        desc: `${destName}의 랜드마크를 방문하여 여행의 첫 발걸음을 딛습니다. 한산한 오전 시간대를 활용해 여유로운 관람이 가능합니다.`, 
        tags: ['도시탐방', '인증샷스팟'], 
        isPrimary: true 
      },
      { 
        time: '오후 12:30', 
        title: '현지 전통 맛집 식사', 
        desc: `선택하신 스타일[${style.join(', ') || '현지 미식'}]에 부합하는 유명 맛집을 방문하여 특별한 식사를 즐깁니다.`, 
        tags: ['현지식사', '추천맛집'], 
        isSecondary: true 
      },
      { 
        time: '오후 03:00', 
        title: `꼭 가고 싶던 장소[${places[0] || '인기 관광지'}] 방문`, 
        desc: `직접 요청하신 스팟을 중심으로 오후 코스를 연계합니다. ${notes ? `요구사항에 맞추어 동선을 디자인했습니다: ${notes}` : '여유로운 산책과 디저트 타임이 연결됩니다.'}`, 
        tags: ['사용자추천', '여유로운동선'], 
        isPrimary: true 
      }
    ]
  };
};

/**
 * Gemini API 또는 Mock Fallback을 활용하여 맞춤형 하루 일정을 생성합니다.
 * @param {object} params - 목적지, 날짜, 스타일, 방문지, 요청사항을 담은 객체
 */
export const generateItinerary = async (params) => {
  const { destination, startDate, endDate, companion, style, places, notes } = params;

  // 1. API 키가 없거나 초기화 실패 시 즉시 Mock 데이터로 Fallback
  if (!genAI) {
    console.warn("Gemini API Key가 설정되지 않았습니다. 임시 Mock 데이터를 생성합니다.");
    // 2.5초 로딩 감성을 재현하기 위해 대기 시간을 줌
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockItinerary(destination, style, places, notes);
  }

  try {
    // gemini-1.5-flash 모델 사용 (빠른 텍스트 처리에 적합)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      You are the ultimate personalized AI travel concierge, "TripMate AI".
      Create a detailed and professional 1-day itinerary based on the user's travel preferences.
      
      === USER REQUEST ===
      - Destination: ${destination}
      - Travel Period: ${startDate} to ${endDate}
      - Companion: ${companion} (Alone, Friends, Couple, Family)
      - Travel Styles: ${style ? style.join(', ') : 'None'}
      - Must-visit places: ${places ? places.join(', ') : 'None'}
      - Special requests/Notes: ${notes}
      
      === OUTPUT FORMAT (MUST BE JSON IN KOREAN) ===
      Generate a single JSON object matching the exact structure below. Do not wrap the JSON in Markdown block ticks, just output raw JSON text:
      {
        "title": "A catchy title for Day 1 (e.g., '1일차: 도쿄의 아침과 예술')",
        "description": "A warm, inspiring introduction of the day in 2-3 sentences.",
        "timeline": [
          {
            "time": "Specific time (e.g., '오전 10:00')",
            "title": "Name of the activity",
            "desc": "Detailed explanation of what to do, how it matches their styles and constraints (in friendly Korean, 2-3 sentences)",
            "tags": ["Tag1", "Tag2"],
            "isPrimary": true if it is a major sightseeing spot, false otherwise,
            "isSecondary": true if it is a restaurant/cafe/food spot, false otherwise
          }
        ]
      }
      
      Make sure to output exactly 3 timeline items (Morning, Lunch/Afternoon, Late Afternoon/Evening) and translate all content to polite Korean.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 파싱
    const itinerary = JSON.parse(text);
    return itinerary;
  } catch (error) {
    console.error("Gemini API 호출 중 에러 발생, Mock 데이터로 대체합니다:", error);
    return getMockItinerary(destination, style, places, notes);
  }
};
