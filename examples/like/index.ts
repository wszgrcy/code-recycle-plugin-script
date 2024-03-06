import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/like/test.ts',
      list: [{ query: '[[$letVar]]a=6', mode: 'like', replace: { letVar: `{{''|ctxInferValue:'letVar'}}1` } }],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
