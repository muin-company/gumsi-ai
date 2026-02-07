"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              검시AI
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`${
                isActive("/") ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors`}
            >
              홈
            </Link>
            <Link
              href="/dashboard"
              className={`${
                isActive("/dashboard") ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors`}
            >
              대시보드
            </Link>
            <Link
              href="/tutor"
              className={`${
                isActive("/tutor") ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors`}
            >
              AI 튜터
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
