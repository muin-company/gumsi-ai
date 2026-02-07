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

## 5. 커스텀 도메인 연결 (상세 가이드)

### 5.1 Vercel에서 도메인 추가

#### 단계별 스크린샷 가이드

**Step 1: Vercel 대시보드 접속**
1. https://vercel.com/dashboard 접속
2. `gumsi-ai` 프로젝트 클릭

**Step 2: Domains 설정 페이지**
1. 상단 탭에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Domains** 클릭
3. 페이지 상단 **Add** 버튼 클릭

**Step 3: 도메인 입력**
1. 입력란에 `gumsi.muin.company` 입력
2. **Add** 버튼 클릭

**Step 4: DNS 설정 안내 확인**
Vercel이 자동으로 DNS 설정 방법을 안내합니다:
- CNAME 레코드 값 확인: `cname.vercel-dns.com`
- 또는 A 레코드 값 확인: `76.76.21.21`

---

### 5.2 DNS 설정 (도메인 관리 페이지)

#### 준비 사항

- 도메인 관리 페이지 접속 권한
- `muin.company` 도메인의 DNS 관리 권한

#### 도메인 관리 페이지 찾기

**일반적인 도메인 등록 업체:**
- **가비아**: https://dns.gabia.com/
- **후이즈**: https://whois.co.kr/
- **Cloudflare**: https://dash.cloudflare.com/
- **AWS Route53**: https://console.aws.amazon.com/route53/
- **Google Domains**: https://domains.google.com/

각 업체의 DNS 관리 페이지로 이동하세요.

---

#### 옵션 1: CNAME 레코드 (권장)

**CNAME이 권장되는 이유:**
- Vercel의 IP가 변경되어도 자동 대응
- 지리적 최적화 (사용자와 가까운 서버로 라우팅)
- DDoS 방어 등 Vercel의 인프라 기능 활용

**DNS 레코드 추가:**

| 항목 | 값 | 설명 |
|------|-----|------|
| **Type** | `CNAME` | 레코드 타입 |
| **Name** | `gumsi` | 서브도메인 (`.muin.company` 제외) |
| **Value/Target** | `cname.vercel-dns.com` | Vercel CNAME |
| **TTL** | `3600` (1시간) | 캐시 시간 (또는 Auto) |

**⚠️ 주의사항:**

1. **Name 필드**
   - ✅ 올바름: `gumsi`
   - ❌ 틀림: `gumsi.muin.company`
   - ❌ 틀림: `gumsi.muin.company.` (마침표 포함)

2. **Value 필드**
   - ✅ 올바름: `cname.vercel-dns.com`
   - ✅ 올바름: `cname.vercel-dns.com.` (마침표 있어도 OK)
   - ❌ 틀림: `https://cname.vercel-dns.com` (프로토콜 제외)

3. **기존 레코드 확인**
   - `gumsi` 이름의 기존 CNAME/A 레코드가 있으면 **삭제**
   - 충돌 시 새 레코드가 적용되지 않음

**도메인 업체별 설정 예시:**

<details>
<summary><strong>가비아 (Gabia)</strong></summary>

1. My가비아 → 도메인 관리
2. `muin.company` 선택 → **DNS 정보** 클릭
3. **레코드 추가** 클릭
4. 다음 정보 입력:
   - 타입: `CNAME`
   - 호스트: `gumsi`
   - 값/위치: `cname.vercel-dns.com`
   - TTL: `3600`
5. **확인** 클릭

</details>

<details>
<summary><strong>Cloudflare</strong></summary>

1. Cloudflare 대시보드 → `muin.company` 도메인 선택
2. **DNS** 탭 클릭
3. **Add record** 클릭
4. 다음 정보 입력:
   - Type: `CNAME`
   - Name: `gumsi`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only** (🌥️ 회색 구름)
   - TTL: Auto
5. **Save** 클릭

**⚠️ Cloudflare 주의:**
- Proxy status는 반드시 **DNS only** 선택
- Proxied (주황색 구름)로 설정하면 Vercel SSL이 작동하지 않음

</details>

<details>
<summary><strong>AWS Route53</strong></summary>

