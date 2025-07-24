const fs = require('fs');

// 파일 읽기
let content = fs.readFileSync('src/components/BatchTracker.tsx', 'utf8');

// 새로운 parseCSV 함수로 교체
const newParseCSV = `  // 택배사명 매핑 함수
  const findCarrierByName = (carrierInput: string): Carrier | undefined => {
    const input = carrierInput.toLowerCase().trim();
    
    // 먼저 ID로 찾기
    let carrier = allCarriers.find(c => c.id.toLowerCase() === input);
    if (carrier) return carrier;
    
    // 한글명으로 찾기
    carrier = allCarriers.find(c => {
      const displayName = (c.displayName || c.name).toLowerCase();
      return displayName.includes(input) || 
             input.includes(displayName.replace(/택배|대한통운|물류/g, '').trim());
    });
    if (carrier) return carrier;
    
    // 영문명으로 찾기
    const nameMapping: { [key: string]: string } = {
      'cj': 'kr.cjlogistics',
      '씨제이': 'kr.cjlogistics',
      '대한통운': 'kr.cjlogistics',
      '한진': 'kr.hanjin',
      'hanjin': 'kr.hanjin',
      '롯데': 'kr.lotte',
      'lotte': 'kr.lotte',
      '우체국': 'kr.epost',
      'epost': 'kr.epost',
      '로젠': 'kr.logen',
      'logen': 'kr.logen',
      '경동': 'kr.kdexp',
      'kdexp': 'kr.kdexp',
      '테스트': 'dev.track.dummy',
      'test': 'dev.track.dummy'
    };
    
    for (const [key, carrierId] of Object.entries(nameMapping)) {
      if (input.includes(key)) {
        return allCarriers.find(c => c.id === carrierId);
      }
    }
    
    return undefined;
  };

  // CSV 파싱 함수
  const parseCSV = (csvText: string): BatchTrackingItem[] => {
    const lines = csvText.trim().split('\n');
    const items: BatchTrackingItem[] = [];
    
    // 헤더 라인 건너뛰기
    const dataLines = lines.slice(1);
    
    dataLines.forEach((line, index) => {
      const [carrierInput, trackingNumber] = line.split(',').map(item => item.trim());
      
      if (carrierInput && trackingNumber) {
        const carrier = findCarrierByName(carrierInput);
        if (carrier) {
          items.push({
            id: \`item-\${index}\`,
            carrierId: carrier.id,
            carrierName: carrier.displayName || carrier.name,
            trackingNumber,
            status: 'pending'
          });
        } else {
          console.warn(\`알 수 없는 택배사: \${carrierInput}\`);
        }
      }
    });
    
    return items;
  };`;

// 기존 parseCSV 함수 교체
content = content.replace(
  /\/\/ CSV 파싱 함수[\s\S]*?return items;\s*};/,
  newParseCSV
);

// 파일 쓰기
fs.writeFileSync('src/components/BatchTracker.tsx', content);
console.log('✅ BatchTracker.tsx 업데이트 완료');
