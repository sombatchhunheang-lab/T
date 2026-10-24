import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { ETEST_MODULES, GRADE_12_SUBJECTS } from '../data/subjects';
import { ETestModule } from '../types';

interface QuestionBankViewProps {
  initialSubjectId: number | null;
  onStartExamModule: (module: ETestModule, mode: 'exam' | 'full_pool') => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  initialSubjectId,
  onStartExamModule,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    initialSubjectId
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealAllAnswers, setRevealAllAnswers] = useState<boolean>(false);
  const [practiceSelections, setPracticeSelections] = useState<
    Record<number, number>
  >({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 25;

  const allQuestionsWithModule = useMemo(() => {
    const list: Array<{
      module: ETestModule;
      question: ETestModule['questions'][0];
      subjectQuestionNumber: number;
    }> = [];
    for (const mod of ETEST_MODULES) {
      mod.questions.forEach((q, idx) => {
        list.push({
          module: mod,
          question: q,
          subjectQuestionNumber: idx + 1,
        });
      });
    }
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    return allQuestionsWithModule.filter(({ module, question }) => {
      if (selectedSubjectId !== null && module.subjectId !== selectedSubjectId) {
        return false;
      }
      if (!qLower) return true;
      const inQuestion = question.text.toLowerCase().includes(qLower);
      const inOptions = question.options.some((o) =>
        o.label.toLowerCase().includes(qLower)
      );
      const inSubject =
        module.subjectName.toLowerCase().includes(qLower) ||
        module.subjectEn.toLowerCase().includes(qLower);
      return inQuestion || inOptions || inSubject;
    });
  }, [allQuestionsWithModule, selectedSubjectId, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const activeModule = useMemo(() => {
    if (selectedSubjectId === null) return null;
    return ETEST_MODULES.find((m) => m.subjectId === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  const khmerLetters = ['ក', 'ខ', 'គ', 'ឃ'];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              ឃ្លាំងសំណួរប្រឡងបាក់ឌុបទាំងអស់ (Complete Question Bank)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              សំណួរ និងចម្លើយផ្លូវការសរុបចំនួន{' '}
              <span className="font-mono-tabular font-bold text-red-600">
                {allQuestionsWithModule.length}
              </span>{' '}
              សំណួរ ពីគ្រប់មុខវិជ្ជាថ្នាក់ទី១២។
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {Object.keys(practiceSelections).length > 0 && (
              <button
                type="button"
                onClick={() => setPracticeSelections({})}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>សម្អាតចម្លើយសាកល្បង</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setRevealAllAnswers((prev) => !prev)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                revealAllAnswers
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {revealAllAnswers ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>លាក់ចម្លើយផ្លូវការទាំងអស់</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>បង្ហាញចម្លើយផ្លូវការទាំងអស់ (Show All Answers)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ស្វែងរកសំណួរ ចម្លើយ ឬពាក្យគន្លឹះ (ឧ. មីតូស, អាស៊ីតអាមីនេ, អង្គរ, ផែនដី)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Subject Interactive Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              selectedSubjectId === null
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            គ្រប់មុខវិជ្ជាទាំងអស់ ({allQuestionsWithModule.length})
          </button>

          {GRADE_12_SUBJECTS.map((subj) => {
            const mod = ETEST_MODULES.find((m) => m.subjectId === subj.id);
            const count = mod ? mod.questions.length : 0;
            const isActive = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => {
                  setSelectedSubjectId(subj.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {subj.nameKh} ({count})
              </button>
            );
          })}
        </div>

        {/* Selected Subject Action Bar */}
        {activeModule && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-700">
              កំពុងបង្ហាញមុខវិជ្ជា៖{' '}
              <strong className="font-display text-slate-900">
                {activeModule.title}
              </strong>{' '}
              ({activeModule.questions.length} សំណួរក្នុងឃ្លាំង)
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onStartExamModule(activeModule, 'exam')}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>ប្រឡង 20 សំណួរចៃដន្យ (60 Mins)</span>
              </button>
              <button
                type="button"
                onClick={() => onStartExamModule(activeModule, 'full_pool')}
                className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>ធ្វើតេស្តសំណួរទាំង {activeModule.questions.length}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Pagination Top */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          រកឃើញសំណួរចំនួន{' '}
          <span className="font-mono-tabular font-bold text-slate-900">
            {filteredItems.length}
          </span>{' '}
          · ទំព័រទី{' '}
          <span className="font-mono-tabular font-bold text-slate-900">
            {safePage} / {totalPages}
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 font-semibold whitespace-nowrap shrink-0"
            >
              ទំព័រមុន
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 font-semibold whitespace-nowrap shrink-0"
            >
              ទំព័របន្ទាប់
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedItems.map(({ module, question, subjectQuestionNumber }) => {
          const pickedIdx = practiceSelections[question.id];
          const showResult = revealAllAnswers || pickedIdx !== undefined;

          return (
            <div
              key={`${module.id}-${question.id}`}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600">
                    {module.subjectName} ({module.subjectEn})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular font-semibold">
                    សំណួរទី {subjectQuestionNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">ID #{question.id}</span>
                </div>
              </div>

              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900">
                {question.text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {question.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === question.correctIndex;
                  const isSelected = pickedIdx === oIdx;

                  let optClass =
                    'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800';
                  if (showResult) {
                    if (isCorrect) {
                      optClass =
                        'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-red-400 bg-red-50/80 text-red-900';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setPracticeSelections((prev) => ({
                          ...prev,
                          [question.id]: oIdx,
                        }))
                      }
                      className={`p-3 rounded-lg border text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${optClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs text-slate-500 shrink-0">
                          {khmerLetters[oIdx] || String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt.label}</span>
                      </div>

                      {showResult && isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0 whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ត្រឹមត្រូវ</span>
                        </span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 shrink-0 whitespace-nowrap">
                          <XCircle className="w-4 h-4" />
                          <span>ខុស</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            ទំព័រមុន (Previous)
          </button>
          <span className="font-mono-tabular text-xs font-semibold text-slate-600">
            ទំព័រទី {safePage} នៃ {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            ទំព័របន្ទាប់ (Next)
          </button>
        </div>
      )}
    </div>
  );
};
