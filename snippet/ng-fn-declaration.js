/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let getNgTs = require('../shared/get-ng-ts');

  let directiveInput = util.documentContext.snippetParameters[1];
  let type = util.documentContext.snippetParameters['variable'];
  let result = await util.changeList([
    getNgTs(
      {
        query: `>CloseBraceToken`,
        insertBefore: true,
        replace: type ? `${directiveInput}: any` : `${directiveInput}(){}\n`,
      },
      util,
    ),
  ]);
  await util.updateChangeList(result);
};