1. AWS Console → Route53
2. Hosted zones → `muin.company` 선택
3. **Create record** 클릭
4. 다음 정보 입력:
   - Record name: `gumsi`
   - Record type: `CNAME`
   - Value: `cname.vercel-dns.com`
   - TTL: `3600`
   - Routing policy: Simple routing
5. **Create records** 클릭

</details>

---

#### 옵션 2: A 레코드 (CNAME 불가능한 경우)

**A 레코드가 필요한 경우:**
- 일부 DNS 제공자가 CNAME을 지원하지 않음
- Root 도메인 (예: `muin.company`)에는 CNAME 불가 → A 레코드 필요

**DNS 레코드 추가:**

| 항목 | 값 | 설명 |
|------|-----|------|
| **Type** | `A` | 레코드 타입 |
| **Name** | `gumsi` | 서브도메인 |
| **Value/IP** | `76.76.21.21` | Vercel IPv4 주소 |
| **TTL** | `3600` | 캐시 시간 |

**⚠️ A 레코드 단점:**
- Vercel IP 변경 시 수동 업데이트 필요
- 지리적 최적화 불가능
- 가능하면 CNAME 사용 권장

---

#### 옵션 3: AAAA 레코드 (IPv6 지원)

IPv6도 지원하려면 AAAA 레코드 추가:

| 항목 | 값 |
|------|-----|
| **Type** | `AAAA` |
| **Name** | `gumsi` |
| **Value** | `2600:1f1c:eb0:c101:216a:7fc7:4c0e:857c` |

**참고:**
- A 레코드와 AAAA 레코드 동시 설정 가능
- 대부분의 사용자는 IPv4만 사용하므로 선택사항

---

### 5.3 DNS 전파 확인 (필수!)

DNS 설정 후 전파까지 시간이 필요합니다.

#### 전파 시간

- **일반적**: 10분 ~ 1시간
- **최대**: 48시간 (드물게)
- **TTL 값에 따라 다름**: TTL 3600초 = 최대 1시간

#### 터미널에서 확인

```bash
# DNS 조회
dig gumsi.muin.company

# 예상 결과 (CNAME):
# gumsi.muin.company. 3600 IN CNAME cname.vercel-dns.com.
# cname.vercel-dns.com. 60 IN A 76.76.21.21

# 또는 nslookup
nslookup gumsi.muin.company

# 예상 결과:
# Non-authoritative answer:
# Name: gumsi.muin.company
# Address: 76.76.21.21
```

#### 온라인 도구로 확인

**DNSChecker** (권장)
1. https://dnschecker.org/ 접속
2. `gumsi.muin.company` 입력
3. 레코드 타입: `A` 또는 `CNAME` 선택
4. 검색 클릭

**결과 해석:**
- ✅ 녹색 체크: 해당 지역에서 DNS 전파 완료
- ❌ 빨간 X: 아직 전파 안 됨
- 전 세계 50% 이상 녹색이면 대부분 정상

**기타 확인 도구:**
- https://www.whatsmydns.net/
- https://mxtoolbox.com/SuperTool.aspx

#### 전파가 안 될 때

1. **DNS 설정 재확인**
   - 오타, 공백, 특수문자 확인
   - CNAME 값에 `http://` 없는지 확인

2. **DNS 캐시 클리어**
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

3. **시크릿 모드에서 테스트**
   - 브라우저 캐시 영향 제거

4. **모바일 데이터로 테스트**
   - 다른 DNS 서버 사용 → 전파 확인

---

### 5.4 Vercel에서 도메인 상태 확인

#### Vercel 대시보드 확인

1. Vercel 프로젝트 → **Settings** → **Domains**
2. `gumsi.muin.company` 도메인 상태 확인

**가능한 상태:**

| 상태 | 의미 | 조치 |
|------|------|------|
| ✅ **Valid Configuration** | 정상 작동 | 없음 |
| 🟡 **Pending Verification** | DNS 전파 대기 중 | 10분~1시간 대기 |
| ❌ **Invalid Configuration** | DNS 설정 오류 | DNS 설정 재확인 |
| 🔄 **Refresh** 버튼 | 강제 재검증 | 클릭하여 즉시 확인 |

