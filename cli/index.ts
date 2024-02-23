import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './test/test.ts',
      list: [{ query: 'let a=[[$var]]', mode: 'like', replace: { var: '7' } }],
      parser: { use: 'tree-sitter', language: 'javascript' },
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
