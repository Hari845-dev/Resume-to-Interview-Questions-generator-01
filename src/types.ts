/**
 * InterviewAI - Type Definitions matching FastAPI Backend Schemas
 */

export type QuestionType =
  | 'project'
  | 'experience'
  | 'technical'
  | 'hr'
  | 'problem_solving'
  | 'follow_up'
  | 'aptitude'
  | 'quiz';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'Easy' | 'Medium' | 'Hard';

export type AptitudeCategory = 'Quantitative' | 'Verbal' | 'Logical';

export interface User {
  id?: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface EvidenceObject {
  source?: string;
  section: string;
  reference?: string;
  snippet: string;
}

export interface Project {
  title: string;
  description: string;
  tech_stack: string[];
  role?: string;
  highlights?: string[];
  evidence_snippet?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location?: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

export interface StructuredProfile {
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[] | {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    concepts?: string[];
  };
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
}

export interface ResumeProfileResponse {
  resume_hash: string;
  structured_profile: StructuredProfile;
  cached: boolean;
  created_at: string;
  filename?: string;
}

export interface StoredResumeItem {
  id?: string;
  resume_hash: string;
  filename: string;
  upload_date: string;
  structured_profile: StructuredProfile;
  extracted_skills: string[];
  projects_count: number;
  experience_count: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface QuestionSetRecord {
  id: string;
  title: string;
  role?: string;
  company?: string;
  mode: 'self_based' | 'role_based';
  date: string;
  questions_count: number;
  difficulty: string;
  questions: InterviewQuestion[];
  generation_summary?: GenerationSummary;
  resume_hash?: string;
}

export interface InterviewQuestion {
  id: string;
  question_id?: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  why_asked: string;
  focus: string;
  evidence: EvidenceObject;
  linked_to: string;
  skill_tag: string;
  expected_answer?: string;
  options?: string[];
}

export interface GenerationSummary {
  questions_requested: number;
  cached_questions: number;
  fresh_questions: number;
  cache_hit_rate: number; // e.g. 0.6 or 60
  gemini_requests: number;
}

export interface GenerateQuestionsRequest {
  resume_hash: string;
  jd_hash?: string | null;
  mode?: 'self_based' | 'role_based';
  total_questions?: number;
  distribution?: Record<string, number>;
}

export interface GenerateQuestionsResponse {
  questions: InterviewQuestion[];
  generation_summary: GenerationSummary;
  resume_hash: string;
  jd_hash?: string | null;
}

export interface SubmittedResponseRecord {
  question_id: string;
  question: string;
  type: QuestionType;
  skill_tag: string;
  evidence?: EvidenceObject;
  user_answer: string;
  feedback: AnswerFeedback;
  is_follow_up?: boolean;
}

export interface CreateSessionRequest {
  resume_hash: string;
  mode?: string;
  title?: string;
  role?: string;
  difficulty?: string;
  total_questions?: number;
  questions?: InterviewQuestion[];
}

export interface SessionResponse {
  session_id: string;
  resume_hash: string;
  mode: string;
  title?: string;
  role?: string;
  difficulty?: string;
  total_questions: number;
  current_question_index: number;
  questions: InterviewQuestion[];
  created_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  responses?: SubmittedResponseRecord[];
  stats?: SessionStatsResponse;
}

export interface SessionAnswerRequest {
  question_id: string;
  user_answer: string;
}

export interface AnswerFeedback {
  score: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  missing_points: string[];
  improvement_suggestions: string[];
  ideal_answer: string;
  technical_accuracy?: number;
  clarity?: number;
}

export interface SubmitAnswerResponse {
  feedback: AnswerFeedback;
  follow_up_question?: InterviewQuestion | null;
  next_question?: InterviewQuestion | null;
  is_completed: boolean;
  current_score: number;
}

export interface SessionStatsResponse {
  session_id: string;
  total_sessions: number;
  questions_attempted: number;
  questions_completed: number;
  average_score: number;
  technical_score: number;
  hr_score: number;
  accuracy: number;
  strong_skills: string[];
  weak_skills: string[];
  cache_hit_rate: number;
  cached_questions: number;
  fresh_questions: number;
  gemini_requests: number;
}

export interface SessionHistoryItem {
  id: string;
  session_id?: string;
  title: string;
  date: string;
  score: number;
  questions_attempted: number;
  total_questions: number;
  type: string;
}

export interface DashboardMetrics {
  total_sessions: number;
  questions_attempted: number;
  questions_completed: number;
  average_score: number;
  technical_score: number;
  hr_score: number;
  aptitude_score: number;
  quiz_score: number;
  accuracy: number;
  strong_skills: string[];
  weak_skills: string[];
  cache_hit_rate: number;
  cached_questions: number;
  fresh_questions: number;
  gemini_requests: number;
  session_history: SessionHistoryItem[];
}

export interface AptitudeQuestion {
  question_id: string;
  category: AptitudeCategory;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct_answer?: number; // 0, 1, 2, 3
  explanation: string;
}

export interface OnboardingPreferences {
  focus: 'interview_prep' | 'aptitude_tests';
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SystemStatus {
  connected: boolean;
  backendUrl: string;
  latencyMs?: number;
  version?: string;
}