#### 도메인 강제 새로고침

DNS 설정을 변경한 후:
1. Vercel Domains 페이지
2. 도메인 옆 **•••** (점 3개) 클릭
3. **Refresh** 클릭
4. Vercel이 즉시 DNS 재확인

---

### 5.5 SSL 인증서 자동 발급

#### Let's Encrypt SSL

Vercel은 모든 도메인에 **무료 SSL 인증서**를 자동 발급합니다.

**발급 조건:**
1. DNS 설정이 올바르게 완료
2. 도메인이 Vercel 서버를 정확히 가리킴

**발급 시간:**
- 보통 5~10분
- 최대 24시간

**SSL 상태 확인:**
1. Vercel → Settings → Domains
2. 도메인 옆에 🔒 **자물쇠 아이콘** 표시 = SSL 활성화

#### HTTPS 리다이렉트

Vercel은 자동으로 HTTP → HTTPS 리다이렉트합니다.

테스트:
```bash
curl -I http://gumsi.muin.company

# 예상 결과:
# HTTP/1.1 308 Permanent Redirect
# Location: https://gumsi.muin.company/
```

브라우저 주소창에서:
- `http://gumsi.muin.company` 입력
- 자동으로 `https://gumsi.muin.company`로 이동

#### SSL 인증서 확인

**브라우저에서:**
1. `https://gumsi.muin.company` 접속
2. 주소창 왼쪽 🔒 자물쇠 아이콘 클릭
3. **인증서** 또는 **Certificate** 클릭
4. 발급 기관: Let's Encrypt
5. 유효 기간: 90일 (자동 갱신)

**SSL Labs 테스트:**
- https://www.ssllabs.com/ssltest/
- 도메인 입력 후 분석
- A+ 등급 목표

#### SSL 문제 해결

**증상: "Your connection is not private" 경고**

1. **DNS 확인**
   - DNS가 올바르게 설정되었는지 재확인

2. **Vercel 도메인 상태**
   - Valid Configuration인지 확인

3. **시간 대기**
   - SSL 발급은 최대 24시간 소요

4. **CAA 레코드 확인** (고급)
   - 일부 도메인은 CAA 레코드로 SSL 발급 제한
   - 도메인 DNS에 다음 추가:
   ```
   CAA 0 issue "letsencrypt.org"
   CAA 0 issuewild "letsencrypt.org"
   ```

---

### 5.6 도메인 연결 최종 확인

모든 설정이 완료되면 다음을 확인하세요:

- [ ] `https://gumsi.muin.company` 접속 가능
- [ ] `http://gumsi.muin.company` → `https://...` 자동 리다이렉트
- [ ] `www.gumsi.muin.company` (선택사항)
- [ ] 브라우저 주소창에 🔒 자물쇠 표시
- [ ] 모바일에서도 정상 접속
- [ ] 전 세계 DNS 전파 완료 (DNSChecker 확인)

축하합니다! 🎉 도메인 연결이 완료되었습니다.

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

## 8. 문제 해결 (트러블슈팅)

### 빌드 실패

**증상:**
- Vercel 배포 중 "Build failed" 에러
- 빌드 로그에 에러 메시지 표시

**해결 방법:**

1. **로컬에서 빌드 테스트**
   ```bash
   cd ~/muin/gumsi-ai
   npm run build
   ```
   로컬에서 빌드가 성공하면 Vercel에서도 성공해야 합니다.

2. **TypeScript 에러 확인**
   ```bash
   npm run lint
   ```
   타입 에러가 있으면 수정하세요.

3. **의존성 문제**
   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Node.js 버전 확인**
   - Vercel은 기본적으로 Node.js 18.x 사용
   - `package.json`에 엔진 명시 (선택):
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

5. **환경변수 누락**
   - 필수 환경변수가 Vercel에 설정되었는지 확인
   - Settings → Environment Variables

**일반적인 빌드 에러:**

