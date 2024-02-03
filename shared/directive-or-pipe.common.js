const pathRelative = require('../shared/path-relative');
/** @type {(option:{type:string,compare:(snippet:string,input:string) => boolean,findName:string,templatePath:string,defaultImportPathName:string,defaultClassName:string,nameInput:string},util:import('../script.define').Util) =>Promise<import('../script.define').FileQueryList> }  */
module.exports = (option, util) => {
  let getNgTs = require('../shared/get-ng-ts');
  /** custom variable */
  let searchDir = util.filePathGroup.currentDir;
  let directiveInput = option.nameInput;
  let defaultImportPathName = option.defaultImportPathName;
  let defaultClassName = option.defaultClassName;
  return util.changeList([
    {
      path: `${searchDir}/**/*.ts`,
      name: 'findDirective',
      glob: true,
      list: [
        {
          query: `ClassDeclaration`,
          multi: true,
          optional: true,
          children: [
            {
              query: `Decorator>CallExpression:has([value=${option.type}]) ObjectLiteralExpression PropertyAssignment:has([value=${option.findName}])::children(2)`,
              multi: true,
              optional: true,
              callback: (context) => {
                if (context.getContext('root.findDirective').data) {
                  return;
                }
                // selector
                let result = option.compare(
                  util.documentContext.snippetParameters[1],
                  context.getNodeValue().slice(1, -1),
                );
                if (result) {
                  let item = context.getContext('root.findDirective');
                  item.data = {
                    name: context.getNodeValue('0'),
                    path: context.getNode('0').path,
                  };
                }
              },
              children: [{ parentMap: 'parent3', query: `>ClassKeyword+*` }],
            },
          ],
        },
      ],
    },
    getNgTs(
      {
        children: [
          {
            // 查询imports对应数组
            query: `Decorator PropertyAssignment:has([value=imports])::children(2)`,
            children: [
              {
                disable: (context) => {
                  let directiveNameContext =
                    context.getContext('root.findDirective');
                  let directiveName = directiveNameContext.data?.name;
                  if (directiveName) {
                    let arrayValue = context.getNodeValue('parent');
                    if (arrayValue.includes(directiveName)) {
                      return true;
                    }
                  }
                  return false;
                },

                query: util.statement`OpenBracketToken`,
                insertAfter: true,
                replace: (context) => {
                  let name =
                    context.getContext('root.findDirective').data?.name ||
                    defaultClassName;
                  return `${name},`;
                },

                callback: (context) => {
                  let directiveNameContext =
                    context.getContext('root.findDirective');
                  let directiveName =
                    directiveNameContext.data?.name || defaultClassName;
                  let importPath =
                    directiveNameContext.data?.path ||
                    util.path.join(searchDir, defaultImportPathName);

                  return util.setChange.contextNode(
                    context.file,
                    `import { ${directiveName} } from '${pathRelative(
                      context.node.path,
                      importPath,
                      util,
                    )}';\n`,
                    [0, 0],
                  );
                },
              },
            ],
          },
        ],
      },
      util,
    ),
    {
      disable: (context) => context.getContext('root.findDirective').data,
      type: 'copy',
      from: (context) => {
        return util.path.normalize(option.templatePath);
      },
      to: (context) => {
        return util.path.join(searchDir, defaultImportPathName);
      },
    },
    {
      disable: (context) => {
        return context.getContext('root.findDirective').data;
      },
      path: util.path.join(searchDir, defaultImportPathName),
      list: [
        {
          query: String.raw`[value=\'template']`,
          replace: `'${directiveInput}'`,
        },
        {
          query: String.raw`[value=TemplateClass]`,
          replace: `${defaultClassName}`,
        },
      ],
    },
  ]);
};
