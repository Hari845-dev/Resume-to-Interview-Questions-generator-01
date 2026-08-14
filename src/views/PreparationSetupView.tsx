import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Target,
  Zap,
  UploadCloud,
  ChevronRight,
  Clock,
  PlayCircle,
  RefreshCw,
  Award,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { QuestionSetRecord, InterviewQuestion } from '../types';

const RECENT_SETS_KEY = 'interviewai_previous_question_sets';

function getStoredQuestionSets(): QuestionSetRecord[] {
  try {
    const raw = localStorage.getItem(RECENT_SETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Default initial set
  return [
    {
      id: 'set_default_fullstack',
      title: 'Full Stack Architecture & Redis Caching',
      role: 'Senior Full Stack Engineer',
      company: 'Tech Corp',
      mode: 'role_based',
      date: new Date(Date.now() - 86400000).toISOString(),
      questions_count: 10,
      difficulty: 'medium',
      questions: []
    }
  ];
}

function saveStoredQuestionSet(record: QuestionSetRecord) {
  try {
    const list = getStoredQuestionSets();
    const filtered = list.filter(s => s.id !== record.id);
    const updated = [record, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_SETS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export const PreparationSetupView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeResumeHash, activeResumeProfile } = useAuth();
  const { isGenerating, generateQuestions, startSession } = useInterview();

  // Mode Selection: default to role_based if url param says so, otherwise self_based
  const initialMode = searchParams.get('mode') === 'job' ? 'role_based' : 'self_based';
  const [prepMode, setPrepMode] = useState<'self_based' | 'role_based'>(initialMode);

  // Setup modal/drawer visibility when triggered from action cards
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(true);

  // Specific Job Fields
  const [jobTitle, setJobTitle] = useState<string>('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState<string>('Tech Corp');
  const [jobDescription, setJobDescription] = useState<string>(
    'We are seeking an experienced Full Stack Engineer proficient in Python (FastAPI/Django), TypeScript, React, and distributed caching (Redis). Experience in scaling high-throughput microservices and deploying with Docker/Kubernetes is highly desirable.'
  );

  // Calibration options
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [focusCategories, setFocusCategories] = useState<{
    project: boolean;
    technical: boolean;
    experience: boolean;
    problem_solving: boolean;
    hr: boolean;
  }>({
    project: true,
    technical: true,
    experience: true,
    problem_solving: true,
    hr: true
  });

  const [isStartingMockDirectly, setIsStartingMockDirectly] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [previousSets, setPreviousSets] = useState<QuestionSetRecord[]>([]);

  useEffect(() => {
    setPreviousSets(getStoredQuestionSets());
  }, []);

  const toggleCategory = (cat: keyof typeof focusCategories) => {
    setFocusCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleGenerate = async (startMock: boolean = false) => {
    setGenerationError(null);
    setIsStartingMockDirectly(startMock);

    try {
      const generated = await generateQuestions(
        activeResumeHash || undefined,
        questionCount
      );

      // Save question set to history
      const newSet: QuestionSetRecord = {
        id: `set_${Date.now()}`,
        title: prepMode === 'role_based' ? `${jobTitle} (${companyName || 'Target Role'})` : 'Comprehensive Resume Grounding',
        role: prepMode === 'role_based' ? jobTitle : undefined,
        company: prepMode === 'role_based' ? companyName : undefined,
        mode: prepMode,
        date: new Date().toISOString(),
        questions_count: generated.length,
        difficulty: difficulty,
        questions: generated,
        resume_hash: activeResumeHash || undefined
      };
      saveStoredQuestionSet(newSet);
      setPreviousSets(getStoredQuestionSets());

      if (startMock) {
        const sessionRes = await startSession(generated);
        navigate(`/interview/session/${sessionRes.session_id}`);
      } else {
        navigate('/app/questions');
      }
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate questions. Please try again.');
    }
  };

  const handleOpenPreviousSet = async (set: QuestionSetRecord, startMock: boolean = false) => {
    if (set.questions && set.questions.length > 0) {
      if (startMock) {
        const sessionRes = await startSession(set.questions);
        navigate(`/interview/session/${sessionRes.session_id}`);
      } else {
        navigate('/app/questions');
      }
    } else {
      // Re-generate if empty
      setPrepMode(set.mode);
      if (set.role) setJobTitle(set.role);
      if (set.company) setCompanyName(set.company);
      setIsSetupOpen(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const candidateName =
    activeResumeProfile?.structured_profile?.name || 'Candidate';

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            PREPARATION WORKSPACE & CALIBRATION HUB
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-1">
          How do you want to prepare today?
        </h1>
        <p className="text-gray-500 text-sm mt-1 max-w-2xl">
          Choose a tailored preparation path, configure specific role requirements, or resume practice from your saved question sets.
        </p>
      </div>

      {/* Resume Status Banner */}
      {!activeResumeProfile ? (
        <div className="p-6 rounded-[28px] bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">No Active Resume Selected</h4>
              <p className="text-xs text-amber-800/80">
                Upload your resume first to unlock exact project grounding and verified snippet citations.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/resume')}
            className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm shrink-0 transition-colors"
          >
            Upload / Select Resume
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Active Resume: {candidateName}
              </h4>
              <p className="text-xs text-gray-500 font-mono">
                {activeResumeProfile.structured_profile?.projects?.length || 0} projects detected • {Array.isArray(activeResumeProfile.structured_profile?.skills) ? activeResumeProfile.structured_profile.skills.length : 12} skills indexed
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/resume')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Resumes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* CORE PATHWAYS SELECTION CARDS */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
          1. Choose Preparation Pathway
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pathway 1: Specific Job Preparation */}
          <div
            onClick={() => {
              setPrepMode('role_based');
              setIsSetupOpen(true);
            }}
            className={`p-7 rounded-[32px] border-2 cursor-pointer transition-all ${
              prepMode === 'role_based'
                ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100/50 ring-4 ring-indigo-600/10'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              {prepMode === 'role_based' && (
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SELECTED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Specific Job Preparation
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Prepare for a particular role using the job description. Evaluates technical stack overlap, role-specific edge cases, and required competencies.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-mono text-orange-900">
                JD Overlap Matching
              </span>
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-mono text-orange-900">
                Role Calibration
              </span>
            </div>
          </div>

          {/* Pathway 2: Self-Paced Preparation */}
          <div
            onClick={() => {
              setPrepMode('self_based');
              setIsSetupOpen(true);
            }}
            className={`p-7 rounded-[32px] border-2 cursor-pointer transition-all ${
              prepMode === 'self_based'
                ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100/50 ring-4 ring-indigo-600/10'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              {prepMode === 'self_based' && (
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SELECTED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Self-Paced Comprehensive Prep
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Practice based on your resume, skills, projects, and work history. Generates a balanced mix of architectural, problem-solving, and STAR behavioral questions.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono text-indigo-900">
                All Projects
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono text-indigo-900">
                Core Stack
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono text-indigo-900">
                STAR Leadership
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: JOB DETAILS (IF ROLE-BASED) */}
      {prepMode === 'role_based' && (
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
              2. Target Position Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                Target Role / Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                Target Company (Optional)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Google"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
              Job Description (JD Text)
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements, responsibilities, and qualifications..."
              className="w-full p-4 rounded-xl border border-gray-200 bg-[#FDFCF9] text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>
        </div>
      )}

      {/* STEP 3: SESSION CALIBRATION & FILTERS */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
            {prepMode === 'role_based' ? '3.' : '2.'} Calibration Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question Count */}
          <div>
            <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
              Question Count: <strong className="text-gray-900 font-mono">{questionCount} Questions</strong>
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                    questionCount === cnt
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
              Difficulty Tier
            </label>
            <div className="flex items-center gap-2">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase font-mono border transition-all ${
                    difficulty === d
                      ? d === 'hard'
                        ? 'bg-red-600 text-white border-red-600'
                        : d === 'easy'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Categories */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
            Question Category Distribution
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { key: 'project', label: 'Projects & Code' },
              { key: 'technical', label: 'Architecture' },
              { key: 'experience', label: 'Work History' },
              { key: 'problem_solving', label: 'System Scaling' },
              { key: 'hr', label: 'Behavioral STAR' }
            ].map(cat => {
              const active = focusCategories[cat.key as keyof typeof focusCategories];
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => toggleCategory(cat.key as keyof typeof focusCategories)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    active
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[11px] leading-tight">{cat.label}</span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {generationError && (
        <div className="p-4 rounded-[20px] bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <span>{generationError}</span>
          <button
            onClick={() => setGenerationError(null)}
            className="font-bold text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* ACTION LAUNCH BAR */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-[#121212] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">
              Ready to generate evidence-grounded questions
            </h4>
          </div>
          <p className="text-xs text-white/60 font-mono">
            FastAPI + Gemini semantic reasoning • {questionCount} questions • {difficulty} tier
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleGenerate(false)}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating && !isStartingMockDirectly ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </span>
            ) : (
              <span>Generate Question Bank</span>
            )}
          </button>

          <button
            onClick={() => handleGenerate(true)}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial px-7 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating && isStartingMockDirectly ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching...</span>
              </span>
            ) : (
              <>
                <span>Launch Mock Interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 4: PREVIOUS QUESTION SETS & RECENT PREPARATION */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              Previous Question Sets ({previousSets.length})
            </h2>
          </div>
        </div>

        {previousSets.length === 0 ? (
          <div className="p-8 rounded-[24px] bg-white border border-gray-100 text-center text-xs text-gray-500">
            No previous preparation sets yet. Generate your first set above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousSets.map(set => (
              <div
                key={set.id}
                className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1.5">
                    <span className="uppercase font-semibold">
                      {set.mode === 'role_based' ? 'Job Description' : 'Resume Grounded'}
                    </span>
                    <span>
                      {new Date(set.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {set.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700">
                      {set.questions_count} Questions
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-700 capitalize">
                      {set.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenPreviousSet(set, false)}
                    className="px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-all"
                  >
                    View Questions
                  </button>
                  <button
                    onClick={() => handleOpenPreviousSet(set, true)}
                    className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Practice Mock</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: RECOMMENDED PRACTICE / FOCUS AREAS */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            Recommended Practice Topics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'High-Throughput Microservices & Redis',
              type: 'Architecture & Scaling',
              count: 10,
              diff: 'Hard'
            },
            {
              title: 'STAR Behavioral Conflict & Leadership',
              type: 'HR & Management',
              count: 8,
              diff: 'Medium'
            },
            {
              title: 'Concurrency & Distributed Systems',
              type: 'Technical Problem Solving',
              count: 12,
              diff: 'Hard'
            }
          ].map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all space-y-3"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 block mb-1">
                  {rec.type}
                </span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  {rec.title}
                </h3>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-400 font-mono">{rec.count} Questions • {rec.diff}</span>
                <button
                  onClick={() => {
                    setQuestionCount(rec.count);
                    setDifficulty(rec.diff.toLowerCase() as any);
                    handleGenerate(true);
                  }}
                  className="p-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all"
                  title="Quick Start"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
