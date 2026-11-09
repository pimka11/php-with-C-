import React from 'react';
import { Play, Sparkles, Download, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'cpp' | 'modernizer' | 'opcodes' | 'benchmark';
  setActiveTab: (tab: 'editor' | 'cpp' | 'modernizer' | 'opcodes' | 'benchmark') => void;
  onRun: () => void;
  onOpenExtensionModal: () => void;
  isExecuting: boolean;
  lang: 'uk' | 'en';
  setLang: (l: 'uk' | 'en') => void;
  hasModernizationChanges: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRun,
  onOpenExtensionModal,
  isExecuting,
  lang,
  setLang,
  hasModernizationChanges,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
      {/* Zone 1: Brand wordmark (single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          PHP 8.4 <span className="text-indigo-400 font-medium">& C++ Engine</span>
        </a>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-700/60 pl-3">
          <span>PHP 8.4.1 Stable</span>
          <span aria-hidden="true">·</span>
          <span>ISO C++23 AOT</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (4-5 single-line clean controls) */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'editor'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'uk' ? 'PHP 8.4 Редактор' : 'PHP 8.4 Editor'}
        </button>

        <button
          onClick={() => setActiveTab('cpp')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'cpp'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'uk' ? 'C++23 Транслятор' : 'C++23 Transpiler'}
        </button>

        <button
          onClick={() => setActiveTab('modernizer')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 relative ${
            activeTab === 'modernizer'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>{lang === 'uk' ? 'Модернізація коду' : 'Modernizer'}</span>
          {hasModernizationChanges && (
            <span className="ml-1.5 text-[10px] text-amber-400 font-mono">(issues)</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('opcodes')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'opcodes'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'uk' ? 'Zend VM Байткод' : 'Zend VM Opcodes'}
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'benchmark'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'uk' ? 'Бенчмарки' : 'Benchmarks'}
        </button>
      </nav>

      {/* Zone 3: Actions (language switch, C++ extension export, and primary Run action) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}
          title="Змінити мову / Switch language"
          className="p-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang.toUpperCase()}</span>
        </button>

        <button
          onClick={onOpenExtensionModal}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-md transition-colors whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'uk' ? 'C++ Zend Модуль' : 'C++ Extension'}</span>
        </button>

        <button
          onClick={onRun}
          disabled={isExecuting}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] rounded-md transition-all whitespace-nowrap shadow-sm shadow-indigo-900/40"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
          <span>
            {isExecuting
              ? (lang === 'uk' ? 'Обчислення...' : 'Running...')
              : (lang === 'uk' ? 'Виконати (PHP & C++)' : 'Run (PHP & C++)')}
          </span>
        </button>
      </div>
    </header>
  );
};
