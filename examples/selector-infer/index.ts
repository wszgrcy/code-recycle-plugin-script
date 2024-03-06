import { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/selector-infer/test.ts',
      list: [{ query: `VariableDeclaration>Identifier~NumericLiteral:infer(var)`, replace: { var: '7' } }],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
