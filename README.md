# 📦 택배 조회 시스템

Delivery Tracker API를 활용한 실시간 택배 조회 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🔍 **실시간 택배 조회**: 운송장 번호로 배송 상태 실시간 확인
- 📱 **반응형 디자인**: 모바일/데스크톱 모두 최적화
- 🎨 **직관적인 UI**: 배송 단계별 시각적 표시
- ⚡ **빠른 조회**: GraphQL API로 효율적인 데이터 로딩
- 🧪 **테스트 모드**: 더미 데이터로 기능 체험 가능

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

웹브라우저에서 [http://localhost:2000](http://localhost:2000) 접속

### 3. 빌드

```bash
npm run build
```

## 🌐 배포 가이드

### Vercel (프론트엔드) + Railway (백엔드) 배포

#### 1. Railway 백엔드 배포

1. Railway 계정 생성 및 프로젝트 생성
2. GitHub 저장소 연결
3. `backend/` 폴더를 루트 디렉터리로 설정
4. 환경 변수 설정:
   ```
   NODE_ENV=production
   PORT=3001
   VITE_DELIVERY_TRACKER_CLIENT_ID=your_api_key
   VITE_DELIVERY_TRACKER_CLIENT_SECRET=your_api_secret
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```
5. 배포 완료 후 Railway URL 복사 (예: `https://your-app.railway.app`)

#### 2. Vercel 프론트엔드 배포

1. Vercel 계정 생성 및 프로젝트 생성
2. GitHub 저장소 연결
3. 루트 디렉터리 설정 (프로젝트 루트)
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
   ```
5. 배포 설정은 `vercel.json`에 자동 구성됨

#### 3. CORS 설정 업데이트

Railway 배포 완료 후 `backend/server.js`에서 Vercel 도메인 업데이트:
```javascript
const allowedOrigins = [
  'http://localhost:2000',
  'https://your-actual-vercel-domain.vercel.app', // 실제 도메인으로 변경
  process.env.FRONTEND_URL
];
```

## 🔑 API 설정 (선택사항)

실제 Delivery Tracker API를 사용하려면:

1. [Delivery Tracker](https://tracker.delivery/) 에서 API 키 발급
2. `.env` 파일 생성:

```env
VITE_DELIVERY_TRACKER_CLIENT_ID=your_client_id
VITE_DELIVERY_TRACKER_CLIENT_SECRET=your_client_secret
```

> **참고**: API 키 없이도 테스트용 더미 데이터로 기능 체험이 가능합니다.

## 🧪 테스트 사용법

1. **택배사 선택**: "테스트 택배사 (dev.track.dummy)" 선택
2. **운송장 번호**: 자동 생성된 테스트 번호 사용 또는 직접 입력
3. **조회**: "배송 조회" 버튼 클릭

### 테스트 운송장 번호 형식
- 형식: `yyyy-mm-ddthh:00:00z` (예: 2024-01-15t12:00:00z)
- 3시간 간격으로 생성: 00, 03, 06, 09, 12, 15, 18, 21시

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express
- **Build**: Vite
- **API**: Apollo Client (GraphQL)
- **Styling**: CSS-in-JS (인라인 스타일)
- **배포**: Vercel (Frontend) + Railway (Backend)
- **포트**: 
  - Frontend: 2000 (개발)
  - Backend: 3001 (개발)

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── CarrierSelect.tsx    # 택배사 선택
│   ├── TrackingForm.tsx     # 조회 폼
│   ├── TrackingResult.tsx   # 결과 표시
│   └── LoadingSpinner.tsx   # 로딩 상태
├── types/              # TypeScript 타입 정의
│   └── api.ts
├── utils/              # 유틸리티
│   └── apolloClient.ts     # GraphQL 클라이언트
└── App.tsx             # 메인 앱

backend/
├── server.js           # Express 서버
├── package.json        # 백엔드 의존성
└── railway.toml        # Railway 배포 설정
```

## 🌐 API 문서

- [Delivery Tracker API 문서](https://tracker.delivery/docs)
- [테스트 페이지](https://tracker.delivery/docs/try)

## 📱 화면 구성

1. **메인 화면**: 택배사 선택 + 운송장 입력
2. **로딩 화면**: 조회 중 스피너 표시  
3. **결과 화면**: 배송 상태 + 상세 이력 + 타임라인

## 🔧 개발 참고사항

- GraphQL 쿼리는 `src/utils/apolloClient.ts`에 정의
- 타입 정의는 `src/types/api.ts`에 모음
- 모든 스타일은 인라인으로 적용 (CSS-in-JS)
- 접근성 고려 (키보드 네비게이션, 포커스 관리)

## 🆘 문제해결

### API 연결 오류
- 인터넷 연결 확인
- API 키 설정 확인 (있는 경우)
- 테스트 모드로 전환하여 기능 확인

### 포트 충돌
- `vite.config.ts`에서 포트 변경 가능
- 기본값: 2000번 포트

### 배포 문제
- CORS 오류: 백엔드의 allowedOrigins에 프론트엔드 도메인 추가
- 환경 변수 누락: Vercel/Railway 대시보드에서 환경 변수 확인
- 빌드 실패: `npm run build` 로컬 테스트

---

**만든이**: AI Assistant 🤖  
**라이센스**: MIT
