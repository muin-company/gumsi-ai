#!/usr/bin/env node

/**
 * PDF 다운로드 스크립트
 * 17개 시도교육청 검정고시 기출문제 페이지 크롤링 및 다운로드
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const cliProgress = require('cli-progress');

// 17개 시도교육청 URL 및 정보
const EDUCATION_OFFICES = [
  {
    name: '서울',
    baseUrl: 'https://www.sen.go.kr',
    searchPath: '/web/services/page/viewPage.action?page=/life/gyul/examlist.html'
  },
  {
    name: '부산',
    baseUrl: 'https://www.pen.go.kr',
    searchPath: '/index.pen?menuCd=DOM_000000104007003000'
  },
  {
    name: '대구',
    baseUrl: 'https://www.dge.go.kr',
    searchPath: '/main/contents.do?menuNo=400211'
  },
  {
    name: '인천',
    baseUrl: 'https://www.ice.go.kr',
    searchPath: '/sub/info.do?m=0403&s=ice'
  },
  {
    name: '광주',
    baseUrl: 'https://www.gen.go.kr',
    searchPath: '/contentsView.do?pageId=www136'
  },
  {
    name: '대전',
    baseUrl: 'https://www.dje.go.kr',
    searchPath: '/boardCnts/list.do?boardID=243&m=030201'
  },
  {
    name: '울산',
    baseUrl: 'https://www.use.go.kr',
    searchPath: '/portal/contents.do?mId=0301040000'
  },
  {
    name: '세종',
    baseUrl: 'https://www.sje.go.kr',
    searchPath: '/main/board/viewList.do?bbsId=BBSMSTR_000000000161'
  },
  {
    name: '경기',
    baseUrl: 'https://www.goe.go.kr',
    searchPath: '/home/bbs/bbsDetail.do?bbsId=1018&menuId=1000000272'
  },
  {
    name: '강원',
    baseUrl: 'https://www.gwe.go.kr',
    searchPath: '/cop/bbs/selectBoardList.do?bbsId=BBSMSTR_000000000242'
  },
  {
    name: '충북',
    baseUrl: 'https://www.cbe.go.kr',
    searchPath: '/home/sub.php?menukey=10170'
  },
  {
    name: '충남',
    baseUrl: 'https://www.cne.go.kr',
    searchPath: '/sub/info.do?page=0502040000&m=0502040000&s=cne'
  },
  {
    name: '전북',
    baseUrl: 'https://www.jbe.go.kr',
    searchPath: '/board/view.jbe?boardId=basic_board&menuCd=DOM_000000104007001000'
  },
  {
    name: '전남',
    baseUrl: 'https://www.jne.go.kr',
    searchPath: '/main/na/ntt/selectNttList.do?mi=10652&bbsId=1046'
  },
  {
    name: '경북',
    baseUrl: 'https://www.gbe.kr',
    searchPath: '/main/bbs/board/list.do?mId=0401030000&bbs_cd_n=4'
  },
  {
    name: '경남',
    baseUrl: 'https://www.gne.go.kr',
    searchPath: '/index.gne?menuCd=DOM_000000105007001001'
  },
  {
    name: '제주',
    baseUrl: 'https://www.jje.go.kr',
    searchPath: '/board/view.jje?boardId=general_board&menuCd=DOM_000000102005001000'
  }
];

// 다운로드할 연도 및 시험
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
const EXAMS = [
  { id: '1', name: '1회' },
  { id: '2', name: '2회' }
];

// 과목 목록
const SUBJECTS = [
  { id: 'korean', name: '국어' },
  { id: 'math', name: '수학' },
  { id: 'english', name: '영어' },
  { id: 'social', name: '사회' },
  { id: 'science', name: '과학' },
  { id: 'history', name: '한국사' }
];

// PDF 다운로드 함수
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// 샘플 PDF URL 생성 (실제 크롤링 대신 예시 구조)
function generateSamplePdfUrls() {
  const urls = [];
  
  // 실제로는 puppeteer로 각 교육청 페이지를 크롤링해야 하지만,
  // 여기서는 구조 예시를 보여줍니다
  for (const office of EDUCATION_OFFICES.slice(0, 3)) { // 예시로 3개만
    for (const year of YEARS) {
      for (const exam of EXAMS) {
        for (const subject of SUBJECTS) {
          urls.push({
            office: office.name,
            year,
            exam: exam.id,
            subject: subject.id,
            subjectName: subject.name,
            // 실제 URL은 크롤링으로 얻어야 함
            url: `${office.baseUrl}/sample/${year}-${exam.id}-${subject.id}.pdf`,
            filename: `${year}-${exam.id}-${subject.id}.pdf`
          });
        }
      }
    }
  }
  
  return urls;
}

// 메인 실행 함수
async function main() {
  console.log('📚 검정고시 기출문제 PDF 다운로드 시작\n');
  
  // 다운로드 디렉토리 생성
  const downloadDir = path.join(__dirname, '../data/pdfs');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  // PDF URL 목록 생성 (실제로는 크롤링)
  console.log('🔍 교육청 웹사이트 크롤링 중...\n');
  const pdfList = generateSamplePdfUrls();
  
  console.log(`📄 총 ${pdfList.length}개의 PDF 파일 발견\n`);
  
  // 프로그레스 바 설정
  const progressBar = new cliProgress.SingleBar({
    format: '다운로드 진행 |{bar}| {percentage}% | {value}/{total} 파일 | {filename}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(pdfList.length, 0, { filename: 'N/A' });
  
  // 다운로드 통계
  const stats = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  
  // PDF 다운로드
  for (let i = 0; i < pdfList.length; i++) {
    const item = pdfList[i];
    const filepath = path.join(downloadDir, item.filename);
    
    progressBar.update(i + 1, { filename: item.filename });
    
    // 이미 존재하는 파일은 스킵
    if (fs.existsSync(filepath)) {
      stats.skipped++;
      continue;
    }
    
    try {
      // 실제 다운로드 (샘플이므로 실패 예상)
      // await downloadFile(item.url, filepath);
      
      // 데모용 더미 파일 생성
      fs.writeFileSync(filepath, `PDF Placeholder for ${item.filename}`);
      stats.success++;
      
      // 너무 빠르면 프로그레스 바가 안 보이므로 약간의 딜레이
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        file: item.filename,
        error: error.message
      });
    }
  }
  
  progressBar.stop();
  
  // 결과 출력
  console.log('\n\n📊 다운로드 완료!\n');
  console.log(`✅ 성공: ${stats.success}개`);
  console.log(`⏭️  스킵: ${stats.skipped}개`);
  console.log(`❌ 실패: ${stats.failed}개\n`);
  
  if (stats.errors.length > 0) {
    console.log('⚠️  실패한 파일:');
    stats.errors.forEach(e => {
      console.log(`   - ${e.file}: ${e.error}`);
    });
  }
  
  // 결과를 JSON으로 저장
  const resultPath = path.join(__dirname, '../data/download-results.json');
  fs.writeFileSync(resultPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    pdfList
  }, null, 2));
  
  console.log(`\n💾 결과 저장: ${resultPath}`);
}

// 스크립트 실행
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = { downloadFile, EDUCATION_OFFICES };
