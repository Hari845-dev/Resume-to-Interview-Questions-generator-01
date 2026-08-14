import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Filter,
  Layers,
  HelpCircle,
  ChevronRight,
  Clock,
  Award,
  PlayCircle,
  Calculator,
  BookOpen,
  Puzzle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { aptitudeApi } from '../api';
import { AptitudeQuestion, AptitudeCategory, Difficulty } from '../types';

export const AptitudeView: React.FC = () => {
  const navigate = useNavigate();

  // Setup screen vs Active practice
  const [isInSetup, setIsInSetup] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active session state
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [results, setResults] = useState<Array<{ questionId: string; selected: number; correct: number; isCorrect: boolean }>>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer
  useEffect(() => {
    if (!isInSetup && !isFinished) {
      const timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInSetup, isFinished]);

  // Trigger confetti on finish
  useEffect(() => {
    if (isFinished) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isFinished]);

  const handleStartPractice = async () => {
    setLoading(true);
    try {
      const data = await aptitudeApi.getAptitudeQuestions(
        selectedCategory === 'All' ? undefined : selectedCategory,
        selectedDifficulty === 'All' ? undefined : selectedDifficulty
      );
      const sliced = data.slice(0, questionCount);
      setQuestions(sliced.length > 0 ? sliced : data);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setResults([]);
      setIsFinished(false);
      setElapsedSeconds(0);
      setIsInSetup(false);
    } catch (err) {
      console.error('Failed to load aptitude questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.question_id,
        selected: selectedAnswer,
        correct: currentQuestion.correct_answer || 0,
        isCorrect
      }
    ]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setIsInSetup(true);
    setIsFinished(false);
    setResults([]);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const currentQuestion: AptitudeQuestion | undefined = questions[currentIndex];
  const totalCorrect = results.filter(r => r.isCorrect).length;
  const accuracyPercent = results.length > 0 ? Math.round((totalCorrect / results.length) * 100) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 1. SETUP SCREEN FIRST
  if (isInSetup) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-4 pb-16">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              STANDARDIZED APTITUDE & DIAGNOSTIC PRACTICE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-1">
            Choose what you want to practise
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Select an assessment category, calibrate question difficulty, and test your problem-solving speed with instant feedback.
          </p>
        </div>

        {/* Category Cards */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
              1. Assessment Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'Quantitative',
                  name: 'Quantitative Ability',
                  desc: 'Percentages, ratios, algebra, probability, time & work',
                  icon: Calculator,
                  color: 'text-indigo-600 bg-indigo-50'
                },
                {
                  id: 'Logical',
                  name: 'Logical Reasoning',
                  desc: 'Pattern sequences, syllogisms, deduction, spatial logic',
                  icon: Puzzle,
                  color: 'text-purple-600 bg-purple-50'
                },
                {
                  id: 'Verbal',
                  name: 'Verbal & Comprehension',
                  desc: 'Grammar correction, vocabulary in context, critical reading',
                  icon: BookOpen,
                  color: 'text-orange-600 bg-orange-50'
                },
                {
                  id: 'All',
                  name: 'Comprehensive Diagnostic (Mixed)',
                  desc: 'Balanced cross-domain aptitude assessment',
                  icon: Layers,
                  color: 'text-green-600 bg-green-50'
                }
              ].map(cat => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      active
                        ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100/50 ring-2 ring-indigo-600/10'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                        {active && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
                2. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDifficulty(d)}
                    className={`py-2.5 rounded-xl text-xs font-bold uppercase font-mono border transition-all ${
                      selectedDifficulty === d
                        ? d === 'Hard'
                          ? 'bg-red-600 text-white border-red-600'
                          : d === 'Easy'
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

            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-3">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                      questionCount === cnt
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="p-6 rounded-[28px] bg-[#121212] text-white shadow-xl flex items-center justify-between gap-4">
          <div className="text-xs text-white/70 font-mono">
            {selectedCategory} • {questionCount} questions • {selectedDifficulty} tier
          </div>

          <button
            onClick={handleStartPractice}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading Questions...</span>
              </span>
            ) : (
              <>
                <span>Start Aptitude Practice</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 2. COMPLETION SUMMARY SCREEN
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6 pb-16">
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-gray-100 shadow-sm text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-green-50 text-green-700 border border-green-200 uppercase">
              Aptitude Practice Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-3">
              Assessment Summary
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Category: <strong className="text-gray-900">{selectedCategory}</strong> • Difficulty: <strong className="text-gray-900">{selectedDifficulty}</strong>
            </p>
          </div>

          {/* Metric Box */}
          <div className="p-6 rounded-[24px] bg-[#121212] text-white shadow-lg grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase block">Score</span>
              <span className="text-3xl font-bold font-serif text-indigo-400">
                {totalCorrect} / {questions.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase block">Accuracy</span>
              <span className="text-3xl font-bold font-serif text-green-400">
                {accuracyPercent}%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase block">Time Taken</span>
              <span className="text-2xl font-bold font-mono text-white pt-1 block">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Set</span>
            </button>

            <button
              onClick={() => navigate('/app/performance')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <span>View Performance History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ONE-QUESTION-AT-A-TIME PRACTICE FLOW
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Session Top Bar */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestart}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900"
          >
            Exit Test
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs font-mono font-bold text-gray-900">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-900 text-white">
                QUESTION {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-indigo-50 text-indigo-700">
                {currentQuestion.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-50 text-amber-700">
                {currentQuestion.difficulty}
              </span>
            </div>

            {isAnswerSubmitted && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 ${
                  selectedAnswer === currentQuestion.correct_answer
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Correct
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-600" /> Incorrect
                  </>
                )}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const optLetter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedAnswer === optIdx;
              const isCorrectOpt = isAnswerSubmitted && optIdx === currentQuestion.correct_answer;
              const isWrongOpt = isAnswerSubmitted && isSelected && !isCorrectOpt;

              let btnStyles = 'bg-gray-50 border-gray-100 text-gray-800 hover:bg-gray-100';
              if (isSelected && !isAnswerSubmitted) {
                btnStyles = 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100';
              } else if (isCorrectOpt) {
                btnStyles = 'bg-green-50 border-green-300 text-green-900 font-bold';
              } else if (isWrongOpt) {
                btnStyles = 'bg-red-50 border-red-300 text-red-900';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-[20px] border text-left text-xs transition-all flex items-start gap-3 ${btnStyles}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                      isSelected && !isAnswerSubmitted
                        ? 'bg-white text-indigo-700'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    {optLetter}
                  </span>
                  <span className="leading-snug pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Submit Action */}
          {!isAnswerSubmitted && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 transition-all disabled:opacity-40"
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Explanation Rationale Card */}
          {isAnswerSubmitted && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-fade-in">
              <div className="p-4 rounded-[20px] bg-[#121212] text-white border border-white/10 text-xs space-y-1.5">
                <div className="font-bold text-indigo-400 uppercase font-mono text-[10px]">
                  Solution & Explanation
                </div>
                <p className="text-white/80 leading-relaxed font-mono">
                  {currentQuestion.explanation}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 transition-all flex items-center gap-1.5"
                >
                  <span>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'View Test Results'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
