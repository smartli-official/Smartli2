export type SubscriptionTier = 'Free' | 'Plus' | 'Pro';

export type Priority = 'Low' | 'Medium' | 'High';

export type AIExplainerMode = 'explainer' | 'tutor' | 'eli5';

export type QuizType = 'mcq' | 'exam' | 'competency' | 'reasoning';

export type QuizSectionKey = 'mcq' | 'competency' | 'critical' | 'justification';
export type QuizDifficulty = 'Light' | 'Easy' | 'Medium' | 'Hard' | 'Extra Hard' | 'Ultra';
export type TimerCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
import type { AIModelId } from '@/lib/ai/config';

export type { AIModelId };

export interface QuizSectionConfig {
  enabled: boolean;
  count: number;
}

export interface QuizConfig {
  sections: Record<QuizSectionKey, QuizSectionConfig>;
  sectionOrder: QuizSectionKey[];
  difficulty: QuizDifficulty;
  model: AIModelId;
  extraNotes: string;
  timeLimitMinutes: number | null;
  timerCorner: TimerCorner;
  files: File[];
}

export interface QuizItem {
  id: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  modelAnswer?: string;
  explanation?: string;
}

export interface QuizResultSection {
  key: QuizSectionKey;
  title: string;
  questions: QuizItem[];
}

export interface QuizMaterialFile {
  name: string;
  words: number;
  status: 'ok' | 'failed';
  error?: string;
}

export interface QuizResult {
  sections: QuizResultSection[];
  material: {
    files: QuizMaterialFile[];
    topics: string[];
    summary: string;
  };
}

export type GradeVerdict = 'correct' | 'partial' | 'incorrect';

export interface GradeResult {
  verdict: GradeVerdict;
  feedback: string;
}

export interface AIRequest {
  prompt: string;
  context?: string;
  mode?: AIExplainerMode;
  quizType?: QuizType;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  grade_level: string;
  curriculum: string;
  subscription_status: SubscriptionTier;
  updated_at: string;
}

export interface StudyTask {
  id: string;
  user_id: string;
  title: string;
  priority: Priority;
  subject: string;
  deadline: Date;
  completed: boolean;
  created_at: string;
}

export interface QuizSet {
  id: string;
  user_id: string;
  title: string;
  type: QuizType;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface TopicMastery {
  subject: string;
  percentage: number;
  lastUpdated: string;
}

export interface DashboardStats {
  user_id: string;
  totalStudyTime: number; // in minutes
  currentStreak: number;
  mastery: TopicMastery[];
}
