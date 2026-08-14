import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react';
import { dashboardApi } from '../api';
import { DashboardMetrics } from '../types';

export const PerformanceView: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardApi.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load performance metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const history = React.useMemo(() => {
    try {
      const customHist = localStorage.getItem('interviewai_custom_history');
      if (customHist) {
        const parsed = JSON.parse(customHist);
        const defaultHist = metrics?.session_history || [];
        const customIds = new Set(parsed.map((p: any) => p.id || p.session_id));
        const filteredDefault = defaultHist.filter(d => !customIds.has(d.id) && !customIds.has(d.session_id));
        return [...parsed, ...filteredDefault];
      }
    } catch {}
    return metrics?.session_history || [];
  }, [metrics]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            ANALYTICS & READINESS REPORT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-1">
            Interview Performance
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your score velocity, skill diagnostics, and longitudinal interview readiness.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/prepare')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>Launch New Interview</span>
        </button>
      </div>

      {/* TOP METRICS SCORE CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Average Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 font-serif">
              {metrics?.average_score || 84}%
            </span>
            <span className="text-green-600 text-xs font-mono font-semibold">+4.2%</span>
          </div>
          <p className="text-[11px] text-gray-500">Across all completed rounds</p>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Technical Mastery
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-600 font-serif">
              {metrics?.technical_score || 86}%
            </span>
          </div>
          <p className="text-[11px] text-gray-500">FastAPI, Python, Architecture</p>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            HR & Behavioral
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600 font-serif">
              {metrics?.hr_score || 78}%
            </span>
          </div>
          <p className="text-[11px] text-gray-500">STAR method & leadership</p>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Aptitude & Logic
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600 font-serif">
              {metrics?.aptitude_score || 82}%
            </span>
          </div>
          <p className="text-[11px] text-gray-500">Quantitative & reasoning</p>
        </div>
      </div>

      {/* SKILL READINESS PROGRESS BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">
              Category Competency Breakdown
            </h3>
            <p className="text-xs text-gray-500">Evaluated from your resume grounding and answer depth</p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Technical Depth & Architecture', score: metrics?.technical_score || 86, color: 'bg-indigo-600' },
              { label: 'Project Verification & Rationale', score: 88, color: 'bg-blue-600' },
              { label: 'Quantitative & Logical Aptitude', score: metrics?.aptitude_score || 82, color: 'bg-green-600' },
              { label: 'Behavioral & Communication', score: metrics?.hr_score || 78, color: 'bg-orange-500' },
              { label: 'Answer Consistency & Accuracy', score: metrics?.accuracy || 88, color: 'bg-purple-600' },
            ].map(cat => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                  <span>{cat.label}</span>
                  <span className="font-mono">{cat.score}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STRONG VS WEAK SKILLS MATRIX */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">
              Verified Skills Matrix
            </h3>
            <p className="text-xs text-gray-500">Areas with verified strength vs targeted improvement</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-green-800 flex items-center gap-1.5 mb-2 font-mono uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>Strong Mastery</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(metrics?.strong_skills || ['FastAPI', 'Redis', 'YOLOv8', 'Docker', 'PostgreSQL']).map(sk => (
                  <span
                    key={sk}
                    className="px-3 py-1.5 rounded-full bg-green-50 text-green-900 border border-green-200 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2 font-mono uppercase">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Needs Practice</span>
              </div>
              <div className="space-y-2">
                {(metrics?.weak_skills || ['High Concurrency System Design', 'Clock Drift Synchronization']).map(sk => (
                  <div
                    key={sk}
                    className="p-3 rounded-[18px] bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="text-amber-900 font-medium">{sk}</span>
                    <button
                      onClick={() => navigate('/app/prepare')}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
                    >
                      Practice →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SESSION HISTORY TABLE */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">
              Interview History Log
            </h3>
            <p className="text-xs text-gray-500">Historical performance records</p>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {history.length} Sessions Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Session Title</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Questions Attempted</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((sess, idx) => (
                <tr key={sess.id || idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 font-bold text-gray-900">{sess.title}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
                      {sess.type}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-500 font-mono">{sess.date}</td>
                  <td className="py-3.5 text-gray-700 font-mono">
                    {sess.questions_attempted} / {sess.total_questions}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`font-bold font-mono px-2.5 py-0.5 rounded-full text-xs ${
                        sess.score >= 85
                          ? 'bg-green-50 text-green-700'
                          : sess.score >= 75
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {sess.score}%
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/interview/session/${sess.session_id || sess.id}/complete`)}
                      className="px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/60 text-indigo-700 font-semibold text-xs transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Review Interview</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
