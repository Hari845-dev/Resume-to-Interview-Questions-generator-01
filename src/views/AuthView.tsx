import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Server,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthView: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, backendUrl, hasCompletedOnboarding, activeResumeProfile } = useAuth();
  
  // LOGIN MUST ALWAYS BE THE DEFAULT STATE
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAccountNotFoundError, setIsAccountNotFoundError] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const switchToSignup = () => {
    setIsLogin(false);
    setErrorMsg(null);
    setIsAccountNotFoundError(false);
    setSuccessMsg(null);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setErrorMsg(null);
    setIsAccountNotFoundError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsAccountNotFoundError(false);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Authenticate existing user
        await login(email, password);
        if (!hasCompletedOnboarding && !activeResumeProfile) {
          navigate('/onboarding');
        } else {
          navigate('/app/dashboard');
        }
      } else {
        // Registration Flow: NEVER auto login
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        if (!password) {
          throw new Error('Please enter a password.');
        }

        await register(email, password, fullName.trim());

        // Return to Login page with success message
        setIsLogin(true);
        setPassword(''); // User manually enters password to sign in
        setSuccessMsg('Account created successfully. Please sign in.');
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please check credentials.';
      setErrorMsg(msg);
      
      // Detect if the error indicates account not found
      if (
        err.code === 'ACCOUNT_NOT_FOUND' ||
        msg.toLowerCase().includes('no account found') ||
        msg.toLowerCase().includes('user not found') ||
        msg.toLowerCase().includes('not found')
      ) {
        setIsAccountNotFoundError(true);
      } else {
        setIsAccountNotFoundError(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-violet-600 selection:text-white font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-violet-700/30 mb-4">
            <Sparkles className="w-6 h-6 text-violet-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
            {isLogin ? 'Welcome back to InterviewAI' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {isLogin
              ? 'Sign in to continue your personalized interview practice.'
              : 'Join InterviewAI to turn your resume into personalized questions.'}
          </p>
        </div>

        {/* Success Notification */}
        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
            {isAccountNotFoundError && isLogin && (
              <div className="pl-6.5 pt-1">
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="text-violet-300 hover:text-white font-semibold underline decoration-violet-400 underline-offset-2 transition-colors inline-flex items-center gap-1"
                >
                  <span>Create an account</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
              {isLogin ? 'Email / Username' : 'Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </span>
            ) : (
              <>
                <span>{isLogin ? 'Continue to InterviewAI' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Subtle Toggle Below Button */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? (
            <span>
              New to InterviewAI?{' '}
              <button
                type="button"
                onClick={switchToSignup}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline underline-offset-2 ml-1"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline underline-offset-2 ml-1"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* Backend Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>
            API Endpoint:{' '}
            <span className="font-mono text-slate-400">{backendUrl}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
