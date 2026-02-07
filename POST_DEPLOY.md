# 배포 후 모니터링 가이드

검시AI를 Vercel에 배포한 후 필수 모니터링 및 최적화 작업입니다.

## 🎉 배포 완료! 이제 뭘 해야 하나요?

배포는 끝이 아니라 시작입니다. 안정적인 서비스 운영을 위해 다음 작업들을 진행하세요.

---

## 1️⃣ 즉시 확인 (배포 후 5분 이내)

### ✅ 배포 성공 확인

- [ ] **배포 URL 접속**
  - Vercel이 제공한 URL (예: `https://gumsi-ai.vercel.app`)
  - 커스텀 도메인 (예: `https://gumsi.muin.company`)
  - 두 URL 모두 정상 작동하는지 확인

- [ ] **주요 페이지 점검**
  - 홈페이지 로딩
  - 베타 신청 폼 동작
  - 404 페이지 확인

- [ ] **콘솔 에러 확인**
  - 브라우저 개발자 도구 (F12)
  - Console 탭에서 에러 메시지 확인
  - Network 탭에서 404/500 에러 확인

### 🌍 도메인 및 SSL 확인

- [ ] **HTTPS 작동**
  ```bash
  curl -I https://gumsi.muin.company
  ```
  - HTTP → HTTPS 자동 리다이렉트 확인
  - SSL 인증서 유효성 확인 (자물쇠 아이콘)

- [ ] **DNS 전파 확인**
  ```bash
  dig gumsi.muin.company
  nslookup gumsi.muin.company
  ```
  - 또는 https://dnschecker.org 사용
  - 전 세계 DNS 서버에서 정상 응답하는지 확인

### 📱 다양한 환경에서 테스트

- [ ] **데스크톱**: Chrome, Safari, Firefox
- [ ] **모바일**: iOS Safari, Android Chrome
- [ ] **태블릿**: iPad, Android 태블릿

---

## 2️⃣ 성능 측정 (배포 후 1시간 이내)

### 📊 Lighthouse 점수 확인

Chrome DevTools → Lighthouse 탭에서 실행:

```bash
# CLI로 실행 (선택)
npm install -g lighthouse
lighthouse https://gumsi.muin.company --view
```

**목표 점수:**
- Performance: 90+ (모바일 80+)
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### ⚡ Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

확인 방법:
- Chrome DevTools → Performance 탭
- PageSpeed Insights: https://pagespeed.web.dev/
- Vercel Analytics (활성화 후)

### 🐌 느린 로딩 발견 시

1. **이미지 최적화**
   - WebP 포맷 사용
   - 적절한 사이즈로 리사이즈
   - Lazy loading 적용

2. **JavaScript 번들 최적화**
   ```bash
   npm run build
   # .next 폴더의 번들 사이즈 확인
   ```

3. **폰트 최적화**
   - 사용하지 않는 폰트 제거
   - `font-display: swap` 설정

---

## 3️⃣ Vercel Analytics 활성화

### 설정 방법

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - `gumsi-ai` 프로젝트 클릭

3. **Analytics 탭**
   - 왼쪽 메뉴 → **Analytics**
   - **Enable Analytics** 클릭

4. **Web Vitals 확인**
   - 실시간 성능 지표 확인
   - 페이지별 성능 비교

### Analytics에서 확인할 지표

- **Pageviews**: 방문자 수
- **Top Pages**: 인기 페이지
- **Top Referrers**: 유입 경로
- **Real User Monitoring (RUM)**: 실제 사용자 성능 지표

---

## 4️⃣ Vercel Speed Insights (선택)

더 상세한 성능 분석이 필요하다면:

1. Vercel 대시보드 → **Speed Insights** 탭
2. **Enable** 클릭
3. 실시간 Core Web Vitals 추적

**유용한 기능:**
- 페이지별 성능 비교
- 디바이스별 성능 분석 (Desktop vs Mobile)
- 지역별 로딩 속도

---

## 5️⃣ 에러 로깅 설정

### Vercel Runtime Logs

**실시간 로그 확인:**
1. Vercel 대시보드 → 프로젝트 선택
2. **Logs** 탭 클릭
3. 실시간으로 서버 에러 확인

**필터링:**
- Error만 보기
- 특정 시간대 로그 검색
- 특정 경로 필터링

### Sentry 연동 (선택, 향후 고려)

프로덕션에서 발생하는 에러를 자동으로 추적하려면:

1. **Sentry 가입**
   - https://sentry.io

2. **Next.js 연동**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **환경변수 설정**
   ```bash
   SENTRY_AUTH_TOKEN=your-token
   SENTRY_PROJECT=gumsi-ai
   SENTRY_ORG=your-org
   ```

4. **Vercel에 환경변수 추가**

**Sentry에서 확인할 사항:**
- JavaScript 에러
- API 에러
- 에러 발생 빈도
- 영향받은 사용자 수
- 스택 트레이스

---

## 6️⃣ SEO 및 메타태그 검증

### Open Graph 디버거

**Facebook/Meta:**
- https://developers.facebook.com/tools/debug/
- URL 입력: `https://gumsi.muin.company`
- **Scrape Again** 클릭 (캐시 갱신)

