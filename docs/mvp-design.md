# 검시 AI - MVP 설계 문서

## 1. 핵심 화면 구조

### 1.1 홈 화면
```
┌─────────────────────────────────┐
│  🎓 검시 AI                    │
│  AI 검정고시 튜터               │
├─────────────────────────────────┤
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 🤖      │  │ 📚      │      │
│  │ AI 튜터 │  │ 기출풀이 │      │
│  └─────────┘  └─────────┘      │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 📊      │  │ ⚙️      │      │
│  │ 내 학습 │  │ 설정    │      │
│  └─────────┘  └─────────┘      │
│                                 │
├─────────────────────────────────┤
│  오늘의 학습 목표: 수학 3문제   │
│  ████████░░░░ 66%              │
└─────────────────────────────────┘
```

### 1.2 AI 튜터 채팅
```
┌─────────────────────────────────┐
│ ← AI 튜터 (수학)           ⋮   │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────┐          │
│  │ 안녕! 오늘은 뭘  │          │
│  │ 도와줄까?        │ 🤖       │
│  └──────────────────┘          │
│                                 │
│          ┌──────────────────┐  │
│     나 → │ 이차방정식 근의  │  │
│          │ 공식 알려줘      │  │
│          └──────────────────┘  │
│                                 │
│  ┌──────────────────┐          │
│  │ 이차방정식       │          │
│  │ ax²+bx+c=0 에서  │ 🤖       │
│  │                  │          │
│  │ x = (-b±√D)/2a  │          │
│  │ (D = b²-4ac)    │          │
│  └──────────────────┘          │
│                                 │
├─────────────────────────────────┤
│ [📷] 질문을 입력하세요...  [→] │
└─────────────────────────────────┘
```

### 1.3 기출문제 풀이
```
┌─────────────────────────────────┐
│ ← 2024년 1회 수학          ⋮   │
├─────────────────────────────────┤
│  문제 5 / 25                    │
│  ████████████░░░░░░░░ 20%      │
├─────────────────────────────────┤
│                                 │
│  5. 다음 이차방정식의 해를     │
│     구하시오.                   │
│                                 │
│     x² - 5x + 6 = 0            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ① x = 1, x = 6          │   │
│  │ ② x = 2, x = 3    ✓     │   │
│  │ ③ x = -2, x = -3        │   │
│  │ ④ x = -1, x = -6        │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│     [이전]  [채점하기]  [다음]  │
└─────────────────────────────────┘
```

### 1.4 학습 대시보드
```
┌─────────────────────────────────┐
│ ← 내 학습 현황                 │
├─────────────────────────────────┤
│                                 │
│  📅 D-45 (4월 시험까지)        │
│                                 │
│  ┌─ 과목별 진도 ─────────────┐ │
│  │ 국어 ████████░░ 80%        │ │
│  │ 영어 ██████░░░░ 60%        │ │
│  │ 수학 ████░░░░░░ 40%   ⚠️  │ │
│  │ 사회 ███████░░░ 70%        │ │
│  │ 과학 █████░░░░░ 50%        │ │
│  │ 한국사 ████████░░ 85%      │ │
│  └────────────────────────────┘ │
│                                 │
│  ⚠️ 취약 단원                  │
│  • 수학 > 이차함수              │
│  • 과학 > 화학반응식            │
│                                 │
│  📊 예상 점수: 72점 (합격 60점) │
│                                 │
└─────────────────────────────────┘
```

## 2. AI 튜터 프롬프트

### 2.1 시스템 프롬프트 (공통)

```
당신은 "검시 AI"의 AI 튜터입니다.

## 역할
- 검정고시(초졸/중졸/고졸) 준비를 돕는 친절한 튜터
- 어려운 개념을 쉽게 설명하는 전문가
- 학생의 수준에 맞춰 설명을 조절

## 대화 스타일
- 반말 사용 (친근하게)
- 이모지 적절히 사용
- 짧고 명확한 문장
- 예시를 많이 들어 설명

## 규칙
1. 정답만 알려주지 말고, 풀이 과정을 설명해
2. 학생이 직접 생각하도록 유도해
3. 틀린 부분이 있으면 왜 틀렸는지 설명해
4. 관련 개념도 함께 알려줘
5. 모르는 건 모른다고 솔직히 말해

## 금지사항
- 욕설, 비속어 사용 금지
- 검정고시와 무관한 주제 회피
- 불확실한 정보 제공 금지
```

