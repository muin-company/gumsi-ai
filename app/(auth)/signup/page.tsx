"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    // TODO: Implement Supabase authentication
    console.log("Signup attempt:", { email, password, name });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            검시AI
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">회원가입</h1>
          <p className="text-gray-600">무료로 AI 튜터를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            label="이메일"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="비밀번호"
            placeholder="8자 이상 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <Input
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            회원가입
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          회원가입 시{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            로그인
          </Link>
        </div>
      </Card>
    </div>
  );
}
