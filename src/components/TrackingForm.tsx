import React, { useState, useEffect } from 'react';
import type { TrackingFormData } from '../types/api';
import CarrierSelect from './CarrierSelect';
import type { Carrier } from '../types/api';

interface TrackingFormProps {
  carriers: Carrier[];
  onSubmit: (data: TrackingFormData) => void;
  loading?: boolean;
  carriersLoading?: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  carriers,
  onSubmit,
  loading = false,
  carriersLoading = false
}) => {
  const [formData, setFormData] = useState<TrackingFormData>({
    carrierId: '',
    trackingNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.carrierId && formData.trackingNumber.trim()) {
      onSubmit(formData);
    }
  };

  const handleCarrierChange = (carrierId: string) => {
    setFormData(prev => ({ ...prev, carrierId }));
  };

  const handleTrackingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, trackingNumber: e.target.value }));
  };

  const formStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '0 auto'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    marginBottom: '1rem'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease',
    opacity: loading ? 0.7 : 1
  };

  const isFormValid = formData.carrierId && formData.trackingNumber.trim();

  // 자동으로 테스트 운송장 번호 생성 (테스트 택배사 선택시)
  useEffect(() => {
    if (formData.carrierId === 'dev.track.dummy') {
      const getTestTrackingNumbers = () => {
        const now = new Date();
        const numbers = [];
        
        // 현재 시간 기준으로 여러 테스트 번호 생성
        for (let i = 0; i < 3; i++) {
          const testDate = new Date(now.getTime() - (i * 3 * 60 * 60 * 1000)); // 3시간씩 뒤로
          const utc = new Date(testDate.getTime() + (testDate.getTimezoneOffset() * 60000));
          const hour = Math.floor(utc.getHours() / 3) * 3;
          const dummyDate = new Date(utc.getFullYear(), utc.getMonth(), utc.getDate(), hour);
          numbers.push(dummyDate.toISOString().slice(0, 19).toLowerCase() + 'z');
        }
        
        return numbers;
      };

      const testNumbers = getTestTrackingNumbers();
      setFormData(prev => ({ ...prev, trackingNumber: testNumbers[0] }));
    }
  }, [formData.carrierId]);

  // 여러 테스트 운송장 번호 생성
  const getTestTrackingNumbers = () => {
    const now = new Date();
    const numbers = [];
    
    // 현재 시간 기준으로 여러 테스트 번호 생성
    for (let i = 0; i < 3; i++) {
      const testDate = new Date(now.getTime() - (i * 3 * 60 * 60 * 1000)); // 3시간씩 뒤로
      const utc = new Date(testDate.getTime() + (testDate.getTimezoneOffset() * 60000));
      const hour = Math.floor(utc.getHours() / 3) * 3;
      const dummyDate = new Date(utc.getFullYear(), utc.getMonth(), utc.getDate(), hour);
      numbers.push(dummyDate.toISOString().slice(0, 19).toLowerCase() + 'z');
    }
    
    return numbers;
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
        📦 택배 조회
      </h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <CarrierSelect
          carriers={carriers}
          selectedCarrierId={formData.carrierId}
          onCarrierChange={handleCarrierChange}
          loading={carriersLoading}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle} htmlFor="tracking-number">
          운송장 번호
        </label>
        <input
          id="tracking-number"
          type="text"
          style={inputStyle}
          value={formData.trackingNumber}
          onChange={handleTrackingNumberChange}
          placeholder="운송장 번호를 입력해주세요"
          disabled={loading}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
        
        {formData.carrierId === 'kr.kdexp' && formData.trackingNumber === '8025071291419' && (
          <div style={{ 
            fontSize: '12px', 
            color: '#1e40af', 
            marginTop: '4px',
            padding: '12px',
            backgroundColor: '#dbeafe',
            borderRadius: '6px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '600', color: '#1e40af' }}>
              🚀 실제 API 연동 테스트 모드
            </div>
            
            <div style={{ 
              fontSize: '11px',
              lineHeight: '1.4'
            }}>
              이 운송장 번호는 실제 Delivery Tracker API 호출을 먼저 시도합니다.<br/>
              API 실패시 자동으로 더미 데이터로 전환됩니다.
            </div>
          </div>
        )}
        
        {formData.carrierId === 'dev.track.dummy' && (
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              🧪 테스트 택배사 더미 데이터:
            </div>
            
            {getTestTrackingNumbers().map((number) => (
              <div key={number} style={{ marginBottom: '6px' }}>
                <span style={{ 
                  fontFamily: 'monospace', 
                  backgroundColor: '#fff',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  marginRight: '8px',
                  fontSize: '11px'
                }}>
                  {number}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, trackingNumber: number }))}
                  style={{
                    fontSize: '11px',
                    color: '#3498db',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  사용
                </button>
              </div>
            ))}
            
            <div style={{ 
              marginTop: '8px', 
              padding: '6px', 
              backgroundColor: '#dbeafe',
              borderRadius: '3px',
              fontSize: '10px',
              color: '#1e40af'
            }}>
              💡 랜덤한 배송상태로 시뮬레이션됩니다
            </div>
          </div>
        )}
        
        {formData.carrierId && formData.carrierId !== 'dev.track.dummy' && !(formData.carrierId === 'kr.kdexp' && formData.trackingNumber === '8025071291419') && (
          <div style={{ 
            fontSize: '11px', 
            color: '#6b7280', 
            marginTop: '4px',
            padding: '8px',
            backgroundColor: '#f0f9ff',
            borderRadius: '4px',
            border: '1px solid #0ea5e9'
          }}>
            ℹ️ 실제 택배사 API로 조회됩니다. 운송장 번호가 존재하지 않으면 오류 메시지가 표시됩니다.
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{
          ...buttonStyle,
          backgroundColor: isFormValid ? '#3498db' : '#94a3b8'
        }}
        disabled={!isFormValid || loading}
        onMouseOver={(e) => {
          if (isFormValid && !loading) {
            e.currentTarget.style.backgroundColor = '#2980b9';
          }
        }}
        onMouseOut={(e) => {
          if (isFormValid && !loading) {
            e.currentTarget.style.backgroundColor = '#3498db';
          }
        }}
      >
        {loading ? '조회 중...' : '배송 조회'}
      </button>
    </form>
  );
};

export default TrackingForm; 