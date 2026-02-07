"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO: Implement Supabase authentication
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            검시AI
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">로그인</h1>
          <p className="text-gray-600">AI 튜터와 함께 학습을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            로그인
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="#" className="text-blue-600 hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            회원가입
          </Link>
        </div>
      </Card>
    </div>
  );
}
