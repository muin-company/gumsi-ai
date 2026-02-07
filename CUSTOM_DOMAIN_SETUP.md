# Custom Domain Setup Guide: gumsi.ai
## 검시AI 커스텀 도메인 설정 가이드

**작성일:** 2026-02-08  
**목적:** 검시AI 서비스에 `gumsi.ai` 커스텀 도메인 연결  
**현재 상태:** Vercel 배포 완료 (`https://gumsi-ai.vercel.app`)

---

## 📋 목차

1. [도메인 등록 옵션 및 가격](#1-도메인-등록-옵션-및-가격)
2. [도메인 등록 단계별 가이드](#2-도메인-등록-단계별-가이드)
3. [Vercel 커스텀 도메인 설정](#3-vercel-커스텀-도메인-설정)
4. [DNS 레코드 설정](#4-dns-레코드-설정)
5. [SSL 인증서 설정](#5-ssl-인증서-설정)
6. [검증 및 테스트](#6-검증-및-테스트)
7. [문제 해결](#7-문제-해결)

---

## 1. 도메인 등록 옵션 및 가격

### ⚠️ 중요: .ai 도메인 가격 현황 (2026년 기준)

`.ai` 도메인은 Anguilla(앵귈라) ccTLD로, 일반 도메인보다 **매우 비쌉니다**.

| 등록 업체 | 첫해 가격 | 갱신 가격 | 총평 |
|----------|---------|---------|------|
| **Porkbun** | **$257.98** (세일) | **$2,060.25/년** | ⚠️ 매우 비쌈 |
| **Namecheap** | ~$100-120 | ~$110-130/년 | 비교적 저렴 |
| **Google Domains** | N/A | N/A | ❌ Squarespace로 이전됨 |
| **Squarespace** | ~$80-100 | ~$100-120/년 | 중간 가격 |
| **GoDaddy** | ~$99.99 | ~$119.99/년 | 비쌈 |
| **Name.com** | ~$90-100 | ~$100-120/년 | 중간 가격 |

### 💰 비용 추정 (3년)

**시나리오 A: Namecheap (권장)**
- 1년차: $120
- 2년차: $130
- 3년차: $130
- **총 3년 비용: $380 (~₩507,000 @ ₩1,335/USD)**

**시나리오 B: Squarespace**
- 1년차: $100
- 2년차: $120
- 3년차: $120
- **총 3년 비용: $340 (~₩454,000)**

**시나리오 C: Porkbun (비추천)**
- 1년차: $257.98
- 2년차: $2,060.25
- 3년차: $2,060.25
- **총 3년 비용: $4,378.48 (!!)** ❌

### 📊 추천 순위

1. **Namecheap** ⭐⭐⭐⭐⭐
   - 가격: 저렴 ($120-130/년)
   - 신뢰도: 높음
   - UI: 직관적
   - DNS 관리: 간편
   - 프라이버시 보호: 기본 제공
   - **추천 이유:** 가성비 최고, 안정적

2. **Squarespace** ⭐⭐⭐⭐
   - 가격: 중간 ($100-120/년)
   - 신뢰도: 높음 (구 Google Domains)
   - UI: 깔끔
   - DNS 관리: 간편
   - **추천 이유:** Google Domains 인수, 안정적

3. **Name.com** ⭐⭐⭐⭐
   - 가격: 중간 ($100-120/년)
   - 신뢰도: 높음
   - UI: 보통
   - **추천 이유:** 무난한 선택

4. **GoDaddy** ⭐⭐⭐
   - 가격: 비쌈 ($120+/년)
   - 신뢰도: 높음
   - UI: 복잡 (업셀 많음)
   - **비추천 이유:** 비싸고 UI 복잡

5. **Porkbun** ⭐
   - 가격: **극도로 비쌈** ($2,060/년)
   - **절대 비추천**

### 🎯 최종 추천

**Namecheap에서 `gumsi.ai` 등록 (연 $120-130)**

---

## 2. 도메인 등록 단계별 가이드

### Option A: Namecheap (권장)

#### Step 1: 도메인 검색
1. https://www.namecheap.com/ 접속
2. 검색창에 `gumsi.ai` 입력
3. **Search** 클릭

#### Step 2: 도메인 가용성 확인
- ✅ **Available**: 등록 가능 → 다음 단계 진행
- ❌ **Taken**: 이미 등록됨 → 대안 도메인 고려 (아래 참조)

#### Step 3: 장바구니 추가
1. `gumsi.ai` 옆 **Add to Cart** 클릭
2. 등록 기간 선택:
   - **1년** (권장): 초기 테스트용
   - **2년**: 할인율 확인
   - **3년**: 장기 운영 확정 시

#### Step 4: 부가 옵션 (선택사항)
| 옵션 | 설명 | 추천 |
|-----|------|------|
| **WhoisGuard** | 개인정보 보호 | ✅ 무료 포함, 활성화 |
| **PremiumDNS** | 빠른 DNS | ❌ 불필요 (Vercel DNS 사용) |
| **SSL Certificate** | SSL 인증서 | ❌ 불필요 (Vercel 무료 제공) |
| **Auto-Renew** | 자동 갱신 | ✅ 활성화 (도메인 만료 방지) |

#### Step 5: 계정 생성 및 결제
1. **Create Account** 클릭
2. 정보 입력:
   - Email: 실제 사용하는 이메일
   - Password: 강력한 비밀번호
3. 결제 정보 입력:
   - 신용카드 (Visa, Mastercard)
   - PayPal
4. **Confirm Order** 클릭

#### Step 6: 등록 완료 확인
- 이메일 확인: "Domain Registration Confirmation"
- Namecheap 대시보드에서 도메인 확인

---

### Option B: Squarespace

#### Step 1: Squarespace Domains 접속
1. https://domains.squarespace.com/ 접속
2. `gumsi.ai` 검색

#### Step 2: 도메인 가용성 확인
- Available이면 **Get This Domain** 클릭

#### Step 3: 계정 생성
- Google 계정으로 로그인 (빠름)
- 또는 이메일로 계정 생성

#### Step 4: 결제
- 가격: 첫해 $80-100
- 결제 수단: 신용카드, PayPal

#### Step 5: DNS 관리 페이지 이동
- Squarespace → Domains → Manage
- DNS Settings 선택

---

### 🛡️ 도메인 보안 설정 (등록 후 즉시)

1. **2FA (Two-Factor Authentication) 활성화**
   - Namecheap: Account → Security → Enable 2FA
   - 도메인 탈취 방지

2. **Domain Lock 활성화**
   - Namecheap: Domain List → Manage → Domain Lock ON
   - 무단 이전 방지

3. **WhoisGuard 확인**
   - 개인정보 보호 활성화 확인
   - WHOIS 검색 시 이메일 숨김

---

## 3. Vercel 커스텀 도메인 설정

### Step 1: Vercel 프로젝트 선택

1. https://vercel.com/dashboard 접속
2. `gumsi-ai` 프로젝트 클릭

### Step 2: Domains 설정 페이지

1. 상단 탭 → **Settings** 클릭
2. 왼쪽 메뉴 → **Domains** 클릭
3. 페이지 중앙 **Add** 버튼 클릭

### Step 3: 도메인 입력

1. 입력란에 `gumsi.ai` 입력
2. **Add** 버튼 클릭

### Step 4: DNS 설정 값 확인

Vercel이 자동으로 DNS 설정 안내를 표시합니다:

**옵션 1: A 레코드 (권장)**
```
Type: A
Name: @
Value: 76.76.21.21
```

**옵션 2: CNAME 레코드** (서브도메인용)
```
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

⚠️ **중요:** A 레코드 값 `76.76.21.21`을 메모하세요!

---

## 4. DNS 레코드 설정

### Namecheap DNS 설정 (상세)

#### Step 1: Namecheap 대시보드 접속

1. https://www.namecheap.com/myaccount/login/ 로그인
2. **Domain List** 클릭
3. `gumsi.ai` 옆 **Manage** 클릭

#### Step 2: Advanced DNS 페이지 이동

1. 상단 탭 → **Advanced DNS** 클릭
2. **Host Records** 섹션 확인

#### Step 3: 기존 레코드 삭제 (있을 경우)

기본적으로 Namecheap은 파킹 페이지 레코드를 추가합니다:
- Parking Page A 레코드 → **휴지통 아이콘** 클릭하여 삭제
- URL Redirect Record → 삭제

⚠️ **주의:** 모든 기존 레코드를 삭제해야 Vercel 연결이 작동합니다.

#### Step 4: A 레코드 추가 (Root Domain)

**Root 도메인용** (`gumsi.ai`)

| Field | Value | 설명 |
|-------|-------|------|
| **Type** | `A Record` | 레코드 타입 선택 |
| **Host** | `@` | Root 도메인 의미 |
| **Value** | `76.76.21.21` | Vercel IPv4 주소 |
| **TTL** | `Automatic` | 또는 `3600` |

**입력 방법:**
1. **Add New Record** 클릭
2. Type: `A Record` 선택
3. Host: `@` 입력
4. Value: `76.76.21.21` 입력
5. TTL: `Automatic` 선택
6. **Save All Changes** (녹색 체크 버튼) 클릭

#### Step 5: CNAME 레코드 추가 (WWW 서브도메인)

**WWW 서브도메인용** (`www.gumsi.ai`)

| Field | Value | 설명 |
|-------|-------|------|
| **Type** | `CNAME Record` | 레코드 타입 |
| **Host** | `www` | WWW 서브도메인 |
| **Value** | `cname.vercel-dns.com` | Vercel CNAME |
| **TTL** | `Automatic` | 자동 |

**입력 방법:**
1. **Add New Record** 클릭
2. Type: `CNAME Record` 선택
3. Host: `www` 입력
4. Value: `cname.vercel-dns.com` 입력
5. TTL: `Automatic` 선택
6. **Save All Changes** 클릭

#### Step 6: 최종 확인

DNS 설정이 다음과 같아야 합니다:

```
TYPE    HOST    VALUE                   TTL
--------------------------------------------
A       @       76.76.21.21             Automatic
CNAME   www     cname.vercel-dns.com    Automatic
```

**⚠️ 일반적인 실수:**

| 잘못된 예 | 올바른 예 | 설명 |
|----------|----------|------|
| Host: `gumsi.ai` | Host: `@` | Root 도메인은 `@` 사용 |
| Value: `76.76.21.21.` (마침표) | Value: `76.76.21.21` | IP는 마침표 없이 |
| Value: `http://cname.vercel-dns.com` | Value: `cname.vercel-dns.com` | 프로토콜 제외 |
| Host: `www.gumsi.ai` | Host: `www` | 서브도메인만 입력 |

---

### Squarespace DNS 설정

#### Step 1: Squarespace Domains 접속

1. https://domains.squarespace.com/ 로그인
2. `gumsi.ai` 선택
3. **DNS Settings** 클릭

#### Step 2: A 레코드 추가

1. **Add Record** 클릭
2. Type: `A` 선택
3. Host: `@` 입력
4. Points to: `76.76.21.21` 입력
5. **Save** 클릭

#### Step 3: CNAME 레코드 추가

1. **Add Record** 클릭
2. Type: `CNAME` 선택
3. Host: `www` 입력
4. Points to: `cname.vercel-dns.com` 입력
5. **Save** 클릭

---

## 5. SSL 인증서 설정

### Vercel 자동 SSL 인증서 (Let's Encrypt)

Vercel은 모든 커스텀 도메인에 **무료 SSL 인증서**를 자동 발급합니다.

#### 발급 조건

1. ✅ DNS 설정이 올바르게 완료
2. ✅ 도메인이 Vercel IP를 정확히 가리킴
3. ✅ DNS 전파 완료 (10분~48시간)

#### 발급 시간

- **일반적:** 5~10분
- **최대:** 24시간

#### SSL 상태 확인

**Vercel 대시보드에서:**
1. Settings → Domains
2. `gumsi.ai` 옆 아이콘 확인:
   - 🔒 **자물쇠**: SSL 활성화 완료
   - 🟡 **경고**: SSL 발급 대기 중
   - ❌ **에러**: DNS 설정 확인 필요

#### HTTPS 자동 리다이렉트

Vercel은 자동으로 HTTP → HTTPS 리다이렉트를 설정합니다.

**테스트:**
```bash
curl -I http://gumsi.ai

# 예상 결과:
HTTP/1.1 308 Permanent Redirect
Location: https://gumsi.ai/
```

브라우저 테스트:
- `http://gumsi.ai` 입력
- 자동으로 `https://gumsi.ai`로 이동

#### SSL 인증서 검증

**브라우저에서:**
1. `https://gumsi.ai` 접속
2. 주소창 왼쪽 🔒 자물쇠 클릭
3. **Certificate** 또는 **인증서** 클릭
4. 확인 사항:
   - 발급자: Let's Encrypt
   - 유효 기간: 90일 (자동 갱신)
   - 도메인: gumsi.ai, www.gumsi.ai

**SSL Labs 테스트:** (선택)
- https://www.ssllabs.com/ssltest/
- URL 입력: `gumsi.ai`
- **Submit** 클릭
- 목표: **A+** 등급

---

## 6. 검증 및 테스트

### DNS 전파 확인

#### 터미널에서 확인 (macOS/Linux)

```bash
# DNS 조회
dig gumsi.ai

# 예상 결과:
# ;; ANSWER SECTION:
# gumsi.ai.    3600    IN    A    76.76.21.21

# 또는 nslookup
nslookup gumsi.ai

# 예상 결과:
# Non-authoritative answer:
# Name:   gumsi.ai
# Address: 76.76.21.21
```

#### 온라인 도구로 확인 (권장)

**DNSChecker.org** (전 세계 전파 확인)
1. https://dnschecker.org/ 접속
2. URL 입력: `gumsi.ai`
3. Type: `A` 선택
4. **Search** 클릭
5. 결과 해석:
   - ✅ **녹색 체크**: 해당 지역에서 전파 완료
   - ❌ **빨간 X**: 아직 전파 안 됨
   - 전 세계 50% 이상 녹색 → 정상

**기타 도구:**
- https://www.whatsmydns.net/
- https://mxtoolbox.com/SuperTool.aspx

#### DNS 전파 시간

| 상황 | 예상 시간 |
|------|----------|
| 최소 (로컬 ISP) | 5~10분 |
| 일반적 | 30분~2시간 |
| 최대 (전 세계) | 48시간 |

⏳ **팁:** DNS 전파 중에는 일부 지역에서만 접속 가능할 수 있습니다.

---

### Vercel 도메인 상태 확인

#### Vercel 대시보드에서

1. https://vercel.com/dashboard 접속
2. `gumsi-ai` 프로젝트 선택
3. **Settings** → **Domains**
4. `gumsi.ai` 상태 확인

**가능한 상태:**

| 상태 | 의미 | 조치 |
|------|------|------|
| ✅ **Valid Configuration** | 정상 작동 | 완료! |
| 🟡 **Pending Verification** | DNS 전파 대기 | 10분~1시간 대기 |
| ❌ **Invalid Configuration** | DNS 설정 오류 | DNS 재확인 |

#### 도메인 강제 새로고침

DNS 변경 후 즉시 확인하려면:
1. Vercel Domains 페이지
2. 도메인 옆 **•••** (점 3개) 클릭
3. **Refresh** 클릭
4. Vercel이 즉시 DNS 재확인

---

### 브라우저 테스트

#### 필수 테스트 항목

- [ ] **Root 도메인 접속**
  - URL: `https://gumsi.ai`
  - 예상: 검시AI 홈페이지 로딩

- [ ] **WWW 서브도메인 접속**
  - URL: `https://www.gumsi.ai`
  - 예상: `gumsi.ai`로 자동 리다이렉트

- [ ] **HTTP 리다이렉트**
  - URL: `http://gumsi.ai`
  - 예상: `https://gumsi.ai`로 자동 리다이렉트

- [ ] **SSL 인증서**
  - 주소창에 🔒 자물쇠 표시
  - "연결이 안전함" 메시지

- [ ] **모바일 테스트**
  - iOS Safari에서 접속
  - Android Chrome에서 접속

#### 캐시 클리어 (접속 안 될 때)

**브라우저 캐시:**
- Chrome: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
- Safari: `Cmd+Option+E` (Mac)
- 시크릿/비공개 모드에서 테스트

**DNS 캐시:**
```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows (관리자 권한)
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

---

### 최종 체크리스트

- [ ] `gumsi.ai` → 검시AI 홈페이지 로딩
- [ ] `www.gumsi.ai` → `gumsi.ai`로 리다이렉트
- [ ] `http://gumsi.ai` → `https://gumsi.ai` 리다이렉트
- [ ] 🔒 SSL 인증서 활성화 (자물쇠 아이콘)
- [ ] 모바일에서 정상 접속
- [ ] 전 세계 DNS 전파 확인 (DNSChecker)
- [ ] 베타 신청 폼 정상 동작
- [ ] 메타태그 확인 (SNS 공유 시)

---

## 7. 문제 해결

### 도메인이 이미 등록됨 (Taken)

#### 대안 1: 다른 TLD 사용

| 도메인 | 가격/년 | 추천도 |
|--------|--------|--------|
| `gumsi.com` | $12-15 | ⭐⭐⭐⭐⭐ (제일 추천) |
| `gumsi.net` | $12-15 | ⭐⭐⭐⭐ |
| `gumsi.org` | $12-15 | ⭐⭐⭐ |
| `gumsi.io` | $30-40 | ⭐⭐⭐⭐ (테크 느낌) |
| `gumsi.co` | $25-30 | ⭐⭐⭐ |
| `gumsi.kr` | ₩15,000 | ⭐⭐⭐⭐ (한국 타겟) |

**권장:** `gumsi.com` (가장 저렴하고 신뢰도 높음)

#### 대안 2: 현재 소유자에게 구매 제안

1. **WHOIS 조회**
   - https://www.whois.com/whois/gumsi.ai
   - 소유자 이메일 확인 (WhoisGuard 없을 경우)

2. **도메인 브로커 이용**
   - Sedo.com
   - Flippa.com
   - Afternic.com
   - 예상 가격: $500~$5,000+

3. **직접 연락**
   - 정중한 이메일 발송
   - 예산 제시: $200~$500
   - 협상 가능성 낮음 (`.ai` 인기 높음)

#### 대안 3: 서브도메인 사용 (임시)

- `gumsi.muin.company` (무료)
- `gumsi.muin.ai` (`.muin.ai` 소유 시)
- 나중에 `gumsi.ai` 확보 후 이전

---

### DNS 전파가 안 됨

#### 증상

- `dig gumsi.ai` 결과 없음
- 또는 잘못된 IP 표시

#### 해결 방법

**1단계: Namecheap DNS 설정 재확인**

- Host: `@` (정확히)
- Value: `76.76.21.21` (공백, 마침표 없이)
- TTL: Automatic
- **Save All Changes** 클릭 확인

**2단계: Nameservers 확인**

Namecheap에서 Nameservers가 기본값인지 확인:

1. Domain List → Manage
2. **Nameservers** 섹션
3. 확인:
   - `dns1.registrar-servers.com`
   - `dns2.registrar-servers.com`

만약 다른 값이면:
- **Custom DNS**에서 **Namecheap BasicDNS**로 변경
- DNS 레코드 재설정 (위 Step 4 참조)

**3단계: 시간 대기**

- 최소 30분 대기
- 최대 48시간 대기
- DNS 전파는 점진적으로 발생

**4단계: 다른 DNS 서버로 테스트**

```bash
# Google DNS로 조회
dig @8.8.8.8 gumsi.ai

# Cloudflare DNS로 조회
dig @1.1.1.1 gumsi.ai
```

---

### Vercel에서 "Invalid Configuration" 에러

#### 원인

1. DNS 설정이 틀림
2. DNS 전파가 아직 안 됨
3. 기존 DNS 레코드 충돌

#### 해결 방법

**1단계: Vercel에서 요구하는 값 확인**

1. Vercel → Settings → Domains
2. `gumsi.ai` 클릭
3. "DNS Configuration" 섹션 확인
4. 필요한 레코드 값 메모

**2단계: Namecheap에서 정확히 일치시키기**

- Type: 정확히 일치
- Host: 정확히 일치 (`@` vs `www`)
- Value: 정확히 일치 (공백 없이)

**3단계: 기존 레코드 모두 삭제 후 재설정**

Namecheap Advanced DNS:
1. 모든 A, CNAME 레코드 삭제
2. Vercel 요구 레코드만 추가
3. **Save All Changes**
4. 10분 대기 후 Vercel에서 **Refresh**

**4단계: Vercel 지원팀 문의**

- https://vercel.com/support
- DNS 설정 스크린샷 첨부
- 도메인 등록 업체 명시 (Namecheap)

---

### SSL 인증서 발급 실패

#### 증상

- 🔒 자물쇠 아이콘 없음
- "Your connection is not private" 경고
- Vercel 도메인 상태: SSL 에러

#### 원인

1. DNS 설정이 올바르지 않음
2. CAA 레코드가 Let's Encrypt 차단
3. 도메인이 아직 Vercel을 가리키지 않음

#### 해결 방법

**1단계: DNS 재확인**

```bash
dig gumsi.ai

# 결과가 76.76.21.21인지 확인
```

**2단계: CAA 레코드 확인 및 추가**

Namecheap Advanced DNS:

1. **Add New Record** 클릭
2. Type: `CAA Record` 선택
3. Host: `@` 입력
4. Value: `0 issue "letsencrypt.org"` 입력
5. **Save Changes**

**CAA 레코드 추가 (상세):**

```
Type: CAA
Host: @
Tag: issue
Value: letsencrypt.org
```

**3단계: 24시간 대기**

- SSL 발급은 최대 24시간 소요
- DNS 전파 후 자동 발급

**4단계: Vercel에서 수동 재시도**

1. Settings → Domains
2. 도메인 옆 **•••** → **Refresh**
3. 또는 도메인 삭제 후 재추가

---

### 속도가 느림

#### 원인

- Vercel Edge Network가 아직 캐싱 안 함
- DNS 해석 느림

#### 해결 방법

**1단계: Vercel Analytics 확인**

- Settings → Analytics
- 실제 로딩 속도 확인
- 지역별 성능 확인

**2단계: TTL 최적화**

Namecheap DNS:
- A 레코드 TTL: `300` (5분) → 빠른 전파
- 안정화 후: `3600` (1시간) → 빠른 조회

**3단계: CDN 활용 (자동)**

- Vercel은 자동으로 Edge Network 사용
- 전 세계 70+ 지역에서 캐싱
- 추가 설정 불필요

**4단계: 성능 측정**

```bash
# Lighthouse 테스트
lighthouse https://gumsi.ai --view
```

목표:
- Performance: 90+
- LCP: < 2.5s
- FID: < 100ms

---

## 📝 체크리스트 (전체 과정)

### 도메인 등록
- [ ] Namecheap에서 `gumsi.ai` 검색
- [ ] 가용성 확인 (Available)
- [ ] 장바구니 추가 (1년)
- [ ] WhoisGuard 활성화
- [ ] Auto-Renew 활성화
- [ ] 결제 완료
- [ ] 등록 확인 이메일 수신
- [ ] 2FA 활성화
- [ ] Domain Lock 활성화

### DNS 설정
- [ ] Namecheap Advanced DNS 접속
- [ ] 기존 Parking 레코드 삭제
- [ ] A 레코드 추가: `@` → `76.76.21.21`
- [ ] CNAME 레코드 추가: `www` → `cname.vercel-dns.com`
- [ ] Save All Changes 클릭
- [ ] DNS 전파 확인 (dig/nslookup)
- [ ] DNSChecker.org로 전 세계 전파 확인

### Vercel 설정
- [ ] Vercel 대시보드 접속
- [ ] gumsi-ai 프로젝트 선택
- [ ] Settings → Domains
- [ ] Add 버튼 클릭
- [ ] `gumsi.ai` 입력 및 추가
- [ ] DNS 설정 값 확인
- [ ] 도메인 상태: Valid Configuration 확인
- [ ] SSL 인증서 자동 발급 대기 (5~10분)

### 검증
- [ ] `https://gumsi.ai` 접속 확인
- [ ] `https://www.gumsi.ai` 리다이렉트 확인
- [ ] `http://gumsi.ai` → HTTPS 리다이렉트 확인
- [ ] 🔒 SSL 자물쇠 아이콘 확인
- [ ] 모바일에서 접속 확인
- [ ] 베타 신청 폼 동작 확인
- [ ] SNS 공유 메타태그 확인

### 사후 관리
- [ ] Namecheap Auto-Renew 활성화 확인
- [ ] 도메인 만료일 캘린더 등록
- [ ] DNS 레코드 백업 (스크린샷)
- [ ] Vercel Analytics 활성화
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터도구 등록

---

## 💰 최종 비용 요약

### 시나리오 1: Namecheap 등록 (권장)

| 항목 | 비용 (USD) | 비용 (KRW @ ₩1,335) |
|-----|-----------|---------------------|
| 도메인 등록 (1년) | $120 | ₩160,200 |
| WhoisGuard | $0 (무료) | ₩0 |
| **총 1년 비용** | **$120** | **₩160,200** |
| 3년 총 비용 | $380 | ₩507,000 |

### 시나리오 2: Squarespace 등록

| 항목 | 비용 (USD) | 비용 (KRW) |
|-----|-----------|-----------|
| 도메인 등록 (1년) | $100 | ₩133,500 |
| **총 1년 비용** | **$100** | **₩133,500** |
| 3년 총 비용 | $340 | ₩454,000 |

### 기타 비용

| 항목 | 비용 |
|-----|------|
| Vercel Hosting | ₩0 (무료) |
| SSL 인증서 | ₩0 (무료) |
| DNS 관리 | ₩0 (무료) |
| 도메인 프라이버시 | ₩0 (무료) |

---

## 📞 지원 및 문의

### Namecheap 지원

- **Live Chat:** https://www.namecheap.com/support/live-chat/
- **티켓:** https://www.namecheap.com/support/
- **시간:** 24/7

### Vercel 지원

- **Support:** https://vercel.com/support
- **문서:** https://vercel.com/docs/concepts/projects/custom-domains
- **커뮤니티:** https://github.com/vercel/vercel/discussions

### DNS 도구

- **DNSChecker:** https://dnschecker.org/
- **WhatsmyDNS:** https://www.whatsmydns.net/
- **MXToolbox:** https://mxtoolbox.com/

### SSL 검증

- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

## 🎯 다음 단계 (도메인 연결 후)

1. **Google Search Console 등록**
   - https://search.google.com/search-console
   - `gumsi.ai` 속성 추가
   - Sitemap 제출: `https://gumsi.ai/sitemap.xml`

2. **네이버 웹마스터도구 등록**
   - https://searchadvisor.naver.com/
   - 사이트 추가
   - 소유권 확인 (HTML 태그 방식)

3. **SNS 메타태그 검증**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

4. **Analytics 설정**
   - Vercel Analytics 활성화
   - Google Analytics (선택)

5. **도메인 홍보**
   - X 포스팅: "검시AI 공식 도메인 오픈: https://gumsi.ai"
   - 네이버 카페 공지
   - 베타 테스터에게 안내

---

## 📌 참고 자료

- [Vercel 커스텀 도메인 공식 문서](https://vercel.com/docs/concepts/projects/custom-domains)
- [Namecheap DNS 설정 가이드](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)
- [Let's Encrypt 공식 사이트](https://letsencrypt.org/)
- [DNS 전파 이해하기](https://www.cloudflare.com/learning/dns/what-is-dns/)

---

**작성:** MJ (COO)  
**검토:** ONE  
**버전:** 1.0  
**업데이트:** 2026-02-08
