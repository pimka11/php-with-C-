import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { ModernizeResult } from '../engine/modernizer';

interface MigrationPanelProps {
  originalCode: string;
  modernizeResult: ModernizeResult;
  onApplyModernization: () => void;
  lang: 'uk' | 'en';
}

export const MigrationPanel: React.FC<MigrationPanelProps> = ({
  originalCode,
  modernizeResult,
  onApplyModernization,
  lang,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'issues'>('diff');

  const { issues, modernizedCode } = modernizeResult;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Migration Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              {lang === 'uk' ? 'Аналізатор міграції на PHP 8.4' : 'PHP 8.4 Migration Engine'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('diff')}
              className={`px-2.5 py-0.5 rounded ${
                viewMode === 'diff'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'uk' ? 'Порівняння коду (Diff)' : 'Side-by-Side Diff'}
            </button>
            <button
              onClick={() => setViewMode('issues')}
              className={`px-2.5 py-0.5 rounded flex items-center gap-1 ${
                viewMode === 'issues'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{lang === 'uk' ? 'Виявлені проблеми' : 'Detected Issues'}</span>
              <span className="font-mono text-[10px] text-amber-400">({issues.length})</span>
            </button>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={onApplyModernization}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>
            {lang === 'uk'
              ? 'Застосувати оновлення до PHP 8.4'
              : 'Apply Modernization to Editor'}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {viewMode === 'diff' ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden text-xs font-mono">
          {/* Legacy View */}
          <div className="flex flex-col h-full overflow-hidden bg-slate-950/40">
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-rose-300 flex items-center justify-between">
              <span>{lang === 'uk' ? 'Поточний / Застарілий код' : 'Legacy / Outdated PHP'}</span>
              <span className="text-[10px] text-slate-400 font-normal">PHP 5.4 - 7.4 / 8.0</span>
            </div>
            <pre className="flex-1 p-3 overflow-auto whitespace-pre text-rose-200/80 selection:bg-rose-900/40">
              {originalCode}
            </pre>
          </div>

          {/* Modernized PHP 8.4 View */}
          <div className="flex flex-col h-full overflow-hidden bg-slate-950/20">
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-emerald-300 flex items-center justify-between">
              <span>{lang === 'uk' ? 'Оновлений код PHP 8.4 (Стабільний)' : 'Modernized PHP 8.4 (Latest Stable)'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">PHP 8.4.1</span>
            </div>
            <pre className="flex-1 p-3 overflow-auto whitespace-pre text-emerald-200 selection:bg-emerald-900/40">
              {modernizedCode}
            </pre>
          </div>
        </div>
      ) : (
        /* Issues List */
        <div className="flex-1 p-4 overflow-auto space-y-3 bg-slate-950/50">
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">
                {lang === 'uk' ? 'Код вже відповідає стандартам PHP 8.4!' : 'Code is fully compliant with PHP 8.4!'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {lang === 'uk'
                  ? 'Застарілих конструкцій не виявлено. Ви можете транспілювати його в C++23 для максимальної швидкодії.'
                  : 'No legacy deprecations found. You can transpile it to C++23 for maximum performance.'}
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3.5 rounded-lg border transition-colors ${
                  issue.impact === 'critical'
                    ? 'bg-rose-950/20 border-rose-900/40'
                    : issue.impact === 'warning'
                    ? 'bg-amber-950/20 border-amber-900/40'
                    : 'bg-indigo-950/20 border-indigo-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        issue.impact === 'critical'
                          ? 'text-rose-400'
                          : issue.impact === 'warning'
                          ? 'text-amber-400'
                          : 'text-indigo-400'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      {lang === 'uk' ? issue.titleUk : issue.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {lang === 'uk' ? `Рядок: ${issue.line}` : `Line ${issue.line}`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {lang === 'uk' ? issue.descriptionUk : issue.description}
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-rose-300">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'uk' ? 'Застарілий синтаксис:' : 'Legacy Pattern:'}
                    </div>
                    <code>{issue.sourceCode}</code>
                  </div>

                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-emerald-300">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'uk' ? 'Стандарт PHP 8.4:' : 'PHP 8.4 Fix:'}
                    </div>
                    <code>{issue.replacementCode}</code>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Status */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Target: PHP 8.4.1 (Active Support until 2027+)</span>
          <span aria-hidden="true">·</span>
          <span>{issues.length} {lang === 'uk' ? 'виправлень готово' : 'modernization fixes ready'}</span>
        </div>
      </div>
    </div>
  );
};
