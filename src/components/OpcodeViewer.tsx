import React, { useState } from 'react';
import { Cpu, Binary, Layers, Info } from 'lucide-react';
import { Opcode, AsmInstruction } from '../types/php';

interface OpcodeViewerProps {
  opcodes: Opcode[];
  asmInstructions: AsmInstruction[];
  lang: 'uk' | 'en';
}

export const OpcodeViewer: React.FC<OpcodeViewerProps> = ({
  opcodes,
  asmInstructions,
  lang,
}) => {
  const [activeView, setActiveView] = useState<'both' | 'zend' | 'asm'>('both');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200">
              {lang === 'uk' ? 'Zend VM Байткод та C++ Асемблер' : 'Zend VM Opcodes & C++ Assembly'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveView('both')}
              className={`px-2.5 py-0.5 rounded ${
                activeView === 'both' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'uk' ? 'Порівняння' : 'Split View'}
            </button>
            <button
              onClick={() => setActiveView('zend')}
              className={`px-2.5 py-0.5 rounded ${
                activeView === 'zend' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Zend Opcodes
            </button>
            <button
              onClick={() => setActiveView('asm')}
              className={`px-2.5 py-0.5 rounded ${
                activeView === 'asm' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              x86_64 ASM
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
          <span>Zend Engine 4.4</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>Clang 18 LLVM AOT</span>
        </div>
      </div>

      {/* Main Opcodes Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden text-xs font-mono">
        {/* Zend Opcodes View */}
        {(activeView === 'both' || activeView === 'zend') && (
          <div className="flex flex-col h-full overflow-hidden bg-slate-950/40">
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-sky-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'uk' ? 'Zend VM Байткод (PHP 8.4)' : 'Zend VM Bytecode (PHP 8.4)'}</span>
              </span>
              <span className="text-[10px] text-slate-400">{opcodes.length} opcodes</span>
            </div>

            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="py-1 px-2">Line</th>
                    <th className="py-1 px-2">Opcode</th>
                    <th className="py-1 px-2">Operands</th>
                    <th className="py-1 px-2">Result</th>
                    <th className="py-1 px-2 hidden sm:table-cell">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {opcodes.map((op, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-1.5 px-2 text-slate-400 tabular-nums">{op.line}</td>
                      <td className="py-1.5 px-2 text-sky-400 font-semibold">{op.opcode}</td>
                      <td className="py-1.5 px-2 text-slate-300">
                        {op.op1 || ''} {op.op2 ? `, ${op.op2}` : ''}
                      </td>
                      <td className="py-1.5 px-2 text-amber-300 font-mono">{op.result || '-'}</td>
                      <td className="py-1.5 px-2 text-slate-400 hidden sm:table-cell text-[11px] truncate max-w-[140px]">
                        {op.comment || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* C++ x86_64 Assembly View */}
        {(activeView === 'both' || activeView === 'asm') && (
          <div className="flex flex-col h-full overflow-hidden bg-slate-950/20">
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'uk' ? 'x86_64 Машинний асемблер (C++23)' : 'x86_64 Machine Assembly (C++23)'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">-O3 AVX2</span>
            </div>

            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="py-1 px-2">Address</th>
                    <th className="py-1 px-2">Instruction</th>
                    <th className="py-1 px-2">Operands</th>
                    <th className="py-1 px-2 hidden sm:table-cell">CPU Optimization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {asmInstructions.map((inst, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-1.5 px-2 text-slate-400 tabular-nums">{inst.address.substring(10)}</td>
                      <td className="py-1.5 px-2 text-emerald-400 font-bold">{inst.mnemonic}</td>
                      <td className="py-1.5 px-2 text-slate-200 font-mono">{inst.operands}</td>
                      <td className="py-1.5 px-2 text-slate-400 hidden sm:table-cell text-[11px]">
                        {inst.comment || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Footer */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0" />
        <span>
          {lang === 'uk'
            ? 'Інтерпретатор PHP 8.4 виконує байткод через віртуальну машину Zend VM, тоді як C++23 компілюється безпосередньо в векторні інструкції процесора (AVX2/SIMD).'
            : 'PHP 8.4 interprets opcodes inside the Zend VM loop, while C++23 compiles ahead-of-time directly into vector CPU instructions (AVX2/SIMD).'}
        </span>
      </div>
    </div>
  );
};
