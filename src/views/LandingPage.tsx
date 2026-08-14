import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  BrainCircuit,
  MessageSquare,
  Target,
  Zap,
  ChevronDown,
  Layers,
  BarChart3,
  CheckCircle2,
  Lock,
  Cpu,
  HelpCircle,
  Instagram,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasCompletedOnboarding, activeResumeProfile } = useAuth();
  const [demoWhyOpen, setDemoWhyOpen] = useState(true);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (!hasCompletedOnboarding && !activeResumeProfile) {
        navigate('/onboarding');
      } else {
        navigate('/app/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-900 selection:bg-violet-200 selection:text-violet-900 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-violet-100" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  InterviewAI
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold bg-violet-100 text-violet-800 rounded-full border border-violet-200">
                  RESUME GROUNDED
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-violet-700 transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('practice')}
                className="hover:text-violet-700 transition-colors cursor-pointer"
              >
                Practice
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('why-interviewai')}
                className="hover:text-violet-700 transition-colors cursor-pointer"
              >
                Why InterviewAI
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="hover:text-violet-700 transition-colors cursor-pointer"
              >
                Features
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {isAuthenticated ? 'Open App' : 'Login'}
              </button>
              <button
                onClick={handleGetStarted}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-violet-700 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2 group cursor-pointer"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 border border-violet-200/90 text-violet-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5 text-violet-700" />
            <span>FastAPI + Gemini + Semantic Resume Parsing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.1] mb-6 font-serif">
            Turn your resume into your{' '}
            <span className="text-violet-700 italic underline decoration-violet-300 decoration-wavy decoration-2">
              personal interview advantage
            </span>
            .
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            InterviewAI understands your projects, skills and experience — then turns them
            into personalized interview questions you can actually practice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-slate-900 hover:bg-violet-700 rounded-2xl shadow-xl shadow-slate-900/10 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Start your preparation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Interactive Dashboard Live Preview / Practice Section */}
          <div id="practice" className="relative max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0B1120] text-slate-200 shadow-2xl p-4 sm:p-6 md:p-8 text-left overflow-hidden scroll-mt-24">
            {/* Subtle Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Window Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">
                  interviewai.app/app/questions
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-violet-950/80 text-violet-300 border border-violet-800/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  Resume Grounded
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  60% Cache Hit Rate
                </span>
              </div>
            </div>

            {/* Question Card Preview */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 relative">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-violet-900/50 text-violet-300 border border-violet-700/50">
                    QUESTION 04
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                    Technical
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50">
                    Medium
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>Project:</span>
                  <span className="text-violet-300 font-medium bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                    Object Detection & Analytics System
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-white mb-4 leading-snug">
                "You mentioned building an object detection application using YOLOv8 and Flask.
                Why did you choose YOLOv8 over SSD or Faster R-CNN, and how did you minimize latency for live video streams?"
              </h3>

              {/* Why was I asked this? Accordion */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDemoWhyOpen(!demoWhyOpen)}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Why was I asked this? (Resume Evidence)
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${demoWhyOpen ? 'rotate-180' : ''}`} />
                </button>

                {demoWhyOpen && (
                  <div className="mt-3 p-4 rounded-xl bg-violet-950/40 border border-violet-800/40 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 border-b border-violet-900/40">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Detected Skill</span>
                        <span className="text-slate-200 font-medium">YOLOv8 & Computer Vision</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Section Reference</span>
                        <span className="text-slate-200 font-medium">Projects &gt; Object Detection</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-mono uppercase">Focus</span>
                        <span className="text-slate-200 font-medium">Latency & Model Architecture</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Resume Evidence Snippet</span>
                      <p className="text-slate-300 italic font-mono text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800">
                        "Benchmarked YOLOv8 models reducing inference latency by 32% via TensorRT export on live 45+ fps video streams."
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Answer Box Mock */}
              <div className="mt-5 p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">AI Evaluation Score: 88/100</span> — Highlighted TensorRT FP16 quantization & Redis queue decoupling.
                </div>
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Full Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works / Product Story Pipeline Section */}
        <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-violet-700 tracking-wider uppercase bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                The Product Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-4 mb-4 font-serif">
                From raw resume to confident interview mastery
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Unlike generic chatbot prompts, InterviewAI reconstructs your authentic candidate profile and tests you with grounded interview scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
              {[
                { step: '01', title: 'Resume', desc: 'Upload PDF / DOCX with drag & drop', icon: FileCheck },
                { step: '02', title: 'Structured Profile', desc: 'Extracts skills, projects & evidence', icon: Layers },
                { step: '03', title: 'Personalized Questions', desc: 'Tailored to your specific stack', icon: BrainCircuit },
                { step: '04', title: 'Practice', desc: 'Write or speak your answers', icon: MessageSquare },
                { step: '05', title: 'AI Feedback', desc: 'Scores, missing points & ideal answers', icon: Target },
                { step: '06', title: 'Mock Interview', desc: 'Simulated multi-round pressure', icon: Zap },
                { step: '07', title: 'Performance', desc: 'Actionable readiness analytics', icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="relative p-5 rounded-2xl bg-[#FBF9F5] border border-slate-200/80 flex flex-col items-center group hover:border-violet-400 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-violet-700 uppercase mb-1">
                      Step {item.step}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why InterviewAI / Core Differentiator */}
        <section id="why-interviewai" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-4 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Evidence-Grounded Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6 font-serif">
                Why generic ChatGPT prompts fail you in real interviews
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Interviewers don’t ask generic trivia — they scrutinize the bullet points on your resume. If you wrote about Redis caching or YOLOv8 optimization, they will ask you about race conditions, memory bottlenecks, and model export tradeoffs.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct Resume Evidence Citations</h4>
                    <p className="text-xs text-slate-600">Every question links explicitly to a section and highlight from your actual resume.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Multi-Dimensional Evaluation Feedback</h4>
                    <p className="text-xs text-slate-600">Get granular breakdowns: What you did well, What you missed, How to improve, and an Ideal Answer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Smart Cache-Hit Optimization</h4>
                    <p className="text-xs text-slate-600">High-throughput caching serves recurring technical taxonomy instantly while generating deep bespoke project questions with Gemini.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Spotlight Card */}
            <div id="features" className="bg-[#0B1120] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  Evidence Grounding Breakdown
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  100% Verifiable
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase mb-1">Your Resume Highlight</div>
                  <div className="text-amber-200">
                    "Refactored legacy database queries, reducing average execution duration by 45% using composite B-tree indexes."
                  </div>
                </div>

                <div className="text-center text-slate-500 font-bold">↓ Parsed & Grounded ↓</div>

                <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-800/40">
                  <div className="text-violet-300 text-[10px] uppercase mb-1">Interviewer Question Generated</div>
                  <div className="text-white">
                    "What was the EXPLAIN ANALYZE plan output before and after your composite index refactoring, and how did you prevent index bloat?"
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                  <div className="text-slate-400 text-[10px] uppercase mb-1">Evaluation Focus</div>
                  <div className="text-slate-300">
                    Tests PostgreSQL query execution internals, lock contention, and index selectivity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-slate-900 text-white text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif">
              Ready to master your next technical or behavioral interview?
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Upload your resume, see your structured profile, and start practicing evidence-grounded questions in seconds.
            </p>
            <div>
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-8 py-4 text-base font-bold text-slate-900 bg-white hover:bg-violet-100 rounded-2xl shadow-xl transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Start Your Preparation Free</span>
                <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Landing Page Footer */}
      <footer className="w-full bg-[#FBF9F5] border-t border-slate-200/90 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* LEFT: InterviewAI name / logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-violet-100" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              InterviewAI
            </span>
          </div>

          {/* CENTER: Social Media Icons Only */}
          <div className="flex items-center gap-5 text-slate-500">
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              aria-label="Instagram"
              className="p-2 rounded-full hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#linkedin"
              onClick={(e) => e.preventDefault()}
              aria-label="LinkedIn"
              className="p-2 rounded-full hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#github"
              onClick={(e) => e.preventDefault()}
              aria-label="GitHub"
              className="p-2 rounded-full hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#twitter"
              onClick={(e) => e.preventDefault()}
              aria-label="Twitter"
              className="p-2 rounded-full hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* RIGHT: Privacy | Terms | Contact */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-violet-700 transition-colors cursor-pointer"
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-violet-700 transition-colors cursor-pointer"
            >
              Terms
            </a>
            <a
              href="#contact"
              onClick={(e) => e.preventDefault()}
              className="hover:text-violet-700 transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
