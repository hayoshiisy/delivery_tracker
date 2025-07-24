import React, { useState, useRef, useEffect } from 'react';
import type { Carrier } from '../types/api';

interface CarrierSelectProps {
  carriers: Carrier[];
  selectedCarrierId: string;
  onCarrierChange: (carrierId: string) => void;
  loading?: boolean;
}

const CarrierSelect: React.FC<CarrierSelectProps> = ({
  carriers,
  selectedCarrierId,
  onCarrierChange,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 테스트용 더미 택배사도 포함
  const testCarriers: Carrier[] = [
    {
      id: 'dev.track.dummy',
      name: 'Test Carrier',
      displayName: '🧪 테스트 택배사 (랜덤 더미 데이터)',
      isEnabled: true
    },
    ...carriers.filter(carrier => carrier.isEnabled)
  ];

  // 검색어로 필터링된 택배사 목록
  const filteredCarriers = testCarriers.filter(carrier => {
    const displayName = carrier.displayName || carrier.name;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 선택된 택배사 찾기
  const selectedCarrier = testCarriers.find(c => c.id === selectedCarrierId);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 택배사 선택 처리
  const handleCarrierSelect = (carrierId: string) => {
    onCarrierChange(carrierId);
    setIsOpen(false);
    setSearchTerm('');
  };

  // 드롭다운 열기/닫기
  const toggleDropdown = () => {
    if (loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%'
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
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: loading ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    opacity: loading ? 0.6 : 1,
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: isOpen ? '#3498db' : '#e1e5e9'
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '2px solid #3498db',
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    borderBottom: '1px solid #e1e5e9',
    outline: 'none',
    fontSize: '14px'
  };

  const optionStyle: React.CSSProperties = {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    borderBottom: '1px solid #f1f5f9'
  };

  const optionHoverStyle: React.CSSProperties = {
    ...optionStyle,
    backgroundColor: '#f8fafc'
  };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      <label style={labelStyle}>
        택배사 선택
      </label>
      
      <button
        type="button"
        style={buttonStyle}
        onClick={toggleDropdown}
        disabled={loading}
      >
        <span>
          {selectedCarrier 
            ? (selectedCarrier.displayName || selectedCarrier.name)
            : '택배사를 선택하거나 검색해주세요'
          }
        </span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <input
            ref={inputRef}
            type="text"
            placeholder="택배사명을 입력하세요 (예: CJ, 한진, 롯데)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredCarriers.length > 0 ? (
              filteredCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  style={optionStyle}
                  onClick={() => handleCarrierSelect(carrier.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {carrier.displayName || carrier.name}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrierSelect; 