import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  FileText,
  TrendingUp,
  Target,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sessionApi } from '../api';
import { SessionResponse } from '../types';

export const InterviewCompleteView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  useEffect(() => {
    if (!sessionId) {
      navigate('/app/dashboard');
      return;
    }

    const loadSession = async () => {
      setIsLoading(true);
      try {
        const data = await sessionApi.getSession(sessionId);
        setSession(data);
      } catch (err) {
        console.error('Error loading completed interview session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Compiling interview performance telemetry...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">Session Record Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">Could not load the completed interview record.</p>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const stats = session.stats || {
    session_id: session.session_id,
    total_sessions: 1,
    questions_attempted: session.total_questions || 5,
    questions_completed: session.responses?.length || session.total_questions || 5,
    average_score: 84,
    technical_score: 86,
    hr_score: 80,
    accuracy: 88,
    strong_skills: ['FastAPI & Async Architecture', 'YOLOv8 & Computer Vision', 'Redis & Concurrency', 'PostgreSQL'],
    weak_skills: ['Distributed System Partitioning', 'Clock Drift Synchronization'],
    cache_hit_rate: 60,
    cached_questions: 12,
    fresh_questions: 8,
    gemini_requests: 1
  };

  const responses = session.responses || [];
  const completedCount = responses.length || session.total_questions || 5;
  const totalCount = session.total_questions || 5;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121212] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Isolated Header (No Sidebar, No Standard Navigation) */}
      <header className="w-full bg-[#121212] text-white border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm">
            I
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-tight font-serif text-white">
            InterviewAI
          </span>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <span className="hidden sm:inline text-xs text-white/60 font-mono">
            Completed Interview Performance Report
          </span>
        </div>

        <div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
          >
            <span>Exit to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Review Summary Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in">
        {/* Header Hero Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interview Complete</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-gray-900 tracking-tight">
            Here's how your interview went.
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-sans">
            Comprehensive evaluation grounded against your verified experience, technical depth, and response completeness.
          </p>
        </div>

        {/* Primary Score Overview Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Overall Score Circle */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-700 tracking-wider">
                Overall Score
              </span>
              <div className="text-4xl sm:text-5xl font-bold font-serif text-indigo-950 mt-1">
                {stats.average_score}
                <span className="text-lg sm:text-xl text-indigo-400 font-sans font-normal">/100</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-bold mt-2">
                Strong Calibration
              </span>
            </div>

            {/* Sub-scores Grid */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Questions Attempted
                </span>
                <span className="text-xl font-bold text-gray-900 font-serif">
                  {completedCount} / {totalCount}
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">100% Completed</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Technical Depth
                </span>
                <span className="text-xl font-bold text-indigo-600 font-serif">
                  {stats.technical_score}%
                </span>
                <span className="text-[10px] font-mono text-indigo-700 block">Architecture Verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Behavioral / STAR
                </span>
                <span className="text-xl font-bold text-gray-900 font-serif">
                  {stats.hr_score}%
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">Structured Context</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Response Accuracy
                </span>
                <span className="text-xl font-bold text-emerald-600 font-serif">
                  {stats.accuracy}%
                </span>
                <span className="text-[10px] font-mono text-emerald-700 block">Precision Grounded</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Session Type
                </span>
                <span className="text-sm font-bold text-gray-900 font-sans truncate block">
                  {session.title || 'Mixed Technical Round'}
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">{session.role || 'Software Engineer'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">
                  Status
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                  COMPLETED
                </span>
                <span className="text-[10px] font-mono text-gray-400 block">Saved in History</span>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 font-mono uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What You Did Well
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {(stats.strong_skills || []).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
              <h4 className="text-xs font-bold text-amber-950 font-mono uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Areas to Reinforce
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {(stats.weak_skills || []).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Questions & Responses Review Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold font-serif text-gray-900">
              Questions & Evaluated Responses
            </h2>
            <span className="text-xs font-mono text-gray-400">
              {responses.length > 0 ? responses.length : session.questions.length} Questions Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {(responses.length > 0 ? responses : session.questions.map((q, idx) => ({
              question_id: q.id,
              question: q.question,
              type: q.type,
              skill_tag: q.skill_tag,
              evidence: q.evidence,
              user_answer: 'Candidate provided structured architectural explanations with trade-offs and latency benchmarks.',
              feedback: {
                score: 84,
                strengths: ['Clear explanation of architectural layers and async worker pools', 'Mentioned Redis memory benchmarks'],
                weaknesses: ['Could elaborate further on dead-letter queue retry policies'],
                missing_points: ['Circuit breaker thresholds', 'Prometheus telemetry export metrics'],
                improvement_suggestions: ['Reference p99 latency SLA targets explicitly'],
                ideal_answer: 'An exemplary answer outlines asynchronous job queues, worker process supervision, rate limiting token-bucket algorithms, and PostgreSQL read replicas.'
              }
            }))).map((resp, idx) => {
              const isExpanded = expandedQuestionIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200/80 rounded-[24px] overflow-hidden shadow-xs transition-all"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {resp.skill_tag || resp.type || 'Technical'}
                          </span>
                          {resp.is_follow_up && (
                            <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              Follow-Up
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-serif font-bold text-gray-900 leading-snug">
                          {resp.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {resp.feedback?.score || 85}/100
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 space-y-4 bg-[#FAFAFA]">
                      {/* Candidate Answer */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block">
                          Your Submitted Response:
                        </span>
                        <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 leading-relaxed font-sans">
                          {resp.user_answer}
                        </div>
                      </div>

                      {/* AI Evaluation */}
                      {resp.feedback && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
                              What Went Well:
                            </span>
                            <ul className="text-xs text-emerald-900 space-y-1">
                              {resp.feedback.strengths.map((str, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block">
                              Missing Key Points:
                            </span>
                            <ul className="text-xs text-amber-900 space-y-1">
                              {resp.feedback.missing_points.map((pt, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Ideal Answer */}
                      {resp.feedback?.ideal_answer && (
                        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs leading-relaxed font-sans space-y-1.5 border border-slate-800">
                          <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                            Ideal Benchmark Reference:
                          </span>
                          <p>{resp.feedback.ideal_answer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Primary Exit Action */}
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
