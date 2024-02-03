/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  /** custom variable */
  let directiveInput = util.documentContext.snippetParameters[1];

  let common = require('../shared/directive-or-pipe.common');
  let result = await common(
    {
      type: 'Directive',
      findName: 'selector',
      compare: (snippet, input) => snippet === input.slice(1, -1),
      templatePath: util.path.join(
        util.path.normalize(__dirname),
        './template/template.directive.ts',
      ),
      defaultImportPathName: `${directiveInput}.directive.ts`,
      defaultClassName: util.lodash.capitalize(directiveInput) + 'Directive',
      nameInput: `[${directiveInput}]`,
    },
    util,
  );

  await util.updateChangeList(result);
};
module.exports.parameters = [];
