const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 - 프로덕션 환경 고려
const allowedOrigins = [
  'http://localhost:2000',
  'https://your-vercel-domain.vercel.app', // Vercel 도메인으로 변경 필요
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // 개발 환경에서는 모든 origin 허용
    if (!origin || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 토큰 저장
let accessToken = null;
let tokenExpiry = null;

// 액세스 토큰 획득
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const clientId = process.env.VITE_DELIVERY_TRACKER_CLIENT_ID;
    const clientSecret = process.env.VITE_DELIVERY_TRACKER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('API 키가 설정되지 않았습니다');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://auth.tracker.delivery/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`인증 실패: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 1분 여유

    console.log('✅ API 토큰 획득 성공');
    return accessToken;
  } catch (error) {
    console.error('❌ 토큰 획득 실패:', error);
    throw error;
  }
}

// 택배사 목록 조회 API (현재는 지원하지 않음)
app.get('/api/carriers', async (req, res) => {
  // Delivery Tracker API의 carriers 스키마가 복잡하여 일단 더미 데이터 반환
  const dummyCarriers = [
    { id: 'kr.cjlogistics', name: 'CJ대한통운', displayName: 'CJ대한통운', isEnabled: true },
    { id: 'kr.hanjin', name: '한진택배', displayName: '한진택배', isEnabled: true },
    { id: 'kr.lotte', name: '롯데택배', displayName: '롯데택배', isEnabled: true },
    { id: 'kr.epost', name: '우체국택배', displayName: '우체국택배', isEnabled: true },
    { id: 'kr.logen', name: '로젠택배', displayName: '로젠택배', isEnabled: true },
    { id: 'kr.kdexp', name: '경동택배', displayName: '경동택배', isEnabled: true }
  ];
  
  res.json({ carriers: dummyCarriers });
});

// 택배 조회 API
app.post('/api/track', async (req, res) => {
  try {
    const { carrierId, trackingNumber } = req.body;
    
    if (!carrierId || !trackingNumber) {
      return res.status(400).json({ error: '택배사 ID와 운송장 번호가 필요합니다' });
    }

    const token = await getAccessToken();
    
    const response = await fetch('https://apis.tracker.delivery/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          query Track($carrierId: ID!, $trackingNumber: String!) {
            track(carrierId: $carrierId, trackingNumber: $trackingNumber) {
              lastEvent {
                time
                status {
                  code
                  name
                }
                description
                location {
                  name
                }
              }
              events(last: 10) {
                edges {
                  node {
                    time
                    status {
                      code
                      name
                    }
                    description
                    location {
                      name
                    }
                  }
                }
              }
              trackingNumber
            }
          }
        `,
        variables: {
          carrierId,
          trackingNumber
        }
      })
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error('GraphQL 에러: ' + JSON.stringify(data.errors));
    }

    if (!data.data.track) {
      return res.status(404).json({ error: '운송장 정보를 찾을 수 없습니다' });
    }

    // Connection 형태의 events를 배열 형태로 변환
    const trackResult = data.data.track;
    if (trackResult.events && trackResult.events.edges) {
      trackResult.events = trackResult.events.edges.map(edge => edge.node);
    }

    console.log(`✅ 택배 조회 성공: ${carrierId} - ${trackingNumber}`);
    res.json(data.data);
  } catch (error) {
    console.error('택배 조회 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버 실행 중: http://localhost:${PORT}`);
  console.log(`📦 프론트엔드 연동: http://localhost:2000`);
});

module.exports = app; 