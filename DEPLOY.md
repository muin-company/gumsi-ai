# Vercel 배포 가이드

검시AI 랜딩페이지를 Vercel에 배포하는 방법입니다.

## 1. 사전 준비

- GitHub 리포지토리에 코드 푸시
- Vercel 계정 생성 (https://vercel.com)
- 커스텀 도메인: `gumsi.muin.company`

## 2. Vercel 프로젝트 생성

### 2.1 GitHub 연동

1. Vercel 대시보드 접속
2. **"Add New Project"** 클릭
3. **"Import Git Repository"** 선택
4. GitHub 리포지토리 선택: `gumsi-ai`
5. **Import** 클릭

### 2.2 빌드 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다.

- **Framework Preset**: Next.js
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

`vercel.json` 파일이 있어 추가 설정이 자동 적용됩니다.

## 3. 환경변수 설정

현재 베타 버전은 환경변수가 필요하지 않습니다. (localStorage 사용)

추후 Supabase 연동 시 필요한 환경변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 환경변수 추가 방법

1. Vercel 프로젝트 페이지 → **Settings** 탭
2. 왼쪽 메뉴 → **Environment Variables**
3. 변수 추가:
   - **Name**: 변수명
   - **Value**: 값
   - **Environment**: Production, Preview, Development 선택
4. **Save** 클릭

## 4. 배포

### 첫 배포

1. 프로젝트 설정 완료 후 **Deploy** 클릭
2. 빌드 진행 (약 1-2분 소요)
3. 배포 완료 시 자동 생성된 URL 확인
   - 예: `https://gumsi-ai.vercel.app`

### 자동 배포

- `main` 브랜치에 푸시 시 자동 배포
- PR 생성 시 Preview 배포 자동 생성

## 5. 커스텀 도메인 연결

### 5.1 Vercel에서 도메인 추가

1. Vercel 프로젝트 → **Settings** → **Domains**
2. **Add Domain** 클릭
3. `gumsi.muin.company` 입력
4. **Add** 클릭

### 5.2 DNS 설정

Vercel이 제공하는 DNS 레코드를 도메인 관리 페이지에 추가:

**옵션 1: CNAME (권장)**
```
Type: CNAME
Name: gumsi
Value: cname.vercel-dns.com
```

**옵션 2: A 레코드**
```
Type: A
Name: gumsi
Value: 76.76.21.21
```

### 5.3 DNS 전파 확인

- DNS 전파는 최대 48시간 소요 (보통 10분~1시간)
- 확인: `dig gumsi.muin.company` 또는 https://dnschecker.org

### 5.4 SSL 인증서

Vercel이 자동으로 Let's Encrypt SSL 인증서 발급 (무료)

## 6. 배포 확인

### 체크리스트

- [ ] 홈페이지 접속 확인
- [ ] 베타 신청 폼 동작 확인
- [ ] 메타태그 확인 (SNS 공유 시)
- [ ] 파비콘 표시 확인
- [ ] 모바일 반응형 확인
- [ ] 페이지 로딩 속도 확인

### 메타태그 확인 도구

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## 7. 추가 최적화

### 7.1 Analytics 연동

1. Vercel 프로젝트 → **Analytics** 탭
2. **Enable** 클릭 (무료)

### 7.2 성능 모니터링

1. Vercel 프로젝트 → **Speed Insights** 탭
2. **Enable** 클릭 (무료)

### 7.3 로그 확인

- 실시간 로그: Vercel 프로젝트 → **Deployments** → 최근 배포 클릭
- Runtime Logs: Vercel 프로젝트 → **Logs** 탭

## 8. 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 후 수정
# 수정 후 다시 푸시
```

### 도메인 연결 안 됨

- DNS 설정 재확인
- DNS 전파 대기 (최대 48시간)
- Vercel 도메인 설정에서 **Refresh** 클릭

### 환경변수 적용 안 됨

- 환경변수 저장 후 **Redeploy** 필요
- Deployments → 최근 배포 → **Redeploy** 클릭

## 9. 참고 자료

- Vercel 공식 문서: https://vercel.com/docs
- Next.js 배포 가이드: https://nextjs.org/docs/deployment
- Vercel CLI: https://vercel.com/docs/cli

## 10. 배포 후 작업

- [ ] Google Search Console에 사이트 등록
- [ ] 네이버 웹마스터도구에 사이트 등록
- [ ] Google Analytics 연동 (선택)
- [ ] 소셜 미디어에 링크 공유

---

**배포 완료!** 🎉

문제 발생 시 Vercel 대시보드의 로그를 먼저 확인하세요.
