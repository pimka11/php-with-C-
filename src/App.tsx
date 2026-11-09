/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { ExecutionConsole } from './components/ExecutionConsole';
import { CppViewer } from './components/CppViewer';
import { MigrationPanel } from './components/MigrationPanel';
import { OpcodeViewer } from './components/OpcodeViewer';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { ExtensionModal } from './components/ExtensionModal';

import { PRESET_SCRIPTS } from './data/presets';
import { PresetScript, ExecutionResult } from './types/php';
import { phpInterpreter } from './engine/phpInterpreter';
import { cppTranspiler, TranspileOptions } from './engine/cppTranspiler';
import { phpModernizer } from './engine/modernizer';
import { zendOpcodeGenerator } from './engine/zendOpcodeGenerator';
import { Sparkles, Zap, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'uk' | 'en'>('uk');
  const [activeTab, setActiveTab] = useState<'editor' | 'cpp' | 'modernizer' | 'opcodes' | 'benchmark'>('editor');
  const [selectedPreset, setSelectedPreset] = useState<PresetScript>(PRESET_SCRIPTS[0]);
  const [code, setCode] = useState<string>(PRESET_SCRIPTS[0].code);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  const [cppOptions, setCppOptions] = useState<TranspileOptions>({
    standard: 'c++23',
    optimizeLevel: '-O3',
    includeBenchmarkTiming: true,
    namespaceName: 'app',
  });

  // Execute PHP & C++ simulation
  const handleRun = useCallback(() => {
    setIsExecuting(true);
    setTimeout(() => {
      const result = phpInterpreter.run(code);
      setExecutionResult(result);
      setIsExecuting(false);
    }, 40);
  }, [code]);

  // Run on mount
  useEffect(() => {
    handleRun();
  }, [handleRun]);

  // Transpile to C++23
  const cppCode = useMemo(() => {
    try {
      return cppTranspiler.transpile(code, cppOptions);
    } catch (e: any) {
      return `// Error during C++ transpilation:\n// ${e?.message || e}`;
    }
  }, [code, cppOptions]);

  // Modernize analysis
  const modernizeResult = useMemo(() => {
    return phpModernizer.analyzeAndModernize(code, selectedPreset.sourceVersion);
  }, [code, selectedPreset.sourceVersion]);

  // Zend Opcodes & Assembly
  const opcodes = useMemo(() => {
    return zendOpcodeGenerator.generateOpcodes(code);
  }, [code]);

  const asmInstructions = useMemo(() => {
    return zendOpcodeGenerator.generateAssembly();
  }, []);

  const handleSelectPreset = (preset: PresetScript) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setTimeout(() => {
      const result = phpInterpreter.run(preset.code);
      setExecutionResult(result);
    }, 20);
  };

  const handleApplyModernization = () => {
    setCode(modernizeResult.modernizedCode);
    setActiveTab('editor');
    setTimeout(() => {
      const result = phpInterpreter.run(modernizeResult.modernizedCode);
      setExecutionResult(result);
    }, 30);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRun={handleRun}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        isExecuting={isExecuting}
        lang={lang}
        setLang={setLang}
        hasModernizationChanges={modernizeResult.issues.length > 0}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col max-w-[1720px] w-full mx-auto p-4 sm:p-6 gap-4">
        {/* Modern PHP 8.4 + C++ Quick Info Strip */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {lang === 'uk' ? 'PHP 8.4 Property Hooks' : 'PHP 8.4 Property Hooks'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'uk'
                  ? 'get => та set => безпосередньо у властивостях, усуваючи 80% геттерів/сеттерів.'
                  : 'Native get/set hooks eliminating boilerplate getter and setter methods.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {lang === 'uk' ? 'Трансляція в C++23 AOT' : 'C++23 Native AOT'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'uk'
                  ? 'Автоматична компіляція PHP у швидкий C++23 код із прискоренням до 30x.'
                  : 'Direct compilation to high-speed C++23 native code with up to 30x speedup.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-sky-500/10 rounded border border-sky-500/20 text-sky-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {lang === 'uk' ? 'Асиметрична видимість' : 'Asymmetric Visibility'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'uk'
                  ? 'public private(set) захищає стан обʼєктів без зайвих мутаторів.'
                  : 'public private(set) properties for clean and safe encapsulation.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {lang === 'uk' ? 'Функції масивів 8.4' : 'PHP 8.4 Array Helpers'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'uk'
                  ? 'Нативні array_find(), array_all(), array_any() без зовнішніх бібліотек.'
                  : 'Native array_find(), array_all(), and array_any() built directly into PHP core.'}
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Content Views */}
        <section className="flex-1 flex flex-col min-h-[560px]">
          {activeTab === 'editor' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CodeEditor
                code={code}
                setCode={setCode}
                selectedPreset={selectedPreset}
                onSelectPreset={handleSelectPreset}
                lang={lang}
              />
              <ExecutionConsole
                result={executionResult}
                onClear={() => setExecutionResult(null)}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'cpp' && (
            <div className="flex-1">
              <CppViewer
                cppCode={cppCode}
                options={cppOptions}
                setOptions={setCppOptions}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'modernizer' && (
            <div className="flex-1">
              <MigrationPanel
                originalCode={code}
                modernizeResult={modernizeResult}
                onApplyModernization={handleApplyModernization}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'opcodes' && (
            <div className="flex-1">
              <OpcodeViewer
                opcodes={opcodes}
                asmInstructions={asmInstructions}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'benchmark' && (
            <div className="flex-1">
              <BenchmarkPanel lang={lang} />
            </div>
          )}
        </section>
      </main>

      {/* C++ Zend Extension Generator Modal */}
      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        lang={lang}
      />

      {/* Subtle Footer */}
      <footer className="px-6 py-3 border-t border-slate-900 bg-slate-950/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">PHP 8.4.1 Latest Stable</span>
          <span aria-hidden="true">·</span>
          <span>C++23 Native Engine</span>
          <span aria-hidden="true">·</span>
          <span>Clang 18+ / GCC 14+ compatible</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{lang === 'uk' ? 'Повна підтримка Property Hooks та Asymmetric Visibility' : 'Full Property Hooks & Asymmetric Visibility support'}</span>
        </div>
      </footer>
    </div>
  );
}
