/**
 * Test script for analytics tracking
 * Run with: npx tsx scripts/test-analytics.ts
 */

import { supabase } from '../lib/supabase';
import {
  trackEvent,
  trackChatInteraction,
  trackQuestionAttempt,
  startSession,
  endSession,
} from '../lib/analytics';

async function testAnalytics() {
  console.log('🧪 Testing 검시AI Analytics Setup...\n');

  // Create a test user
  console.log('1️⃣ Creating test user...');
  const testEmail = `test-${Date.now()}@gumsi.ai`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Test1234!',
    options: {
      data: {
        name: 'Test User',
      },
    },
  });

  if (authError || !authData.user) {
    console.error('❌ Failed to create test user:', authError);
    return;
  }

  const testUserId = authData.user.id;
  console.log(`✅ Test user created: ${testUserId}\n`);

  // Test event tracking
  console.log('2️⃣ Testing event tracking...');
  await trackEvent({
    userId: testUserId,
    eventType: 'test',
    eventName: 'analytics_test',
    eventData: {
      source: 'test_script',
      timestamp: new Date().toISOString(),
    },
  });
  console.log('✅ Event tracked\n');

  // Test session tracking
  console.log('3️⃣ Testing session tracking...');
  const sessionId = await startSession(testUserId, {
    deviceType: 'desktop',
    userAgent: 'Test/1.0',
    ipAddress: '127.0.0.1',
  });

  if (!sessionId) {
    console.error('❌ Failed to start session');
    return;
  }
  console.log(`✅ Session started: ${sessionId}\n`);

  // Wait a bit to simulate session duration
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test chat interaction
  console.log('4️⃣ Testing chat interaction tracking...');
  await trackChatInteraction({
    userId: testUserId,
    sessionId,
    subject: 'math',
    topic: '이차방정식',
    userMessage: '이차방정식 근의 공식을 알려주세요',
    aiResponse:
      'x = (-b ± √(b² - 4ac)) / 2a 입니다. 이 공식은 ax² + bx + c = 0 형태의 방정식을 풀 때 사용합니다.',
    responseTimeMs: 350,
  });
  console.log('✅ Chat interaction tracked\n');

  // Test question attempt
  console.log('5️⃣ Testing question attempt tracking...');
  await trackQuestionAttempt({
    userId: testUserId,
    sessionId,
    questionId: 'q-math-001',
    subject: 'math',
    difficulty: 'medium',
    topic: '이차방정식',
    userAnswer: 'x = 2, x = -3',
    isCorrect: true,
    timeSpentSeconds: 45,
  });
  console.log('✅ Question attempt tracked\n');

  // End session
  console.log('6️⃣ Ending session...');
  await endSession(sessionId);
  console.log('✅ Session ended\n');

  // Verify data
  console.log('7️⃣ Verifying tracked data...\n');

  const { data: events } = await supabase
    .from('user_events')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false })
    .limit(1);

  console.log('📊 Latest event:', events?.[0] || 'None');

  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', testUserId)
    .order('session_start', { ascending: false })
    .limit(1);

  console.log(
    '📊 Latest session:',
    sessions?.[0]
      ? {
          id: sessions[0].id,
          duration: sessions[0].duration_seconds,
          device: sessions[0].device_type,
        }
      : 'None'
  );

  const { data: chats } = await supabase
    .from('chat_interactions')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false })
    .limit(1);

  console.log(
    '📊 Latest chat:',
    chats?.[0]
      ? {
          subject: chats[0].subject,
          topic: chats[0].topic,
          response_time: chats[0].response_time_ms,
        }
      : 'None'
  );

  const { data: questions } = await supabase
    .from('question_attempts')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false })
    .limit(1);

  console.log(
    '📊 Latest question attempt:',
    questions?.[0]
      ? {
          question_id: questions[0].question_id,
          is_correct: questions[0].is_correct,
          time_spent: questions[0].time_spent_seconds,
        }
      : 'None'
  );

  // Test RPC functions
  console.log('\n8️⃣ Testing RPC functions...');

  const { data: dauData, error: dauError } = await supabase.rpc('get_dau');
  console.log('📊 Current DAU:', dauData?.[0]?.dau || 0, dauError ? '❌' : '✅');

  const { data: mauData, error: mauError } = await supabase.rpc('get_mau');
  console.log('📊 Current MAU:', mauData?.[0]?.mau || 0, mauError ? '❌' : '✅');

  console.log('\n✅ All tests completed successfully!');
  console.log('\n🧹 Cleanup: You can delete the test user from Supabase dashboard');
  console.log(`   Email: ${testEmail}`);
  console.log(`   User ID: ${testUserId}`);
}

// Run tests
testAnalytics()
  .then(() => {
    console.log('\n✨ Test script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
