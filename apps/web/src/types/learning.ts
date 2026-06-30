export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  chapterCount: number;
  totalQuestions: number;
  estimatedHours: number;
  icon: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  index: number;
  description: string;
  keyPoints: string[];
  questionCount: number;
  estimatedMinutes: number;
}

export interface ExerciseQuestion {
  id: string;
  chapterId: string;
  type:
    | "single_choice"
    | "multiple_choice"
    | "true_false"
    | "short_answer"
    | "calculation";
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  knowledgePoint: string;
}

export interface SubmitResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  knowledgePoint: string;
  score: number;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  errorReason: string;
  knowledgePoint: string;
  errorCount: number;
  lastPracticeAt: string;
  createdAt: string;
}

export interface StudyReport {
  totalStudyHours: number;
  completedChapters: number;
  totalChapters: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  knowledgeMastery: Array<{ name: string; mastery: number }>;
  weakPoints: string[];
  studySuggestions: string[];
  streakDays: number;
  todayStudyMinutes: number;
}

export interface AIExplanation {
  knowledgePoint: string;
  definition: string;
  detailedExplanation: string;
  examFocus: string;
  commonQuestionTypes: string[];
  classicExample: string;
  memoryTips: string;
  furtherReading: string;
}
