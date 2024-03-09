// cli中使用
/** @type {import('@code-recycle/cli').ScriptFunction} */

// vscode中使用
/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      path: './test/test.ts',
      list: [{ query: 'let a=[[$var]]', mode: 'like', replace: { var: '7' } }],
    },
  ]);
  await util.updateChangeList(list);
  await rule.hint.outputLog('hello world')
}
