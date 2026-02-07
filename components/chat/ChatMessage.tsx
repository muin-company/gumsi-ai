'use client';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎓</span>
            <span className="text-sm font-semibold text-gray-700">검시 선생님</span>
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          {content.split('\n').map((line, i) => (
            <p key={i} className={isUser ? 'text-white' : 'text-gray-900'}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
