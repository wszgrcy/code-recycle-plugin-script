/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let pathRelative = require('../shared/path-relative');
  /** custom variable */
  let directiveInput = util.documentContext.snippetParameters[1];
  let defaultName =util.lodash.upperFirst(util.lodash.camelCase(directiveInput))  + 'Directive';
  let list = await util.changeList([
    {
      path: `${util.filePathGroup.currentDir}/*.ts`,
      name: 'findDirective',
      glob: true,
      list: [
        {
          query: `@Directive( [[{]] selector:[[$selector]] [[}]] )[[...]]class [[$className]]`,
          mode: 'like',
          multi: true,
          optional: true,
          callback: (context) => {
            if (context.getContext('root.findDirective')?.data) {
              return;
            }
            let pipe = context.pipe;
            let value = pipe.ctxInferValue('', 'selector');
            if (value.slice(2, -2) === directiveInput) {
              let item = context.getContext('root.findDirective');
              item.data = {
                name: pipe.ctxInferValue('', 'className'),
                path: context.getNode('').path,
              };
            }
          },
        },
      ],
    },
    {
      path: '*.ts',
      name: 'component',
      glob: true,
      list: [
        {
          disable: (context) => {
            if (context.getContext('root.component').data) {
              return;
            }
          },
          query: `ClassDeclaration:like(
            @Component( [[{]] imports: [[$importList]] [[}]]) 
            ):like(  @Component( [[{]] templateUrl: [[$htmlRel]] [[}]])  )`,
          multi: true,
          optional: true,
          modeOptions: { matchLevel: 'top' },
          callback: (ctx) => {
            if (ctx.getContext('root.component')?.data) {
              return;
            }
            let pipe = ctx.pipe;
            // html path
            let path = pipe.ctxInferValue('', 'htmlRel').slice(1, -1);
            let result = util.path.relative(util.path.dirname(ctx.node.path), util.documentContext.path);
            result = result.startsWith('..') ? result : './' + result;
            if (path !== result) {
              return;
            }

            let importList = pipe.ctxInferValue('', 'importList');
            let importListRange = pipe.ctxInferRange('', 'importList');
            let directiveData = ctx.getContext('root.findDirective').data;
            let directiveName = !directiveData ? defaultName : directiveData.name;
            if (importList.includes(directiveName)) {
              return;
            }
            let importPath =
              directiveData?.path || util.path.join(util.filePathGroup.currentDir, `${util.lodash.kebabCase(directiveInput)}.directive.ts`);
            return [
              { value: `${directiveName},`, range: [importListRange[0] + 1, importListRange[0] + 1] },
              { value: `import { ${directiveName} } from '${pathRelative(ctx.node.path, importPath, util)}';\n`, range: [0, 0] },
            ];
          },
        },
      ],
    },
    {
      disable: (context) => context.getContext('root.findDirective').data,
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
      templateContext: { name: directiveInput, standalone: true, selector: directiveInput, 'if-flat': (input) => '' },
      to: (context) => {
        util.rule.hint.outputLog(util.filePathGroup.currentDir);
        return util.filePathGroup.currentDir;
      },
    },
  ]);
  await util.updateChangeList(list);
};
