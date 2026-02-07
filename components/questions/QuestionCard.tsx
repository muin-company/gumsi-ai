'use client';

import Link from 'next/link';

interface QuestionCardProps {
  id: string;
  number: number;
  question: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

const difficultyLabels = {
  easy: '하',
  medium: '중',
  hard: '상',
};

export default function QuestionCard({
  id,
  number,
  question,
  subject,
  difficulty,
  topic,
}: QuestionCardProps) {
  return (
    <Link href={`/questions/${id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              문제 {number}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${difficultyColors[difficulty]}`}
            >
              {difficultyLabels[difficulty]}
            </span>
          </div>
          <span className="text-xs text-gray-500">{topic}</span>
        </div>
        <p className="text-gray-800 line-clamp-2">{question}</p>
      </div>
    </Link>
  );
}
