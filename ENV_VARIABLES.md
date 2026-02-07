# 환경변수 목록

검시AI 프로젝트의 환경변수 설정 가이드입니다.

## 현재 상태 (베타 버전)

베타 랜딩페이지는 **환경변수 없이** 작동합니다.
- 베타 신청: localStorage 사용
- 인증: 미구현 (추후 Supabase 연동 예정)

## 추후 필요한 환경변수

### Supabase (인증 및 DB)

```bash
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (공개 키)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key (서버 전용, 비공개)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### OpenAI (AI 튜터 기능)

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-...

# 선택: 사용할 모델
OPENAI_MODEL=gpt-4
```

### 기타

```bash
# Next.js 환경
NODE_ENV=production

# 앱 URL (절대 경로 생성용)
NEXT_PUBLIC_APP_URL=https://gumsi.muin.company

# 베타 신청 알림 (선택)
ADMIN_EMAIL=admin@muin.company
```

## 환경변수 설정 방법

### 로컬 개발

1. `.env.local` 파일 생성 (루트 디렉토리)
2. 위 환경변수 복사 후 값 입력
3. `.env.local`은 `.gitignore`에 포함되어 Git에 업로드되지 않음

```bash
# .env.local 예시
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
```

### Vercel 배포

DEPLOY.md의 "3. 환경변수 설정" 참조

1. Vercel 프로젝트 → Settings → Environment Variables
2. 각 변수 추가
3. Environment 선택:
   - **Production**: 프로덕션 배포
   - **Preview**: PR 미리보기
   - **Development**: 로컬 개발 (`vercel dev` 사용 시)

## 보안 주의사항

### 공개 키 (NEXT_PUBLIC_*)

- 브라우저에 노출됨
- GitHub에 업로드 가능 (`.env.example`에 예시로 포함)
- Supabase Anon Key는 RLS(Row Level Security)로 보호됨

### 비밀 키

- **절대 Git에 업로드 금지**
- Vercel 환경변수로만 설정
- 서버 사이드에서만 사용
- 예: SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY

## 환경변수 확인

```bash
# 로컬에서 환경변수 로드 확인
npm run dev

# 브라우저 콘솔에서
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

서버 전용 변수는 API Route나 Server Component에서만 접근 가능.

## 참고

- `.env.example`: 샘플 환경변수 (Git 업로드 가능)
- `.env.local`: 실제 환경변수 (Git 제외)
- `.env.production`: 프로덕션 전용 (선택)
- `.env.development`: 개발 전용 (선택)

Next.js 환경변수 우선순위:
1. `.env.local`
2. `.env.production` 또는 `.env.development`
3. `.env`

---

**현재는 환경변수 없이 배포 가능!** Supabase 연동 시 위 변수들을 추가하세요.
