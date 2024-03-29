// cli中使用
import type { ScriptFunction } from '@code-recycle/cli';
// vscode中使用
// import type { ScriptFunction } from '../script.define';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './test/test.ts',
      list: [{ query: 'let a=[[$var]]', mode: 'like', replace: { var: '7' } }],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
