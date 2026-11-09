import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sliders, CheckCircle2 } from 'lucide-react';
import { TranspileOptions } from '../engine/cppTranspiler';

interface CppViewerProps {
  cppCode: string;
  options: TranspileOptions;
  setOptions: (opts: TranspileOptions) => void;
  lang: 'uk' | 'en';
}

export const CppViewer: React.FC<CppViewerProps> = ({
  cppCode,
  options,
  setOptions,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([cppCode], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'php_native_app.cpp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = cppCode.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* C++ Settings Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              {lang === 'uk' ? 'C++23 Нативний вихідний код' : 'Native C++23 Source'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
            {/* Standard selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
              <button
                onClick={() => setOptions({ ...options, standard: 'c++23' })}
                className={`px-2 py-0.5 rounded ${
                  options.standard === 'c++23'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                C++23
              </button>
              <button
                onClick={() => setOptions({ ...options, standard: 'c++20' })}
                className={`px-2 py-0.5 rounded ${
                  options.standard === 'c++20'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                C++20
              </button>
            </div>

            {/* Optimization level */}
            <select
              value={options.optimizeLevel}
              onChange={(e) => setOptions({ ...options, optimizeLevel: e.target.value as any })}
              className="text-[11px] bg-slate-900 text-slate-300 border border-slate-800 rounded px-2 py-1 font-mono focus:outline-none"
            >
              <option value="-O2">-O2 Standard</option>
              <option value="-O3">-O3 Aggressive AOT</option>
              <option value="-Ofast">-Ofast Maximum SIMD</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'uk' ? 'Скопійовано' : 'Copied') : (lang === 'uk' ? 'Копіювати' : 'Copy')}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'uk' ? 'Завантажити .cpp' : 'Download .cpp'}</span>
          </button>
        </div>
      </div>

      {/* Feature notice banner */}
      <div className="px-4 py-2 bg-emerald-950/20 border-b border-emerald-900/30 text-xs text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {lang === 'uk'
              ? 'PHP 8.4 Property Hooks та масиви транспільовано у нульовий оверхед C++23 (std::variant, std::string, std::ranges)'
              : 'PHP 8.4 Property Hooks & arrays compiled to zero-overhead C++23 (std::variant, std::string, std::ranges)'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-400/80 hidden md:inline">
          clang++ -std=c++23 {options.optimizeLevel} -march=native
        </span>
      </div>

      {/* Code Textarea / Viewer with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs leading-5">
        <div
          aria-hidden="true"
          className="select-none py-3 pl-3 pr-2.5 text-right text-slate-400 bg-slate-950/60 border-r border-slate-800/80 tabular-nums shrink-0 font-mono"
          style={{ width: '48px' }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <pre className="flex-1 w-full h-full p-3 bg-slate-950/40 text-slate-200 resize-none font-mono whitespace-pre overflow-auto selection:bg-emerald-500/30">
          {cppCode}
        </pre>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Target: Clang 18+ / GCC 14+</span>
          <span aria-hidden="true">·</span>
          <span>{lines.length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-medium">Ready to compile with g++</span>
        </div>
      </div>
    </div>
  );
};
