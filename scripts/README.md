# 검정고시 기출문제 자동 수집 스크립트

17개 시도교육청의 검정고시 기출문제를 자동으로 다운로드하고 파싱하여 JSON 형태로 변환하는 도구 모음입니다.

## 📋 목차

- [기능](#기능)
- [의존성](#의존성)
- [설치](#설치)
- [사용법](#사용법)
- [스크립트 상세](#스크립트-상세)
- [데이터 구조](#데이터-구조)
- [트러블슈팅](#트러블슈팅)

## ✨ 기능

- **자동 PDF 다운로드**: 17개 시도교육청 웹사이트 크롤링 및 PDF 다운로드
- **PDF 파싱**: PDF를 읽어 문제, 선택지, 정답을 추출하여 JSON으로 변환
- **데이터 검증**: 중복 문제 체크, 누락 데이터 감지, 통계 리포트 생성
- **진행상황 표시**: CLI 프로그레스 바로 실시간 진행상황 확인
- **에러 핸들링**: 상세한 에러 로그 및 복구 가능한 처리

## 📦 의존성

### 필수 패키지

```json
{
  "cli-progress": "^3.12.0",
  "pdf-parse": "^1.1.1"
}
```

### 선택 패키지 (고급 기능)

```json
{
  "puppeteer": "^21.0.0",  // 웹 크롤링 (현재 샘플 URL 사용)
  "tesseract.js": "^5.0.0"  // OCR (이미지 기반 PDF용)
}
```

## 🚀 설치

### 1. 의존성 설치

```bash
cd ~/muin/gumsi-ai
npm install cli-progress pdf-parse
```

### 2. 선택 패키지 설치 (필요시)

```bash
npm install puppeteer tesseract.js
```

### 3. 실행 권한 부여

```bash
chmod +x scripts/*.sh scripts/*.js
```

## 📖 사용법

### 빠른 시작 (전체 실행)

```bash
cd ~/muin/gumsi-ai/scripts
./collect-questions.sh
```

이 명령어는 다음을 순서대로 실행합니다:
1. PDF 다운로드
2. PDF 파싱
3. 데이터 검증

### 단계별 실행

#### 1. PDF 다운로드만

```bash
node download-pdfs.js
```

#### 2. PDF 파싱만

```bash
node parse-pdfs.js
```

#### 3. 데이터 검증만

```bash
node validate-data.js
```

### 옵션

전체 실행 스크립트는 다음 옵션을 지원합니다:

```bash
./collect-questions.sh --skip-download  # 다운로드 스킵
./collect-questions.sh --skip-parse     # 파싱 스킵
./collect-questions.sh --skip-validate  # 검증 스킵
./collect-questions.sh --help           # 도움말
```

## 📄 스크립트 상세

### 1. `download-pdfs.js`

**기능**: 17개 시도교육청 검정고시 기출문제 다운로드

**주요 동작**:
- 17개 시도교육청 웹사이트 크롤링
- 2020-2025년 기출문제 PDF 자동 다운로드
- 과목별 정리 (`YYYY-N-subject.pdf` 형식)
- 프로그레스 바로 진행상황 표시

**출력**:
- `../data/pdfs/*.pdf` - 다운로드된 PDF 파일
- `../data/download-results.json` - 다운로드 결과 로그

**샘플 구조**:
```
data/pdfs/
  ├── 2024-1-korean.pdf
  ├── 2024-1-math.pdf
  ├── 2024-1-english.pdf
  └── ...
```

### 2. `parse-pdfs.js`

**기능**: PDF를 JSON으로 변환

**주요 동작**:
- `pdf-parse` 라이브러리로 PDF 텍스트 추출
- 정규식 패턴 매칭으로 문제, 선택지, 정답 파싱
- JSON 스키마 검증
- 파싱 에러 로깅

**출력**:
- `../data/questions/*.json` - 파싱된 문제 JSON
- `../data/parse-errors.json` - 파싱 에러 로그

**JSON 구조**:
```json
{
  "metadata": {
    "year": 2024,
    "exam": 1,
    "subject": "math",
    "filename": "2024-1-math.pdf"
  },
  "questions": [
    {
      "number": 1,
      "question": "다음 중 옳은 것은?",
      "choices": [
        "① 선택지 1",
        "② 선택지 2",
        "③ 선택지 3",
        "④ 선택지 4"
      ],
      "answer": "②"
    }
  ]
}
```

### 3. `validate-data.js`

**기능**: 데이터 검증 및 통계 생성

**주요 동작**:
- JSON 스키마 검증 (메타데이터, 문제 구조)
- MD5 해시 기반 중복 문제 체크
- 누락 데이터 감지 (본문, 선택지, 정답)
- 통계 리포트 생성 (연도별, 과목별 분포)

**출력**:
- `../data/validation-report.txt` - 사람이 읽기 쉬운 리포트
- `../data/validation-report.json` - 기계가 읽기 쉬운 JSON 리포트

**리포트 예시**:
```
=============================================================
📊 검정고시 문제 데이터 검증 리포트
=============================================================

## 📈 기본 통계
총 파일 수: 216개
총 문제 수: 5400개
파일당 평균 문제 수: 25개

### 연도별 분포
  2024년: 36개 파일, 900개 문제
  2023년: 36개 파일, 900개 문제
  ...

### 과목별 분포
  국어: 36개 파일, 900개 문제
  수학: 36개 파일, 900개 문제
  ...
```

### 4. `collect-questions.sh`

**기능**: 전체 파이프라인 실행

**주요 동작**:
- 단계별 실행 (다운로드 → 파싱 → 검증)
- 에러 핸들링 및 중단
- 결과 요약 출력
- 실행 시간 측정

## 📊 데이터 구조

### 디렉토리 구조

```
gumsi-ai/
├── scripts/
│   ├── download-pdfs.js      # PDF 다운로드
│   ├── parse-pdfs.js          # PDF 파싱
│   ├── validate-data.js       # 데이터 검증
│   ├── collect-questions.sh   # 전체 실행
│   └── README.md              # 이 파일
├── data/
│   ├── pdfs/                  # 다운로드된 PDF
│   ├── questions/             # 파싱된 JSON
│   ├── download-results.json  # 다운로드 결과
│   ├── parse-errors.json      # 파싱 에러
│   ├── validation-report.txt  # 검증 리포트
│   └── validation-report.json # 검증 리포트 (JSON)
└── package.json
```

### 파일명 규칙

- PDF: `YYYY-N-subject.pdf` (예: `2024-1-math.pdf`)
  - `YYYY`: 연도 (2020-2025)
  - `N`: 회차 (1, 2)
  - `subject`: 과목 (korean, math, english, social, science, history)

- JSON: PDF 파일명과 동일하되 확장자만 `.json`

## 🔧 트러블슈팅

### 문제: `pdf-parse` 설치 실패

**증상**:
```
npm ERR! canvas@2.x.x build failed
```

**해결**:
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg

# Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### 문제: PDF 파싱 실패 (이미지 기반 PDF)

**증상**:
```
PDF 읽기 실패: No text content found
```

**해결**:
1. OCR 라이브러리 설치:
```bash
npm install tesseract.js
```

2. `parse-pdfs.js` 수정하여 OCR 로직 추가

### 문제: 메모리 부족

**증상**:
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**해결**:
```bash
# Node.js 힙 메모리 증가
NODE_OPTIONS="--max-old-space-size=4096" node parse-pdfs.js
```

### 문제: 권한 오류

**증상**:
```
Permission denied
```

**해결**:
```bash
chmod +x scripts/*.sh scripts/*.js
```

### 문제: 크롤링 차단

**증상**:
```
403 Forbidden or timeout
```

**해결**:
1. User-Agent 헤더 추가
2. 요청 간 딜레이 추가 (예: 1초)
3. VPN 또는 프록시 사용

## 📝 추가 개선 사항

### TODO

- [ ] Puppeteer 연동하여 실제 크롤링 구현
- [ ] 이미지 기반 PDF를 위한 OCR 연동
- [ ] 병렬 처리로 성능 향상
- [ ] 재시도 로직 추가 (네트워크 실패 시)
- [ ] 증분 업데이트 (변경된 파일만 처리)
- [ ] 웹 대시보드 (실시간 진행상황)

## 🙋 도움말

### 로그 확인

```bash
# 다운로드 결과
cat ../data/download-results.json | jq .

# 파싱 에러
cat ../data/parse-errors.json | jq .

# 검증 리포트
cat ../data/validation-report.txt
```

### 특정 연도만 처리

현재는 전체 연도를 처리하지만, 스크립트를 수정하여 특정 연도만 필터링할 수 있습니다:

```javascript
// download-pdfs.js 또는 parse-pdfs.js에서
const YEARS = [2024, 2025];  // 원하는 연도만
```

### 특정 과목만 처리

```javascript
// download-pdfs.js 또는 parse-pdfs.js에서
const SUBJECTS = [
  { id: 'math', name: '수학' },
  { id: 'english', name: '영어' }
];
```

## 📞 문의

문제가 지속되거나 추가 기능이 필요한 경우:
- GitHub Issues: (저장소 URL)
- 이메일: (담당자 이메일)

---

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0
