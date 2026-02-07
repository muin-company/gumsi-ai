'use client';

interface ExplanationPanelProps {
  explanation: string;
  isCorrect: boolean;
}

export default function ExplanationPanel({
  explanation,
  isCorrect,
}: ExplanationPanelProps) {
  return (
    <div
      className={`mt-6 p-4 rounded-lg border-2 ${
        isCorrect
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <>
            <span className="text-2xl">🎉</span>
            <h3 className="text-lg font-bold text-green-800">정답입니다!</h3>
          </>
        ) : (
          <>
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-red-800">아쉽지만 오답이에요</h3>
          </>
        )}
      </div>
      <div className="bg-white p-3 rounded border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-1">해설</h4>
        <p className="text-gray-800">{explanation}</p>
      </div>
    </div>
  );
}
