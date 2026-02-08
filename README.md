# 검시 AI (GumsiAI)

> AI 검정고시 튜터 - 24시간 실시간 학습 도우미

[![무인기업](https://img.shields.io/badge/by-MUIN-black)](https://muin.company)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

**Live Demo:** [https://gumsi-ai.vercel.app](https://gumsi-ai.vercel.app)  
**Contact:** mj@muin.company

---

## 📋 목차

- [소개](#-소개)
- [핵심 가치](#-핵심-가치)
- [기능](#-주요-기능)
- [시작하기](#-시작하기)
  - [사전 요구사항](#사전-요구사항)
  - [설치](#설치)
  - [환경 변수 설정](#환경-변수-설정)
  - [개발 서버 실행](#개발-서버-실행)
- [사용법](#-사용법)
  - [학생 관점](#학생-관점)
  - [관리자 관점](#관리자-관점)
- [아키텍처](#-아키텍처)
  - [기술 스택](#기술-스택)
  - [프로젝트 구조](#프로젝트-구조)
  - [데이터 흐름](#데이터-흐름)
- [배포](#-배포)
- [문제 해결](#-문제-해결)
- [FAQ](#-자주-묻는-질문)
- [기여하기](#-기여하기)
- [로드맵](#-로드맵)
- [라이선스](#-라이선스)

---

## 🎯 소개

**검시 AI**는 검정고시 준비생을 위한 AI 기반 학습 플랫폼입니다. 경제적 어려움이나 시간 제약으로 학원을 다니기 어려운 학생들에게 24시간 언제든지 질문하고 답변받을 수 있는 AI 튜터를 제공합니다.

### 왜 검시 AI인가?

대한민국의 검정고시 준비생은 연간 약 6만 명. 이들 중 대다수는:
- 💰 **경제적 어려움**: 월 30-80만원의 학원비 부담
- ⏰ **시간 제약**: 일과 학업 병행으로 학원 시간 맞추기 어려움
- 🔇 **질문 장벽**: 녹화 강의는 일방향이라 궁금한 점을 즉시 해결 불가
- 😔 **낮은 완주율**: 동기 부여 부족으로 중도 포기율 높음

**검시 AI는 이러한 문제를 해결합니다.**

---

## 💎 핵심 가치

### 1️⃣ 접근성 (Accessibility)
- 💰 **파격적 가격**: 기존 인강 대비 1/4 ~ 1/15 수준 (무료 ~ ₩19,900/월)
- 📱 **멀티 플랫폼**: PC, 스마트폰, 태블릿 모두 지원
- ⏰ **24/7 가용성**: 새벽이든 주말이든 언제나 질문 가능

### 2️⃣ 개인화 (Personalization)
- 🎯 **맞춤형 설명**: 학생의 이해 수준에 맞춰 설명 난이도 조절
- 📊 **학습 분석**: 취약 단원 자동 진단 (프리미엄)
- 🔄 **반복 학습**: 이해할 때까지 무제한 질문 가능

### 3️⃣ 효율성 (Efficiency)
- ⚡ **즉시 응답**: 5초 이내 답변 시작
- 🎓 **단계별 설명**: 답만 주는 게 아니라 풀이 과정 상세 설명
- 📚 **종합 학습**: 국어, 영어, 수학, 사회, 과학, 한국사 전 과목 지원

---

## 🚀 주요 기능

### 🤖 AI 튜터
- **실시간 대화형 학습**: 채팅으로 질문하고 즉시 답변 받기
- **전 과목 지원**: 국어, 영어, 수학, 사회, 과학, 한국사
- **무제한 질문**: 이해할 때까지 반복 질문 가능 (프리미엄)
- **맥락 이해**: 이전 대화 기억으로 연속적인 학습 가능

### 📚 문제 풀이
- **5년치 기출문제**: 2020-2024 검정고시 전 과목 수록
- **단계별 풀이**: 답만이 아닌 상세한 풀이 과정 제공
- **오답 분석**: 왜 틀렸는지 분석하고 보완점 제시

### 📊 학습 분석 (프리미엄)
- **취약점 진단**: 어떤 단원이 약한지 자동 분석
- **진도 추적**: 학습 현황 시각화
- **맞춤 커리큘럼**: 개인별 학습 계획 제안

### vs 기존 인강

| 구분 | 기존 인강 | 검시 AI |
|------|----------|---------|
| **학습 방식** | 녹화 강의 시청 | 실시간 대화형 학습 |
| **질문 응답** | 불가능 (일방향) | 무제한 질문/답변 |
| **커리큘럼** | 고정 커리큘럼 | 개인 맞춤 학습 |
| **가용 시간** | 강의 스케줄 고정 | 24시간 언제든지 |
| **가격** | 월 30-80만원 | 무료 ~ ₩19,900 |
| **진도 관리** | 수동 체크 | 자동 추적 (프리미엄) |

---

## 🏁 시작하기

### 사전 요구사항

개발 환경 구축을 위해 다음이 필요합니다:

- **Node.js** 18.0 이상 ([다운로드](https://nodejs.org/))
- **npm** 또는 **yarn**
- **Git** ([다운로드](https://git-scm.com/))
- **(선택) Supabase 계정** - 인증 및 DB ([가입](https://supabase.com/))
- **(선택) Anthropic API 키** - AI 튜터 기능 ([가입](https://www.anthropic.com/))

### 설치

#### 1. 저장소 클론

```bash
git clone https://github.com/muin-company/gumsi-ai.git
cd gumsi-ai
```

#### 2. 의존성 설치

```bash
npm install
```

또는 yarn 사용 시:

```bash
yarn install
```

#### 3. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 실제 값 입력:

```bash
# 텍스트 에디터로 .env.local 열기
nano .env.local  # 또는 vim, code 등
```

### 환경 변수 설정

검시 AI는 다음 환경 변수를 사용합니다:

#### 필수 환경 변수 (프로덕션)

```bash
# Supabase (인증 및 데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic (AI 튜터)
ANTHROPIC_API_KEY=sk-ant-api...

# 앱 URL
NEXT_PUBLIC_APP_URL=https://gumsi-ai.vercel.app
```

#### 선택 환경 변수

```bash
# 개발 환경 설정
NODE_ENV=development  # development | production | test

# AI 모델 설정
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022  # 기본값

# 관리자 이메일 (알림용)
ADMIN_EMAIL=admin@muin.company

# 로깅 레벨
LOG_LEVEL=info  # error | warn | info | debug
```

#### 환경 변수 획득 방법

**1. Supabase 키 획득:**
1. [Supabase](https://supabase.com/) 접속 및 로그인
2. 새 프로젝트 생성
3. Settings → API에서 키 복사
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 비공개)

**2. Anthropic API 키 획득:**
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. API Keys → Create Key
3. 생성된 키를 `ANTHROPIC_API_KEY`에 입력

#### 보안 주의사항

⚠️ **절대 Git에 업로드하지 마세요:**
- `.env.local`은 `.gitignore`에 포함되어 있음
- `SUPABASE_SERVICE_ROLE_KEY`와 `ANTHROPIC_API_KEY`는 서버 전용
- GitHub, Discord 등에 실수로 공유하지 않도록 주의

✅ **안전한 관리:**
- `.env.example`에는 샘플 값만 포함
- 프로덕션 키는 Vercel 환경 변수로 관리
- 팀원과 공유 시 1Password, LastPass 등 사용

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

개발 서버가 정상적으로 실행되면:
- ✅ 랜딩 페이지 확인
- ✅ 회원가입/로그인 페이지 접근
- ✅ (Supabase 연동 시) 실제 회원가입 가능
- ✅ (Anthropic API 연동 시) AI 튜터 사용 가능

---

## 📖 사용법

### 학생 관점

#### 1. 회원가입 및 로그인

**회원가입:**
1. [https://gumsi-ai.vercel.app](https://gumsi-ai.vercel.app) 접속
2. "시작하기" 버튼 클릭
3. 이메일과 비밀번호 입력
4. 이메일 인증 (Supabase 설정에 따라)

**로그인:**
1. 우측 상단 "로그인" 클릭
2. 이메일/비밀번호 입력
3. (선택) "로그인 유지" 체크

#### 2. AI 튜터 사용하기

**기본 사용법:**
```
1. 상단 메뉴에서 "AI 튜터" 클릭
2. 과목 선택 (국어, 수학, 영어, 사회, 과학, 한국사)
3. 채팅창에 질문 입력
4. AI의 답변 확인
```

**효과적인 질문 예시:**

✅ **개념 설명 요청:**
```
Q: 피타고라스 정리가 뭐야?
A: 피타고라스 정리는 직각삼각형에서 빗변의 제곱이 
   다른 두 변의 제곱의 합과 같다는 정리입니다...
```

✅ **문제 풀이 도움:**
```
Q: 2x + 3 = 7을 어떻게 풀어?
A: 단계별로 설명드릴게요:
   1. 양변에서 3을 빼면: 2x = 4
   2. 양변을 2로 나누면: x = 2
```

✅ **심화 학습:**
```
Q: 르네상스가 왜 이탈리아에서 시작됐어?
A: 여러 이유가 있습니다:
   1. 경제적 번영 (무역 중심지)
   2. 고대 로마 문화 유산
   3. 메디치 가문의 후원...
```

❌ **피해야 할 질문:**
```
❌ "수학 알려줘" (너무 모호함)
✅ "인수분해 공식 알려줘"

❌ "답만 알려줘" (학습 효과 없음)
✅ "이 문제를 단계별로 설명해줘"
```

#### 3. 문제 풀이 연습

**기출문제 풀기:**
1. "문제 풀이" 메뉴 클릭
2. 과목 및 연도 선택
3. 문제 확인 후 답 입력
4. 틀린 문제는 AI 튜터에게 질문

**오답 분석:**
```
Q: 이 문제를 틀렸는데, 어디서 실수한 거야?
   [문제와 내가 선택한 답 입력]
   
A: 분석해드릴게요:
   - 실수한 부분: ...
   - 올바른 풀이: ...
   - 비슷한 유형 주의사항: ...
```

#### 4. 학습 진도 관리 (프리미엄)

- **대시보드**: 전체 학습 현황 확인
- **취약 단원**: 어떤 부분이 약한지 진단
- **학습 통계**: 일/주/월별 학습 시간 및 문제 풀이 수

### 관리자 관점

#### 관리자 기능 접근

관리자 계정은 Supabase에서 직접 권한 부여:

```sql
-- Supabase SQL 에디터에서 실행
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data, 
  '{role}', 
  '"admin"'
)
WHERE email = 'admin@example.com';
```

#### 사용자 관리

**대시보드에서:**
- 전체 사용자 목록 조회
- 사용자별 학습 통계 확인
- 계정 활성화/비활성화
- 구독 플랜 수동 변경

**Supabase 콘솔에서:**
1. Authentication → Users
2. 사용자 검색 및 필터링
3. 메타데이터 편집

#### 콘텐츠 관리

**문제 추가:**
```bash
# JSON 파일 준비 (data/questions-sample.json 참고)
# Supabase 콘솔 → Table Editor → questions → Insert
```

**기출문제 업데이트:**
```bash
npm run import-questions -- --year 2025 --subject math
```

#### 시스템 모니터링

**Vercel 대시보드:**
- Analytics → 트래픽 및 성능 확인
- Logs → 에러 로그 확인
- Deployments → 배포 이력

**Supabase 대시보드:**
- Database → 테이블 크기 모니터링
- API → 요청 횟수 확인
- Auth → 로그인 활동

---

## 🏗 아키텍처

### 기술 스택

#### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **UI Components**: Custom components (Button, Input, Card)

#### Backend
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **API Routes**: Next.js API Routes
- **File Storage**: Supabase Storage (이미지 업로드용, 추후)

#### AI & ML
- **LLM**: [Anthropic Claude API](https://www.anthropic.com/) (Claude 3.5 Sonnet)
- **Streaming**: Server-Sent Events (SSE)

#### DevOps
- **Hosting**: [Vercel](https://vercel.com/)
- **CI/CD**: Vercel Git Integration (자동 배포)
- **Monitoring**: Vercel Analytics
- **Version Control**: Git / GitHub

### 프로젝트 구조

```
gumsi-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지 (레이아웃 그룹)
│   │   ├── login/                # 로그인 페이지
│   │   │   └── page.tsx
│   │   └── signup/               # 회원가입 페이지
│   │       └── page.tsx
│   ├── (main)/                   # 메인 앱 페이지 (레이아웃 그룹)
│   │   ├── layout.tsx            # 공통 레이아웃 (헤더/푸터)
│   │   ├── tutor/                # AI 튜터 페이지
│   │   │   └── page.tsx
│   │   ├── questions/            # 문제 풀이 페이지
│   │   │   ├── page.tsx          # 문제 목록
│   │   │   └── [id]/             # 개별 문제 상세
│   │   │       └── page.tsx
│   │   ├── dashboard/            # 대시보드 (미구현)
│   │   └── profile/              # 프로필 (미구현)
│   ├── api/                      # API Routes
│   │   ├── chat/                 # AI 채팅 API
│   │   │   └── route.ts
│   │   ├── auth/                 # 인증 API (미구현)
│   │   └── questions/            # 문제 API (미구현)
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 랜딩 페이지
│   └── globals.css               # 글로벌 스타일
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # UI 컴포넌트
│   │   ├── Button.tsx            # 버튼
│   │   ├── Input.tsx             # 인풋 필드
│   │   ├── Card.tsx              # 카드
│   │   └── index.ts              # Export barrel
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── Header.tsx            # 헤더
│       ├── Footer.tsx            # 푸터
│       └── index.ts
│
├── data/                         # 데이터 파일
│   ├── questions-sample.json     # 샘플 기출문제
│   └── download-results.json     # 다운로드 결과
│
├── docs/                         # 문서
│   ├── api/                      # API 문서
│   ├── guides/                   # 가이드
│   └── architecture/             # 아키텍처 문서
│
├── marketing/                    # 마케팅 자료
│   ├── landing-copy.md           # 랜딩 페이지 카피
│   └── pricing.md                # 가격 정책
│
├── public/                       # 정적 파일
│   ├── favicon.ico               # 파비콘
│   └── images/                   # 이미지 자산
│
├── scripts/                      # 유틸리티 스크립트
│   ├── import-questions.ts       # 문제 임포트
│   └── seed-db.ts                # DB 시드
│
├── .env.example                  # 환경 변수 템플릿
├── .env.local                    # 로컬 환경 변수 (Git 제외)
├── .gitignore                    # Git 제외 파일
├── .eslintrc.json                # ESLint 설정
├── .prettierrc                   # Prettier 설정
├── next.config.js                # Next.js 설정
├── tailwind.config.ts            # Tailwind 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # 의존성 및 스크립트
├── package-lock.json             # 의존성 잠금 파일
├── vercel.json                   # Vercel 배포 설정
└── README.md                     # 프로젝트 문서 (이 파일)
```

### 데이터 흐름

#### 1. 사용자 인증 플로우

```
[사용자] → [회원가입/로그인 폼]
    ↓
[Next.js API Route: /api/auth/*]
    ↓
[Supabase Auth]
    ↓ (세션 생성)
[쿠키/LocalStorage]
    ↓
[인증된 사용자 세션]
```

#### 2. AI 튜터 대화 플로우

```
[사용자 질문 입력] → [app/(main)/tutor/page.tsx]
    ↓ (POST 요청)
[API Route: /api/chat/route.ts]
    ↓ (프롬프트 생성)
[Anthropic Claude API]
    ↓ (스트리밍 응답)
[Server-Sent Events]
    ↓ (실시간 렌더링)
[UI: 채팅 메시지 표시]
```

**스트리밍 구현:**
```typescript
// app/api/chat/route.ts 예시
export async function POST(request: Request) {
  const { message, subject } = await request.json();
  
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: message }],
    system: `검정고시 ${subject} 과목 튜터로 답변하세요.`,
    max_tokens: 2048,
  });

  return new Response(stream.toReadableStream());
}
```

#### 3. 데이터베이스 스키마 (Supabase)

**users (확장)**
```sql
-- Supabase auth.users 테이블은 기본 제공
-- app_metadata에 추가 필드:
{
  "role": "student" | "admin",
  "subscription": "free" | "premium",
  "beta_tester": boolean
}
```

**profiles (사용자 프로필)**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  grade TEXT,  -- 중학/고등
  target_exam_date DATE,
  weak_subjects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**chat_sessions (대화 세션)**
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**chat_messages (대화 메시지)**
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions NOT NULL,
  role TEXT NOT NULL,  -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**questions (문제 데이터)**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  choices JSONB,  -- { "1": "...", "2": "...", ... }
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT,  -- 'easy' | 'medium' | 'hard'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**user_answers (사용자 답안)**
```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  question_id UUID REFERENCES questions NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚢 배포

### Vercel 배포 (권장)

#### 자동 배포 (권장)

1. **GitHub 저장소와 Vercel 연결:**
   - [Vercel](https://vercel.com/) 로그인
   - "Import Project" 클릭
   - GitHub 저장소 선택 (`muin-company/gumsi-ai`)
   - "Import" 클릭

2. **환경 변수 설정:**
   - Settings → Environment Variables
   - 위 "[환경 변수 설정](#환경-변수-설정)" 섹션 참고
   - Production, Preview, Development 환경별 설정

3. **자동 배포 활성화:**
   - `main` 브랜치 푸시 시 자동으로 프로덕션 배포
   - PR 생성 시 자동으로 프리뷰 배포

#### 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### 기타 플랫폼

<details>
<summary><b>Netlify 배포</b></summary>

```bash
# 빌드 명령어
npm run build

# 출력 디렉토리
.next

# netlify.toml 설정
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```
</details>

<details>
<summary><b>Docker 배포</b></summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t gumsi-ai .
docker run -p 3000:3000 --env-file .env.local gumsi-ai
```
</details>

### 배포 체크리스트

- [ ] 환경 변수 모두 설정
- [ ] Supabase 프로젝트 생성 및 DB 스키마 적용
- [ ] Anthropic API 키 발급 및 크레딧 확인
- [ ] 도메인 설정 (선택)
- [ ] HTTPS 활성화 (Vercel 자동)
- [ ] 에러 모니터링 설정 (Sentry 등)
- [ ] 분석 도구 설정 (Vercel Analytics, Google Analytics)

---

## 🔧 문제 해결

### 개발 환경 문제

#### 1. `npm install` 실패

**증상:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결:**
```bash
# package-lock.json 삭제 후 재시도
rm package-lock.json
rm -rf node_modules
npm install

# 또는 --legacy-peer-deps 사용
npm install --legacy-peer-deps
```

#### 2. 개발 서버가 시작되지 않음

**증상:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결:**
```bash
# 포트 3000을 사용 중인 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 또는 다른 포트 사용
npm run dev -- -p 3001
```

#### 3. TypeScript 오류

**증상:**
```
Cannot find module '@/components/ui/Button' or its corresponding type declarations.
```

**해결:**
```bash
# TypeScript 캐시 삭제
rm -rf .next
npm run dev
```

### 환경 변수 문제

#### 4. Supabase 연결 실패

**증상:**
```
Error: Invalid Supabase URL
```

**해결:**
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_SUPABASE_URL`이 `https://`로 시작하는지 확인
3. Supabase 프로젝트가 활성 상태인지 확인

```bash
# 환경 변수 로드 확인
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

#### 5. Anthropic API 오류

**증상:**
```
Error: 401 Unauthorized - Invalid API Key
```

**해결:**
1. `ANTHROPIC_API_KEY`가 올바른지 확인
2. API 키가 `sk-ant-`로 시작하는지 확인
3. Anthropic 콘솔에서 크레딧 잔액 확인
4. 키가 활성화되어 있는지 확인

#### 6. 환경 변수가 undefined

**증상:**
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); // undefined
```

**해결:**
- 클라이언트에서 사용하려면 `NEXT_PUBLIC_` 접두사 필요
- `.env.local` 파일 저장 후 개발 서버 재시작
- 브라우저 새로고침 (캐시 삭제)

### 런타임 문제

#### 7. AI 응답이 느림

**원인:**
- 네트워크 속도
- Anthropic API 서버 부하
- 프롬프트가 너무 김

**해결:**
```typescript
// 응답 시간 최적화: max_tokens 조정
const stream = await anthropic.messages.stream({
  max_tokens: 1024,  // 2048 → 1024로 줄이기
  // ...
});
```

#### 8. 대화 기록이 사라짐

**원인:**
- 세션 스토리지 사용 (새로고침 시 초기화)
- DB 저장 미구현

**해결:**
- 단기: localStorage 사용
- 장기: Supabase에 대화 저장 (chat_sessions, chat_messages 테이블)

#### 9. 로그인이 유지되지 않음

**원인:**
- 쿠키 설정 문제
- 시크릿 모드 사용
- Supabase 세션 만료

**해결:**
```typescript
// Supabase 클라이언트 설정 확인
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,  // 세션 유지 활성화
    autoRefreshToken: true,  // 자동 토큰 갱신
  },
});
```

### 프로덕션 문제

#### 10. Vercel 배포 실패

**증상:**
```
Error: Build failed
```

**해결:**
1. Vercel 로그 확인
2. 로컬에서 `npm run build` 테스트
3. 환경 변수가 Vercel에 설정되어 있는지 확인
4. Node.js 버전 확인 (package.json의 `engines` 필드)

#### 11. API Route Timeout

**증상:**
```
Error: FUNCTION_INVOCATION_TIMEOUT
```

**해결:**
```javascript
// vercel.json 설정
{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 60  // 기본 10초 → 60초로 증가
    }
  }
}
```

#### 12. CORS 오류

**증상:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**해결:**
```typescript
// API Route에 CORS 헤더 추가
export async function POST(request: Request) {
  return new Response(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
```

### 데이터베이스 문제

#### 13. Supabase RLS(Row Level Security) 오류

**증상:**
```
Error: permission denied for table profiles
```

**해결:**
```sql
-- Supabase SQL 에디터에서 RLS 정책 추가
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### 14. 데이터베이스 마이그레이션 실패

**해결:**
1. Supabase 대시보드 → Database → Migrations
2. SQL 에디터에서 수동 실행
3. 에러 로그 확인 후 스키마 수정

### 성능 최적화

#### 15. 페이지 로딩 느림

**원인:**
- 큰 번들 사이즈
- 이미지 최적화 안 됨
- 서버 렌더링 부하

**해결:**
```typescript
// Dynamic import로 코드 스플리팅
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});

// 이미지 최적화 (Next.js Image)
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

---

## ❓ 자주 묻는 질문

### 일반 사용자

**Q1. 검시 AI는 무료인가요?**

**A:** 기본 기능은 무료입니다. 프리미엄 플랜(₩19,900/월)은 무제한 질문, 학습 분석, 모의고사 등 고급 기능을 제공합니다. 베타 테스터는 모든 기능이 평생 무료입니다.

**Q2. 어떤 검정고시를 지원하나요?**

**A:** 중학 검정고시와 고등 검정고시를 모두 지원합니다. 과목은 국어, 수학, 영어, 사회, 과학, 한국사입니다.

**Q3. AI가 틀린 답을 줄 수도 있나요?**

**A:** 네, AI도 완벽하지 않습니다. 답이 이상하다면 "이 답이 틀린 것 같은데?"라고 질문해주세요. 심각한 오류는 support@muin.company로 제보 부탁드립니다.

**Q4. 모바일에서도 사용할 수 있나요?**

**A:** 네! 웹 기반이라 PC, 스마트폰, 태블릿 모두 사용 가능합니다. 앱은 아직 없지만, 웹사이트를 홈 화면에 추가하면 앱처럼 사용 가능합니다.

**Q5. 대화 내역이 저장되나요?**

**A:** 현재는 같은 세션 내에서만 저장됩니다. 대시보드 기능(3월 출시 예정)에서 모든 대화 내역을 조회할 수 있습니다.

**Q6. 이미지(사진)를 올려서 질문할 수 있나요?**

**A:** 현재는 텍스트만 가능합니다. 이미지 업로드 기능은 3월 중 추가 예정입니다.

**Q7. 수능 준비도 할 수 있나요?**

**A:** 검정고시 중심이지만 기본 개념은 동일합니다. 수능 특화 기능은 향후 추가 예정입니다.

**Q8. 오프라인에서도 사용할 수 있나요?**

**A:** 현재는 인터넷 연결이 필요합니다. 오프라인 모드는 향후 고려 중입니다.

### 개발자

**Q9. 로컬에서 Supabase 없이 개발할 수 있나요?**

**A:** 베타 랜딩 페이지는 환경 변수 없이도 작동합니다. 인증 및 AI 튜터 기능을 테스트하려면 Supabase와 Anthropic API 키가 필요합니다.

**Q10. 다른 LLM(예: OpenAI GPT)을 사용할 수 있나요?**

**A:** 코드 수정으로 가능합니다. `app/api/chat/route.ts`에서 Anthropic SDK를 OpenAI SDK로 교체하면 됩니다.

```typescript
// Anthropic 대신 OpenAI 사용 예시
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: message }],
  stream: true,
});
```

**Q11. 프로덕션에서 API 키를 안전하게 관리하려면?**

**A:**
- `.env.local`은 Git에 포함되지 않음 (`.gitignore` 확인)
- Vercel에서 환경 변수로 설정
- 서버 전용 키(`ANTHROPIC_API_KEY`)는 절대 `NEXT_PUBLIC_` 접두사 사용 금지
- API Route에서만 사용

**Q12. TypeScript를 JavaScript로 바꿀 수 있나요?**

**A:** 가능하지만 권장하지 않습니다. TypeScript는 타입 안정성으로 버그를 사전에 방지합니다. 꼭 필요하다면 `.tsx` → `.jsx`, `.ts` → `.js`로 변경하고 `tsconfig.json` 삭제하세요.

---

## 🤝 기여하기

검시 AI는 오픈소스 프로젝트이며, 커뮤니티의 기여를 환영합니다!

### 기여 방법

1. **이슈 생성**
   - 버그 발견 시 [GitHub Issues](https://github.com/muin-company/gumsi-ai/issues)에 제보
   - 기능 제안도 환영합니다

2. **Pull Request 제출**
   ```bash
   # 1. Fork 후 클론
   git clone https://github.com/YOUR_USERNAME/gumsi-ai.git
   
   # 2. 새 브랜치 생성
   git checkout -b feature/your-feature-name
   
   # 3. 변경 사항 커밋
   git commit -m "feat: add new feature"
   
   # 4. Push
   git push origin feature/your-feature-name
   
   # 5. GitHub에서 Pull Request 생성
   ```

3. **코드 리뷰**
   - 다른 사람의 PR을 리뷰하고 피드백 제공

### 기여 가이드라인

#### 코드 스타일

- **ESLint + Prettier** 사용
  ```bash
  npm run lint      # ESLint 검사
  npm run format    # Prettier 포맷팅
  ```
- **TypeScript strict 모드** 준수
- **Tailwind CSS** 유틸리티 클래스 사용 (인라인 스타일 지양)

#### 커밋 메시지 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 사용:

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

**예시:**
```bash
git commit -m "feat: add image upload to AI tutor"
git commit -m "fix: resolve login session timeout issue"
git commit -m "docs: update README installation guide"
```

#### 브랜치 전략

- `main`: 프로덕션 코드 (보호됨)
- `develop`: 개발 브랜치 (여기서 PR 생성)
- `feature/*`: 새 기능 개발
- `fix/*`: 버그 수정
- `docs/*`: 문서 작업

### 무엇을 기여할 수 있나요?

#### 🐛 버그 수정
- UI 깨짐 문제
- API 오류 처리
- 성능 최적화

#### ✨ 기능 추가
- 다크 모드
- 다국어 지원 (영어, 중국어 등)
- 음성 입력/출력
- 모바일 앱 (React Native)

#### 📚 문서 개선
- 번역 (영어 README)
- 튜토리얼 작성
- API 문서화

#### 🎨 디자인
- UI/UX 개선
- 일러스트레이션
- 로고 디자인

### 라이선스

기여한 코드는 MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일 참조.

### 행동 강령

- **존중**: 모든 기여자를 존중합니다
- **건설적 피드백**: 비판은 구체적이고 건설적으로
- **협력**: 함께 더 나은 제품을 만듭니다
- **포용**: 모든 배경의 사람들을 환영합니다

### 질문이 있으신가요?

- 이메일: dev@muin.company
- Discord: (곧 오픈 예정)
- GitHub Discussions: (곧 활성화 예정)

---

## 🗺 로드맵

### ✅ 완료 (v1.0 - Beta)

- [x] **랜딩 페이지** - 제품 소개 및 베타 신청
- [x] **회원가입/로그인** - Supabase Auth 연동
- [x] **AI 튜터 채팅** - Anthropic Claude API 연동
- [x] **과목 선택** - 국어, 수학, 영어, 사회, 과학, 한국사
- [x] **반응형 디자인** - 모바일, 태블릿, PC 지원
- [x] **Vercel 배포** - 자동 CI/CD

### 🚧 진행 중 (2026년 3월)

- [ ] **이미지 업로드** - 문제 사진 찍어서 질문
- [ ] **대화 내역 저장** - Supabase DB에 영구 저장
- [ ] **대시보드** - 학습 통계 및 진도 확인
- [ ] **기출문제 DB** - 2020-2024 전 과목 수록
- [ ] **학습 진도 추적** - 과목별 진도율 시각화

### 📅 예정 (2026년 4-5월)

- [ ] **모의고사 기능** - 실전 연습 및 자동 채점
- [ ] **취약점 분석** - AI 기반 약점 진단 및 맞춤 문제 추천
- [ ] **스마트 스케줄러** - 학습 계획 자동 생성
- [ ] **학습 리포트** - 주간/월간 학습 분석 리포트
- [ ] **소셜 로그인** - Google, Kakao, Naver 로그인
- [ ] **모바일 앱** - React Native 기반 Android/iOS 앱

### 🔮 향후 검토 (2026년 하반기 이후)

- [ ] **음성 입력/출력** - 말로 질문하고 들으며 학습
- [ ] **그룹 스터디** - 친구와 함께 공부하기
- [ ] **선생님 매칭** - AI + 실제 튜터 하이브리드 (유료)
- [ ] **수능 특화 모드** - 수능 준비생 지원
- [ ] **라이브 클래스** - 실시간 그룹 강의
- [ ] **게임화** - 포인트, 배지, 리더보드로 동기 부여
- [ ] **다국어 지원** - 영어, 중국어, 베트남어 등
- [ ] **오프라인 모드** - 인터넷 없이 일부 기능 사용

### 커뮤니티 요청 기능

투표를 통해 우선순위 결정! 원하는 기능을 [GitHub Discussions](https://github.com/muin-company/gumsi-ai/discussions)에 제안해주세요.

---

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

```
MIT License

Copyright (c) 2026 MUIN Company

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 감사의 말

검시 AI를 만드는 데 영감과 도움을 주신 분들께 감사드립니다:

- **Anthropic** - Claude API 제공
- **Supabase** - 백엔드 인프라
- **Vercel** - 호스팅 및 배포
- **Next.js 팀** - 훌륭한 프레임워크
- **베타 테스터들** - 귀중한 피드백
- **오픈소스 커뮤니티** - 수많은 라이브러리와 도구

---

## 📞 문의 및 지원

### 사용자 지원
- **이메일**: support@muin.company
- **응답 시간**: 24시간 내 (주말 포함)
- **긴급**: 이메일 제목에 [긴급] 표시

### 개발자 문의
- **이메일**: dev@muin.company
- **GitHub Issues**: [이슈 생성](https://github.com/muin-company/gumsi-ai/issues)
- **GitHub Discussions**: (곧 활성화)

### 사업 문의
- **이메일**: mj@muin.company
- **웹사이트**: [muin.company](https://muin.company)

### 소셜 미디어
- **Twitter/X**: (곧 오픈)
- **Instagram**: (곧 오픈)
- **YouTube**: (곧 오픈)

---

## 🌟 별(Star) 부탁드립니다!

이 프로젝트가 도움이 되었다면 ⭐️ 별을 눌러주세요! 많은 사람들이 검시 AI를 발견할 수 있도록 도와주세요.

---

<div align="center">

**검정고시 합격, AI와 함께라면 쉽습니다!** 🚀

[시작하기](https://gumsi-ai.vercel.app) • [문서](docs/) • [기여하기](#-기여하기) • [로드맵](#-로드맵)

---

**Made with ❤️ by [MUIN Company](https://muin.company)**  
*일하는 AI, 누리는 인간* 🤖

</div>
