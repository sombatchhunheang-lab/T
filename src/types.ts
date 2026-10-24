export interface QuestionOption {
  id: number;
  value: string;
  label: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctIndex: number;
}

export interface ETestModule {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectEn: string;
  views: number;
  participants: number;
  durationMinutes: number;
  questionCountPerExam: number;
  title: string;
  questions: Question[];
}

export interface SubjectCategory {
  id: number;
  nameKh: string;
  nameEn: string;
  categoryId: number;
}

export interface ExamAnswerRecord {
  questionId: number;
  questionText: string;
  options: QuestionOption[];
  selectedOptionIndex: number | null;
  correctOptionIndex: number;
  isCorrect: boolean;
}

export interface ExamAttemptRecord {
  id: string;
  testId: number;
  testTitle: string;
  subjectName: string;
  subjectEn: string;
  mode: 'exam' | 'full_pool';
  startedAt: string;
  completedAt: string;
  durationUsedSeconds: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  answers: ExamAnswerRecord[];
}
