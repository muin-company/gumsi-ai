import { supabase } from './supabase';

export interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  eventType: string;
  eventName?: string;
  eventData?: Record<string, any>;
}

export interface ChatInteractionData {
  userId: string;
  sessionId?: string;
  subject?: string;
  topic?: string;
  userMessage: string;
  aiResponse: string;
  responseTimeMs: number;
}

export interface QuestionAttemptData {
  userId: string;
  sessionId?: string;
  questionId: string;
  subject: string;
  difficulty?: string;
  topic?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
}

export interface SessionInfo {
  deviceType: string;
  userAgent: string;
  ipAddress?: string;
}

/**
 * Track a general user event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const { error } = await supabase.from('user_events').insert({
      user_id: event.userId,
      session_id: event.sessionId,
      event_type: event.eventType,
      event_name: event.eventName,
      event_data: event.eventData || {},
    });

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (err) {
    console.error('Analytics error:', err);
  }
}

/**
 * Track a chat interaction with the AI tutor
 */
export async function trackChatInteraction(data: ChatInteractionData): Promise<void> {
  try {
    const { error } = await supabase.from('chat_interactions').insert({
      user_id: data.userId,
      session_id: data.sessionId,
      subject: data.subject,
      topic: data.topic,
      user_message: data.userMessage,
      ai_response: data.aiResponse,
      response_time_ms: data.responseTimeMs,
    });

    if (error) {
      console.error('Chat tracking error:', error);
    }
  } catch (err) {
    console.error('Chat tracking error:', err);
  }
}

/**
 * Track a practice question attempt
 */
export async function trackQuestionAttempt(data: QuestionAttemptData): Promise<void> {
  try {
    const { error } = await supabase.from('question_attempts').insert({
      user_id: data.userId,
      session_id: data.sessionId,
      question_id: data.questionId,
      subject: data.subject,
      difficulty: data.difficulty,
      topic: data.topic,
      user_answer: data.userAnswer,
      is_correct: data.isCorrect,
      time_spent_seconds: data.timeSpentSeconds,
    });

    if (error) {
      console.error('Question tracking error:', error);
    }
  } catch (err) {
    console.error('Question tracking error:', err);
  }
}

/**
 * Start a new user session
 * Returns session ID for tracking subsequent events
 */
export async function startSession(
  userId: string,
  deviceInfo: SessionInfo
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        device_type: deviceInfo.deviceType,
        user_agent: deviceInfo.userAgent,
        ip_address: deviceInfo.ipAddress,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Session start error:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Session start error:', err);
    return null;
  }
}

/**
 * End a user session and calculate duration
 */
export async function endSession(sessionId: string): Promise<void> {
  try {
    // Get session start time
    const { data: session, error: fetchError } = await supabase
      .from('user_sessions')
      .select('session_start')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError);
      return;
    }

    const sessionEnd = new Date();
    const sessionStart = new Date(session.session_start);
    const durationSeconds = Math.floor(
      (sessionEnd.getTime() - sessionStart.getTime()) / 1000
    );

    const { error } = await supabase
      .from('user_sessions')
      .update({
        session_end: sessionEnd.toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Session end error:', error);
    }
  } catch (err) {
    console.error('Session end error:', err);
  }
}

/**
 * Detect device type from user agent
 */
export function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  
  return 'desktop';
}

/**
 * Get current user session ID from localStorage
 * (For client-side tracking)
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gumsi_session_id');
}

/**
 * Set current session ID in localStorage
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gumsi_session_id', sessionId);
}

/**
 * Clear session ID from localStorage
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gumsi_session_id');
}
