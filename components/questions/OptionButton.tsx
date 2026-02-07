'use client';

interface OptionButtonProps {
  option: string;
  index: number;
  selected: boolean;
  correct?: boolean;
  showAnswer: boolean;
  onClick: () => void;
}

export default function OptionButton({
  option,
  index,
  selected,
  correct,
  showAnswer,
  onClick,
}: OptionButtonProps) {
  const getButtonStyle = () => {
    if (showAnswer) {
      if (correct) {
        return 'bg-green-100 border-green-500 text-green-800';
      }
      if (selected && !correct) {
        return 'bg-red-100 border-red-500 text-red-800';
      }
      return 'bg-gray-50 border-gray-300 text-gray-600';
    }
    if (selected) {
      return 'bg-blue-100 border-blue-500 text-blue-800';
    }
    return 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50';
  };

  return (
    <button
      onClick={onClick}
      disabled={showAnswer}
      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${getButtonStyle()}`}
    >
      <div className="flex items-start gap-3">
        <span className="font-semibold">{option.split(' ')[0]}</span>
        <span className="flex-1">{option.substring(option.indexOf(' ') + 1)}</span>
        {showAnswer && correct && (
          <span className="text-green-600">✓</span>
        )}
        {showAnswer && selected && !correct && (
          <span className="text-red-600">✗</span>
        )}
      </div>
    </button>
  );
}
