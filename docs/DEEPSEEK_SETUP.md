# DeepSeek API 설정 완벽 가이드

## 목차
1. [DeepSeek란?](#deepseek란)
2. [계정 생성](#1-계정-생성)
3. [API 키 발급](#2-api-키-발급)
4. [무료 크레딧 & 가격 정책](#3-무료-크레딧--가격-정책)
5. [환경 변수 설정](#4-환경-변수-설정)
6. [API 호출 예제](#5-api-호출-예제)
7. [Rate Limit & 에러 처리](#6-rate-limit--에러-처리)
8. [비용 모니터링](#7-비용-모니터링)
9. [트러블슈팅](#8-트러블슈팅)

---

## DeepSeek란?

DeepSeek는 고성능 AI 언어 모델을 저렴한 가격에 제공하는 API 서비스입니다.
- **장점**: Claude/GPT 대비 훨씬 저렴 (1/10 ~ 1/20 가격)
- **성능**: GPT-4급 추론 능력
- **속도**: 빠른 응답 속도
- **한국어**: 한국어 성능 우수

---

## 1. 계정 생성

### 1-1. DeepSeek 웹사이트 접속

1. 브라우저에서 https://platform.deepseek.com 접속
2. 우측 상단 **Sign Up** 버튼 클릭

### 1-2. 회원가입

**방법 1: 이메일로 가입**
```
1. Email 입력
2. Verification Code 받기 (Send Code 클릭)
3. 이메일에서 6자리 코드 확인 후 입력
4. Password 설정 (8자 이상, 영문+숫자 조합)
5. Sign Up 클릭
```

**방법 2: Google 계정으로 가입**
```
1. "Continue with Google" 클릭
2. Google 계정 선택
3. 권한 승인
```

### 1-3. 가입 완료 확인

- 가입 완료 후 자동으로 Dashboard로 이동
- 좌측 메뉴에 "API Keys", "Usage", "Billing" 등이 보이면 성공

---

## 2. API 키 발급

### 2-1. API Keys 페이지 이동

```
Dashboard 좌측 메뉴 > API Keys 클릭
또는 https://platform.deepseek.com/api_keys 직접 접속
```

### 2-2. 새 API 키 생성

1. **Create API Key** 버튼 클릭
2. API Key 이름 입력 (예: `gumsi-ai-production`)
3. **Create** 클릭
4. 생성된 API 키가 화면에 표시됨

⚠️ **중요**: API 키는 **생성 직후 단 한 번만** 표시됩니다!

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2-3. API 키 안전하게 보관

```bash
# 복사 후 안전한 곳에 저장 (예: 1Password, Bitwarden)
# 절대 GitHub, 공개 채팅에 올리지 말 것!

✅ 저장 예시:
제목: DeepSeek API Key (검시AI 프로덕션)
키: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
생성일: 2026-02-07
용도: 검시AI 프로덕션 서버
```

### 2-4. 여러 API 키 관리 전략

- **개발용**: `gumsi-ai-dev` (로컬/테스트 환경)
- **프로덕션용**: `gumsi-ai-production` (실제 서비스)
- **백업용**: `gumsi-ai-backup` (주 키 장애 대비)

각 환경마다 별도 키를 발급하면 비용 추적 및 보안 관리가 쉬워집니다.

---

## 3. 무료 크레딧 & 가격 정책

### 3-1. 무료 크레딧 (2026년 2월 기준)

```
✅ 신규 가입 시 무료 크레딧 제공
   - $5 (약 6,500원) 상당
   - 유효기간: 가입 후 3개월
   - 검시AI 기준: 약 10,000~15,000 대화 가능
```

### 3-2. 가격 정책

| 모델 | 입력 (1M 토큰) | 출력 (1M 토큰) | 비교 |
|------|----------------|----------------|------|
| DeepSeek Chat | $0.14 | $0.28 | Claude의 1/100 |
| DeepSeek Reasoner | $0.55 | $2.19 | GPT-4o의 1/5 |

**토큰이란?**
- 토큰 ≈ 단어의 0.75배
- 한국어 기준: 1,000자 ≈ 500~700 토큰
- 검시AI 평균 대화: 입력 200 토큰 + 출력 500 토큰 = 0.7 토큰

**실제 비용 예시**
```
검시AI 사용자 1,000명 × 월 10회 대화 = 10,000 대화
= 약 700만 토큰 (7M tokens)
= $0.14 (입력) + $0.28 (출력) = $2.94 (약 4,000원)

→ 사용자 1명당 월 4원 정도!
```

### 3-3. 크레딧 충전 방법

```
1. 좌측 메뉴 > Billing 클릭
2. Add Credit 버튼 클릭
3. 충전 금액 선택 ($10, $50, $100, Custom)
4. 결제 수단 선택
   - 신용카드 (Visa, MasterCard, AMEX)
   - PayPal (가능 시)
5. 결제 완료

💡 팁: $10부터 충전 가능, 소액으로 시작 추천
```

---

## 4. 환경 변수 설정

### 4-1. `.env.local` 파일 생성

프로젝트 루트 디렉토리 (`gumsi-ai/`)에서:

```bash
# .env.example을 복사하여 .env.local 생성
cp .env.example .env.local

# 또는 직접 생성
touch .env.local
```

### 4-2. API 키 추가

`.env.local` 파일을 열고 다음 내용 추가:

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 어떤 AI 모델을 사용할지 선택
AI_PROVIDER=deepseek  # 'deepseek' 또는 'anthropic'

# DeepSeek 모델 선택
DEEPSEEK_MODEL=deepseek-chat  # 또는 'deepseek-reasoner'

# Supabase (이미 있다면 건너뛰기)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4-3. 환경 변수 확인

```bash
# 개발 서버 재시작
npm run dev

# 또는 환경 변수 출력 확인
node -e "console.log(process.env.DEEPSEEK_API_KEY)"
```

⚠️ **보안 주의사항**
```bash
# .env.local은 절대 Git에 커밋하지 말 것!
# .gitignore에 이미 포함되어 있는지 확인:
cat .gitignore | grep .env.local

# 없으면 추가:
echo ".env.local" >> .gitignore
```

---

## 5. API 호출 예제

### 5-1. cURL로 테스트

터미널에서 API 키 동작 확인:

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "system",
        "content": "당신은 검정고시 수학 튜터입니다. 친절하게 설명해주세요."
      },
      {
        "role": "user",
        "content": "이차방정식 근의 공식을 알려줘"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

**예상 응답**
```json
{
  "id": "chatcmpl-xxxxx",
  "object": "chat.completion",
  "created": 1707307200,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "이차방정식 ax² + bx + c = 0의 근의 공식은:\n\nx = (-b ± √(b² - 4ac)) / 2a\n\n여기서:\n- a, b, c는 계수\n- ± 는 두 개의 근이 있다는 뜻\n- √(b² - 4ac)를 판별식 D라고 해\n\n..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 128,
    "total_tokens": 173
  }
}
```

### 5-2. JavaScript (Node.js) 예제

```javascript
// lib/deepseek.js
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

export async function chatWithDeepSeek(messages, options = {}) {
  const {
    model = 'deepseek-chat',
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DeepSeek API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}
```

### 5-3. Next.js API Route 예제

```javascript
// app/api/chat/route.js
import { chatWithDeepSeek } from '@/lib/deepseek';

export async function POST(request) {
  try {
    const { message, subject } = await request.json();

    const systemPrompt = `당신은 검정고시 ${subject} 튜터입니다. 친절하고 쉽게 설명해주세요.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    const result = await chatWithDeepSeek(messages, {
      temperature: 0.7,
      maxTokens: 1500,
    });

    return Response.json({
      reply: result.content,
      usage: result.usage,
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 5-4. React 컴포넌트에서 호출

```jsx
// components/ChatBox.jsx
'use client';
import { useState } from 'react';

export default function ChatBox({ subject }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, subject }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="질문을 입력하세요..."
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? '응답 중...' : '전송'}
      </button>
      {reply && (
        <div className="reply">
          <strong>AI 튜터:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Rate Limit & 에러 처리

### 6-1. Rate Limit 정책

```
무료 플랜:
- 분당 60 요청 (RPM)
- 일일 10,000 요청
- 동시 요청 10개

유료 플랜:
- 분당 300 요청
- 일일 무제한
- 동시 요청 50개
```

### 6-2. Rate Limit 에러 처리

```javascript
// lib/deepseek.js에 재시도 로직 추가
export async function chatWithDeepSeek(messages, options = {}) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: options.model || 'deepseek-chat',
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
        }),
      });

      const data = await response.json();

      // 429 Too Many Requests 에러 처리
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 5;
        console.warn(`Rate limit hit. Retrying after ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        attempt++;
        continue;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
      };

    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      attempt++;
      await sleep(1000 * attempt); // 지수 백오프
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 6-3. 주요 에러 코드

| 코드 | 의미 | 해결 방법 |
|------|------|-----------|
| 401 | Unauthorized | API 키 확인 |
| 429 | Too Many Requests | Rate limit 대기 후 재시도 |
| 500 | Internal Server Error | 잠시 후 재시도 |
| 503 | Service Unavailable | DeepSeek 서버 점검 중 |

---

## 7. 비용 모니터링

### 7-1. DeepSeek Dashboard에서 확인

```
1. https://platform.deepseek.com/usage 접속
2. 실시간 사용량 확인
   - 오늘 사용한 토큰 수
   - 요청 횟수
   - 예상 비용
3. 기간별 필터링 (Today, Last 7 days, Last 30 days, Custom)
```

### 7-2. 앱 내에서 토큰 사용량 기록

```javascript
// lib/analytics.js
import { createClient } from '@/lib/supabase/server';

export async function logApiUsage(userId, usage) {
  const supabase = createClient();
  
  await supabase.from('api_usage').insert({
    user_id: userId,
    prompt_tokens: usage.prompt_tokens,
    completion_tokens: usage.completion_tokens,
    total_tokens: usage.total_tokens,
    estimated_cost: calculateCost(usage),
    created_at: new Date().toISOString(),
  });
}

function calculateCost(usage) {
  const INPUT_COST_PER_1M = 0.14;
  const OUTPUT_COST_PER_1M = 0.28;
  
  const inputCost = (usage.prompt_tokens / 1_000_000) * INPUT_COST_PER_1M;
  const outputCost = (usage.completion_tokens / 1_000_000) * OUTPUT_COST_PER_1M;
  
  return inputCost + outputCost;
}
```

```sql
-- Supabase에 api_usage 테이블 추가
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  estimated_cost DECIMAL(10, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7-3. 비용 알림 설정

```javascript
// lib/cost-alert.js
const DAILY_BUDGET = 1.0; // $1 per day

export async function checkDailyBudget() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data } = await supabase
    .from('api_usage')
    .select('estimated_cost')
    .gte('created_at', today)
    .select();
  
  const totalCost = data.reduce((sum, record) => sum + record.estimated_cost, 0);
  
  if (totalCost > DAILY_BUDGET) {
    // 관리자에게 알림 전송
    await sendAlert(`⚠️ 일일 예산 초과: $${totalCost.toFixed(2)}`);
  }
}
```

---

## 8. 트러블슈팅

### 8-1. API 키 오류

**증상**
```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

**해결 방법**
```bash
# 1. API 키 확인
echo $DEEPSEEK_API_KEY

# 2. .env.local 파일 확인
cat .env.local | grep DEEPSEEK_API_KEY

# 3. 공백/줄바꿈 제거 확인
DEEPSEEK_API_KEY=sk-xxx  # ✅
DEEPSEEK_API_KEY= sk-xxx # ❌ (앞에 공백)
DEEPSEEK_API_KEY=sk-xxx
                         # ❌ (뒤에 줄바꿈)

# 4. 개발 서버 재시작
npm run dev
```

### 8-2. 429 Too Many Requests

**증상**
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

**해결 방법**
1. **즉시 해결**: 5~10초 대기 후 재시도
2. **장기 해결**: 요청 쓰로틀링 구현

```javascript
// lib/throttle.js
class RequestQueue {
  constructor(maxRequestsPerMinute = 50) {
    this.queue = [];
    this.maxRPM = maxRequestsPerMinute;
    this.interval = 60000 / maxRequestsPerMinute; // ms
  }

  async enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { fn, resolve, reject } = this.queue.shift();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      setTimeout(() => this.process(), this.interval);
    }
  }
}

export const deepseekQueue = new RequestQueue(50);
```

### 8-3. 응답이 너무 느림

**원인**
- 모델: `deepseek-reasoner`는 느림 (복잡한 추론)
- `max_tokens` 너무 높음
- 네트워크 지연

**해결 방법**
```javascript
// 1. 빠른 모델 사용
model: 'deepseek-chat' // ✅ 빠름
model: 'deepseek-reasoner' // ⚠️ 느리지만 정확

// 2. max_tokens 제한
max_tokens: 500 // 짧은 답변
max_tokens: 2000 // 긴 설명

// 3. Streaming 활성화
const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages,
    stream: true, // ✅ 실시간 스트리밍
  }),
});

// 4. 타임아웃 설정
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초

const response = await fetch(url, {
  signal: controller.signal,
  ...
});
```

### 8-4. 한국어 응답 품질이 낮음

**해결 방법**
```javascript
// System prompt에 명시
const systemPrompt = `
당신은 한국 검정고시 수학 튜터입니다.
반드시 한국어로만 답변하세요.
수식은 한글 설명과 함께 제공하세요.

예시:
- "이차방정식의 근의 공식은 x = (-b ± √D) / 2a 입니다."
- "여기서 D는 판별식으로 b² - 4ac를 의미합니다."
`;

// 또는 user message에 명시
const userMessage = `
[한국어로 답변해주세요]

${message}
`;
```

### 8-5. API 응답이 잘림

**원인**: `max_tokens` 부족

**해결 방법**
```javascript
// 1. max_tokens 증가
max_tokens: 2000 // 기본 1000에서 증가

// 2. finish_reason 확인
const data = await response.json();
if (data.choices[0].finish_reason === 'length') {
  console.warn('응답이 max_tokens로 인해 잘렸습니다.');
  // 추가 요청 또는 사용자에게 알림
}
```

### 8-6. 크레딧이 부족함

**증상**
```json
{
  "error": {
    "message": "Insufficient credits",
    "type": "insufficient_credits",
    "code": "insufficient_credits"
  }
}
```

**해결 방법**
```bash
# 1. 크레딧 확인
https://platform.deepseek.com/billing

# 2. 충전
Add Credit > $10 선택 > 결제

# 3. 앱에서 크레딧 부족 시 안내
if (error.code === 'insufficient_credits') {
  alert('관리자에게 문의하세요. (크레딧 부족)');
}
```

---

## 추가 리소스

- **공식 문서**: https://platform.deepseek.com/docs
- **API Reference**: https://platform.deepseek.com/api-docs
- **모델 비교**: https://platform.deepseek.com/docs/models
- **커뮤니티**: https://discord.gg/deepseek (영어)

---

## 체크리스트

설정 완료 후 아래 항목을 확인하세요:

```
✅ DeepSeek 계정 생성 완료
✅ API 키 발급 및 안전하게 보관
✅ .env.local에 API 키 추가
✅ cURL 테스트 성공
✅ Next.js에서 API 호출 성공
✅ Rate limit 에러 처리 구현
✅ 비용 모니터링 설정
✅ .gitignore에 .env.local 포함 확인
```

---

**작성일**: 2026-02-07  
**작성자**: MJ (COO, 검시AI)  
**버전**: 1.0
