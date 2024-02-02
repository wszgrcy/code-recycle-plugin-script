/** @type {import('/home/chen/my-project/code-factory-plugin/dist/script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  /** custom variable */
  let directiveInput = util.documentContext.snippetParameters[1];

  let common = require('../shared/directive-or-pipe.common');
  let result = await common(
    {
      type:'Directive',
      findName: 'selector',
      compare: (snippet, input) => snippet === input.slice(1,-1),
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
  // let result = await util.changeList([
  //   {
  //     path: `${searchDir}/**/*.ts`,
  //     name: 'findDirective',
  //     glob: true,
  //     list: [
  //       {
  //         query: `ClassDeclaration`,
  //         multi: true,
  //         optional: true,
  //         children: [
  //           {
  //             query: `Decorator>CallExpression:has([value=Directive]) ObjectLiteralExpression PropertyAssignment:has([value=selector])::children(2)`,
  //             multi: true,
  //             optional: true,
  //             callback: (context) => {
  //               if (context.getContext('root.findDirective').data) {
  //                 return;
  //               }
  //               // selector
  //               let value = context.getNodeValue().slice(2, -2);
  //               if (value === util.documentContext.snippetParameters[1]) {
  //                 let item = context.getContext('root.findDirective');
  //                 item.data = {
  //                   name: context.getNodeValue('0'),
  //                   path: context.getNode('0').path,
  //                 };
  //               }
  //             },
  //             children: [{ parentMap: 'parent3', query: `>ClassKeyword+*` }],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   getNgTs(
  //     {
  //       children: [
  //         {
  //           // 查询imports对应数组
  //           query: `Decorator PropertyAssignment:has([value=imports])::children(2)`,
  //           children: [
  //             {
  //               disable: (context) => {
  //                 let directiveNameContext =
  //                   context.getContext('root.findDirective');
  //                 let directiveName = directiveNameContext.data?.name;
  //                 if (directiveName) {
  //                   let arrayValue = context.getNodeValue('parent');
  //                   if (arrayValue.includes(directiveName)) {
  //                     return true;
  //                   }
  //                 }
  //                 return false;
  //               },

  //               query: util.statement`OpenBracketToken`,
  //               insertAfter: true,
  //               replace: (context) => {
  //                 let name =
  //                   context.getContext('root.findDirective').data?.name ||
  //                   defaultClassName;
  //                 return `${name},`;
  //               },

  //               callback: (context) => {
  //                 let directiveNameContext =
  //                   context.getContext('root.findDirective');
  //                 let directiveName =
  //                   directiveNameContext.data?.name || defaultClassName;
  //                 let importPath =
  //                   directiveNameContext.data?.path ||
  //                   util.path.join(searchDir, defaultImportPathName);

  //                 return util.setChange.contextNode(
  //                   context.file,
  //                   `import { ${directiveName} } from '${pathRelative(
  //                     context.node.path,
  //                     importPath,
  //                     util,
  //                   )}';\n`,
  //                   [0, 0],
  //                 );
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     util,
  //   ),
  //   {
  //     disable: (context) => context.getContext('root.findDirective').data,
  //     type: 'copy',
  //     from: (context) => {
  //       return util.path.join(
  //         util.path.normalize(__dirname),
  //         './template/template.directive.ts',
  //       );
  //     },
  //     to: (context) => {
  //       return util.path.join(searchDir, defaultImportPathName);
  //     },
  //   },
  //   {
  //     disable: (context) => {
  //       return context.getContext('root.findDirective').data;
  //     },
  //     path: util.path.join(searchDir, defaultImportPathName),
  //     list: [
  //       {
  //         query: String.raw`[value=\'template']`,
  //         replace: `'[${directiveInput}]'`,
  //       },
  //       {
  //         query: String.raw`[value=TemplateClass]`,
  //         replace: `${util.lodash.capitalize(directiveInput)}Directive`,
  //       },
  //     ],
  //   },
  // ]);
  await util.updateChangeList(result);
};
module.exports.parameters = [];
