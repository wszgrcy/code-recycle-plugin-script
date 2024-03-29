import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/specify-parser/test.ts',
      parser: { use: 'tree-sitter', language: 'javascript' },
      list: [{ query: 'let a=[[$var]]', mode: 'like', replace: { var: '7' } }],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
