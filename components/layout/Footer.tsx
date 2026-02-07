export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">검시AI</h3>
            <p className="text-gray-600 text-sm">
              AI 기반 검정고시 학습 플랫폼
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>AI 튜터</li>
              <li>문제풀이</li>
              <li>학습 분석</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">정보</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>이용약관</li>
              <li>개인정보처리방침</li>
              <li>문의하기</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © 2026 검시AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
