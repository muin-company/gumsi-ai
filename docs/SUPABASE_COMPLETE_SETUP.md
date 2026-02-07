# Supabase 완벽 설정 가이드

## 목차
1. [Supabase란?](#supabase란)
2. [프로젝트 생성](#1-프로젝트-생성)
3. [Database 설정](#2-database-설정)
4. [Authentication 설정](#3-authentication-설정)
5. [API Keys 확인](#4-api-keys-확인)
6. [환경 변수 설정](#5-환경-변수-설정)
7. [Supabase CLI 설치](#6-supabase-cli-설치)
8. [로컬 개발 환경 연동](#7-로컬-개발-환경-연동)
9. [프로덕션 배포 체크리스트](#8-프로덕션-배포-체크리스트)
10. [트러블슈팅](#9-트러블슈팅)

---

## Supabase란?

Supabase는 오픈소스 Firebase 대안으로, PostgreSQL 기반의 백엔드 서비스입니다.

**검시AI에서 사용하는 기능**
- 🔐 **Authentication**: 회원가입, 로그인, OAuth
- 📊 **Database**: PostgreSQL (사용자, 문제, 학습 기록)
- 🔒 **Row Level Security**: 데이터 보안
- 📡 **Realtime**: 실시간 데이터 구독 (선택)
- 📦 **Storage**: 이미지/파일 업로드 (선택)

**가격**
- **Free tier**: 월 500MB 데이터베이스, 2GB 스토리지
- 검시AI 초기에는 Free tier로 충분!

---

## 1. 프로젝트 생성

### 1-1. Supabase 가입

1. https://supabase.com 접속
2. **Start your project** 클릭
3. **Sign up** 선택

**가입 방법**
- GitHub (추천): "Continue with GitHub" → 권한 승인
- Email: 이메일 입력 → 인증 메일 확인 → 비밀번호 설정

### 1-2. Organization 생성

가입 완료 후 Organization 생성 화면이 나타납니다.

```
Organization Name: gumsi-ai (또는 원하는 이름)
```

- Organization은 여러 프로젝트를 그룹화하는 단위
- 개인 사용이라면 본인 이름으로 생성해도 OK

### 1-3. 프로젝트 생성

1. **New project** 버튼 클릭

2. 프로젝트 정보 입력:
```
Name: gumsi-ai-production
Database Password: (자동 생성되거나 직접 입력)
  → 안전한 곳에 저장! (1Password, Bitwarden 등)
Region: Northeast Asia (Seoul) - 한국 사용자에게 가장 빠름
Pricing Plan: Free
```

3. **Create new project** 클릭

4. 프로젝트 생성 대기 (약 2-3분)
   - "Setting up project..." 진행 바 표시
   - 완료되면 대시보드로 이동

### 1-4. 프로젝트 확인

대시보드에서 다음 정보 확인:
```
✅ Project URL: https://xxxxxxxxxxxxx.supabase.co
✅ API Keys 탭 존재
✅ Database 탭 존재
✅ Authentication 탭 존재
```

---

## 2. Database 설정

### 2-1. SQL Editor 접속

```
좌측 메뉴 > SQL Editor 클릭
또는 Database > SQL Editor
```

### 2-2. 검시AI 스키마 생성

**New query** 버튼 클릭 후 아래 SQL 실행:

```sql
-- ==========================================
-- 검시AI Database Schema
-- ==========================================

-- 1. 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'high' CHECK (level IN ('elementary', 'middle', 'high')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 기출문제 테이블
CREATE TABLE questions (
  id TEXT PRIMARY KEY, -- 예: '2024-1-math-01'
  year INTEGER NOT NULL,
  session INTEGER NOT NULL CHECK (session IN (1, 2)),
  subject TEXT NOT NULL,
  number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["① 1과 6", "② 2와 3", ...]
  answer INTEGER NOT NULL CHECK (answer BETWEEN 1 AND 4),
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(year, session, subject, number)
);

-- 3. 학습 기록 테이블
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  user_answer INTEGER CHECK (user_answer BETWEEN 1 AND 4),
  is_correct BOOLEAN,
  time_spent INTEGER, -- seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. AI 대화 기록 테이블
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  messages JSONB NOT NULL, -- [{role: "user", content: "...", timestamp: "..."}]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 학습 통계 테이블
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  study_time INTEGER DEFAULT 0, -- minutes
  weak_topics JSONB, -- ["이차함수", "화학반응"]
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subject)
);

-- 6. API 사용량 테이블 (비용 모니터링용)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  estimated_cost DECIMAL(10, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 인덱스 생성 (성능 최적화)
-- ==========================================

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_created_at ON progress(created_at);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_stats_user_id ON stats(user_id);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_year_session ON questions(year, session);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);

-- ==========================================
-- 트리거: updated_at 자동 갱신
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**실행 방법**
1. 위 SQL 전체를 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)
4. "Success. No rows returned" 확인

### 2-3. 테이블 확인

```
좌측 메뉴 > Database > Tables
```

다음 테이블들이 생성되었는지 확인:
```
✅ users
✅ questions
✅ progress
✅ conversations
✅ stats
✅ api_usage
```

각 테이블 클릭 시:
- **Columns**: 컬럼 목록 확인
- **Indexes**: 인덱스 확인
- **Definition**: SQL 스키마 확인

### 2-4. Row Level Security (RLS) 설정

RLS는 사용자가 자기 데이터만 볼 수 있게 보호하는 기능입니다.

**RLS 정책 활성화 SQL**:

```sql
-- ==========================================
-- Row Level Security (RLS) 정책
-- ==========================================

-- 1. RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- questions 테이블은 모두 읽기 가능 (공개 데이터)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- users 정책
-- ==========================================

-- 자기 정보만 조회 가능
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 자기 정보만 수정 가능
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- progress 정책
-- ==========================================

-- 자기 학습 기록만 조회
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

-- 자기 학습 기록만 생성
CREATE POLICY "Users can create own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- conversations 정책
-- ==========================================

-- 자기 대화만 조회
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

-- 자기 대화만 생성
CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 자기 대화만 수정
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- stats 정책
-- ==========================================

-- 자기 통계만 조회
CREATE POLICY "Users can view own stats"
  ON stats FOR SELECT
  USING (auth.uid() = user_id);

-- 자기 통계만 생성/수정
CREATE POLICY "Users can upsert own stats"
  ON stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON stats FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- api_usage 정책
-- ==========================================

-- 자기 API 사용량만 조회
CREATE POLICY "Users can view own api usage"
  ON api_usage FOR SELECT
  USING (auth.uid() = user_id);

-- 시스템이 API 사용량 기록 (authenticated users)
CREATE POLICY "Users can create api usage"
  ON api_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- questions 정책 (공개 데이터)
-- ==========================================

-- 모든 인증된 사용자가 문제 조회 가능
CREATE POLICY "Authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);
```

**실행 방법**
1. SQL Editor에서 **New query**
2. 위 SQL 붙여넣기
3. **Run** 실행
4. "Success" 확인

### 2-5. 샘플 데이터 추가 (선택)

테스트용 샘플 데이터:

```sql
-- 샘플 문제 추가 (2024년 1회 수학 5문제)
INSERT INTO questions (id, year, session, subject, number, question, options, answer, explanation, difficulty) VALUES
('2024-1-math-01', 2024, 1, 'math', 1, '3 + 5 = ?', '["① 6", "② 7", "③ 8", "④ 9"]', 3, '3 + 5 = 8입니다.', 'easy'),
('2024-1-math-02', 2024, 1, 'math', 2, '10 - 4 = ?', '["① 4", "② 5", "③ 6", "④ 7"]', 3, '10 - 4 = 6입니다.', 'easy'),
('2024-1-math-03', 2024, 1, 'math', 3, '2 × 7 = ?', '["① 12", "② 14", "③ 16", "④ 18"]', 2, '2 × 7 = 14입니다.', 'easy'),
('2024-1-math-04', 2024, 1, 'math', 4, '20 ÷ 5 = ?', '["① 2", "② 3", "③ 4", "④ 5"]', 3, '20 ÷ 5 = 4입니다.', 'easy'),
('2024-1-math-05', 2024, 1, 'math', 5, 'x² - 5x + 6 = 0의 해는?', '["① x = 1, x = 6", "② x = 2, x = 3", "③ x = -2, x = -3", "④ x = -1, x = -6"]', 2, '(x-2)(x-3) = 0이므로 x = 2 또는 x = 3입니다.', 'medium');
```

---

## 3. Authentication 설정

### 3-1. Email 인증 활성화

1. 좌측 메뉴 > **Authentication** 클릭
2. **Providers** 탭 선택
3. **Email** 찾기 → 이미 활성화되어 있음 (기본값)

**Email 설정 확인**:
```
✅ Enable Email provider: ON
✅ Confirm email: ON (이메일 인증 필수)
✅ Allow duplicate emails: OFF
```

### 3-2. 이메일 템플릿 수정 (선택)

**Email Templates** 탭:
- **Confirm signup**: 회원가입 인증 메일
- **Magic Link**: 비밀번호 없이 로그인
- **Change Email Address**: 이메일 변경 인증
- **Reset Password**: 비밀번호 재설정

기본 템플릿 사용해도 되지만, 원한다면 커스터마이징 가능:

```html
<!-- Confirm signup 예시 -->
<h2>검시AI에 오신 것을 환영합니다! 🎓</h2>
<p>아래 링크를 클릭하여 이메일 인증을 완료하세요:</p>
<p><a href="{{ .ConfirmationURL }}">이메일 인증하기</a></p>
<p>이 링크는 24시간 동안 유효합니다.</p>
```

### 3-3. OAuth 프로바이더 설정 (Google)

**Google OAuth 설정** (선택):

1. **Providers** 탭에서 **Google** 클릭
2. **Enable Google provider** 켜기
3. Google Cloud Console에서 OAuth 설정 필요

**Google Cloud Console 설정**:
```
1. https://console.cloud.google.com 접속
2. 프로젝트 생성: "gumsi-ai"
3. APIs & Services > Credentials
4. Create Credentials > OAuth 2.0 Client ID
5. Application type: Web application
6. Name: gumsi-ai-production
7. Authorized redirect URIs:
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   (Supabase에서 제공하는 Callback URL 복사)
8. Create 클릭
9. Client ID, Client Secret 복사
```

**Supabase에 입력**:
```
Client ID: 복사한 Google Client ID
Client Secret: 복사한 Google Client Secret
Save 클릭
```

### 3-4. OAuth 프로바이더 설정 (Kakao)

**Kakao OAuth 설정** (선택):

1. https://developers.kakao.com 접속
2. 로그인 → **내 애플리케이션** 클릭
3. **애플리케이션 추가하기**
```
앱 이름: 검시AI
사업자명: 개인 (또는 사업자명)
```
4. **카카오 로그인 활성화**
```
제품 설정 > 카카오 로그인 > 활성화 설정 ON
Redirect URI 추가:
https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
```
5. **앱 키 확인**
```
앱 설정 > 앱 키 > REST API 키 복사
```

**Supabase에 입력** (현재 Kakao는 기본 지원 안 됨):
- Supabase는 Kakao를 공식 지원하지 않음
- 필요 시 Custom OAuth 구현 필요 (고급)

### 3-5. Redirect URLs 설정

**URL Configuration** 탭:

```
Site URL: https://gumsi-ai.vercel.app (프로덕션 URL)
Redirect URLs:
  http://localhost:3000/**  (로컬 개발)
  https://gumsi-ai.vercel.app/**  (프로덕션)
```

---

## 4. API Keys 확인

### 4-1. API Keys 복사

```
좌측 메뉴 > Project Settings (⚙️) > API
```

**복사할 키들**:
```
✅ Project URL: https://xxxxxxxxxxxxx.supabase.co
✅ anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**주의**:
- **anon key**: 클라이언트(브라우저)에서 사용 (공개 가능)
- **service_role key**: 서버에서만 사용 (절대 공개 금지!)

### 4-2. 안전하게 보관

```bash
# 1Password, Bitwarden 등에 저장
제목: Supabase API Keys (검시AI 프로덕션)
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
생성일: 2026-02-07
```

---

## 5. 환경 변수 설정

### 5-1. `.env.local` 파일 생성/수정

프로젝트 루트 (`gumsi-ai/`)에서:

```bash
# .env.local 파일 열기
code .env.local

# 또는
nano .env.local
```

### 5-2. Supabase 환경 변수 추가

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# DeepSeek (이미 있다면 건너뛰기)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5-3. Vercel 환경 변수 설정 (프로덕션)

Vercel에 배포할 때:

```
1. Vercel Dashboard > gumsi-ai 프로젝트 선택
2. Settings > Environment Variables
3. 다음 변수 추가:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (Production only, Encrypted)
   - DEEPSEEK_API_KEY (Production only, Encrypted)
4. Save
5. Redeploy (Deployments > ... > Redeploy)
```

---

## 6. Supabase CLI 설치

### 6-1. CLI 설치

**macOS (Homebrew)**:
```bash
brew install supabase/tap/supabase
```

**Windows (Scoop)**:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Linux / npm**:
```bash
npm install -g supabase
```

### 6-2. 설치 확인

```bash
supabase --version
# 출력: supabase 1.x.x
```

### 6-3. CLI 로그인

```bash
supabase login

# 브라우저가 열리고 로그인 프롬프트 표시
# 승인 후 터미널로 돌아옴
```

---

## 7. 로컬 개발 환경 연동

### 7-1. 프로젝트와 연결

```bash
cd ~/muin/gumsi-ai

# Supabase 프로젝트와 연결
supabase link --project-ref xxxxxxxxxxxxx

# Project Reference는 Supabase Dashboard > Project Settings에서 확인
```

### 7-2. 로컬 Supabase 시작 (선택)

로컬에서 Supabase를 Docker로 실행 (완전 오프라인 개발):

```bash
# Docker Desktop 필요 (https://docker.com 설치)

# Supabase 로컬 시작
supabase start

# 완료 후 출력:
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
```

로컬 Supabase 사용 시 `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=(로컬 anon key)
```

### 7-3. 스키마 동기화

```bash
# 로컬 → 원격 (로컬에서 작업한 스키마를 프로덕션에 적용)
supabase db push

# 원격 → 로컬 (프로덕션 스키마를 로컬로 가져오기)
supabase db pull
```

### 7-4. Migration 생성

스키마 변경 시 Migration으로 관리:

```bash
# 새 마이그레이션 파일 생성
supabase migration new add_quiz_attempts_table

# supabase/migrations/에 파일 생성됨
# 예: 20260207_add_quiz_attempts_table.sql

# SQL 작성 후 적용
supabase db push
```

---

## 8. 프로덕션 배포 체크리스트

검시AI를 실제로 배포하기 전 확인 사항:

### 8-1. Database 체크

```
✅ 모든 테이블 생성 완료
✅ RLS 정책 활성화 및 테스트 완료
✅ 인덱스 생성 완료
✅ 샘플 데이터 삭제 (또는 실제 데이터로 교체)
```

### 8-2. Authentication 체크

```
✅ Email 인증 활성화
✅ OAuth 프로바이더 설정 (Google, Kakao)
✅ Redirect URLs 프로덕션 도메인으로 설정
✅ Email 템플릿 커스터마이징
```

### 8-3. Security 체크

```
✅ service_role key는 서버 환경 변수에만 저장
✅ .env.local은 .gitignore에 포함
✅ RLS 정책 테스트 (다른 사용자 데이터 접근 불가 확인)
✅ API Rate Limiting 고려
```

### 8-4. Performance 체크

```
✅ Database 인덱스 확인
✅ Connection Pooling 설정 (필요 시)
✅ Query 최적화 (EXPLAIN ANALYZE로 확인)
```

### 8-5. Monitoring 설정

```
✅ Supabase Dashboard에서 로그 모니터링
✅ Database 사용량 확인 (Free tier: 500MB)
✅ API 호출량 모니터링
✅ 에러 로그 수집 (Sentry 등)
```

---

## 9. 트러블슈팅

### 9-1. 데이터베이스 연결 오류

**증상**
```
Error: connect ECONNREFUSED
```

**해결 방법**
```bash
# 1. Supabase Project URL 확인
echo $NEXT_PUBLIC_SUPABASE_URL

# 2. 프로젝트가 Paused 상태인지 확인
# Dashboard > Project Settings > 
# Free tier는 7일 미사용 시 일시정지됨

# 3. Restore project (Paused 상태라면)
# Dashboard에서 Restore 버튼 클릭

# 4. Firewall/VPN 확인
# 일부 VPN은 Supabase 차단 가능
```

### 9-2. RLS 정책 오류

**증상**
```javascript
// 데이터 조회 시
Error: new row violates row-level security policy
```

**해결 방법**
```sql
-- 1. RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'users';

-- 2. 정책 비활성화 (테스트용)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. 정책 재생성
-- (위 RLS 설정 섹션 참고)

-- 4. 정책 재활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**디버깅 팁**:
```javascript
// Supabase 클라이언트에서 에러 로그 확인
const { data, error } = await supabase
  .from('users')
  .select('*');

console.log('Error:', error);
```

### 9-3. Authentication 실패

**증상**
```
User not authenticated
```

**해결 방법**
```javascript
// 1. 세션 확인
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// 2. 로그인 상태 확인
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// 3. 토큰 갱신
const { data, error } = await supabase.auth.refreshSession();

// 4. 로그아웃 후 재로그인
await supabase.auth.signOut();
```

### 9-4. Migration 충돌

**증상**
```
Error: Migration already applied
```

**해결 방법**
```bash
# 1. Migration 상태 확인
supabase migration list

# 2. 특정 Migration 되돌리기
supabase migration revert 20260207_add_quiz_table

# 3. Migration 재적용
supabase db push

# 4. Migration 히스토리 초기화 (주의!)
supabase db reset
```

### 9-5. "Too many connections" 에러

**증상**
```
Error: remaining connection slots are reserved
```

**원인**: Free tier는 동시 연결 제한 (최대 60개)

**해결 방법**
```javascript
// 1. Connection Pooling 사용
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false, // 서버사이드에서는 false
    },
  }
);

// 2. 연결 후 즉시 종료
// Vercel Serverless Functions는 자동으로 처리

// 3. Pro 플랜 업그레이드 고려
// Pro: 200 동시 연결
```

### 9-6. SQL 문법 오류

**증상**
```
syntax error at or near "..."
```

**해결 방법**
```sql
-- 1. SQL Editor에서 단계별 실행
-- 전체 스크립트 대신 테이블 하나씩 실행

-- 2. PostgreSQL 문법 확인
-- Supabase는 PostgreSQL 사용

-- 3. 세미콜론 확인
CREATE TABLE test (...);  -- ✅
CREATE TABLE test (...)   -- ❌

-- 4. 예약어 사용 확인
-- "user", "order" 등은 예약어이므로 따옴표 필요
CREATE TABLE "user" (...);
```

### 9-7. Vercel 배포 후 Supabase 연결 안 됨

**증상**
```
NEXT_PUBLIC_SUPABASE_URL is undefined
```

**해결 방법**
```bash
# 1. Vercel 환경 변수 확인
vercel env ls

# 2. 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL

# 3. 변수 이름 확인 (NEXT_PUBLIC_ 접두사 필수)
NEXT_PUBLIC_SUPABASE_URL=...  # ✅ 클라이언트에서 접근 가능
SUPABASE_URL=...              # ❌ 클라이언트에서 접근 불가

# 4. Redeploy
vercel --prod
```

---

## 추가 리소스

- **공식 문서**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript/introduction
- **SQL Reference**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **커뮤니티**: https://github.com/supabase/supabase/discussions

---

## 체크리스트

설정 완료 후 아래 항목을 확인하세요:

```
✅ Supabase 계정 생성 및 프로젝트 생성
✅ Database 스키마 생성 (6개 테이블)
✅ RLS 정책 활성화
✅ Authentication 설정 (Email + OAuth)
✅ API Keys 복사 및 안전하게 보관
✅ .env.local에 환경 변수 추가
✅ Supabase CLI 설치 및 로그인
✅ 로컬 개발 환경 연동
✅ 테스트 회원가입/로그인 성공
✅ 프로덕션 배포 시 Vercel 환경 변수 설정
```

---

**작성일**: 2026-02-07  
**작성자**: MJ (COO, 검시AI)  
**버전**: 1.0
