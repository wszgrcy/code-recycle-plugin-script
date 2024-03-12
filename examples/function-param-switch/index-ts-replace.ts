import type { ScriptFunction } from '@code-recycle/cli';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './examples/function-param-switch/test.ts',
      list: [
        {
          query: `CallExpression:like(test1( [[{^]]  [[...]] [[$p4]] [[$}]] ) )`,
          multi: true,
          replace: {
            p4: `{value:{{''|ctxInferValue:'p4'}}}`,
          },
        },
        // {
        //   query: `CallExpression>SyntaxList:has(::children(0):infer(p1)):has(::children(-1):infer(p4))`,
        //   multi: true,
        //   replace: {
        //     p1: `{{''|ctxInferValue:'p4'}}`,
        //     p4: `{{''|ctxInferValue:'p1'}}`,
        //   },
        // },
      ],
    },
  ]);

  await util.updateChangeList(list);
};
export default fn;