```bash
# 에러: Module not found
→ 누락된 패키지 설치: npm install <package-name>

# 에러: Type error
→ TypeScript 타입 수정 또는 tsconfig.json 확인

# 에러: Out of memory
→ Vercel 프로젝트 설정에서 메모리 증가 (Pro 플랜)
```

---

### 도메인 연결 안 됨

**증상:**
- `gumsi.muin.company` 접속 시 "ERR_NAME_NOT_RESOLVED"
- 또는 기존 사이트가 계속 표시됨

**해결 방법:**

#### 1단계: Vercel 도메인 설정 확인

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains**
3. `gumsi.muin.company`가 추가되어 있는지 확인
4. 상태가 "Valid Configuration"인지 확인

#### 2단계: DNS 설정 재확인

**옵션 A: CNAME 레코드 (권장)**

도메인 관리 페이지에서:
```
Type: CNAME
Name: gumsi
Value: cname.vercel-dns.com
TTL: 3600 (또는 Auto)
```

**⚠️ 주의:**
- `Name`에는 서브도메인만 입력 (`gumsi`)
- `.muin.company`는 제외
- 기존 CNAME/A 레코드가 있으면 삭제하고 새로 추가

**옵션 B: A 레코드 (CNAME 불가능한 경우)**

```
Type: A
Name: gumsi
Value: 76.76.21.21
TTL: 3600
```

#### 3단계: DNS 전파 확인

DNS 변경 후 전파까지 시간 소요:
- 일반적으로: 10분~1시간
- 최대: 48시간 (드물게)

**실시간 확인:**
```bash
# 터미널에서 확인
dig gumsi.muin.company
nslookup gumsi.muin.company

# 예상 결과 (CNAME):
# gumsi.muin.company. 300 IN CNAME cname.vercel-dns.com.
```

**온라인 도구:**
- https://dnschecker.org
- URL 입력: `gumsi.muin.company`
- 전 세계 DNS 서버에서 전파 상태 확인

#### 4단계: Vercel에서 강제 새로고침

1. Vercel 대시보드 → Settings → Domains
2. `gumsi.muin.company` 옆 **•••** 클릭
3. **Refresh** 클릭

#### 5단계: 캐시 클리어

브라우저 캐시가 문제일 수 있습니다:
- Chrome: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
- 시크릿 모드에서 테스트

**여전히 안 된다면:**

1. **DNS 설정 스크린샷 확인**
   - 정확히 입력했는지 재확인
   - 오타, 공백 확인

2. **도메인 관리자에게 문의**
   - 일부 DNS 제공자는 CNAME에 제약이 있음
   - DNSSEC 활성화 여부 확인

3. **Vercel 지원팀 문의**
   - https://vercel.com/support
   - DNS 설정 스크린샷 첨부

---

### 환경변수 적용 안 됨

**증상:**
- 코드에서 `process.env.NEXT_PUBLIC_*` 값이 `undefined`
- API 연동 실패

**해결 방법:**

1. **Vercel에 환경변수 추가 확인**
   - Settings → Environment Variables
   - 변수명 정확한지 확인 (대소문자 구분)
   - 올바른 환경 선택 (Production/Preview/Development)

2. **재배포 필요**
   환경변수는 빌드 타임에 적용됩니다.
   - Deployments → 최근 배포 → **Redeploy** 클릭
   - 또는 Git에 더미 커밋 후 푸시:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

3. **환경변수 이름 규칙**
   - 클라이언트 사이드: `NEXT_PUBLIC_*` prefix 필수
   - 서버 사이드: prefix 없이 사용 가능
   
   ```javascript
   // ✅ 올바른 사용
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   
   // ❌ 클라이언트에서 접근 불가
   const secret = process.env.SECRET_KEY; // undefined
   ```

4. **로컬과 다른 값 사용**
   - 로컬: `.env.local`
   - Vercel: 대시보드에서 설정
   - 두 환경의 값이 다를 수 있음을 인지

---

### CORS 에러 (API 연동 시)

**증상:**
- 브라우저 콘솔에 "CORS policy" 에러
- API 호출 실패

**해결 방법:**

1. **next.config.js에 헤더 추가**
   ```javascript
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: '*' },
             { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
           ],
         },
       ];
     },
   };
   ```

