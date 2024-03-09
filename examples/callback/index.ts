import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/callback/test.ts',
      list: [
        {
          query: '[[$letVar]]a=6',
          mode: 'like',
          callback: (context) => {
            return [
              {
                value: (context.pipe as any).ctxInferValue('', 'letVar') + '1',
                range: (context.pipe as any).ctxInferRange('', 'letVar'),
              },
            ];
          },
        },
      ],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
