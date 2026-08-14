import { apiFetch } from './client';
import {
  CreateSessionRequest,
  SessionResponse,
  SessionAnswerRequest,
  SubmitAnswerResponse,
  SessionStatsResponse,
  InterviewQuestion
} from '../types';
import { generateMockFeedback, SAMPLE_QUESTIONS } from './mockData';

export const sessionApi = {
  async createSession(payload: CreateSessionRequest): Promise<SessionResponse> {
    try {
      const response = await apiFetch<SessionResponse>('/sessions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        console.warn('Backend unavailable, initiating local interview session:', err.message);

        const questions = payload.questions && payload.questions.length > 0
          ? payload.questions
          : SAMPLE_QUESTIONS.slice(0, payload.total_questions || 5);

        const sessionId = 'sess_' + Date.now().toString(36);
        const sessionState: SessionResponse = {
          session_id: sessionId,
          resume_hash: payload.resume_hash,
          mode: payload.mode || 'self_based',
          title: payload.title || 'Mixed Technical & Grounded Round',
          role: payload.role || 'Software Engineer',
          difficulty: payload.difficulty || 'medium',
          total_questions: questions.length,
          current_question_index: 0,
          questions: questions,
          created_at: new Date().toISOString(),
          status: 'in_progress',
          responses: []
        };

        sessionStorage.setItem(`interviewai_session_${sessionId}`, JSON.stringify(sessionState));
        return sessionState;
      }
      throw err;
    }
  },

  async getSession(sessionId: string): Promise<SessionResponse> {
    try {
      const response = await apiFetch<SessionResponse>(`/sessions/${sessionId}`);
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        const stored = sessionStorage.getItem(`interviewai_session_${sessionId}`) ||
          localStorage.getItem(`interviewai_session_${sessionId}`);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // fallback below
          }
        }

        // Generate synthetic completed review session for historical items (e.g. sess_101, sess_102)
        const qs = SAMPLE_QUESTIONS.slice(0, 5);
        const sampleResponses = qs.map((q, idx) => {
          const sampleAnswer = idx === 0
            ? 'We opted for YOLOv8 over SSD due to superior mAP on small object geometries, and utilized TensorRT FP16 quantization to achieve sub-22ms frame inference.'
            : idx === 1
            ? 'We structured distributed rate limiting using Redis sliding window logs in Go, with atomic Lua scripts to prevent concurrent race conditions.'
            : idx === 2
            ? 'In our FastAPI microservice, we decoupled incoming requests with an async Celery worker pool and configured PostgreSQL connection pooling via asyncpg.'
            : idx === 3
            ? 'I navigated conflict during a tight deadline by establishing measurable latency criteria with the product lead, presenting benchmark charts to resolve disagreements.'
            : 'We handled database query degradation by analyzing EXPLAIN ANALYZE traces and creating composite B-tree indices on high-selectivity filtering columns.';

          return {
            question_id: q.id,
            question: q.question,
            type: q.type,
            skill_tag: q.skill_tag,
            evidence: q.evidence,
            user_answer: sampleAnswer,
            feedback: generateMockFeedback(sampleAnswer, q)
          };
        });

        const fallbackSession: SessionResponse = {
          session_id: sessionId,
          resume_hash: 'res_default',
          mode: 'self_based',
          title: 'Full Stack Engineering Round',
          role: 'Software Engineer',
          difficulty: 'medium',
          total_questions: qs.length,
          current_question_index: qs.length - 1,
          questions: qs,
          created_at: '2026-08-12T10:00:00Z',
          completed_at: '2026-08-12T10:24:00Z',
          status: 'completed',
          responses: sampleResponses,
          stats: {
            session_id: sessionId,
            total_sessions: 1,
            questions_attempted: 5,
            questions_completed: 5,
            average_score: 84,
            technical_score: 86,
            hr_score: 80,
            accuracy: 88,
            strong_skills: ['YOLOv8 & Computer Vision', 'FastAPI & Async Architecture', 'Redis & Concurrency', 'PostgreSQL Optimization'],
            weak_skills: ['High Concurrency System Scaling', 'Clock Drift Synchronization'],
            cache_hit_rate: 60,
            cached_questions: 12,
            fresh_questions: 8,
            gemini_requests: 1
          }
        };

        return fallbackSession;
      }
      throw err;
    }
  },

  async submitAnswer(sessionId: string, data: SessionAnswerRequest): Promise<SubmitAnswerResponse> {
    try {
      const response = await apiFetch<SubmitAnswerResponse>(`/sessions/${sessionId}/answer`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        console.warn('Backend unavailable, generating evaluation feedback locally:', err.message);

        // Retrieve existing session if present
        let session: SessionResponse | null = null;
        const stored = sessionStorage.getItem(`interviewai_session_${sessionId}`);
        if (stored) {
          try {
            session = JSON.parse(stored);
          } catch {}
        }

        let activeQuestion = session?.questions.find(q => q.id === data.question_id || q.question_id === data.question_id)
          || SAMPLE_QUESTIONS.find(q => q.id === data.question_id || q.question_id === data.question_id)
          || SAMPLE_QUESTIONS[0];

        const feedback = generateMockFeedback(data.user_answer, activeQuestion);

        // Check if question deserves a follow-up (e.g. if technical/project and score >= 60)
        let followUp: InterviewQuestion | null = null;
        if (activeQuestion.type === 'project' && feedback.score > 60 && !activeQuestion.id.includes('fu')) {
          followUp = {
            id: `${activeQuestion.id}_fu`,
            question_id: `${activeQuestion.id}_fu`,
            type: 'follow_up',
            difficulty: 'Hard',
            question: `Let's go deeper into ${activeQuestion.linked_to}: In your answer, you noted optimization strategies. What failure recovery mechanism would you invoke if one of the background inference nodes crashes during high-traffic streaming?`,
            why_asked: `Follow-up to your response on ${activeQuestion.focus}. Tests fault-tolerance and recovery design.`,
            focus: 'Fault tolerance & system recovery edge cases',
            linked_to: activeQuestion.linked_to,
            skill_tag: `${activeQuestion.skill_tag} – High Availability`,
            evidence: activeQuestion.evidence,
            expected_answer: 'Explain health checks, circuit breakers, container replica restarts, Redis queue message re-delivery, and dead-letter queues.'
          };
        }

        // Record response in session
        if (session) {
          if (!session.responses) {
            session.responses = [];
          }
          const existingIdx = session.responses.findIndex(r => r.question_id === data.question_id);
          const responseRecord = {
            question_id: data.question_id,
            question: activeQuestion.question,
            type: activeQuestion.type,
            skill_tag: activeQuestion.skill_tag,
            evidence: activeQuestion.evidence,
            user_answer: data.user_answer,
            feedback,
            is_follow_up: activeQuestion.id.includes('fu')
          };

          if (existingIdx >= 0) {
            session.responses[existingIdx] = responseRecord;
          } else {
            session.responses.push(responseRecord);
          }

          sessionStorage.setItem(`interviewai_session_${sessionId}`, JSON.stringify(session));
        }

        return {
          feedback,
          follow_up_question: followUp,
          next_question: null,
          is_completed: false,
          current_score: feedback.score
        };
      }
      throw err;
    }
  },

  async finalizeSession(sessionId: string, customStats?: Partial<SessionStatsResponse>): Promise<SessionResponse> {
    const stored = sessionStorage.getItem(`interviewai_session_${sessionId}`) ||
      localStorage.getItem(`interviewai_session_${sessionId}`);
    
    let session: SessionResponse;
    if (stored) {
      session = JSON.parse(stored);
    } else {
      session = await this.getSession(sessionId);
    }

    session.status = 'completed';
    session.completed_at = new Date().toISOString();

    const responses = session.responses || [];
    const avgScore = responses.length > 0
      ? Math.round(responses.reduce((sum, r) => sum + (r.feedback?.score || 80), 0) / responses.length)
      : 84;

    const stats: SessionStatsResponse = {
      session_id: sessionId,
      total_sessions: 1,
      questions_attempted: session.total_questions,
      questions_completed: responses.length || session.total_questions,
      average_score: customStats?.average_score || avgScore,
      technical_score: customStats?.technical_score || Math.min(100, avgScore + 3),
      hr_score: customStats?.hr_score || Math.max(70, avgScore - 4),
      accuracy: customStats?.accuracy || Math.min(100, avgScore + 5),
      strong_skills: customStats?.strong_skills || ['FastAPI & Async Architecture', 'YOLOv8 & Computer Vision', 'Redis & Concurrency', 'PostgreSQL'],
      weak_skills: customStats?.weak_skills || ['Distributed System Partitioning', 'Clock Drift Synchronization'],
      cache_hit_rate: 60,
      cached_questions: 12,
      fresh_questions: 8,
      gemini_requests: 1
    };

    session.stats = stats;
    sessionStorage.setItem(`interviewai_session_${sessionId}`, JSON.stringify(session));
    localStorage.setItem(`interviewai_session_${sessionId}`, JSON.stringify(session));

    // Also update history in localStorage
    try {
      const historyJson = localStorage.getItem('interviewai_custom_history');
      let historyList = historyJson ? JSON.parse(historyJson) : [];
      const historyItem = {
        id: sessionId,
        session_id: sessionId,
        title: session.title || 'Completed Mock Interview',
        date: new Date().toISOString().split('T')[0],
        score: stats.average_score,
        questions_attempted: stats.questions_completed,
        total_questions: session.total_questions,
        type: session.mode === 'role_based' ? 'Job Specific' : 'Full Round'
      };
      // Prepend or replace
      historyList = [historyItem, ...historyList.filter((h: any) => h.id !== sessionId && h.session_id !== sessionId)];
      localStorage.setItem('interviewai_custom_history', JSON.stringify(historyList));
    } catch {}

    return session;
  },

  async getSessionStats(sessionId: string): Promise<SessionStatsResponse> {
    try {
      const response = await apiFetch<SessionStatsResponse>(`/sessions/${sessionId}/stats`);
      return response;
    } catch (err: any) {
      if (err.status === 0 || err.status === 404 || err.status === 502) {
        const stored = sessionStorage.getItem(`interviewai_session_${sessionId}`) ||
          localStorage.getItem(`interviewai_session_${sessionId}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.stats) return parsed.stats;
          } catch {}
        }
        return {
          session_id: sessionId,
          total_sessions: 1,
          questions_attempted: 5,
          questions_completed: 5,
          average_score: 84,
          technical_score: 86,
          hr_score: 80,
          accuracy: 88,
          strong_skills: ['YOLOv8 & Computer Vision', 'FastAPI & Async Architecture', 'Redis & Concurrency'],
          weak_skills: ['Extreme Scale System Design', 'Clock Drift Synchronization'],
          cache_hit_rate: 60,
          cached_questions: 12,
          fresh_questions: 8,
          gemini_requests: 1
        };
      }
      throw err;
    }
  }
};
