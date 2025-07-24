import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// 더미 데이터 전용 Apollo Client (API 호출 없음)
export const apolloClient = new ApolloClient({
  uri: 'http://localhost:9999/dummy', // 사용하지 않는 더미 엔드포인트
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// GraphQL 쿼리들 (더미용)
export const GET_CARRIERS = gql`
  query GetCarriers {
    carriers {
      id
      name
      displayName
      isEnabled
    }
  }
`;

export const TRACK_PACKAGE = gql`
  query TrackPackage($carrierId: ID!, $trackingNumber: String!) {
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
      events {
        time
        description
        location {
          name
        }
      }
      carrier {
        id
        name
      }
      trackingNumber
    }
  }
`; 