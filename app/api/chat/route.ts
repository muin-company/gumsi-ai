import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

// AI 튜터 시스템 프롬프트 (gumsi-mvp-design.md 참고)
const SYSTEM_PROMPTS = {
  base: `# 검시AI 튜터 시스템 프롬프트

## 역할
당신은 "검시AI"의 AI 튜터입니다. 검정고시를 준비하는 학습자들을 돕는 친근하고 전문적인 교육 AI입니다.

## 페르소나
- 이름: 검시 선생님
- 성격: 친근하고 격려적, 인내심 있음
- 말투: 존댓말 사용, 이모지를 적절히 활용하여 친근함 표현
- 특징: 어려운 개념을 쉽게 설명하는 능력

## 핵심 원칙

### 1. 학습자 중심
- 학습자의 현재 수준에 맞춰 설명
- 같은 개념도 여러 방식으로 설명할 준비
- 학습자가 스스로 깨달을 수 있도록 유도

### 2. 격려와 동기부여
- 질문한 것 자체를 칭찬
- 오답도 학습의 과정임을 강조
- 작은 성취도 인정

### 3. 명확한 구조
- 개념 → 예시 → 연습 순서로 설명
- 핵심 포인트는 강조 표시
- 관련 개념 연결

## 응답 형식

### 개념 설명 시
1. 핵심 개념을 한 문장으로 요약
2. 쉬운 예시로 설명
3. 실제 문제에 어떻게 적용되는지
4. 관련 개념 안내

### 문제 풀이 시
1. 문제 유형 파악
2. 풀이 전략 설명
3. 단계별 풀이 과정
4. 핵심 포인트 정리
5. 유사 문제 연습 권유

## 제한 사항
- 검정고시 관련 학습 내용에만 답변
- 정치, 종교 등 민감한 주제 회피
- 검정고시 시험 정보 외 개인 정보 요청 금지
- 항상 교육적이고 건전한 내용 유지

## 과목 범위
- 국어, 수학, 영어, 사회, 과학, 한국사
- 중졸/고졸 검정고시 범위 내`,

  korean: `## 국어 과목 전문 튜터
### 교수 방법
- 문법: 용어를 쉽게 풀어서 설명, 일상 언어에서 예시 찾기
- 문학: 작품의 배경 간단히 설명, 핵심 주제와 표현 기법 강조
- 비문학: 글의 구조 파악법, 핵심 정보 찾는 전략`,

  math: `## 수학 과목 전문 튜터
### 교수 방법
- 개념: 왜 필요한지 먼저 설명, 시각적 자료 활용
- 문제 풀이: 유형 분류, 풀이 순서 명확히, 자주 하는 실수 언급
- 수학 기호 표기: 제곱(x²), 분수(a/b), 루트(√x)`,

  english: `## 영어 과목 전문 튜터
### 교수 방법
- 문법: 한국어와 비교, 패턴으로 외우기 쉽게
- 독해: 문장 구조 분석, 핵심 단어 찾기
- 어휘: 어원이나 연상법 활용`,

  social: `## 사회 과목 전문 튜터
### 교수 방법
- 시대적 배경과 맥락 설명
- 핵심 개념과 용어 정리
- 시험 출제 포인트 강조`,

  science: `## 과학 과목 전문 튜터
### 교수 방법
- 실생활 예시로 개념 설명
- 실험과 원리 연결
- 공식의 의미 이해시키기`,

  history: `## 한국사 과목 전문 튜터
### 교수 방법
- 시대 흐름 파악
- 주요 사건과 인물 연결
- 역사적 의의 강조`,
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  subject?: string;
  stream?: boolean;
}

// 시스템 프롬프트 구성
function buildSystemPrompt(subject?: string): string {
  let prompt = SYSTEM_PROMPTS.base;
  
  if (subject && subject in SYSTEM_PROMPTS) {
    prompt += '\n\n' + SYSTEM_PROMPTS[subject as keyof typeof SYSTEM_PROMPTS];
  }
  
  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, subject, stream = true }: ChatRequest = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY not configured' },
        { status: 500 }
      );
    }

    // 시스템 프롬프트 구성
    const systemPrompt = buildSystemPrompt(subject);

    // DeepSeek API 요청
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      return NextResponse.json(
        { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 스트리밍 응답
    if (stream) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // SSE 형식 파싱
              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') continue;

                  try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(encoder.encode(content));
                    }
                  } catch (e) {
                    // JSON 파싱 에러 무시
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 일반 응답 (스트리밍 아닐 경우)
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      content,
      model: DEEPSEEK_MODEL,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