### 2.2 과목별 프롬프트

#### 수학 튜터
```
당신은 수학 전문 튜터입니다.

## 전문 영역
- 기초 연산, 방정식, 부등식
- 함수 (일차, 이차, 지수, 로그)
- 도형, 기하학
- 확률과 통계

## 풀이 스타일
1. 문제 유형 먼저 파악
2. 필요한 공식 제시
3. 단계별 풀이 과정
4. 검산 방법 안내

## 수식 표현
- 분수: a/b
- 제곱: x²
- 루트: √
- 더하기/빼기: +, -
```

#### 영어 튜터
```
당신은 영어 전문 튜터입니다.

## 전문 영역
- 문법 (시제, 관계사, 가정법 등)
- 독해 전략
- 어휘 학습
- 듣기/말하기 기초

## 설명 스타일
1. 한국어로 개념 설명
2. 영어 예문 제시
3. 비슷한 표현 비교
4. 암기 팁 제공
```

### 2.3 문제 풀이 프롬프트

```
학생이 기출문제를 풀고 있습니다.

## 문제 정보
- 연도: {year}
- 회차: {session}
- 과목: {subject}
- 문제번호: {number}
- 문제: {question}
- 보기: {options}
- 정답: {answer}
- 학생 선택: {student_answer}

## 응답 형식
1. 정답 여부 알림
2. 정답 설명 (왜 이게 답인지)
3. 오답 설명 (학생이 틀렸다면)
4. 관련 개념 요약
5. 비슷한 유형 팁
```

## 3. 데이터베이스 스키마

### 3.1 Supabase 테이블

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'high', -- 'elementary', 'middle', 'high'
  plan TEXT DEFAULT 'free', -- 'free', 'premium'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 기출문제
CREATE TABLE questions (
  id TEXT PRIMARY KEY, -- '2024-1-math-01'
  year INTEGER NOT NULL,
  session INTEGER NOT NULL, -- 1 or 2
  subject TEXT NOT NULL,
  number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["①...", "②...", ...]
  answer INTEGER NOT NULL, -- 1-4
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 학습 기록
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  question_id TEXT REFERENCES questions(id),
  user_answer INTEGER,
  is_correct BOOLEAN,
  time_spent INTEGER, -- seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI 대화 기록
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  subject TEXT,
  messages JSONB NOT NULL, -- [{role, content, timestamp}]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 학습 통계
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  subject TEXT NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  study_time INTEGER DEFAULT 0, -- minutes
  weak_topics JSONB, -- ["이차함수", "화학반응"]
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subject)
);
```

## 4. API 구조

### 4.1 인증
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 4.2 AI 튜터
```
POST /api/chat
  body: { subject, message, conversationId? }
  response: { reply, conversationId }
```

### 4.3 기출문제
```
GET  /api/questions?year=2024&session=1&subject=math
GET  /api/questions/:id
POST /api/questions/:id/submit
  body: { answer }
  response: { isCorrect, explanation }
```

### 4.4 학습 통계
```
GET  /api/stats
GET  /api/stats/:subject
GET  /api/progress?limit=20
```

## 5. 개발 일정

### Week 1 (2/7-2/14)
- [x] 프로젝트 설정 (Next.js, Tailwind)
- [ ] Supabase 연동 (Auth, DB)
- [ ] 기출문제 DB 구축 (100문제)
- [ ] AI 튜터 기본 구현

### Week 2 (2/14-2/21)
- [ ] 기출문제 풀이 UI
- [ ] 학습 대시보드
- [ ] 프리미엄 결제 (Stripe/토스)
- [ ] 모바일 최적화

### Week 3 (2/21-2/28)
- [ ] 베타 테스터 모집 (100명)
- [ ] 피드백 수집
- [ ] 버그 수정
- [ ] 성능 최적화

### Week 4 (2/28-3/7)
- [ ] 소프트 런칭
- [ ] 마케팅 시작
- [ ] 사용자 지원 체계

---

*작성일: 2026-02-07*
*작성자: MJ (COO)*
