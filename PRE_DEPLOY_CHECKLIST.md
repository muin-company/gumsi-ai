# 배포 전 체크리스트

검시AI를 Vercel에 배포하기 전 반드시 확인해야 할 사항들입니다.

## ✅ 코드 품질

- [ ] **TypeScript 에러 없음**
  ```bash
  npm run build
  ```
  빌드가 성공적으로 완료되어야 합니다.

- [ ] **ESLint 경고 확인**
  ```bash
  npm run lint
  ```
  심각한 경고가 없는지 확인하세요.

- [ ] **로컬 환경에서 정상 동작**
  ```bash
  npm run dev
  ```
  모든 페이지와 기능이 정상 작동하는지 확인하세요.

---

## 📦 빌드 설정

- [ ] **package.json 확인**
  - `build` 스크립트: `next build`
  - `start` 스크립트: `next start`
  - 모든 dependencies 버전 확인

- [ ] **vercel.json 설정 확인**
  - 빌드 설정 올바른지 확인
  - 리다이렉트 규칙 확인
  - 헤더 설정 확인

- [ ] **next.config.js 확인**
  - 프로덕션 설정 확인
  - 이미지 최적화 설정
  - 환경변수 참조 확인

---

## 🔐 환경변수

### 현재 버전 (베타)

- [ ] `.env.local` 파일 존재 (선택사항)
- [ ] localStorage 기반 로직 정상 동작 확인

### 향후 Supabase 연동 시

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `ANTHROPIC_API_KEY` 설정 (서버 사이드)
- [ ] Vercel 프로젝트에 환경변수 추가 완료

**⚠️ 주의:** `.env.local` 파일은 Git에 포함되지 않습니다. Vercel 대시보드에서 직접 설정해야 합니다.

---

## 🎨 UI/UX 최종 점검

- [ ] **데스크톱 화면**
  - 1920x1080 해상도에서 레이아웃 정상
  - 1366x768 해상도에서 레이아웃 정상

- [ ] **태블릿 화면**
  - iPad (768x1024) 반응형 정상
  - 가로/세로 모드 모두 확인

- [ ] **모바일 화면**
  - iPhone SE (375x667) 레이아웃 정상
  - iPhone 14 Pro (390x844) 레이아웃 정상
  - 터치 영역 충분히 큰지 확인

- [ ] **다크모드 지원** (해당 시)
  - 색상 대비 적절한지 확인

---

## 🔍 SEO 최적화

- [ ] **메타태그 설정**
  - `<title>` 태그: "검시AI - AI 검정고시 튜터"
  - `<meta name="description">`: 검시AI 소개 (150자 이내)
  - Open Graph 태그 설정 (og:title, og:description, og:image)
  - Twitter Card 태그 설정

- [ ] **파비콘**
  - `favicon.ico` 존재 (`public/` 폴더)
  - Apple Touch Icon 존재
  - 다양한 사이즈 아이콘 준비 (16x16, 32x32, 192x192, 512x512)

- [ ] **Structured Data** (선택)
  - JSON-LD 스키마 추가 (Organization, WebSite)

- [ ] **robots.txt**
  - 크롤링 허용 설정 확인

- [ ] **sitemap.xml** (선택)
  - 주요 페이지 포함

---

## 🚀 성능 최적화

- [ ] **이미지 최적화**
  - WebP 포맷 사용
  - Next.js Image 컴포넌트 사용
  - lazy loading 적용

- [ ] **폰트 최적화**
  - 필요한 폰트만 로드
  - font-display: swap 설정

- [ ] **번들 사이즈 확인**
  ```bash
  npm run build
  ```
  `.next/` 폴더 크기 확인 (일반적으로 5MB 이하)

- [ ] **Core Web Vitals**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

---

## 🧪 기능 테스트

- [ ] **베타 신청 폼**
  - 이메일 입력 정상 동작
  - 유효성 검사 작동
  - localStorage 저장 확인
  - 중복 신청 방지 로직 확인

- [ ] **네비게이션**
  - 모든 링크 정상 작동
  - 스크롤 애니메이션 정상

- [ ] **404 페이지**
  - 존재하지 않는 URL 접속 시 404 페이지 표시

---

## 🌐 도메인 및 DNS

- [ ] **커스텀 도메인 준비**
  - `gumsi.muin.company` 사용 예정
  - 도메인 관리 페이지 접근 가능
  - DNS 설정 권한 확인

- [ ] **SSL 인증서**
  - Vercel이 자동 발급 (Let's Encrypt)
  - HTTPS 강제 리다이렉트 설정 확인

---

## 📊 분석 및 모니터링

- [ ] **Vercel Analytics 준비**
  - 배포 후 활성화 예정
  - 페이지뷰, 성능 지표 추적

- [ ] **Google Analytics** (선택)
  - GA4 태그 준비
  - 추적 코드 추가 예정

- [ ] **에러 추적** (선택)
  - Sentry 연동 준비 (향후)

---

## 🔄 Git 및 배포 설정

- [ ] **Git 상태 확인**
  ```bash
  git status
  ```
  모든 변경사항이 커밋되었는지 확인

- [ ] **GitHub 리포지토리**
  - 리포지토리 공개/비공개 설정 확인
  - README.md 업데이트

- [ ] **브랜치 전략**
  - `main` 브랜치: 프로덕션 배포
  - `develop` 브랜치: Preview 배포 (선택)

- [ ] **Vercel GitHub 연동**
  - Vercel이 리포지토리에 접근 가능한지 확인

---

## 📝 문서화

- [ ] **README.md**
  - 프로젝트 소개 명확
  - 설치 및 실행 방법 기재

- [ ] **DEPLOY.md**
  - 배포 가이드 최신화
  - 트러블슈팅 섹션 확인

- [ ] **ENV_VARIABLES.md**
  - 환경변수 설명 최신화

---

## ✨ 최종 확인

- [ ] **모든 항목 체크 완료**
- [ ] **팀원에게 리뷰 요청** (해당 시)
- [ ] **배포 시간 계획**
  - 사용자 트래픽이 적은 시간대 선택
  - 긴급 롤백 계획 수립

---

## 🚀 배포 실행

위 모든 항목을 확인했다면, 이제 배포할 준비가 되었습니다!

```bash
# 자동화 스크립트 사용
./deploy.sh preview    # Preview 배포
./deploy.sh production # 프로덕션 배포

# 또는 수동 배포
vercel           # Preview 배포
vercel --prod    # 프로덕션 배포
```

---

## 📞 문제 발생 시

배포 중 문제가 발생하면:

1. **Vercel 빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 실패한 배포 클릭
   - 에러 메시지 확인

2. **로컬 빌드 재확인**
   ```bash
   npm run build
   ```

3. **DEPLOY.md 트러블슈팅 섹션 참고**

4. **Vercel 공식 문서 확인**
   - https://vercel.com/docs

---

**체크리스트 작성일:** 2026-02-07  
**다음 업데이트:** Supabase 연동 시
