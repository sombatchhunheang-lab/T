/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  Compass,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  Trash2,
  ArrowRight,
  Layers
} from 'lucide-react';
import {
  GRADE_12_SUBJECTS,
  ETEST_MODULES,
  TOTAL_UNIQUE_QUESTIONS
} from './data/subjects';
import { ETestModule, Question, ExamAttemptRecord } from './types';
import { ExamSessionView } from './components/ExamSessionView';
import { ExamResultView } from './components/ExamResultView';
import { QuestionBankView } from './components/QuestionBankView';

type ActiveTab = 'etest_catalog' | 'etest_detail' | 'exam_session' | 'exam_result' | 'question_bank' | 'history' | 'about';

const STORAGE_KEY = 'khsearch_etest_records_v1';

function pickRandomQuestions(pool: Question[], count: number): Question[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('etest_catalog');
  const [selectedCategory, setSelectedCategory] = useState<number>(2);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [searchHeaderQuery, setSearchHeaderQuery] = useState<string>('');

  // Active exam / detail state
  const [detailModule, setDetailModule] = useState<ETestModule | null>(null);
  const [sessionModule, setSessionModule] = useState<ETestModule | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionMode, setSessionMode] = useState<'exam' | 'full_pool'>('exam');
  const [activeRecord, setActiveRecord] = useState<ExamAttemptRecord | null>(null);

  // Saved attempt records
  const [attemptHistory, setAttemptHistory] = useState<ExamAttemptRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attemptHistory));
    } catch {
      // Ignore storage quota errors
    }
  }, [attemptHistory]);

  const filteredCatalogModules = useMemo(() => {
    return ETEST_MODULES.filter((mod) => {
      if (selectedSubjectId !== null && mod.subjectId !== selectedSubjectId) {
        return false;
      }
      if (searchHeaderQuery.trim()) {
        const q = searchHeaderQuery.trim().toLowerCase();
        const matchTitle =
          mod.title.toLowerCase().includes(q) ||
          mod.subjectName.toLowerCase().includes(q) ||
          mod.subjectEn.toLowerCase().includes(q);
        const matchQuestion = mod.questions.some((item) =>
          item.text.toLowerCase().includes(q)
        );
        return matchTitle || matchQuestion;
      }
      return true;
    });
  }, [selectedSubjectId, searchHeaderQuery]);

  const handleOpenDetail = (mod: ETestModule) => {
    setDetailModule(mod);
    setActiveTab('etest_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (mod: ETestModule, mode: 'exam' | 'full_pool') => {
    const questionsToUse =
      mode === 'exam'
        ? pickRandomQuestions(mod.questions, mod.questionCountPerExam)
        : [...mod.questions];
    setSessionModule(mod);
    setSessionQuestions(questionsToUse);
    setSessionMode(mode);
    setActiveTab('exam_session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuickRandomExam = () => {
    const randomMod =
      ETEST_MODULES[Math.floor(Math.random() * ETEST_MODULES.length)];
    handleStartExam(randomMod, 'exam');
  };

  const handleFinishExam = (record: ExamAttemptRecord) => {
    setAttemptHistory((prev) => [record, ...prev]);
    setActiveRecord(record);
    setActiveTab('exam_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetryWrongOnly = (record: ExamAttemptRecord) => {
    const mod =
      ETEST_MODULES.find((m) => m.id === record.testId) || ETEST_MODULES[0];
    const wrongQuestionIds = new Set(
      record.answers.filter((a) => !a.isCorrect).map((a) => a.questionId)
    );
    const wrongQuestions = mod.questions.filter((q) =>
      wrongQuestionIds.has(q.id)
    );
    if (wrongQuestions.length > 0) {
      setSessionModule(mod);
      setSessionQuestions(wrongQuestions);
      setSessionMode('exam');
      setActiveTab('exam_session');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentSubjectObj = useMemo(() => {
    if (selectedSubjectId === null) return null;
    return GRADE_12_SUBJECTS.find((s) => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F9] text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white border-b border-red-200 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single text element Brand wordmark in crisp Red */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setSelectedSubjectId(null);
              setActiveTab('etest_catalog');
            }}
            className="font-display text-2xl font-extrabold tracking-wider text-red-600 hover:text-red-700 transition-colors whitespace-nowrap shrink-0"
          >
            TONG
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('etest_catalog')}
              className={`hover:text-red-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'etest_catalog' || activeTab === 'etest_detail'
                  ? 'text-red-600 font-bold underline decoration-2'
                  : ''
              }`}
            >
              វិញ្ញាសាប្រឡង (ETests)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('question_bank')}
              className={`hover:text-red-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'question_bank'
                  ? 'text-red-600 font-bold underline decoration-2'
                  : ''
              }`}
            >
              ឃ្លាំងសំណួរ ({TOTAL_UNIQUE_QUESTIONS})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`hover:text-red-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'history'
                  ? 'text-red-600 font-bold underline decoration-2'
                  : ''
              }`}
            >
              ប្រវត្តិតេស្ត ({attemptHistory.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`hover:text-red-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'about'
                  ? 'text-red-600 font-bold underline decoration-2'
                  : ''
              }`}
            >
              មគ្គុទ្ទេសក៍ប្រឡង
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleStartQuickRandomExam}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              ចាប់ផ្តើមប្រឡងរហ័ស
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Secondary Navigation Strip */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('etest_catalog')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'etest_catalog'
              ? 'bg-red-600 text-white'
              : 'text-slate-700 bg-slate-100'
          }`}
        >
          វិញ្ញាសាប្រឡង
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('question_bank')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'question_bank'
              ? 'bg-red-600 text-white'
              : 'text-slate-700 bg-slate-100'
          }`}
        >
          ឃ្លាំងសំណួរ ({TOTAL_UNIQUE_QUESTIONS})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'history'
              ? 'bg-red-600 text-white'
              : 'text-slate-700 bg-slate-100'
          }`}
        >
          ប្រវត្តិតេស្ត ({attemptHistory.length})
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'exam_session' && sessionModule && (
          <ExamSessionView
            module={sessionModule}
            questions={sessionQuestions}
            mode={sessionMode}
            onFinish={handleFinishExam}
            onCancel={() => setActiveTab('etest_catalog')}
          />
        )}

        {activeTab === 'exam_result' && activeRecord && (
          <ExamResultView
            record={activeRecord}
            onRetakeNewExam={(testId) => {
              const mod =
                ETEST_MODULES.find((m) => m.id === testId) || ETEST_MODULES[0];
              handleStartExam(mod, 'exam');
            }}
            onRetryWrongOnly={handleRetryWrongOnly}
            onBackToCatalog={() => setActiveTab('etest_catalog')}
          />
        )}

        {activeTab === 'question_bank' && (
          <QuestionBankView
            initialSubjectId={selectedSubjectId}
            onStartExamModule={handleStartExam}
          />
        )}

        {/* ETest Detail View (/etest/detail/...) */}
        {activeTab === 'etest_detail' && detailModule && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 6-icon Menu Grid */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('question_bank')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-800">Questions</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-800">Articles</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-800">Scholarships</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Compass className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-800">Experiences</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('question_bank')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-800">Book</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('etest_catalog')}
                      className="p-4 flex flex-col items-center justify-center gap-2 bg-red-50/80 text-red-800 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-8 h-8 text-red-600" />
                      <span className="text-xs font-bold">ETest</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Detail Card matching /etest/detail/... */}
              <div className="lg:col-span-9">
                <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 space-y-6">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('etest_catalog')}
                        className="hover:text-red-600 transition-colors"
                      >
                        វិទ្យាល័យ High School &gt;&gt; ថ្នាក់ទី១២ Grade 12
                      </button>
                      <span className="mx-2">/</span>
                      <span className="text-red-700 font-semibold">{detailModule.subjectName}</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                      {detailModule.title}{' '}
                      <span className="font-mono-tabular text-base font-normal text-slate-500">
                        ({detailModule.views}Views)
                      </span>
                    </h1>
                    <p className="text-base text-slate-700 mt-3">
                      <span className="font-mono-tabular font-bold text-red-600">
                        {detailModule.questionCountPerExam}
                      </span>{' '}
                      សំនួរ,{' '}
                      <span className="font-mono-tabular font-bold text-red-600">
                        {detailModule.durationMinutes}
                      </span>{' '}
                      នាទី , មានអ្នកធ្វើតេសនេះចំនួន{' '}
                      <span className="font-mono-tabular font-bold text-red-600">
                        {detailModule.participants}
                      </span>{' '}
                      នាក់
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-sm text-slate-700">
                    <div className="font-bold text-slate-900">
                      ព័ត៌មានអំពីវិញ្ញាសា ({detailModule.subjectName} - {detailModule.subjectEn})
                    </div>
                    <p>
                      វិញ្ញាសានេះមានសំណួរក្នុងឃ្លាំងសរុបចំនួន{' '}
                      <strong className="font-mono-tabular text-red-700">
                        {detailModule.questions.length}
                      </strong>{' '}
                      សំណួរ។ អ្នកអាចជ្រើសរើសប្រឡងសាកល្បងតាមទម្រង់ផ្លូវការ (ចាប់យក 20 សំណួរដោយចៃដន្យក្នុងរយៈពេល 60 នាទី) ឬធ្វើតេស្តសំណួរទាំងអស់ក្នុងឃ្លាំងតែម្តង។
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => handleStartExam(detailModule, 'exam')}
                      className="px-8 py-4 text-sm font-bold text-red-600 bg-white hover:bg-red-50 border border-red-300 hover:border-red-600 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                    >
                      <span>START EXAM (20 សំណួរចៃដន្យ)</span>
                      <Send className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartExam(detailModule, 'full_pool')}
                      className="px-6 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>ធ្វើតេស្តសំណួរទាំងអស់ ({detailModule.questions.length} សំណួរ)</span>
                      <Layers className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(detailModule.subjectId);
                        setActiveTab('question_bank');
                      }}
                      className="px-5 py-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>មើលសំណួរ និងចម្លើយទាំងអស់</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main ETest Catalog View (https://legacy.khsearch.com/etest?category=2) */}
        {activeTab === 'etest_catalog' && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-5">
                {/* 6-tile Navigation Box */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('question_bank')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-9 h-9 text-slate-700 hover:text-red-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-800">Questions</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-9 h-9 text-slate-700 hover:text-red-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-800">Articles</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-9 h-9 text-slate-700 hover:text-red-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-800">Scholarships</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Compass className="w-9 h-9 text-slate-700 hover:text-red-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-800">Experiences</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('question_bank')}
                      className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-9 h-9 text-slate-700 hover:text-red-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-800">Book</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(null);
                        setActiveTab('etest_catalog');
                      }}
                      className="p-4 flex flex-col items-center justify-center gap-2 bg-red-50/80 text-red-800 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-9 h-9 text-red-600" />
                      <span className="text-xs font-bold">ETest</span>
                    </button>
                  </div>
                </div>

                {/* Category Switcher */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-600">
                    កម្រិតសិក្សា (ETest Categories)
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(2);
                        setSelectedSubjectId(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === 2
                          ? 'bg-red-50 text-red-800 font-bold border border-red-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>វិទ្យាល័យ High School · ថ្នាក់ទី១២</span>
                      <span className="font-mono-tabular">8 មុខវិជ្ជា</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(4);
                        setSelectedSubjectId(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === 4
                          ? 'bg-red-50 text-red-800 font-bold border border-red-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>ភាសាបរទេស Language · English</span>
                      <span className="font-mono-tabular">2 មុខវិជ្ជា</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900">
                    ទិន្នន័យសរុបក្នុងប្រព័ន្ធ
                  </div>
                  <div className="flex items-center justify-between">
                    <span>វិញ្ញាសាប្រឡងបាក់ឌុប</span>
                    <span className="font-mono-tabular font-bold text-slate-900">
                      {ETEST_MODULES.length} វិញ្ញាសា
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>សំណួរសរុបក្នុងឃ្លាំង</span>
                    <span className="font-mono-tabular font-bold text-red-600">
                      {TOTAL_UNIQUE_QUESTIONS} សំណួរ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ប្រវត្តិធ្វើតេស្តរបស់អ្នក</span>
                    <span className="font-mono-tabular font-bold text-slate-900">
                      {attemptHistory.length} ដង
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Column */}
              <div className="lg:col-span-9">
                <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 space-y-7">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchHeaderQuery}
                      onChange={(e) => setSearchHeaderQuery(e.target.value)}
                      placeholder="ស្វែងរកចម្លើយ បទពិសោធន៍ សៀវភៅ ឬឈ្មោះមុខវិជ្ជាប្រឡង..."
                      className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-red-600 focus:outline-none transition-colors"
                    />
                    {searchHeaderQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchHeaderQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800"
                      >
                        សម្អាត
                      </button>
                    )}
                  </div>

                  {selectedCategory === 2 ? (
                    <>
                      {/* Category Breadcrumb & Subject Grid */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSubjectId(null)}
                              className="hover:text-red-600 transition-colors cursor-pointer"
                            >
                              វិទ្យាល័យ High School
                            </button>
                            <span className="text-slate-400 text-sm">&gt;&gt;</span>
                            <button
                              type="button"
                              onClick={() => setSelectedSubjectId(null)}
                              className="hover:text-red-600 transition-colors cursor-pointer"
                            >
                              ថ្នាក់ទី១២ Grade 12
                            </button>
                            {currentSubjectObj && (
                              <>
                                <span className="text-slate-400 text-sm">&gt;&gt;</span>
                                <span className="text-red-600">
                                  {currentSubjectObj.nameKh} ({currentSubjectObj.nameEn})
                                </span>
                              </>
                            )}
                          </h1>

                          {selectedSubjectId !== null && (
                            <button
                              type="button"
                              onClick={() => setSelectedSubjectId(null)}
                              className="text-xs font-bold text-red-600 hover:text-red-800 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              បង្ហាញគ្រប់មុខវិជ្ជាទាំង 8 (Show All)
                            </button>
                          )}
                        </div>

                        {/* 8 Subject Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {GRADE_12_SUBJECTS.map((subj) => {
                            const isSelected = selectedSubjectId === subj.id;
                            const mod = ETEST_MODULES.find(
                              (m) => m.subjectId === subj.id
                            );
                            const qPoolCount = mod ? mod.questions.length : 0;

                            return (
                              <button
                                key={subj.id}
                                type="button"
                                onClick={() =>
                                  setSelectedSubjectId(
                                    isSelected ? null : subj.id
                                  )
                                }
                                className={`p-3.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-red-50 border-red-600 text-red-900 font-bold'
                                    : 'bg-white border-slate-200 hover:border-red-400 hover:bg-red-50/30 text-slate-800'
                                }`}
                              >
                                <div className="font-display text-sm sm:text-base font-bold text-red-600">
                                  {subj.nameKh}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {subj.nameEn} ·{' '}
                                  <span className="font-mono-tabular">
                                    {qPoolCount} សំណួរ
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ETests Section Heading & 2-Column Test Cards */}
                      <div className="space-y-4 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <h2 className="font-display text-xl font-bold text-slate-900">
                            ETests
                          </h2>
                          <span className="text-xs text-slate-500">
                            ជ្រើសរើសវិញ្ញាសាដើម្បីចាប់ផ្តើមប្រឡងសាកល្បង (20 សំណួរ / 60 នាទី) ឬមើលឃ្លាំងសំណួរទាំងអស់
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredCatalogModules.map((mod) => (
                            <div
                              key={mod.id}
                              className="bg-white border border-slate-200 hover:border-red-300 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[210px] transition-colors"
                            >
                              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug max-w-[92%]">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(mod)}
                                  className="hover:text-red-600 transition-colors cursor-pointer text-center"
                                >
                                  {mod.title}
                                </button>
                              </h3>

                              <div className="mt-3 text-sm text-slate-600 flex flex-wrap items-center justify-center gap-1.5">
                                <span className="font-mono-tabular font-bold text-red-600">
                                  {mod.questionCountPerExam}
                                </span>
                                <span>Questions,</span>
                                <span className="font-mono-tabular font-bold text-red-600">
                                  {mod.durationMinutes}
                                </span>
                                <span>Mins,</span>
                                <button
                                  type="button"
                                  onClick={() => handleStartExam(mod, 'exam')}
                                  className="text-red-600 hover:text-red-800 font-bold inline-flex items-center gap-1 ml-1 cursor-pointer whitespace-nowrap shrink-0"
                                >
                                  <span>Start</span>
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 w-full flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
                                <span className="font-mono-tabular">
                                  ក្នុងឃ្លាំង៖ {mod.questions.length} សំណួរ
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-tabular">
                                  {mod.views} Views
                                </span>
                                <span aria-hidden="true">·</span>
                                <button
                                  type="button"
                                  onClick={() => handleStartExam(mod, 'full_pool')}
                                  className="text-slate-700 hover:text-red-700 font-semibold underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
                                >
                                  ធ្វើតេស្តទាំង {mod.questions.length} សំណួរ
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Category 4: Foreign Language -> English */
                    <div className="space-y-5">
                      <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>ភាសាបរទេស Langauge</span>
                        <span className="text-slate-400 text-sm">&gt;&gt;</span>
                        <span>ភាសាអង់គ្លេស English</span>
                      </h1>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold text-red-600">
                          Grammer
                        </div>
                        <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold text-red-600">
                          Reading
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
                        <p className="text-sm text-slate-600">
                          ផ្នែកភាសាអង់គ្លេស (Category 4) មិនទាន់មានវិញ្ញាសានៅលើប្រព័ន្ធចាស់នៅឡើយទេ។ សូមត្រឡប់ទៅផ្នែក វិទ្យាល័យ ថ្នាក់ទី១២ (Category 2) ដើម្បីអនុវត្តវិញ្ញាសាទាំង 8 មុខវិជ្ជា។
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(2)}
                          className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                        >
                          ត្រឡប់ទៅ ថ្នាក់ទី១២ Grade 12 (Category 2)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attempt History View */}
        {activeTab === 'history' && (
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  ប្រវត្តិនៃការធ្វើតេស្តរបស់អ្នក (Test Record History)
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  រាល់លទ្ធផលប្រឡងសាកល្បងរបស់អ្នកត្រូវបានរក្សាទុកដើម្បីងាយស្រួលពិនិត្យមើលចម្លើយដែលខុស និងពង្រឹងសមត្ថភាពមុនថ្ងៃប្រឡងបាក់ឌុប។
                </p>
              </div>
              {attemptHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAttemptHistory([])}
                  className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>លុបប្រវត្តិទាំងអស់</span>
                </button>
              )}
            </div>

            {attemptHistory.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
                <Clock className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    មិនទាន់មានប្រវត្តិធ្វើតេស្តនៅឡើយទេ
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    សូមជ្រើសរើសមុខវិជ្ជាណាមួយក្នុងចំណោមមុខវិជ្ជាទាំង 8 ដើម្បីចាប់ផ្តើមប្រឡងសាកល្បង។
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('etest_catalog')}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>ទៅកាន់បញ្ជីវិញ្ញាសាប្រឡង</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {attemptHistory.map((rec) => {
                  const pct = Math.round(
                    (rec.correctCount / Math.max(1, rec.totalQuestions)) * 100
                  );
                  return (
                    <div
                      key={rec.id}
                      className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-tabular font-bold text-slate-700">
                            {rec.id}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{rec.subjectName} ({rec.subjectEn})</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            {new Date(rec.completedAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {rec.testTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="font-mono-tabular">
                              Correct: {rec.correctCount}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="font-mono-tabular">
                              Wrong: {rec.wrongCount}
                            </span>
                          </span>
                          <span className="font-mono-tabular font-semibold">
                            ពិន្ទុ៖ {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRecord(rec);
                            setActiveTab('exam_result');
                          }}
                          className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          មើលលទ្ធផលលម្អិត
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const mod =
                              ETEST_MODULES.find((m) => m.id === rec.testId) ||
                              ETEST_MODULES[0];
                            handleStartExam(mod, 'exam');
                          }}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>ប្រឡងម្តងទៀត</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* About & Exam Guide View */}
        {activeTab === 'about' && (
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
              <h1 className="font-display text-2xl font-bold text-slate-900">
                អំពីប្រព័ន្ធប្រឡងសាកល្បង TONG ETest (ថ្នាក់ទី១២)
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                ប្រព័ន្ធ TONG ETest (Category 2: វិទ្យាល័យ ថ្នាក់ទី១២) ត្រូវបានរៀបចំឡើងសម្រាប់សិស្សានុសិស្សថ្នាក់ទី១២ ដើម្បីហ្វឹកហាត់សំណួរពហុជ្រើសរើស (Multiple Choice) និងត្រៀមខ្លួនសម្រាប់ការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)។
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ETEST_MODULES.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-display font-bold text-slate-900 text-sm">
                        {mod.subjectName} ({mod.subjectEn})
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono-tabular">
                        សំណួរក្នុងឃ្លាំង៖ {mod.questions.length} សំណួរ · វិញ្ញាសា៖ 20 សំណួរ / 60 នាទី
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartExam(mod, 'exam')}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      ចាប់ផ្តើម
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="font-semibold text-slate-700">
            <span className="text-red-600 font-extrabold">TONG</span> · វិទ្យាល័យ ថ្នាក់ទី១២ (Grade 12 National Exam Preparation)
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('etest_catalog')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              ETests
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('question_bank')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Question Bank ({TOTAL_UNIQUE_QUESTIONS})
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Test Records
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
