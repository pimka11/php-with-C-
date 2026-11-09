/**
 * Core type definitions for PHP 8.4 & C++ Engine
 */

export type PhpVersion = '5.6' | '7.4' | '8.0' | '8.2' | '8.4';

export interface ModernizationIssue {
  id: string;
  line: number;
  type: 'removed' | 'deprecated' | 'modernize' | 'performance';
  title: string;
  titleUk: string;
  description: string;
  descriptionUk: string;
  sourceCode: string;
  replacementCode: string;
  targetVersion: string;
  impact: 'critical' | 'warning' | 'info';
}

export interface ExecutionResult {
  output: string;
  executionTimeMs: number;
  memoryPeakKb: number;
  opcodesCount: number;
  success: boolean;
  error?: string;
  cExecutionTimeMs: number;
  cMemoryPeakKb: number;
}

export interface Opcode {
  line: number;
  opcode: string;
  op1?: string;
  op2?: string;
  result?: string;
  comment?: string;
}

export interface AsmInstruction {
  address: string;
  mnemonic: string;
  operands: string;
  comment?: string;
}

export interface PresetScript {
  id: string;
  title: string;
  titleUk: string;
  category: 'php84_features' | 'migration' | 'benchmarks' | 'cpp_native';
  description: string;
  descriptionUk: string;
  sourceVersion: PhpVersion;
  code: string;
}
