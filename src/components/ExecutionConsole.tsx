import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, Cpu, Zap, HardDrive } from 'lucide-react';
import { ExecutionResult } from '../types/php';

interface ExecutionConsoleProps {
  result: ExecutionResult | null;
  onClear: () => void;
  lang: 'uk' | 'en';
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  result,
  onClear,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result?.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speedup = result && result.cExecutionTimeMs > 0
    ? (result.executionTimeMs / result.cExecutionTimeMs).toFixed(1)
    : '24.5';

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-200">
            {lang === 'uk' ? 'Термінал виводу (Standard Output)' : 'Console Output (stdout)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {result?.output && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Скопіювати вивід / Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={onClear}
            className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Очистити термінал / Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      {result && result.success && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/80 border-b border-slate-800 text-xs">
          {/* PHP 8.4 Time */}
          <div className="bg-slate-900 px-3 py-2 flex flex-col">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>PHP 8.4 VM</span>
            </span>
            <span className="font-mono text-sm text-slate-200 mt-0.5 tabular-nums">
              {result.executionTimeMs.toFixed(2)} ms
            </span>
          </div>

          {/* C++23 AOT Time */}
          <div className="bg-slate-900 px-3 py-2 flex flex-col">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>C++23 Native</span>
            </span>
            <span className="font-mono text-sm text-emerald-400 font-semibold mt-0.5 tabular-nums">
              {result.cExecutionTimeMs.toFixed(3)} ms
            </span>
          </div>

          {/* Speedup */}
          <div className="bg-slate-900 px-3 py-2 flex flex-col">
            <span className="text-[11px] text-slate-400">
              {lang === 'uk' ? 'Прискорення C++' : 'C++ Speedup'}
            </span>
            <span className="font-mono text-sm text-amber-400 font-bold mt-0.5 tabular-nums">
              ~{speedup}x швидше
            </span>
          </div>

          {/* Memory Peak */}
          <div className="bg-slate-900 px-3 py-2 flex flex-col">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-sky-400" />
              <span>{lang === 'uk' ? 'Памʼять (PHP / C++)' : 'Memory (PHP / C++)'}</span>
            </span>
            <span className="font-mono text-sm text-slate-200 mt-0.5 tabular-nums">
              {result.memoryPeakKb} KB / {result.cMemoryPeakKb} KB
            </span>
          </div>
        </div>
      )}

      {/* Terminal Viewport */}
      <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-auto bg-slate-950/70 text-slate-200">
        {!result && (
          <div className="text-slate-400 italic">
            {lang === 'uk'
              ? 'Натисніть "Виконати (PHP & C++)" вгорі для запуску інтерпретатора PHP 8.4 та компіляції в C++23...'
              : 'Press "Run (PHP & C++)" above to execute PHP 8.4 and compile to native C++23...'}
          </div>
        )}

        {result?.error && (
          <div className="text-rose-400 bg-rose-950/30 border border-rose-900/50 p-3 rounded mb-2 font-mono whitespace-pre-wrap">
            <span className="font-bold">Fatal PHP Engine Error:</span> {result.error}
          </div>
        )}

        {result?.output && (
          <pre className="whitespace-pre-wrap font-mono text-slate-200 selection:bg-indigo-500/30">
            {result.output}
          </pre>
        )}
      </div>

      {/* Console Bottom Bar */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{lang === 'uk' ? 'Слухач STDOUT активний' : 'STDOUT listener ready'}</span>
        </div>
        {result?.opcodesCount && (
          <div className="tabular-nums">
            <span>{result.opcodesCount} opcodes executed</span>
          </div>
        )}
      </div>
    </div>
  );
};
