import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Clock,
  Layers,
  FileCheck,
  Award,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  BarChart2,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api';
import { DashboardMetrics } from '../types';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeResumeProfile, activeResumeHash } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const candidateName =
    activeResumeProfile?.structured_profile?.name ||
    user?.full_name ||
    'Candidate';

  const structured = activeResumeProfile?.structured_profile;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900">
            {getGreeting()}, {candidateName.split(' ')[0]}.
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Your interview prep is {metrics?.average_score || 84}% complete for the week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchMetrics();
            }}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => navigate('/app/prepare')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
          >
            <Target className="w-4 h-4" />
            <span>Start Preparation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Profile Card */}
          <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">
                Current Profile
              </span>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {structured?.name || 'Full Stack Developer'}
              </h2>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {(structured?.skills && Array.isArray(structured.skills)
                  ? structured.skills.slice(0, 5)
                  : ['FastAPI', 'Python', 'React.js', 'Redis', 'MongoDB', 'Docker']
                ).map((sk: string) => (
                  <span
                    key={sk}
                    className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600 border border-gray-100 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
                <span>Resume:</span>
                <button
                  onClick={() => navigate('/app/resume')}
                  className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                >
                  <span>{activeResumeProfile ? `${candidateName.toLowerCase().replace(/\s+/g, '_')}_cv.pdf` : 'Upload CV'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Circular Readiness Widget */}
            <div className="w-32 h-32 relative z-10 shrink-0 self-center md:self-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="339.29"
                  strokeDashoffset={`${339.29 * (1 - (metrics?.average_score || 84) / 100)}`}
                  strokeLinecap="round"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-gray-900 font-serif">
                  {metrics?.average_score || 84}%
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold">
                  Readiness
                </span>
              </div>
            </div>

            {/* Ambient subtle glow */}
            <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Quick Preparation Pathways Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Specific Job */}
            <div
              onClick={() => navigate('/app/prepare?mode=job')}
              className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm hover:border-orange-200 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full uppercase">
                  Job Match
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Prepare for Specific Job
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Calibrate questions and practice directly with a target job description.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 pt-1">
                <span>Configure Position &rarr;</span>
              </div>
            </div>

            {/* Self Paced */}
            <div
              onClick={() => navigate('/app/prepare')}
              className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm hover:border-indigo-200 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full uppercase">
                  Resume-Grounded
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Self-Paced Comprehensive Prep
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Practice questions tailored across your projects, stack, and experience.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 pt-1">
                <span>Start Practice &rarr;</span>
              </div>
            </div>
          </div>

          {/* Sub-grid: Recent Performance & AI Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Performance */}
            <div className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Recent Performance
                </h3>
                <button
                  onClick={() => navigate('/app/performance')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Details →
                </button>
              </div>

              <div className="space-y-4">
                {/* Bar chart visual */}
                <div className="flex justify-between items-end h-24 gap-2 px-2 pt-2">
                  <div className="w-full bg-gray-100 rounded-t-sm h-[40%]" title="Mon: 40%" />
                  <div className="w-full bg-gray-100 rounded-t-sm h-[60%]" title="Tue: 60%" />
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[85%]" title="Wed: 85%" />
                  <div className="w-full bg-gray-100 rounded-t-sm h-[50%]" title="Thu: 50%" />
                  <div className="w-full bg-gray-100 rounded-t-sm h-[75%]" title="Fri: 75%" />
                  <div className="w-full bg-indigo-300 rounded-t-sm h-[90%]" title="Sat: 90%" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase px-1 font-mono">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>

              {/* Latest session item */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Last Round: <strong>Full Stack Mock</strong></span>
                <span className="font-semibold text-emerald-600">88/100</span>
              </div>
            </div>

            {/* AI Generation Dark Card */}
            <div className="bg-[#121212] text-white p-6 rounded-[24px] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider font-mono">
                    AI Generation
                  </h3>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Questions Requested</span>
                    <span className="text-sm font-mono text-white">
                      {metrics?.cached_questions ? metrics.cached_questions + metrics.fresh_questions : 20}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Cached (Fast)</span>
                    <span className="text-sm font-mono text-indigo-400">
                      {metrics?.cached_questions || 12}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Fresh Generation</span>
                    <span className="text-sm font-mono text-orange-400">
                      {metrics?.fresh_questions || 8}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/90">Cache Hit Rate</span>
                      <span className="text-sm font-bold text-green-400 font-mono">
                        {metrics?.cache_hit_rate || 60}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-white/40 mt-4 leading-tight italic">
                Powered by Gemini with semantic resume grounding.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Skill Analysis Card */}
          <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Analysis</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-700">Technical Accuracy</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {metrics?.technical_score || 86}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.technical_score || 86}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-700">HR & Behavioral</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {metrics?.hr_score || 78}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.hr_score || 78}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-700">Aptitude Logic</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {metrics?.aptitude_score || 82}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.aptitude_score || 82}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Needs Practice */}
            <div className="mt-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Needs Practice
              </h4>
              <div className="space-y-2">
                {(metrics?.weak_skills || ['System Design', 'Problem Solving']).slice(0, 2).map(
                  skill => (
                    <div
                      key={skill}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl"
                    >
                      <span className="text-xs font-medium text-red-700">{skill}</span>
                      <button
                        onClick={() => navigate('/app/prepare')}
                        className="text-[10px] font-bold text-red-700 hover:underline"
                      >
                        Practice &rarr;
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Next Mock Session Callout */}
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-[32px] space-y-3">
            <h3 className="text-sm font-bold text-orange-800">Next Mock Session</h3>
            <p className="text-xs text-orange-700/80 leading-relaxed">
              Focus on: Scalability and Distributed Systems based on your Object Detection project claims.
            </p>
            <button
              onClick={() => navigate('/app/prepare')}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Configure & Start Prep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
