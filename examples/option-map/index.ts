import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/option-map/test.ts',
      list: [
        {
          query: 'no content',
          mode: 'like',
          nullable: true,
          children: [{ parentMap: 'item', query: 'let', mode: 'like', replace: 'let1' }],
        },
      ],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
