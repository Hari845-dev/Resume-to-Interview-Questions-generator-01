import React, { useState } from 'react';
import {
  Settings,
  Server,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBaseApiUrl } from '../api';

export const SettingsView: React.FC = () => {
  const {
    user,
    backendConnected,
    backendUrl,
    setBackendUrl,
    checkBackendHealth,
    preferences,
    updatePreferences
  } = useAuth();

  const [inputUrl, setInputUrl] = useState<string>(backendUrl);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [role, setRole] = useState(preferences.targetRole || 'Software Engineering');
  const [exp, setExp] = useState(preferences.experienceLevel || 'Intermediate');
  const [diff, setDiff] = useState(preferences.difficulty || 'Medium');

  const handleSaveBackendUrl = async () => {
    setTestingConnection(true);
    setStatusFeedback(null);
    try {
      setBackendUrl(inputUrl);
      const isAlive = await checkBackendHealth();
      if (isAlive) {
        setStatusFeedback('Successfully connected to FastAPI backend!');
      } else {
        setStatusFeedback('Backend configured. Note: Server did not respond to /health or /docs. Local fallback engine will handle requests seamlessly.');
      }
    } catch {
      setStatusFeedback('Saved. Local fallback engine active.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSavePreferences = () => {
    updatePreferences({
      targetRole: role,
      experienceLevel: exp as any,
      difficulty: diff as any
    });
    setStatusFeedback('Preferences successfully updated!');
  };

  const handleResetCache = () => {
    localStorage.removeItem('interviewai_active_resume_hash');
    localStorage.removeItem('interviewai_active_resume_profile');
    localStorage.removeItem('interviewai_onboarding_done');
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            PREFERENCES & INFRASTRUCTURE
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-1">
          Settings & Environment
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure backend API endpoints, interview calibration, and account data.
        </p>
      </div>

      {statusFeedback && (
        <div className="p-4 rounded-[20px] bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs flex items-center justify-between animate-fade-in">
          <span>{statusFeedback}</span>
          <button onClick={() => setStatusFeedback(null)} className="font-bold text-indigo-700">✕</button>
        </div>
      )}

      {/* BACKEND API CONFIGURATION */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900 font-serif">
              FastAPI Backend Endpoint
            </h2>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 ${
              backendConnected
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {backendConnected ? 'Connected to FastAPI' : 'Active Local Fallback'}
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          The frontend communicates with your FastAPI backend repository. If running locally, specify your host (default: <code className="font-mono text-gray-800 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">http://localhost:8000</code>).
        </p>

        <div>
          <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
            Backend API Base URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] font-mono text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
            <button
              onClick={handleSaveBackendUrl}
              disabled={testingConnection}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {testingConnection ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Save & Ping</span>
            </button>
          </div>
        </div>
      </div>

      {/* INTERVIEW CALIBRATION PREFERENCES */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Zap className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-gray-900 font-serif">
            Interview Calibration
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
              Target Discipline / Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Product Management">Product Management</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="AI / Machine Learning">AI / Machine Learning</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                Experience Level
              </label>
              <select
                value={exp}
                onChange={e => setExp(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              >
                <option value="Beginner">Beginner (0 - 1 years)</option>
                <option value="Intermediate">Intermediate (2 - 4 years)</option>
                <option value="Advanced">Advanced (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                Interview Difficulty
              </label>
              <select
                value={diff}
                onChange={e => setDiff(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 transition-all"
          >
            Save Calibration
          </button>
        </div>
      </div>

      {/* ACCOUNT & LOCAL RESET */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-bold text-gray-900 font-serif">
            Account & Session Management
          </h2>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <strong>Logged in as:</strong> {user?.full_name || 'Candidate'} ({user?.email})
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleResetCache}
            className="px-5 py-2.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cached Profile & Session Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
