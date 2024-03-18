/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let list = await util.changeList([
    {
      type: 'copy',
      source: 'git',
      from: {
        url: 'https://github.com/angular/angular-cli.git',
        match: '/packages/schematics/angular/directive/files',
        output: '/packages/schematics/angular/directive/files',
      },
      pathTemplate: '@angular-devkit',
      contentTemplate: '@angular-devkit',
      pathTemplateSuffix: '.template',
      templateContext: { name: 'hello', standalone: true, selector: 'hello', 'if-flat': (input) => '' },
      to: './hello-directive'
    },
  ]);
  await util.updateChangeList(list);
};