2. **API 라우트에서 처리**
   ```typescript
   // app/api/route.ts
   export async function GET(request: Request) {
     return new Response(JSON.stringify(data), {
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type': 'application/json',
       },
     });
   }
   ```

---

### 404 에러 (페이지 라우팅 실패)

**증상:**
- 특정 URL 접속 시 404 페이지 표시
- 로컬에서는 정상 작동

**해결 방법:**

1. **파일 경로 확인**
   - Next.js App Router: `app/about/page.tsx`
   - Pages Router: `pages/about.tsx`
   - 파일명 대소문자 확인 (Linux는 대소문자 구분)

2. **동적 라우트 확인**
   ```
   app/[slug]/page.tsx → /anything
   app/posts/[id]/page.tsx → /posts/123
   ```

3. **vercel.json 리다이렉트 확인**
   - 잘못된 리다이렉트 규칙이 있는지 확인

---

### 이미지 로딩 실패

**증상:**
- 이미지가 깨지거나 표시되지 않음
- Next.js Image 컴포넌트 에러

**해결 방법:**

1. **이미지 경로 확인**
   ```tsx
   // ✅ public 폴더의 이미지
   <Image src="/logo.png" alt="Logo" width={100} height={100} />
   
   // ❌ 잘못된 경로
   <Image src="public/logo.png" alt="Logo" />
   ```

2. **외부 이미지 허용**
   `next.config.js`:
   ```javascript
   module.exports = {
     images: {
       domains: ['example.com', 'cdn.example.com'],
     },
   };
   ```

3. **이미지 사이즈 명시**
   ```tsx
   // width, height 필수 (static import 제외)
   <Image src="/hero.jpg" alt="Hero" width={1200} height={630} />
   ```

---

### 빌드는 성공하지만 사이트가 느림

**해결 방법:**

1. **Lighthouse로 성능 측정**
   ```bash
   npm install -g lighthouse
   lighthouse https://gumsi.muin.company --view
   ```

2. **이미지 최적화**
   - Next.js `<Image>` 컴포넌트 사용
   - WebP 포맷 활용
   - Lazy loading 적용

3. **JavaScript 번들 분석**
   ```bash
   npm run build
   # .next/analyze 확인 (플러그인 설치 필요)
   ```

4. **폰트 최적화**
   - Google Fonts는 `next/font` 사용
   - Preload 적용

---

### Vercel 배포 시간 초과 (Timeout)

**증상:**
- 빌드 시간이 10분 초과 (Hobby 플랜 제한)
- "Build exceeded maximum time" 에러

**해결 방법:**

1. **불필요한 빌드 단계 제거**
   - 무거운 패키지 제거
   - 빌드 시 불필요한 작업 최소화

2. **캐싱 활용**
   - Vercel은 자동으로 `node_modules` 캐싱
   - `.next/cache` 활용

3. **Pro 플랜 고려**
   - 빌드 시간 제한 45분
   - 더 많은 리소스 할당

---

### SSL 인증서 발급 실패

**증상:**
- "Invalid SSL Certificate" 경고
- HTTPS 접속 불가

**해결 방법:**

1. **DNS 설정 재확인**
   - SSL 발급은 DNS가 올바르게 설정된 후 가능

2. **Vercel에서 재시도**
   - Settings → Domains → **Refresh**

3. **CAA 레코드 확인**
   - 도메인에 CAA 레코드가 있으면 Let's Encrypt 허용 필요
   ```
   CAA 0 issue "letsencrypt.org"
   ```

4. **대기 시간**
   - SSL 발급은 최대 24시간 소요 가능

---

### Git 리포지토리 연동 실패

**증상:**
- Vercel이 GitHub 리포지토리를 찾지 못함

**해결 방법:**

1. **GitHub 권한 확인**
   - Vercel에 리포지토리 접근 권한 부여
   - GitHub Settings → Applications → Vercel

2. **리포지토리 공개 여부**
   - Private 리포지토리는 권한 설정 필요

3. **Vercel Git Integration 재설치**
   - Vercel 대시보드 → Settings → Git
   - GitHub 연동 재설정

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
