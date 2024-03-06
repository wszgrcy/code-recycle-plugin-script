import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/multi-layer/test.ts',
      list: [
        {
          query: '[[$letVar]]a=6',
          mode: 'like',
          replace: {
            letVar: 'const',
          },
        },
        {
          query: 'let [[$define]]=6',
          mode: 'like',
          replace: {
            define: 'aa',
          },
        },
      ],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
