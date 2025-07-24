import React from 'react';
import type { TrackingInfo } from '../types/api';
import { STATUS_MESSAGES } from '../types/api';

interface TrackingResultProps {
  trackingInfo: TrackingInfo;
  onNewSearch: () => void;
}

const TrackingResult: React.FC<TrackingResultProps> = ({ trackingInfo, onNewSearch }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    }).format(date);
  };

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case 'INFORMATION_RECEIVED': return '📋';
      case 'AT_PICKUP': return '📦';
      case 'IN_TRANSIT': return '🚚';
      case 'OUT_FOR_DELIVERY': return '🚛';
      case 'DELIVERED': return '✅';
      case 'EXCEPTION': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'INFORMATION_RECEIVED': return '#6b7280';
      case 'AT_PICKUP': return '#f59e0b';
      case 'IN_TRANSIT': return '#3b82f6';
      case 'OUT_FOR_DELIVERY': return '#8b5cf6';
      case 'DELIVERED': return '#10b981';
      case 'EXCEPTION': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const headerStyle: React.CSSProperties = {
    padding: '2rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  };

  const statusStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: getStatusColor(trackingInfo.lastEvent.status.code),
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '1rem'
  };

  const eventStyle: React.CSSProperties = {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    position: 'relative'
  };

  const timelineStyle: React.CSSProperties = {
    position: 'absolute',
    left: '1rem',
    top: '1.5rem',
    bottom: '1.5rem',
    width: '2px',
    backgroundColor: '#e2e8f0'
  };

  const eventContentStyle: React.CSSProperties = {
    marginLeft: '2rem',
    paddingLeft: '1rem'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#3498db',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div style={containerStyle}>
      {/* 헤더 정보 */}
      <div style={headerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
            {trackingInfo.carrier?.name || '택배 조회'}
          </h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            운송장 번호: {trackingInfo.trackingNumber}
          </p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={statusStyle}>
            <span>{getStatusIcon(trackingInfo.lastEvent.status.code)}</span>
            <span>
              {STATUS_MESSAGES[trackingInfo.lastEvent.status.code] || trackingInfo.lastEvent.status.name}
            </span>
          </div>
          
          <div style={{ color: '#374151' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              {trackingInfo.lastEvent.description}
            </p>
            {trackingInfo.lastEvent.location && (
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#6b7280' }}>
                📍 {trackingInfo.lastEvent.location.name}
              </p>
            )}
            {trackingInfo.lastEvent.time && (
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                {formatDate(trackingInfo.lastEvent.time)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 배송 이력 */}
      {trackingInfo.events && trackingInfo.events.length > 0 && (
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '16px' }}>
            📋 배송 이력
          </h4>
          
          <div style={{ position: 'relative' }}>
            {trackingInfo.events.map((event, index) => (
              <div key={index} style={eventStyle}>
                {trackingInfo.events && index < trackingInfo.events.length - 1 && (
                  <div style={timelineStyle}></div>
                )}
                
                <div style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '1.5rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3498db',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 2px #e2e8f0'
                }}></div>
                
                <div style={eventContentStyle}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#374151' }}>
                    {event.description}
                  </p>
                  {event.location && (
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '14px', color: '#6b7280' }}>
                      📍 {event.location.name}
                    </p>
                  )}
                  {event.time && (
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                      {formatDate(event.time)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 새 조회 버튼 */}
      <button
        style={buttonStyle}
        onClick={onNewSearch}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
      >
        🔍 새로운 택배 조회하기
      </button>
    </div>
  );
};

export default TrackingResult; 