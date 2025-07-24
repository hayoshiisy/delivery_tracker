import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './utils/apolloClient';
import TrackingForm from './components/TrackingForm';
import TrackingResult from './components/TrackingResult';
import LoadingSpinner from './components/LoadingSpinner';
import BatchTracker from './components/BatchTracker';
import type { TrackingFormData, TrackingInfo, Carrier } from './types/api';
import './App.css';

const DeliveryTrackerApp: React.FC = () => {
  const [trackingResult, setTrackingResult] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBatchTracker, setShowBatchTracker] = useState(false);

  // 더미 택배사 목록
  const dummyCarriers: Carrier[] = [
    { id: 'kr.cjlogistics', name: 'CJ대한통운', displayName: 'CJ대한통운', isEnabled: true },
    { id: 'kr.hanjin', name: '한진택배', displayName: '한진택배', isEnabled: true },
    { id: 'kr.lotte', name: '롯데택배', displayName: '롯데택배', isEnabled: true },
    { id: 'kr.epost', name: '우체국택배', displayName: '우체국택배', isEnabled: true },
    { id: 'kr.logen', name: '로젠택배', displayName: '로젠택배', isEnabled: true },
    { id: 'kr.kdexp', name: '경동택배', displayName: '경동택배', isEnabled: true }
  ];

  const handleSubmit = async (formData: TrackingFormData) => {
    setError(null);
    setTrackingResult(null);
    setLoading(true);
    
    // 테스트 택배사인 경우 바로 더미 데이터 생성
    if (formData.carrierId === 'dev.track.dummy') {
      console.log('🧪 테스트 택배사 더미 데이터 모드 실행');
      generateDummyData(formData);
      return;
    }
    
    console.log('🌐 백엔드 서버를 통한 실제 API 호출 시도 중...');
    
    try {
      // 환경에 따른 API URL 설정
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      
      // 백엔드 서버를 통한 API 호출
      const response = await fetch(`${API_BASE_URL}/api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carrierId: formData.carrierId,
          trackingNumber: formData.trackingNumber
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.track) {
          // 실제 API 응답에 carrier 정보 추가
          const selectedCarrier = dummyCarriers.find(c => c.id === formData.carrierId);
          const trackingData = {
            ...data.track,
            carrier: {
              id: formData.carrierId,
              name: selectedCarrier?.name || '택배사'
            }
          };
          setTrackingResult(trackingData);
          setLoading(false);
          console.log('✅ 백엔드를 통한 실제 API 호출 성공!');
          return;
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API 호출 실패');
      }
      
    } catch (error) {
      console.log('❌ 백엔드 API 호출 실패:', error);
      
      // 실제 택배사인 경우 적절한 오류 메시지 표시
      setLoading(false);
      
      // 에러 메시지 분류
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('운송장 번호') || errorMessage.includes('10자리') || errorMessage.includes('12자리')) {
        setError('❌ 운송장 번호 형식이 올바르지 않습니다. (10자리 또는 12자리 숫자를 입력해주세요)');
      } else if (errorMessage.includes('찾을 수 없습니다') || errorMessage.includes('404')) {
        setError('📦 해당 운송장 번호로 조회된 배송 정보가 없습니다. 운송장 번호와 택배사를 다시 확인해주세요.');
      } else if (errorMessage.includes('연결') || errorMessage.includes('네트워크')) {
        setError('🌐 네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('⚠️ 택배 조회 중 오류가 발생했습니다. 운송장 번호와 택배사를 확인하고 다시 시도해주세요.');
      }
      return;
    }
  };

  // 더미 데이터 생성 함수 (테스트 택배사 전용)
  const generateDummyData = (formData: TrackingFormData) => {
    const now = new Date();
    const isDelivered = Math.random() > 0.5;
    const selectedCarrier = dummyCarriers.find(c => c.id === formData.carrierId);
    
    const dummyResult: TrackingInfo = {
      trackingNumber: formData.trackingNumber,
      carrier: {
        id: formData.carrierId,
        name: formData.carrierId === 'dev.track.dummy' 
          ? '테스트 택배사' 
          : selectedCarrier?.name || '알 수 없는 택배사'
      },
      lastEvent: {
        time: now.toISOString(),
        status: {
          code: isDelivered ? 'DELIVERED' : 'IN_TRANSIT',
          name: isDelivered ? '배송완료' : '배송중'
        },
        description: isDelivered ? '배송이 완료되었습니다' : '고객님의 상품이 배송 중입니다',
        location: {
          name: isDelivered ? '고객님 댁' : '서울특별시 강남구'
        }
      },
      events: [
        {
          time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: '배송 정보가 접수되었습니다',
          location: { name: '발송지 창고' }
        },
        {
          time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: '상품이 택배사에 인수되었습니다',
          location: { name: '발송 터미널' }
        },
        {
          time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: '상품이 배송 터미널에 도착했습니다',
          location: { name: '목적지 터미널' }
        },
        {
          time: now.toISOString(),
          description: isDelivered ? '배송이 완료되었습니다' : '배송기사님이 배송 중입니다',
          location: { name: isDelivered ? '고객님 댁' : '서울특별시 강남구' }
        }
      ]
    };
    
    // 로딩 효과
    setTimeout(() => {
      setTrackingResult(dummyResult);
      setError(null);
      setLoading(false);
      console.log('✅ 테스트 택배사 더미 시뮬레이션 완료!');
    }, 1500);
  };

  const handleNewSearch = () => {
    setTrackingResult(null);
    setError(null);
  };

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 0.5rem 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#e2e8f0',
    margin: 0
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    border: '2px solid #fca5a5',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    color: '#dc2626',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
    fontSize: '14px',
    lineHeight: '1.5'
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📦 버핏체험단 택배 조회 시스템</h1>
          <p style={subtitleStyle}>운송장 번호로 실시간 배송 상황을 확인하세요</p>
          
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => setShowBatchTracker(true)}
              style={{
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📊 일괄 조회 (CSV 업로드)
            </button>
          </div>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {!trackingResult && (
          <TrackingForm
            carriers={dummyCarriers}
            onSubmit={handleSubmit}
            loading={loading}
            carriersLoading={false}
          />
        )}

        {loading && <LoadingSpinner message="택배 정보를 조회하고 있습니다..." />}

        {trackingResult && !loading && (
          <TrackingResult
            trackingInfo={trackingResult}
            onNewSearch={handleNewSearch}
          />
        )}

        {/* 일괄 조회 모달 */}
        {showBatchTracker && (
          <BatchTracker
            carriers={dummyCarriers}
            onClose={() => setShowBatchTracker(false)}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <DeliveryTrackerApp />
    </ApolloProvider>
  );
};

export default App;
