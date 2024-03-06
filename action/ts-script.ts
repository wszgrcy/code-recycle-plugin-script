import type { ScriptFunction } from '../script.define';

let fn: ScriptFunction = async (util, rule, host, injector) => {
  console.log('测试');
  let resolve = await rule.read.fileResolve('./a1.ts', { use: 'tree-sitter', language: 'javascript' });
  let result = await rule.query.like(resolve, 'let', 1);

  rule.hint.outputLog((result as any).node.value);
  rule.hint.outputLog('ts-output');
};
export default fn;
