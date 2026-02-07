'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import OptionButton from '@/components/questions/OptionButton';
import ExplanationPanel from '@/components/questions/ExplanationPanel';
import ProgressBar from '@/components/questions/ProgressBar';
import questionsData from '@/data/questions-sample.json';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = useMemo(
    () => questionsData.questions.find((q) => q.id === questionId),
    [questionId]
  );

  const currentIndex = useMemo(
    () => questionsData.questions.findIndex((q) => q.id === questionId),
    [questionId]
  );

  const nextQuestion = useMemo(
    () =>
      currentIndex < questionsData.questions.length - 1
        ? questionsData.questions[currentIndex + 1]
        : null,
    [currentIndex]
  );

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            문제를 찾을 수 없습니다
          </h1>
          <Link
            href="/questions"
            className="text-blue-600 hover:underline"
          >
            문제 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleOptionClick = (index: number) => {
    if (!showAnswer) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (nextQuestion) {
      router.push(`/questions/${nextQuestion.id}`);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const isCorrect = selectedOption === question.answer;

  const subjectLabels: { [key: string]: string } = {
    math: '수학',
    korean: '국어',
    english: '영어',
    science: '과학',
    social: '사회',
    history: '역사',
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <Link
          href="/questions"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 문제 목록으로
        </Link>
        <ProgressBar
          current={currentIndex + 1}
          total={questionsData.questions.length}
        />
      </div>

      {/* 문제 정보 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
            {subjectLabels[question.subject] || question.subject}
          </span>
          <span className="text-sm text-gray-600">{question.topic}</span>
          <span className="text-sm text-gray-500">
            {question.year}년 {question.session}회
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          문제 {question.number}
        </h1>
      </div>

      {/* 문제 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-lg text-gray-800 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* 선택지 */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            selected={selectedOption === index}
            correct={index === question.answer}
            showAnswer={showAnswer}
            onClick={() => handleOptionClick(index)}
          />
        ))}
      </div>

      {/* 정답 확인 버튼 */}
      {!showAnswer && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            selectedOption === null
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          정답 확인
        </button>
      )}

      {/* 해설 패널 */}
      {showAnswer && (
        <>
          <ExplanationPanel
            explanation={question.explanation}
            isCorrect={isCorrect}
          />

          {/* 다음 문제 버튼 */}
          <div className="mt-6 flex gap-3">
            <Link
              href="/questions"
              className="flex-1 py-3 text-center rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              목록으로
            </Link>
            {nextQuestion ? (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                다음 문제 →
              </button>
            ) : (
              <button
                onClick={() => router.push('/questions')}
                className="flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
              >
                완료 🎉
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
