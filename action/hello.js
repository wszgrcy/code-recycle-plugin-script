/** @type {import('/home/chen/my-project/code-factory-plugin/dist/script.define').ScriptFunction} */
module.exports = async(util, rule, host, injector) => {
  console.log('hello')
  await rule.debug.output('测试','1233')
}
module.exports.parameters=[]