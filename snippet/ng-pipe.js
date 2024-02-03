/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let directiveInput = util.documentContext.snippetParameters[1];
  let common = require('../shared/directive-or-pipe.common');
  let result = await common(
    {
      type:'Pipe',
      findName: 'name',
      compare: (snippet, input) => {
        return snippet === input;
      },
      templatePath: util.path.join(
        util.path.normalize(__dirname),
        './template/template.pipe.ts',
      ),
      defaultImportPathName: `${directiveInput}.pipe.ts`,
      defaultClassName: util.lodash.capitalize(directiveInput) + 'Pipe',
      nameInput: `${directiveInput}`,
    },
    util,
  );
  await util.updateChangeList(result);
};
module.exports.parameters = [];
