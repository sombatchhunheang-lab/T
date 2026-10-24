import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowLeft,
  Send,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { ETestModule, Question, ExamAttemptRecord, ExamAnswerRecord } from '../types';

interface ExamSessionViewProps {
  module: ETestModule;
  questions: Question[];
  mode: 'exam' | 'full_pool';
  onFinish: (record: ExamAttemptRecord) => void;
  onCancel: () => void;
}

export const ExamSessionView: React.FC<ExamSessionViewProps> = ({
  module,
  questions,
  mode,
  onFinish,
  onCancel,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<Record<number, boolean>>({});
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [instantCheckMode, setInstantCheckMode] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'all' | 'single'>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [startedAt] = useState<string>(() => new Date().toISOString());

  const totalSecondsLimit = module.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalSecondsLimit - elapsedSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedIds((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleReveal = (questionId: number) => {
    setRevealedIds((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  const buildAndSubmitRecord = () => {
    let correctCount = 0;
    let wrongCount = 0;

    const answers: ExamAnswerRecord[] = questions.map((q) => {
      const chosen = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : null;
      const isCorrect = chosen !== null && chosen === q.correctIndex;
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
      return {
        questionId: q.id,
        questionText: q.text,
        options: q.options,
        selectedOptionIndex: chosen,
        correctOptionIndex: q.correctIndex,
        isCorrect,
      };
    });

    const record: ExamAttemptRecord = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      testId: module.id,
      testTitle: module.title,
      subjectName: module.subjectName,
      subjectEn: module.subjectEn,
      mode,
      startedAt,
      completedAt: new Date().toISOString(),
      durationUsedSeconds: elapsedSeconds,
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      answers,
    };

    onFinish(record);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unansweredCount > 0) {
      setShowConfirmSubmit(true);
    } else {
      buildAndSubmitRecord();
    }
  };

  const scrollToQuestion = (idx: number) => {
    setActiveIndex(idx);
    if (viewLayout === 'all') {
      const el = document.getElementById(`exam-question-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderQuestionCard = (q: Question, idx: number) => {
    const selectedIdx = selectedAnswers[q.id];
    const isFlagged = !!flaggedIds[q.id];
    const isRevealed = instantCheckMode ? selectedIdx !== undefined : !!revealedIds[q.id];

    return (
      <div
        key={q.id}
        id={`exam-question-${idx}`}
        className="bg-white border border-slate-200 rounded-lg p-6 transition-colors"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono-tabular text-sm font-bold text-red-600 shrink-0">
              {idx + 1}.
            </span>
            <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {q.text}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleReveal(q.id)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              title="បង្ហាញចម្លើយត្រឹមត្រូវ (Check Answer)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isRevealed ? 'លាក់ចម្លើយ' : 'មើលចម្លើយ'}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFlag(q.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isFlagged
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
              title="ចំណាំសំណួរ (Flag for review)"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isFlagged ? 'បានចំណាំ' : 'ចំណាំ'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5 pl-6">
          {q.options.map((opt, optIdx) => {
            const isSelected = selectedIdx === optIdx;
            const isCorrectOption = q.correctIndex === optIdx;

            let optionStyle =
              'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
            if (isRevealed) {
              if (isCorrectOption) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                optionStyle =
                  'border-red-400 bg-red-50/70 text-red-950';
              }
            } else if (isSelected) {
              optionStyle =
                'border-red-600 bg-red-50/60 text-slate-900 font-semibold';
            }

            const khmerLetters = ['ក', 'ខ', 'គ', 'ឃ'];

            return (
              <label
                key={opt.id}
                onClick={() => handleSelectOption(q.id, optIdx)}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`question_${q.id}`}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => handleSelectOption(q.id, optIdx)}
                    className="w-4 h-4 accent-red-600 text-red-600 border-slate-300 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-500 w-5 shrink-0">
                    {khmerLetters[optIdx] || String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span className="text-sm sm:text-base">{opt.label}</span>
                </div>

                {isRevealed && isCorrectOption && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ចម្លើយត្រឹមត្រូវ</span>
                  </span>
                )}
                {isRevealed && isSelected && !isCorrectOption && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-700 whitespace-nowrap shrink-0">
                    <XCircle className="w-4 h-4" />
                    <span>មិនត្រឹមត្រូវ</span>
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
      {/* Top breadcrumb & return control */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 mb-1 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅបញ្ជីវិញ្ញាសា (Back to ETests)</span>
          </button>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            {module.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
            <span>មុខវិជ្ជា៖ {module.subjectName} ({module.subjectEn})</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-red-600">{questions.length} សំណួរ</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-red-600">{module.durationMinutes} នាទី</span>
            <span aria-hidden="true">·</span>
            <span>
              {mode === 'exam'
                ? 'ទម្រង់ប្រឡងផ្លូវការ (20 សំណួរចៃដន្យ)'
                : 'ទម្រង់សំណួរទាំងអស់ក្នុងឃ្លាំង'}
            </span>
          </div>
        </div>

        {/* Mode & View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewLayout('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewLayout === 'all'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              បង្ហាញទាំងអស់ ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('single')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewLayout === 'single'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ម្តងមួយសំណួរ (1 by 1)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setInstantCheckMode((prev) => !prev)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              instantCheckMode
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {instantCheckMode
              ? '✓ ផ្ទៀងផ្ទាត់ចម្លើយភ្លាមៗ៖ បើក'
              : 'ផ្ទៀងផ្ទាត់ចម្លើយភ្លាមៗ៖ បិទ'}
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <form onSubmit={handleRequestSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          {viewLayout === 'all' ? (
            questions.map((q, idx) => renderQuestionCard(q, idx))
          ) : (
            <div className="space-y-4">
              {renderQuestionCard(questions[activeIndex], activeIndex)}
              <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>សំណួរមុន</span>
                </button>
                <span className="font-mono-tabular text-sm font-semibold text-slate-600">
                  សំណួរទី {activeIndex + 1} នៃ {questions.length}
                </span>
                <button
                  type="button"
                  disabled={activeIndex === questions.length - 1}
                  onClick={() =>
                    setActiveIndex((i) => Math.min(questions.length - 1, i + 1))
                  }
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>សំណួរបន្ទាប់</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Submit Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              បានឆ្លើយចំនួន{' '}
              <span className="font-mono-tabular font-bold text-slate-900">
                {answeredCount}/{questions.length}
              </span>{' '}
              សំណួរ
              {unansweredCount > 0 && (
                <span className="text-amber-700 ml-2">
                  (នៅសល់ {unansweredCount} សំណួរមិនទាន់ឆ្លើយ)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setRevealedIds({});
                  setFlaggedIds({});
                }}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>សម្អាតចម្លើយ (Reset)</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>បញ្ជូនសន្លឹកកិច្ចការ (Finish)</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Control & Question Navigator Deck */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 bg-white border border-slate-200 rounded-lg p-5 space-y-5">
          {/* Timer & Progress */}
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600" />
                <span>រយៈពេលធ្វើតេស្ត (Elapsed / Remaining)</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">រយៈពេលប្រើប្រាស់</div>
                <div className="font-mono-tabular text-xl font-bold text-slate-900 mt-0.5">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">រយៈពេលនៅសល់</div>
                <div className="font-mono-tabular text-xl font-bold text-red-600 mt-0.5">
                  {formatTime(remainingSeconds)}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Summary */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>វឌ្ឍនភាពនៃការឆ្លើយ</span>
              <span className="font-mono-tabular font-bold text-slate-900">
                {answeredCount} / {questions.length} (
                {Math.round((answeredCount / Math.max(1, questions.length)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-transform duration-150 origin-left"
                style={{
                  transform: `scaleX(${answeredCount / Math.max(1, questions.length)})`,
                }}
              />
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div>
            <div className="text-xs font-bold text-slate-700 mb-2.5">
              តារាងសំណួរទាំង {questions.length} (ចុចដើម្បីរំកិលទៅកាន់សំណួរ)
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isFlagged = !!flaggedIds[q.id];
                const isCurrent = viewLayout === 'single' && activeIndex === idx;

                let btnClass =
                  'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400';
                if (isFlagged) {
                  btnClass = 'bg-amber-50 text-amber-900 border-amber-400 font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-red-600 text-white border-red-600 font-bold';
                }
                if (isCurrent) {
                  btnClass += ' ring-2 ring-red-500 ring-offset-1';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(idx)}
                    className={`h-9 rounded border font-mono-tabular text-xs transition-colors flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-red-600 inline-block" />
                <span>បានឆ្លើយ ({answeredCount})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-300 inline-block" />
                <span>មិនទាន់ឆ្លើយ ({unansweredCount})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block" />
                <span>បានចំណាំ ({Object.values(flaggedIds).filter(Boolean).length})</span>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>បញ្ជូនសន្លឹកកិច្ចការ (Finish Exam)</span>
            <Send className="w-4 h-4" />
          </button>
        </aside>
      </form>

      {/* Unanswered Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  បញ្ជាក់ការបញ្ជូនសន្លឹកកិច្ចការ
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  អ្នកនៅសល់សំណួរចំនួន{' '}
                  <span className="font-mono-tabular font-bold text-slate-900">
                    {unansweredCount}
                  </span>{' '}
                  ដែលមិនទាន់បានជ្រើសរើសចម្លើយ។ តើអ្នកពិតជាចង់បញ្ជូនសន្លឹកកិច្ចការឥឡូវនេះមែនទេ?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                ត្រឡប់ទៅធ្វើបន្ត (Continue)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  buildAndSubmitRecord();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                បញ្ជូនឥឡូវនេះ (Submit Now)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
