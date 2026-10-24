import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Clock,
  BookOpen,
  Filter
} from 'lucide-react';
import { ExamAttemptRecord } from '../types';

interface ExamResultViewProps {
  record: ExamAttemptRecord;
  onRetakeNewExam: (testId: number) => void;
  onRetryWrongOnly: (record: ExamAttemptRecord) => void;
  onBackToCatalog: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  record,
  onRetakeNewExam,
  onRetryWrongOnly,
  onBackToCatalog,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showAllOptions, setShowAllOptions] = useState<boolean>(true);

  const accuracyPct = Math.round(
    (record.correctCount / Math.max(1, record.totalQuestions)) * 100
  );
  const usedMinutes = Math.max(1, Math.round(record.durationUsedSeconds / 60));

  const getBacIIGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A', label: 'ល្អប្រសើរ (Excellent)' };
    if (pct >= 80) return { grade: 'B', label: 'ល្អណាស់ (Very Good)' };
    if (pct >= 70) return { grade: 'C', label: 'ល្អ (Good)' };
    if (pct >= 60) return { grade: 'D', label: 'ល្អបង្គួរ (Fairly Good)' };
    if (pct >= 50) return { grade: 'E', label: 'មធ្យម (Pass)' };
    return { grade: 'F', label: 'ធ្លាក់ - ត្រូវប្រឹងប្រែងបន្ថែម (Needs Improvement)' };
  };

  const gradeInfo = getBacIIGrade(accuracyPct);

  const filteredAnswers = record.answers.filter((a) => {
    if (filterMode === 'correct') return a.isCorrect;
    if (filterMode === 'wrong') return !a.isCorrect;
    return true;
  });

  const khmerLetters = ['ក', 'ខ', 'គ', 'ឃ'];

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 mb-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅបញ្ជីវិញ្ញាសា (ETests)</span>
          </button>
          <h1 className="font-display text-2xl font-bold text-slate-900">{record.testTitle}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
            <span>មុខវិជ្ជា៖ {record.subjectName} ({record.subjectEn})</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-red-600">{record.totalQuestions} Questions</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-semibold text-red-600">60 Minutes</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {new Date(record.completedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {record.wrongCount > 0 && (
            <button
              type="button"
              onClick={() => onRetryWrongOnly(record)}
              className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>ធ្វើតេស្តឡើងវិញเฉพาะសំណួរខុស ({record.wrongCount})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onRetakeNewExam(record.testId)}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ប្រឡងម្តងទៀត (New 20 Questions)</span>
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-500">
              ចម្លើយត្រឹមត្រូវ (Correct)
            </div>
            <div className="mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-mono-tabular text-2xl font-bold text-emerald-700">
                {record.correctCount}
              </span>
              <span className="text-xs text-slate-500">
                / {record.totalQuestions} សំណួរ
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">ចម្លើយខុស (Wrong)</div>
            <div className="mt-1 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-mono-tabular text-2xl font-bold text-red-600">
                {record.wrongCount}
              </span>
              <span className="text-xs text-slate-500">
                / {record.totalQuestions} សំណួរ
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              រយៈពេលធ្វើតេស្ត (Test use time)
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-mono-tabular text-2xl font-bold text-slate-900">
                {usedMinutes}
              </span>
              <span className="text-xs text-slate-500">
                minutes ({record.durationUsedSeconds}s)
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              ពិន្ទុសរុប និងនិទ្ទេសបាក់ឌុប
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono-tabular text-2xl font-bold text-red-600">
                {accuracyPct}%
              </span>
              <span className="text-xs font-bold text-slate-700">
                និទ្ទេស {gradeInfo.grade} · {gradeInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            សំណួរទាំងអស់ ({record.totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('correct')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'correct'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✓ ត្រឹមត្រូវ ({record.correctCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('wrong')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'wrong'
                ? 'bg-white text-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✗ ខុស ({record.wrongCount})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAllOptions((prev) => !prev)}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>
            {showAllOptions
              ? 'ទម្រង់លម្អិត (បង្ហាញជម្រើសទាំងអស់)'
              : 'ទម្រង់ដើម (សង្ខេប)'}
          </span>
        </button>
      </div>

      {/* Question Result List */}
      <div className="space-y-4">
        {filteredAnswers.map((ans) => {
          const originalIdx = record.answers.findIndex(
            (x) => x.questionId === ans.questionId
          );
          const correctOption = ans.options[ans.correctOptionIndex];
          const chosenOption =
            ans.selectedOptionIndex !== null
              ? ans.options[ans.selectedOptionIndex]
              : null;

          return (
            <div
              key={ans.questionId}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono-tabular text-sm font-bold text-red-600 shrink-0">
                    {originalIdx + 1}.
                  </span>
                  <span className="font-display text-base font-semibold text-slate-900">
                    {ans.questionText}
                  </span>
                </div>

                {ans.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 shrink-0 whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ត្រឹមត្រូវ (Correct)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 shrink-0 whitespace-nowrap">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>ខុស (Wrong)</span>
                  </span>
                )}
              </div>

              {showAllOptions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pl-6">
                  {ans.options.map((opt, oIdx) => {
                    const isRight = oIdx === ans.correctOptionIndex;
                    const isPicked = oIdx === ans.selectedOptionIndex;

                    let boxClass = 'border-slate-200 bg-slate-50/60 text-slate-700';
                    if (isRight) {
                      boxClass =
                        'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold';
                    } else if (isPicked && !isRight) {
                      boxClass = 'border-red-400 bg-red-50/70 text-red-900';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-lg border text-sm flex items-center justify-between gap-2 ${boxClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-500">
                            {khmerLetters[oIdx] || String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span>{opt.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isRight && (
                            <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                              ✓ ចម្លើយត្រឹមត្រូវ
                            </span>
                          )}
                          {isPicked && !isRight && (
                            <span className="text-xs font-bold text-red-600 whitespace-nowrap">
                              ✗ ចម្លើយដែលអ្នកជ្រើសរើស
                            </span>
                          )}
                          {isPicked && isRight && (
                            <span className="text-xs font-bold text-emerald-800 whitespace-nowrap">
                              (អ្នកជ្រើសរើស)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2.5 pl-6 text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span>
                    ចម្លើយរបស់អ្នក៖{' '}
                    <strong className={ans.isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                      {chosenOption ? chosenOption.label : 'មិនបានជ្រើសរើស'}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    ចម្លើយផ្លូវការ៖{' '}
                    <strong className="text-emerald-700">
                      {correctOption ? correctOption.label : '-'}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
