import React, { useState } from 'react';
import { X, Download, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { generateCppExtension, ExtensionFiles } from '../engine/extensionGenerator';

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'uk' | 'en';
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [moduleName, setModuleName] = useState('fast_php_engine');
  const [activeFile, setActiveFile] = useState<keyof ExtensionFiles>('cppSource');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = generateCppExtension(moduleName);

  const fileMap: Record<keyof ExtensionFiles, { name: string; content: string }> = {
    cppSource: { name: `php_${moduleName.toLowerCase()}.cpp`, content: files.cppSource },
    headerSource: { name: `php_${moduleName.toLowerCase()}.h`, content: files.headerSource },
    configM4: { name: 'config.m4', content: files.configM4 },
    cmakeLists: { name: 'CMakeLists.txt', content: files.cmakeLists },
    readme: { name: 'README.md', content: files.readme },
  };

  const current = fileMap[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = current.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'uk'
                  ? 'Генератор C++23 Native Zend Розширення для PHP 8.4'
                  : 'C++23 Native Zend Extension Generator for PHP 8.4'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'uk'
                  ? 'Створення нативних бінарних C++ модулів (.so / .dll) для екстремального прискорення вашого проекту'
                  : 'Compile high-speed native C++ extensions for PHP 8.4 applications'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Module Name & File Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-slate-400 font-medium">
              {lang === 'uk' ? 'Назва модуля:' : 'Module Name:'}
            </label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* File selector tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
            {(Object.keys(fileMap) as (keyof ExtensionFiles)[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeFile === key
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fileMap[key].name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'uk' ? 'Скопійовано' : 'Copied') : (lang === 'uk' ? 'Копіювати' : 'Copy')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'uk' ? 'Завантажити файл' : 'Download File'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed text-slate-200">
          <pre className="whitespace-pre">{current.content}</pre>
        </div>

        {/* Instructions footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'uk'
                ? 'Для збирання розширення: phpize && ./configure && make && sudo make install'
                : 'To build extension on Linux: phpize && ./configure && make && sudo make install'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
          >
            {lang === 'uk' ? 'Закрити' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
