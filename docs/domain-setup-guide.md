# gumsi.ai 커스텀 도메인 설정 가이드

**작성일:** 2026-02-10  
**작성자:** MJ (COO Agent)  
**목적:** gumsi-ai.vercel.app → gumsi.ai 도메인 전환

---

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [DNS 설정 (whois.co.kr)](#dns-설정-whoiscokr)
4. [Vercel 도메인 추가](#vercel-도메인-추가)
5. [SSL 인증서 설정](#ssl-인증서-설정)
6. [DNS Propagation 확인](#dns-propagation-확인)
7. [보안 설정](#보안-설정)
8. [최종 테스트](#최종-테스트)
9. [트러블슈팅](#트러블슈팅)
10. [롤백 계획](#롤백-계획)
11. [실행 체크리스트](#실행-체크리스트)

---

## 개요

### 현재 상태
- **운영 중인 도메인:** gumsi-ai.vercel.app
- **목표 도메인:** gumsi.ai (whois.co.kr에서 구매 완료)
- **호스팅:** Vercel
- **프로젝트:** gumsi-ai

### 작업 목표
1. gumsi.ai를 gumsi-ai.vercel.app에 연결
2. www.gumsi.ai → gumsi.ai 자동 리다이렉트
3. HTTPS 자동 적용 (Let's Encrypt)
4. DNS 전파 후 정상 작동 확인

### 예상 소요 시간
- DNS 설정: 10분
- Vercel 설정: 5분
- DNS Propagation: 최대 48시간 (보통 1-2시간)
- 총 작업 시간: 약 15분 (대기 시간 제외)

---

## 사전 준비

### 필요한 접근 권한
- [ ] whois.co.kr 계정 로그인 정보
- [ ] Vercel 대시보드 접근 권한 (gumsi-ai 프로젝트)
- [ ] DNS 변경 권한

### 필요한 정보 수집

#### 1. Vercel의 DNS 레코드 정보
Vercel이 제공하는 표준 IP 주소:
```
76.76.21.21
```

또는 CNAME 방식:
```
cname.vercel-dns.com
```

#### 2. 현재 DNS 설정 확인
```bash
# 현재 gumsi.ai의 DNS 상태 확인
dig gumsi.ai
whois gumsi.ai
```

#### 3. TTL 값 확인
- 변경 전 TTL을 300초(5분)로 낮춰서 문제 발생 시 빠른 롤백 가능

### ⚠️ 중요 주의사항
1. **다운타임 최소화:** DNS 변경은 전파 시간이 필요하므로 사용자가 적은 시간대에 진행
2. **백업:** 현재 DNS 설정을 스크린샷 또는 텍스트로 저장
3. **테스트 환경:** 가능하면 로컬 hosts 파일로 먼저 테스트
4. **롤백 준비:** 문제 발생 시 즉시 원복할 수 있도록 이전 설정 보관

---

## DNS 설정 (whois.co.kr)

### Step 1: whois.co.kr 로그인

1. https://whois.co.kr 접속
2. 로그인
3. 상단 메뉴 → **나의 서비스** → **도메인 관리**
4. gumsi.ai 도메인 선택

### Step 2: DNS 관리 진입

1. gumsi.ai 옆 **관리** 버튼 클릭
2. **DNS 설정** 또는 **네임서버 설정** 메뉴 선택
3. DNS 레코드 관리 화면 진입

### Step 3: TTL 값 먼저 낮추기 (선택적, 권장)

롤백을 빠르게 하기 위해:
```
기존 TTL: 3600 (1시간) 또는 86400 (24시간)
→ 변경: 300 (5분)
```

1. 기존 레코드의 TTL을 300으로 변경
2. 저장 후 1시간 대기 (기존 TTL이 만료될 때까지)
3. 이후 실제 DNS 변경 진행

### Step 4: A 레코드 추가

#### 방법 1: A 레코드 (권장)

```
호스트명: @
레코드 타입: A
값: 76.76.21.21
TTL: 300 (초기) → 나중에 3600으로 변경
```

**설정 예시:**
```
@ IN A 76.76.21.21
```

#### 방법 2: CNAME 레코드 (대안)

⚠️ 주의: 루트 도메인(@)에는 CNAME을 사용할 수 없는 경우가 많습니다.
```
호스트명: @
레코드 타입: CNAME
값: cname.vercel-dns.com.
TTL: 300
```

### Step 5: www 서브도메인 추가

```
호스트명: www
레코드 타입: CNAME
값: cname.vercel-dns.com.
TTL: 300
```

**설정 예시:**
```
www IN CNAME cname.vercel-dns.com.
```

### Step 6: 기존 레코드 확인

다음 레코드들이 있다면 충돌 가능성 확인:
- 기존 A 레코드 (@)
- 기존 CNAME 레코드 (www)
- 와일드카드 레코드 (*)

**충돌 시 대응:**
1. 백업 후 삭제
2. 또는 비활성화

### Step 7: 저장 및 적용

1. 모든 설정 저장
2. whois.co.kr에서 DNS 변경사항 적용 버튼 클릭
3. 확인 메시지 확인

### 설정 후 확인 명령어

```bash
# DNS 레코드 즉시 확인 (whois.co.kr 네임서버에서)
dig @ns1.whois.co.kr gumsi.ai

# 일반 확인 (로컬 DNS 캐시 영향 받음)
dig gumsi.ai
nslookup gumsi.ai

# 특정 네임서버 직접 조회
dig @8.8.8.8 gumsi.ai
```

### whois.co.kr 특화 팁

#### 네임서버 확인
whois.co.kr의 기본 네임서버:
```
ns1.whois.co.kr
ns2.whois.co.kr
```

현재 gumsi.ai가 위 네임서버를 사용하는지 확인:
```bash
dig NS gumsi.ai
```

#### 대안: Vercel 네임서버 사용

더 빠른 전파를 원한다면 Vercel 네임서버로 변경 가능:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**변경 방법:**
1. whois.co.kr → gumsi.ai 관리
2. 네임서버 변경 메뉴
3. Vercel 네임서버 입력
4. Vercel 대시보드에서 DNS 레코드 직접 관리

**장점:**
- Vercel이 모든 DNS를 관리하므로 전파 빠름
- Vercel 대시보드에서 통합 관리

**단점:**
- whois.co.kr DNS 관리 패널 사용 불가
- 이메일 등 다른 서비스 설정 시 Vercel에서 해야 함

---

## Vercel 도메인 추가

### Step 1: Vercel 대시보드 접속

1. https://vercel.com 로그인
2. **Projects** → **gumsi-ai** 선택
3. **Settings** → **Domains** 메뉴

### Step 2: 도메인 추가

1. **Add** 또는 **Add Domain** 버튼 클릭
2. 입력: `gumsi.ai`
3. **Add** 클릭

### Step 3: DNS 설정 확인

Vercel이 자동으로 DNS 설정을 확인합니다:
- ✅ Valid Configuration: DNS가 올바르게 설정됨
- ⚠️ Invalid Configuration: DNS 레코드 확인 필요
- 🔄 Pending: DNS 전파 대기 중

### Step 4: www 서브도메인 추가

1. 다시 **Add Domain** 클릭
2. 입력: `www.gumsi.ai`
3. **Add** 클릭

### Step 5: 리다이렉트 설정

**www → apex 리다이렉트:**
1. www.gumsi.ai 옆 **Edit** 클릭
2. **Redirect to** 선택
3. Target: `gumsi.ai`
4. Permanent (301) 선택
5. **Save**

**또는 apex → www:**
- 선호도에 따라 반대로 설정 가능
- SEO 관점에서는 하나로 통일 중요

### Step 6: Git Branch 연결 (선택)

특정 브랜치를 도메인에 연결:
```
gumsi.ai → main 브랜치 (프로덕션)
staging.gumsi.ai → staging 브랜치 (선택)
```

### Vercel CLI를 통한 설정 (대안)

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서
cd ~/muin-company/gumsi-ai

# 도메인 추가
vercel domains add gumsi.ai
vercel domains add www.gumsi.ai

# 도메인 목록 확인
vercel domains ls

# 특정 도메인 상태 확인
vercel domains inspect gumsi.ai
```

### 설정 확인

```bash
# Vercel에서 제공하는 정보 확인
curl -I https://gumsi.ai
# 응답 헤더에서 x-vercel-id 확인 → Vercel을 통하고 있음을 의미
```

---

## SSL 인증서 설정

### 자동 SSL (Let's Encrypt)

Vercel은 도메인이 연결되면 자동으로 SSL 인증서를 발급합니다.

#### 발급 조건
1. DNS가 올바르게 Vercel을 가리킴
2. 도메인이 Vercel 대시보드에 추가됨
3. DNS 전파 완료 (일반적으로 5-10분)

#### 확인 방법

**Vercel 대시보드:**
1. Domains 페이지에서 gumsi.ai 확인
2. 상태가 **Valid Configuration**이면 SSL 자동 발급 시작
3. 🔒 아이콘 또는 **Certificate Issued** 표시 확인

**커맨드라인:**
```bash
# SSL 인증서 확인
echo | openssl s_client -servername gumsi.ai -connect gumsi.ai:443 2>/dev/null | openssl x509 -noout -issuer -dates

# Let's Encrypt인지 확인
echo | openssl s_client -servername gumsi.ai -connect gumsi.ai:443 2>/dev/null | openssl x509 -noout -issuer | grep "Let's Encrypt"
```

**브라우저:**
1. https://gumsi.ai 접속
2. 주소창 자물쇠 아이콘 클릭
3. 인증서 정보 확인
   - Issued by: R10 (Let's Encrypt)
   - Valid until: 발급일로부터 90일

### SSL 발급 실패 시

#### 원인
1. DNS가 Vercel을 가리키지 않음
2. DNS 전파 미완료
3. CAA 레코드가 Let's Encrypt를 차단

#### 해결 방법

**1. DNS 재확인**
```bash
dig gumsi.ai
# ANSWER SECTION에 76.76.21.21 또는 cname.vercel-dns.com이 있는지 확인
```

**2. Vercel 대시보드에서 강제 재시도**
- Domains → gumsi.ai → Refresh
- 또는 도메인 삭제 후 재추가

**3. CAA 레코드 확인**
```bash
dig CAA gumsi.ai
```

CAA 레코드가 있다면 Let's Encrypt 허용 추가:
```
@ IN CAA 0 issue "letsencrypt.org"
```

### 인증서 갱신

- Let's Encrypt 인증서는 90일 유효
- Vercel이 자동으로 30일 전 갱신
- 수동 작업 불필요

### 강제 HTTPS 리다이렉트

Vercel은 기본적으로 HTTP → HTTPS 리다이렉트 적용.

확인:
```bash
curl -I http://gumsi.ai
# Location: https://gumsi.ai 응답 확인
```

추가 설정 (vercel.json):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

---

## DNS Propagation 확인

### 개요

DNS 변경 후 전 세계에 전파되는 시간:
- **이론:** 최대 48시간
- **실제:** 대부분 1-2시간
- **whois.co.kr 네임서버:** 보통 10-30분

### 확인 도구

#### 1. 온라인 도구

**WhatsMyDNS (추천):**
```
https://www.whatsmydns.net/#A/gumsi.ai
```
- 전 세계 여러 위치에서 DNS 확인
- A, CNAME, NS 등 다양한 레코드 확인

**DNS Checker:**
```
https://dnschecker.org/
```

**Google DNS Propagation:**
```
https://dns.google/query?name=gumsi.ai&type=A
```

#### 2. 커맨드라인

**다양한 DNS 서버로 확인:**
```bash
# Google DNS
dig @8.8.8.8 gumsi.ai

# Cloudflare DNS
dig @1.1.1.1 gumsi.ai

# whois.co.kr DNS (직접 확인)
dig @ns1.whois.co.kr gumsi.ai

# 로컬 DNS
dig gumsi.ai
```

**A 레코드 확인:**
```bash
nslookup gumsi.ai
nslookup gumsi.ai 8.8.8.8
```

**CNAME 확인:**
```bash
dig www.gumsi.ai CNAME
```

#### 3. 전파 상태 모니터링 스크립트

```bash
#!/bin/bash
# dns-check.sh

DOMAIN="gumsi.ai"
EXPECTED_IP="76.76.21.21"

echo "Checking DNS propagation for $DOMAIN"
echo "Expected IP: $EXPECTED_IP"
echo ""

DNS_SERVERS=(
    "8.8.8.8:Google"
    "1.1.1.1:Cloudflare"
    "208.67.222.222:OpenDNS"
    "ns1.whois.co.kr:whois.co.kr"
)

for server in "${DNS_SERVERS[@]}"; do
    IFS=':' read -r ip name <<< "$server"
    result=$(dig @$ip +short $DOMAIN | head -n1)
    
    if [ "$result" = "$EXPECTED_IP" ]; then
        echo "✅ $name ($ip): $result"
    else
        echo "❌ $name ($ip): $result (expected $EXPECTED_IP)"
    fi
done
```

사용법:
```bash
chmod +x dns-check.sh
./dns-check.sh
```

### 로컬 DNS 캐시 클리어

전파는 완료됐는데 로컬에서 안 보인다면:

**macOS:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
# 또는
sudo service nscd restart
```

**Windows:**
```cmd
ipconfig /flushdns
```

**브라우저 캐시:**
- Chrome: 개발자도구 → Network 탭 → Disable cache
- Firefox: about:config → network.dnsCacheExpiration → 0

### /etc/hosts로 미리 테스트

DNS 전파 전에 로컬에서 미리 테스트:

```bash
sudo nano /etc/hosts
```

추가:
```
76.76.21.21 gumsi.ai
76.76.21.21 www.gumsi.ai
```

저장 후:
```bash
ping gumsi.ai
curl -I https://gumsi.ai
```

⚠️ 테스트 후 반드시 제거!

---

## 보안 설정

### 1. HSTS (HTTP Strict Transport Security)

#### Vercel 설정

`vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

설명:
- `max-age=63072000`: 2년 (초 단위)
- `includeSubDomains`: 모든 서브도메인에도 적용
- `preload`: HSTS Preload List 등록 가능

#### HSTS Preload 등록

1. https://hstspreload.org/ 접속
2. gumsi.ai 입력 후 조건 확인
3. 조건 만족 시 Submit
4. 다음 Chrome 업데이트에 포함됨

⚠️ 주의: Preload는 제거가 매우 어려움. 신중히 결정.

### 2. CAA (Certification Authority Authorization) 레코드

#### 목적
어떤 CA(인증 기관)가 이 도메인의 SSL 인증서를 발급할 수 있는지 명시.

#### whois.co.kr DNS 설정

```
호스트명: @
레코드 타입: CAA
Flag: 0
Tag: issue
Value: letsencrypt.org
```

추가 (선택):
```
@ IN CAA 0 issuewild "letsencrypt.org"
@ IN CAA 0 iodef "mailto:admin@gumsi.ai"
```

설명:
- `issue`: 일반 인증서 발급 허용
- `issuewild`: 와일드카드 인증서 발급 허용
- `iodef`: 무단 발급 시도 시 알림 받을 이메일

#### 확인

```bash
dig CAA gumsi.ai
```

### 3. DNSSEC (선택)

#### 개요
DNS 응답의 진위를 암호학적으로 검증.

#### 설정 (whois.co.kr 지원 시)

1. whois.co.kr → gumsi.ai 관리
2. DNSSEC 설정 메뉴
3. DNSSEC 활성화
4. DS 레코드 자동 생성됨

#### 확인

```bash
dig +dnssec gumsi.ai
# RRSIG 레코드가 있으면 DNSSEC 활성화됨
```

⚠️ 주의: DNSSEC 설정 오류 시 도메인 전체가 접속 불가할 수 있음.

### 4. Security Headers

추가 보안 헤더 (`vercel.json`):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### 5. 보안 검증 도구

**Security Headers:**
```
https://securityheaders.com/?q=gumsi.ai
```

**SSL Labs:**
```
https://www.ssllabs.com/ssltest/analyze.html?d=gumsi.ai
```

**Mozilla Observatory:**
```
https://observatory.mozilla.org/analyze/gumsi.ai
```

---

## 최종 테스트

### Pre-Launch 체크리스트

#### DNS 테스트
```bash
# 1. A 레코드
dig gumsi.ai +short
# 예상: 76.76.21.21

# 2. www CNAME
dig www.gumsi.ai +short
# 예상: cname.vercel-dns.com.

# 3. 네임서버
dig NS gumsi.ai +short
# 예상: ns1.whois.co.kr, ns2.whois.co.kr

# 4. 전 세계 전파 확인
curl -s https://www.whatsmydns.net/api/details?server=google&type=A&query=gumsi.ai | jq
```

#### HTTP/HTTPS 테스트
```bash
# 1. HTTP → HTTPS 리다이렉트
curl -I http://gumsi.ai
# 예상: 301/302 → https://gumsi.ai

# 2. HTTPS 접속
curl -I https://gumsi.ai
# 예상: 200 OK

# 3. www → apex 리다이렉트
curl -I https://www.gumsi.ai
# 예상: 301 → https://gumsi.ai

# 4. SSL 인증서
echo | openssl s_client -servername gumsi.ai -connect gumsi.ai:443 2>/dev/null | openssl x509 -noout -dates
# 예상: notAfter가 미래 날짜
```

#### Vercel 연결 확인
```bash
# Vercel 헤더 확인
curl -I https://gumsi.ai | grep -i vercel
# 예상: x-vercel-id: ...
```

#### 페이지 로드 테스트
```bash
# 응답 시간 측정
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://gumsi.ai

# 페이지 내용 확인
curl -s https://gumsi.ai | head -n 20
```

### 브라우저 테스트

#### Chrome DevTools
1. F12 → Network 탭
2. Disable cache 체크
3. https://gumsi.ai 접속
4. 확인 사항:
   - Status: 200
   - Type: document
   - Size: 정상 로드
   - Time: 2초 이내

#### 보안 확인
1. 주소창 자물쇠 아이콘 클릭
2. 인증서 정보:
   - Issued by: R10 (Let's Encrypt)
   - Valid until: (미래 날짜)
3. F12 → Console 탭:
   - Mixed content 경고 없음
   - Security errors 없음

#### 다양한 기기/브라우저
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

#### 시크릿 모드
캐시 없이 깨끗한 상태 테스트:
```
Chrome: Ctrl+Shift+N (Mac: Cmd+Shift+N)
```

### 성능 테스트

**PageSpeed Insights:**
```
https://pagespeed.web.dev/analysis?url=https://gumsi.ai
```

**WebPageTest:**
```
https://www.webpagetest.org/
```

**Lighthouse (Chrome DevTools):**
1. F12 → Lighthouse 탭
2. Generate report
3. 확인:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

### SEO 확인

```bash
# robots.txt
curl -s https://gumsi.ai/robots.txt

# sitemap
curl -s https://gumsi.ai/sitemap.xml

# meta tags
curl -s https://gumsi.ai | grep -i '<meta'
```

---

## 트러블슈팅

### 문제 1: DNS 변경 후에도 접속 안 됨

#### 증상
```bash
dig gumsi.ai
# ANSWER SECTION이 비어있음
```

#### 원인
- DNS 레코드 오타
- TTL이 아직 만료 안 됨
- 네임서버 변경 미적용

#### 해결
1. whois.co.kr에서 DNS 레코드 재확인
2. 네임서버 확인:
   ```bash
   dig NS gumsi.ai
   ```
3. 네임서버가 whois.co.kr이 아니면 변경
4. 1시간 대기 후 재확인

---

### 문제 2: Vercel에서 "Invalid Configuration"

#### 증상
Vercel Domains 페이지에서 ⚠️ 경고.

#### 원인
- DNS가 Vercel을 가리키지 않음
- DNS 전파 미완료

#### 해결
1. DNS 레코드 재확인:
   ```bash
   dig gumsi.ai
   # 76.76.21.21 또는 cname.vercel-dns.com이 나와야 함
   ```
2. 틀렸다면 whois.co.kr에서 수정
3. 맞다면 1시간 대기 후 Vercel에서 Refresh

---

### 문제 3: SSL 인증서 발급 안 됨

#### 증상
```bash
curl https://gumsi.ai
# SSL certificate problem
```

#### 원인
- DNS가 Vercel을 가리키지 않음
- CAA 레코드가 Let's Encrypt 차단

#### 해결
1. DNS 확인:
   ```bash
   dig gumsi.ai +short
   ```
2. CAA 레코드 확인:
   ```bash
   dig CAA gumsi.ai
   ```
3. CAA가 있고 Let's Encrypt가 없다면 추가:
   ```
   @ IN CAA 0 issue "letsencrypt.org"
   ```
4. Vercel 대시보드에서 도메인 Refresh

---

### 문제 4: www.gumsi.ai가 작동 안 함

#### 증상
https://gumsi.ai는 되는데 https://www.gumsi.ai는 안 됨.

#### 원인
- www CNAME 레코드 누락
- Vercel에 www 도메인 미추가

#### 해결
1. DNS 확인:
   ```bash
   dig www.gumsi.ai CNAME
   # cname.vercel-dns.com이 나와야 함
   ```
2. 없다면 whois.co.kr에서 추가
3. Vercel 대시보드 → Domains → www.gumsi.ai 추가

---

### 문제 5: 일부 지역에서 접속 안 됨

#### 증상
한국에서는 되는데 해외에서 안 됨 (또는 반대).

#### 원인
- DNS 전파 미완료
- 특정 DNS 서버에만 캐시됨

#### 해결
1. 전 세계 DNS 전파 확인:
   ```
   https://www.whatsmydns.net/#A/gumsi.ai
   ```
2. 빨간색(실패) 지역이 있다면 대기
3. 24시간 후에도 실패하면 whois.co.kr 고객센터 문의

---

### 문제 6: HTTP는 되는데 HTTPS는 안 됨

#### 증상
```bash
curl http://gumsi.ai  # OK
curl https://gumsi.ai # Failed
```

#### 원인
- SSL 인증서 미발급
- 방화벽이 443 포트 차단

#### 해결
1. Vercel Domains에서 SSL 상태 확인
2. "Certificate Pending"이면 대기
3. 24시간 후에도 안 되면 Vercel 도메인 삭제 후 재추가

---

### 문제 7: Mixed Content 경고

#### 증상
브라우저 콘솔에 "Mixed Content" 경고.

#### 원인
HTTPS 페이지 내 HTTP 리소스 로드.

#### 해결
1. F12 → Console에서 어떤 리소스가 HTTP인지 확인
2. 해당 리소스 URL을 HTTPS로 변경
3. 또는 `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`

---

### 문제 8: Vercel 도메인은 되는데 커스텀 도메인은 404

#### 증상
```bash
curl https://gumsi-ai.vercel.app  # 200 OK
curl https://gumsi.ai              # 404 Not Found
```

#### 원인
- Vercel에서 도메인이 프로젝트에 연결 안 됨
- Git 브랜치 설정 오류

#### 해결
1. Vercel 대시보드 → Domains 확인
2. gumsi.ai가 목록에 있는지 확인
3. 있다면 Git Branch가 올바른지 확인 (main)
4. 없다면 도메인 추가

---

### 문제 9: 특정 페이지만 404

#### 증상
```bash
curl https://gumsi.ai      # 200 OK
curl https://gumsi.ai/about # 404 Not Found
```

#### 원인
- Next.js 라우팅 설정 오류
- Static export 설정 문제

#### 해결
1. 로컬에서 확인:
   ```bash
   npm run build
   npm run start
   curl http://localhost:3000/about
   ```
2. 로컬에서 되면 Git push → Vercel 자동 배포
3. 안 되면 Next.js 라우팅 코드 확인

---

### 디버깅 명령어 모음

```bash
# DNS 종합 확인
dig gumsi.ai ANY

# Trace DNS 쿼리
dig +trace gumsi.ai

# TCP 연결 테스트
nc -zv gumsi.ai 80
nc -zv gumsi.ai 443

# HTTP 헤더 상세 출력
curl -v https://gumsi.ai

# SSL Handshake 상세
openssl s_client -connect gumsi.ai:443 -servername gumsi.ai

# DNS 캐시 확인 (macOS)
dscacheutil -q host -a name gumsi.ai

# MTR (네트워크 경로 추적)
mtr gumsi.ai
```

---

## 롤백 계획

### 언제 롤백하는가?

다음 상황에서 즉시 롤백:
- [ ] SSL 인증서 발급 24시간 이상 실패
- [ ] 사용자 접속 불가 리포트
- [ ] 심각한 보안 문제 발견
- [ ] DNS 설정 오류로 다른 서비스 영향

### 롤백 절차

#### 1단계: Vercel에서 커스텀 도메인 제거

```bash
# Vercel CLI
vercel domains rm gumsi.ai
vercel domains rm www.gumsi.ai
```

또는 대시보드:
1. Vercel → gumsi-ai → Domains
2. gumsi.ai 옆 ... 메뉴 → Remove
3. www.gumsi.ai도 동일

#### 2단계: DNS 원복 (필요 시)

whois.co.kr에서:
1. 추가한 A 레코드 삭제
2. 추가한 CNAME 레코드 삭제
3. 이전 설정이 있었다면 복원

#### 3단계: TTL 원복

```
TTL: 300 → 3600 또는 86400
```

#### 4단계: 확인

```bash
# Vercel 기본 도메인 작동 확인
curl -I https://gumsi-ai.vercel.app
# 200 OK 확인

# 커스텀 도메인 제거 확인
curl -I https://gumsi.ai
# 접속 안 됨 또는 다른 서비스 (정상)
```

### 부분 롤백

문제가 특정 부분에만 있다면:

**www만 롤백:**
- Vercel에서 www.gumsi.ai만 제거
- gumsi.ai는 유지

**apex만 롤백:**
- gumsi.ai 제거
- www.gumsi.ai는 유지 (일반적이지 않음)

### 롤백 후 재시도

1. 원인 파악 후 수정
2. TTL을 300으로 유지 (빠른 재롤백 대비)
3. 다시 DNS 설정
4. 작동 확인 후 TTL을 3600으로 증가

### Emergency Contact

롤백으로도 해결 안 될 시:
- **Vercel Support:** https://vercel.com/support
- **whois.co.kr 고객센터:** 1544-2424
- **ONE에게 즉시 보고**

---

## 실행 체크리스트

### Phase 1: 사전 준비 (15분)

#### 백업
- [ ] 현재 DNS 설정 스크린샷 저장
- [ ] 현재 Vercel Domains 설정 스크린샷 저장
- [ ] whois.co.kr 로그인 확인
- [ ] Vercel 대시보드 접근 확인

#### 정보 수집
- [ ] Vercel IP 확인: 76.76.21.21
- [ ] 현재 네임서버 확인: `dig NS gumsi.ai`
- [ ] 현재 DNS 레코드 확인: `dig gumsi.ai ANY`

---

### Phase 2: TTL 낮추기 (선택, +1시간 대기)

- [ ] whois.co.kr → gumsi.ai DNS 관리
- [ ] 기존 레코드 TTL → 300 변경
- [ ] 저장 및 적용
- [ ] 1시간 대기 (기존 TTL 만료)

---

### Phase 3: DNS 설정 (10분)

#### whois.co.kr

- [ ] DNS 관리 페이지 진입
- [ ] A 레코드 추가:
  - 호스트: `@`
  - 타입: `A`
  - 값: `76.76.21.21`
  - TTL: `300`
- [ ] CNAME 레코드 추가:
  - 호스트: `www`
  - 타입: `CNAME`
  - 값: `cname.vercel-dns.com.`
  - TTL: `300`
- [ ] 저장 및 적용

#### 즉시 확인

```bash
dig @ns1.whois.co.kr gumsi.ai
dig @ns1.whois.co.kr www.gumsi.ai CNAME
```

---

### Phase 4: Vercel 도메인 추가 (5분)

- [ ] Vercel 대시보드 → gumsi-ai → Settings → Domains
- [ ] Add Domain: `gumsi.ai`
- [ ] Add Domain: `www.gumsi.ai`
- [ ] www.gumsi.ai → Edit → Redirect to `gumsi.ai` (301)
- [ ] 상태 확인: Valid Configuration 또는 Pending

---

### Phase 5: DNS Propagation 대기 (1-48시간)

#### 10분마다 확인
```bash
dig gumsi.ai +short
# 76.76.21.21이 나오면 전파 시작
```

#### 전 세계 확인
```
https://www.whatsmydns.net/#A/gumsi.ai
```

- [ ] 50% 이상 전파 → Phase 6 진행 가능
- [ ] 100% 전파 → 완벽

---

### Phase 6: SSL 인증서 확인 (자동, ~10분)

- [ ] Vercel Domains → gumsi.ai 상태 확인
- [ ] Certificate Issued 표시 확인
- [ ] 브라우저에서 https://gumsi.ai 접속
- [ ] 자물쇠 아이콘 확인
- [ ] 인증서 정보: Let's Encrypt

```bash
echo | openssl s_client -servername gumsi.ai -connect gumsi.ai:443 2>/dev/null | openssl x509 -noout -issuer -dates
```

---

### Phase 7: 최종 테스트 (10분)

#### HTTP/HTTPS
- [ ] `curl -I http://gumsi.ai` → 301/302 to HTTPS
- [ ] `curl -I https://gumsi.ai` → 200 OK
- [ ] `curl -I https://www.gumsi.ai` → 301 to https://gumsi.ai

#### 브라우저
- [ ] Chrome에서 https://gumsi.ai 접속
- [ ] Safari에서 접속
- [ ] 모바일(iOS/Android)에서 접속
- [ ] 시크릿 모드에서 접속

#### 페이지 로드
- [ ] 홈페이지 정상 로드
- [ ] 모든 주요 페이지 확인 (/about, /features 등)
- [ ] 이미지/CSS/JS 정상 로드
- [ ] Console에 에러 없음

#### Vercel 연결
- [ ] `curl -I https://gumsi.ai | grep x-vercel-id` → 값 존재

---

### Phase 8: 보안 설정 (10분)

#### HSTS
- [ ] `vercel.json`에 HSTS 헤더 추가
- [ ] Git commit & push
- [ ] Vercel 자동 배포 확인
- [ ] `curl -I https://gumsi.ai | grep Strict-Transport-Security`

#### CAA (선택)
- [ ] whois.co.kr → CAA 레코드 추가
- [ ] `dig CAA gumsi.ai` 확인

#### 보안 점수
- [ ] https://securityheaders.com/?q=gumsi.ai → A 등급 이상
- [ ] https://www.ssllabs.com/ssltest/analyze.html?d=gumsi.ai → A 등급 이상

---

### Phase 9: 성능 최적화 (선택, 20분)

- [ ] PageSpeed Insights 테스트
- [ ] Lighthouse 점수 확인 (90+ 목표)
- [ ] WebPageTest 실행
- [ ] 필요 시 최적화 (이미지 압축, CDN 등)

---

### Phase 10: TTL 증가 (1일 후)

모든 것이 안정적으로 작동하면:
- [ ] whois.co.kr → DNS 레코드 TTL을 3600 또는 86400으로 증가
- [ ] 저장 및 적용

---

### Phase 11: 문서화 및 보고 (10분)

- [ ] 이 가이드에 실제 작업 시간 기록
- [ ] 발생한 이슈와 해결 방법 기록
- [ ] Git commit: `docs: Add domain setup guide and execution notes`
- [ ] Git push
- [ ] ONE에게 완료 보고:
  - gumsi.ai 라이브 확인
  - SSL 인증서 발급 완료
  - 성능/보안 점수
  - 발생한 이슈 (있다면)

---

## 체크리스트 요약

```
□ 사전 준비 (백업, 정보 수집)
□ TTL 낮추기 (선택)
□ DNS 설정 (A, CNAME)
□ Vercel 도메인 추가
□ DNS Propagation 대기 및 확인
□ SSL 인증서 자동 발급 확인
□ 최종 테스트 (HTTP/HTTPS, 브라우저, 페이지)
□ 보안 설정 (HSTS, CAA)
□ 성능 최적화 (선택)
□ TTL 증가 (안정화 후)
□ 문서화 및 보고
```

---

## 참고 자료

### 공식 문서
- **Vercel Custom Domains:** https://vercel.com/docs/concepts/projects/domains
- **Vercel DNS:** https://vercel.com/docs/concepts/projects/domains/dns
- **Let's Encrypt:** https://letsencrypt.org/docs/
- **whois.co.kr 고객센터:** https://whois.co.kr/customer

### 유용한 도구
- **DNS Propagation:** https://www.whatsmydns.net/
- **SSL Checker:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com/
- **PageSpeed:** https://pagespeed.web.dev/
- **HSTS Preload:** https://hstspreload.org/

### 커뮤니티
- **Vercel Discord:** https://vercel.com/discord
- **Vercel Support:** https://vercel.com/support

---

## 변경 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|-----------|
| 2026-02-10 | MJ (COO Agent) | 초안 작성 (~500 lines) |

---

## 라이선스

이 문서는 검시AI(gumsi.ai) 프로젝트의 일부로 무인컴퍼니(Muin Company)에 속합니다.

---

**문서 끝**

**실행 전 반드시 ONE에게 승인 요청!**
