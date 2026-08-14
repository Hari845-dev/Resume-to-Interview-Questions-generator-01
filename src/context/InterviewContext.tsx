import React, { createContext, useContext, useState } from 'react';
import {
  InterviewQuestion,
  GenerationSummary,
  SessionResponse,
  AnswerFeedback,
  SubmitAnswerResponse,
  SessionStatsResponse
} from '../types';
import { interviewApi, sessionApi } from '../api';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  questions: InterviewQuestion[];
  generationSummary: GenerationSummary | null;
  isGenerating: boolean;
  currentSession: SessionResponse | null;
  activeQuestionIndex: number;
  activeFeedback: AnswerFeedback | null;
  activeFollowUp: InterviewQuestion | null;
  isSubmittingAnswer: boolean;
  sessionStats: SessionStatsResponse | null;
  generateQuestions: (resumeHash?: string, count?: number) => Promise<InterviewQuestion[]>;
  startSession: (questionsToUse?: InterviewQuestion[]) => Promise<SessionResponse>;
  submitAnswer: (questionId: string, answer: string) => Promise<SubmitAnswerResponse>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  resetSession: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeResumeHash } = useAuth();

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [generationSummary, setGenerationSummary] = useState<GenerationSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [currentSession, setCurrentSession] = useState<SessionResponse | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [activeFeedback, setActiveFeedback] = useState<AnswerFeedback | null>(null);
  const [activeFollowUp, setActiveFollowUp] = useState<InterviewQuestion | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState<SessionStatsResponse | null>(null);

  const generateQuestions = async (resumeHash?: string, count: number = 20): Promise<InterviewQuestion[]> => {
    const hash = resumeHash || activeResumeHash || 'res_default';
    setIsGenerating(true);
    try {
      const res = await interviewApi.generateQuestions({
        resume_hash: hash,
        mode: 'self_based',
        total_questions: count
      });
      setQuestions(res.questions);
      setGenerationSummary(res.generation_summary);
      return res.questions;
    } finally {
      setIsGenerating(false);
    }
  };

  const startSession = async (questionsToUse?: InterviewQuestion[]): Promise<SessionResponse> => {
    const hash = activeResumeHash || 'res_default';
    const qs = questionsToUse || (questions.length > 0 ? questions : await generateQuestions(hash, 6));

    const sessionRes = await sessionApi.createSession({
      resume_hash: hash,
      mode: 'self_based',
      questions: qs,
      total_questions: qs.length
    });

    setCurrentSession(sessionRes);
    setActiveQuestionIndex(0);
    setActiveFeedback(null);
    setActiveFollowUp(null);
    setSessionStats(null);
    return sessionRes;
  };

  const submitAnswer = async (questionId: string, answer: string): Promise<SubmitAnswerResponse> => {
    if (!currentSession) {
      throw new Error('No active interview session');
    }
    setIsSubmittingAnswer(true);
    try {
      const res = await sessionApi.submitAnswer(currentSession.session_id, {
        question_id: questionId,
        user_answer: answer
      });

      setActiveFeedback(res.feedback);
      if (res.follow_up_question) {
        setActiveFollowUp(res.follow_up_question);
      } else {
        setActiveFollowUp(null);
      }

      return res;
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const nextQuestion = () => {
    if (!currentSession) return;
    setActiveFeedback(null);
    setActiveFollowUp(null);

    if (activeQuestionIndex < currentSession.questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      // Fetch completion statistics
      sessionApi.getSessionStats(currentSession.session_id).then(stats => {
        setSessionStats(stats);
      });
    }
  };

  const prevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
      setActiveFeedback(null);
      setActiveFollowUp(null);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (currentSession && index >= 0 && index < currentSession.questions.length) {
      setActiveQuestionIndex(index);
      setActiveFeedback(null);
      setActiveFollowUp(null);
    }
  };

  const resetSession = () => {
    setCurrentSession(null);
    setActiveQuestionIndex(0);
    setActiveFeedback(null);
    setActiveFollowUp(null);
    setSessionStats(null);
  };

  return (
    <InterviewContext.Provider
      value={{
        questions,
        generationSummary,
        isGenerating,
        currentSession,
        activeQuestionIndex,
        activeFeedback,
        activeFollowUp,
        isSubmittingAnswer,
        sessionStats,
        generateQuestions,
        startSession,
        submitAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        resetSession
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
