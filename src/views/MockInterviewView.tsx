import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  Sparkles,
  Sliders,
  FileText,
  Target,
  ArrowRight,
  Shield,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sessionApi, dashboardApi } from '../api';
import { SessionHistoryItem } from '../types';

export const MockInterviewView: React.FC = () => {
  const navigate = useNavigate();
  const { activeResumeProfile, activeResumeHash } = useAuth();

  // Setup parameters
  const [selectedType, setSelectedType] = useState<string>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // Past interview sessions
  const [pastSessions, setPastSessions] = useState<SessionHistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const metrics = await dashboardApi.getDashboardMetrics();
        // Check local custom history first
        const customHist = localStorage.getItem('interviewai_custom_history');
        if (customHist) {
          const parsed = JSON.parse(customHist);
          setPastSessions(parsed);
        } else {
          setPastSessions(metrics.session_history || []);
        }
      } catch (err) {
        console.error('Failed to load session history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const typeTitles: Record<string, string> = {
        mixed: 'Mixed Technical & Resume-Grounded Round',
        technical: 'Deep Distributed & Technical Architecture',
        behavioral: 'STAR Behavioral & Engineering Leadership',
        scaling: 'High-Scale Concurrency & System Scaling'
      };

      const sessionRes = await sessionApi.createSession({
        resume_hash: activeResumeHash || 'res_default',
        mode: selectedType === 'behavioral' ? 'role_based' : 'self_based',
        title: typeTitles[selectedType] || 'Mock Interview Round',
        role: targetRole,
        difficulty: selectedDifficulty,
        total_questions: questionCount
      });

      // Navigate to the isolated full-screen route
      navigate(`/interview/session/${sessionRes.session_id}`);
    } catch (err) {
      console.error('Failed to initialize mock interview session:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const interviewTypes = [
    {
      id: 'mixed',
      title: 'Mixed / Real Interview',
      description: 'Balanced technical stack, project architecture, and behavioral STAR questions.',
      tag: 'Recommended'
    },
    {
      id: 'technical',
      title: 'Deep Technical & Coding',
      description: 'System fundamentals, language internals, database indexing, and query optimization.',
      tag: 'Technical'
    },
    {
      id: 'behavioral',
      title: 'Behavioral & Leadership',
      description: 'STAR methodology inquiries, conflict resolution, cross-functional collaboration, and deadlines.',
      tag: 'STAR Focus'
    },
    {
      id: 'scaling',
      title: 'System Scaling & Fault Tolerance',
      description: 'Distributed rate limiting, asynchronous queues, caching tiers, and recovery protocols.',
      tag: 'High Scale'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Full-Screen Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Experience realistic, distraction-free conversational interviews evaluated against your verified resume background.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-mono bg-white px-3.5 py-2 rounded-full border border-gray-200 text-gray-700 shadow-xs">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>{activeResumeProfile?.filename || 'AlexChen_Resume.pdf'}</span>
          </div>
        </div>
      </div>

      {/* Main Setup Configuration Card */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-8">
        {/* Step 1: Select Interview Type */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold font-mono text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Select Interview Round Type</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interviewTypes.map(type => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  selectedType === type.id
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{type.title}</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                    {type.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{type.description}</p>
                <div className="flex items-center text-[11px] font-semibold text-indigo-600 pt-1">
                  <span>{selectedType === type.id ? 'Selected' : 'Select Round'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Target Position & Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          {/* Target Role */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono text-gray-900 uppercase tracking-wider block">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Difficulty Tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono text-gray-900 uppercase tracking-wider block">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono text-gray-900 uppercase tracking-wider block">
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 8].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    questionCount === count
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Launch Banner & CTA */}
        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 font-serif">
                Isolated Distraction-Free Environment
              </h4>
              <p className="text-[11px] text-indigo-800">
                Mock interview will launch in a full-screen layout with real-time feedback, scratchpad, and timer.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isStarting}
            onClick={handleStartInterview}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isStarting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Simulation...</span>
              </>
            ) : (
              <>
                <span>Start Mock Interview</span>
                <PlayCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Completed Interviews Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-bold font-serif text-gray-900">
              Completed Interview History
            </h2>
          </div>
          <button
            onClick={() => navigate('/app/performance')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            View All Performance Analytics →
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm divide-y divide-gray-100">
          {pastSessions.slice(0, 4).map(sess => (
            <div
              key={sess.id || sess.session_id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 font-serif">
                    {sess.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                  <span>{sess.date}</span>
                  <span>•</span>
                  <span>{sess.questions_attempted} Questions Attempted</span>
                  <span>•</span>
                  <span>{sess.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-900 block">
                    Score: {sess.score}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600">Evaluated</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/interview/session/${sess.session_id || sess.id}/complete`)}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-700 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Review Interview</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
