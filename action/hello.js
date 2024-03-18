/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  console.log('hello')
  await rule.hint.outputLog('output:hello world')
  await rule.hint.dialogInfo('dialog:hello world')
}
