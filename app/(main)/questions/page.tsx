'use client';

import { useState } from 'react';
import QuestionCard from '@/components/questions/QuestionCard';
import questionsData from '@/data/questions-sample.json';

const subjects = {
  all: '전체',
  math: '수학',
  korean: '국어',
  english: '영어',
  science: '과학',
  social: '사회',
  history: '역사',
};

export default function QuestionsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredQuestions =
    selectedSubject === 'all'
      ? questionsData.questions
      : questionsData.questions.filter((q) => q.subject === selectedSubject);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">기출문제 풀이</h1>
        <p className="text-gray-600">
          검정고시 기출문제를 풀어보세요. 총 {questionsData.metadata.totalQuestions}문제가
          준비되어 있습니다.
        </p>
      </div>

      {/* 과목 선택 탭 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(subjects).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedSubject(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSubject === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 문제 목록 */}
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              number={question.number}
              question={question.question}
              subject={question.subject}
              difficulty={question.difficulty as 'easy' | 'medium' | 'hard'}
              topic={question.topic}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            해당 과목의 문제가 없습니다.
          </div>
        )}
      </div>

      {/* 통계 정보 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">문제 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">총 문제 수:</span>{' '}
            {filteredQuestions.length}개
          </div>
          <div>
            <span className="font-medium">출처:</span>{' '}
            {questionsData.metadata.sources.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}