**확인 사항:**
- `og:title`: "검시AI - AI 검정고시 튜터"
- `og:description`: 검시AI 소개
- `og:image`: 썸네일 이미지 (1200x630 권장)
- `og:url`: 올바른 URL

### Twitter Card Validator

- https://cards-dev.twitter.com/validator
- URL 입력 후 확인
- `twitter:card`: summary_large_image
- `twitter:title`, `twitter:description` 확인

### LinkedIn Post Inspector

- https://www.linkedin.com/post-inspector/
- URL 입력 후 미리보기 확인

---

## 7️⃣ Search Console 등록

### Google Search Console

1. **사이트 등록**
   - https://search.google.com/search-console
   - **속성 추가** → `https://gumsi.muin.company`

2. **소유권 확인**
   - DNS TXT 레코드 추가
   - 또는 HTML 파일 업로드
   - Vercel에서는 DNS 레코드 권장

3. **sitemap.xml 제출**
   ```
   https://gumsi.muin.company/sitemap.xml
   ```

4. **URL 검사**
   - 주요 페이지 크롤링 요청
   - 색인 생성 요청

### 네이버 웹마스터도구

1. **사이트 등록**
   - https://searchadvisor.naver.com/
   - **사이트 추가** → `https://gumsi.muin.company`

2. **소유권 확인**
   - HTML 태그 방식 권장

3. **사이트맵 제출**

---

## 8️⃣ Google Analytics 연동 (선택)

더 상세한 사용자 분석이 필요하다면:

1. **GA4 생성**
   - https://analytics.google.com/
   - **관리** → **속성 만들기**

2. **측정 ID 확인**
   - 형식: `G-XXXXXXXXXX`

3. **Next.js에 추가**
   
   `app/layout.tsx` 또는 `_document.tsx`에 추가:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
     strategy="afterInteractive"
   />
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     `}
   </Script>
   ```

4. **환경변수로 관리** (권장)
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

---

## 9️⃣ 모니터링 체크리스트 (일일/주간)

### 매일 확인 (3분)

- [ ] **사이트 정상 작동**
  - 홈페이지 접속 확인
  - 주요 기능 동작 확인

- [ ] **Vercel Logs 확인**
  - 에러 발생 여부
  - 비정상적인 트래픽

- [ ] **Analytics 간단 확인**
  - 방문자 수
  - 페이지뷰

### 주 1회 확인 (30분)

- [ ] **성능 지표**
  - Lighthouse 점수
  - Core Web Vitals
  - 로딩 속도

- [ ] **SEO 순위**
  - Google Search Console
  - 주요 키워드 순위

- [ ] **사용자 피드백**
  - 베타 신청 현황
  - 문의사항

- [ ] **보안 업데이트**
  - 의존성 취약점 확인
  ```bash
  npm audit
  ```

---

## 🔟 알림 설정 (선택)

### Vercel Slack 연동

중요한 이벤트를 Slack으로 받으려면:

1. Vercel 대시보드 → **Settings** → **Integrations**
2. **Slack** 검색 및 설치
3. 알림 받을 채널 선택

**알림 종류:**
- 배포 성공/실패
- 빌드 에러
- 도메인 만료 경고

### Uptime Monitoring

사이트 다운타임을 즉시 알림 받으려면:

**무료 서비스:**
- UptimeRobot: https://uptimerobot.com/
- Pingdom: https://www.pingdom.com/ (무료 플랜)
- Better Uptime: https://betteruptime.com/

**설정:**
- URL: `https://gumsi.muin.company`
- 체크 간격: 5분
- 알림: 이메일, Slack, 텔레그램

---

## 📈 장기 목표 (1개월 후)

- [ ] **사용자 피드백 수집**
  - 베타 사용자 인터뷰
  - 개선 사항 파악

- [ ] **A/B 테스트**
  - CTA 버튼 문구 테스트
  - 랜딩페이지 레이아웃 최적화

- [ ] **SEO 개선**
  - 블로그 콘텐츠 추가
  - 백링크 확보

- [ ] **성능 최적화**
  - CDN 설정 (Vercel 자동)
  - 이미지 최적화
  - 코드 스플리팅

---

## 🚨 긴급 상황 대응

### 사이트가 다운됐어요!

1. **Vercel Status 확인**
   - https://www.vercel-status.com/

2. **Vercel Logs 확인**
   - 에러 메시지 파악

3. **롤백**
   ```bash
   # Vercel 대시보드에서
   # Deployments → 이전 배포 → "Promote to Production"
   ```

4. **핫픽스 배포**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### 에러가 계속 발생해요!

1. **Sentry 로그 확인** (연동 시)
2. **로컬에서 재현**
3. **핫픽스 작성 및 배포**
4. **사후 분석 (Postmortem) 작성**

---

## 📚 유용한 리소스

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 문서**: https://nextjs.org/docs
- **Web.dev**: https://web.dev/ (성능 최적화)
- **Can I Use**: https://caniuse.com/ (브라우저 호환성)

---

## 📝 변경 이력

- **2026-02-07**: 초기 작성 (베타 버전 기준)
- **향후 업데이트**: Supabase 연동 시 데이터베이스 모니터링 추가

---

**축하합니다! 🎉**

검시AI가 성공적으로 배포되었고, 이제 안정적으로 모니터링하고 있습니다.
