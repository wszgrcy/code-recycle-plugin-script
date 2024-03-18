/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  rule.hint.outputLog('视图 hello');
  return () => {
    rule.hint.outputLog('视图 hello-update');
    return {
      type: 'button',
      callback: () => {
        console.log('hello111');
        rule.hint.outputLog('hello world');
      },
      config: { label: '点击' },
    };
  };
};
