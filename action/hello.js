/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  console.log('hello')
  await rule.debug.output('output:hello world')
  await rule.debug.dialog('dialog:hello world')
}
module.exports.parameters = []