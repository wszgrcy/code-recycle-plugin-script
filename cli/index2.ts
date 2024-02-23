import { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './test/test2.ts',
      list: [{ query: `VariableDeclaration>Identifier~NumericLiteral:infer(var)`, replace: { var: '7' } }],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
