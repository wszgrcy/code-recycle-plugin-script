/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  console.log('hello');
  rule.hint.outputLog('hello')
};
