// Delivery Tracker API 타입 정의

export interface Carrier {
  id: string;
  name: string;
  displayName: string;
  isEnabled: boolean;
}

export interface CarriersResponse {
  carriers: Carrier[];
}

export interface TrackingEvent {
  time: string;
  description: string;
  location?: {
    name: string;
  };
}

export interface TrackingStatus {
  code: string;
  name: string;
}

export interface LastEvent {
  time: string;
  status: TrackingStatus;
  description: string;
  location?: {
    name: string;
  };
}

export interface TrackingInfo {
  lastEvent: LastEvent;
  events?: TrackingEvent[];
  carrier?: {
    id: string;
    name: string;
  };
  trackingNumber: string;
}

export interface TrackResponse {
  track: TrackingInfo;
}

export interface TrackingFormData {
  carrierId: string;
  trackingNumber: string;
}

// 상태 코드별 한국어 메시지
export const STATUS_MESSAGES: Record<string, string> = {
  'INFORMATION_RECEIVED': '배송 정보 접수',
  'AT_PICKUP': '픽업 대기',
  'IN_TRANSIT': '배송 중',
  'OUT_FOR_DELIVERY': '배송 출발',
  'DELIVERED': '배송 완료',
  'EXCEPTION': '배송 예외',
  'UNKNOWN': '알 수 없음'
}; 