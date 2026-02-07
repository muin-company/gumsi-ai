'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat';

const SUBJECTS = [
  { id: '', label: '전체' },
  { id: 'korean', label: '국어' },
  { id: 'math', label: '수학' },
  { id: 'english', label: '영어' },
  { id: 'social', label: '사회' },
  { id: 'science', label: '과학' },
  { id: 'history', label: '한국사' },
];

export default function TutorPage() {
  const [selectedSubject, setSelectedSubject] = useState('');

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">💬 AI 튜터</h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="subject" className="text-sm font-medium text-gray-700">
            과목 선택:
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {SUBJECTS.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 채팅 인터페이스 */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface subject={selectedSubject || undefined} />
      </div>
    </div>
  );
}
