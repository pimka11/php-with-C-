import React, { useRef, useState } from 'react';
import { Copy, Check, RotateCcw, Code, Sparkles } from 'lucide-react';
import { PRESET_SCRIPTS } from '../data/presets';
import { PresetScript } from '../types/php';

interface CodeEditorProps {
  code: string;
  setCode: (c: string) => void;
  selectedPreset: PresetScript;
  onSelectPreset: (preset: PresetScript) => void;
  lang: 'uk' | 'en';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  selectedPreset,
  onSelectPreset,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(selectedPreset.code);
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(nextCode);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 10);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        {/* Preset Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="preset-select" className="text-xs font-medium text-slate-400 whitespace-nowrap">
            {lang === 'uk' ? 'Приклад проекту:' : 'Preset Script:'}
          </label>
          <select
            id="preset-select"
            value={selectedPreset.id}
            onChange={(e) => {
              const found = PRESET_SCRIPTS.find((p) => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            className="text-xs bg-slate-900 text-slate-200 border border-slate-700/80 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-sans"
          >
            {PRESET_SCRIPTS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {lang === 'uk' ? preset.titleUk : preset.title} ({preset.sourceVersion})
              </option>
            ))}
          </select>
        </div>

        {/* Quick PHP 8.4 Primitives Toolbar */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1">
            {lang === 'uk' ? 'Швидка вставка PHP 8.4:' : 'PHP 8.4 Snippets:'}
          </span>
          <button
            onClick={() => insertSnippet('\n    public string $name {\n        get => $this->firstName;\n        set(string $val) => trim($val);\n    }\n')}
            title="PHP 8.4 Property Hooks"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded border border-slate-700/60 transition-colors"
          >
            Property Hook
          </button>
          <button
            onClick={() => insertSnippet('public private(set) string $status = "active";')}
            title="PHP 8.4 Asymmetric Visibility"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded border border-slate-700/60 transition-colors"
          >
            private(set)
          </button>
          <button
            onClick={() => insertSnippet('$found = array_find($list, fn($x) => $x["id"] === 1);')}
            title="PHP 8.4 array_find"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded border border-slate-700/60 transition-colors"
          >
            array_find
          </button>
        </div>

        {/* Copy & Reset actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
            title="Скопіювати код / Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
            title="Скинути до початкового стану / Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs leading-5">
        {/* Line Numbers Column */}
        <div
          aria-hidden="true"
          className="select-none py-3 pl-3 pr-2.5 text-right text-slate-400 bg-slate-950/60 border-r border-slate-800/80 tabular-nums shrink-0 font-mono"
          style={{ width: '42px' }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent text-slate-200 resize-none focus:outline-none font-mono whitespace-pre overflow-auto"
          placeholder="<?php // Напишіть або вставте код PHP..."
        />
      </div>

      {/* Footer info bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>PHP 8.4.1</span>
          <span aria-hidden="true">·</span>
          <span>{lines.length} lines</span>
          <span aria-hidden="true">·</span>
          <span>{code.length} bytes</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">Ready</span>
        </div>
      </div>
    </div>
  );
};
