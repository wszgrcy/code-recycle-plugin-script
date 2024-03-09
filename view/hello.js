/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  console.log('视图 hello');
  return {
    type: 'button',
    callback: () => {
      console.log('hello111');
      rule.hint.outputLog('hello world')
    },
    config: { label: '点击' },
  };
};
module.exports.parameters = [];
