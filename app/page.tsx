import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              검정고시 합격, <br />
              <span className="text-blue-600">AI와 함께라면 쉽습니다</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              24시간 언제든지, 나만의 AI 튜터와 함께 <br />
              맞춤형 학습으로 검정고시를 준비하세요
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">무료로 시작하기</Button>
              </Link>
              <Link href="/tutor">
                <Button variant="outline" size="lg">
                  체험해보기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">왜 검시AI인가요?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card hover>
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI 맞춤 학습</h3>
                <p className="text-gray-600">
                  나의 학습 수준과 이해도를 분석하여 맞춤형 문제와 설명을 제공합니다
                </p>
              </Card>

              <Card hover>
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">24시간 질문 가능</h3>
                <p className="text-gray-600">
                  언제든지 궁금한 점을 물어보세요. AI 튜터가 즉시 답변합니다
                </p>
              </Card>

              <Card hover>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">학습 분석</h3>
                <p className="text-gray-600">
                  내 학습 패턴과 약점을 분석하여 효율적인 학습 방향을 제시합니다
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
            <p className="text-xl mb-8 opacity-90">
              회원가입 후 무료로 AI 튜터를 체험할 수 있습니다
            </p>
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 border-white"
              >
                무료 체험 시작하기
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
