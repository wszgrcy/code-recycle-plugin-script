/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let result = await util.changeList([
    {
      path: `*.ts`,
      glob: true,
      list: [
        {
          query: `ClassDeclaration`,
          name: 'component',
          multi: true,
          optional: true,
          children: [
            {
              query: `Decorator>CallExpression:has(Identifier[value=Component]) PropertyAssignment:has(Identifier[value=templateUrl])::children(2)`,
              multi: true,
              optional: true,
              children: [
                {
                  disable: (context) => {
                    let parent = context.getContext('parent');
                    let value = parent.getNodeValue().slice(1, -1);
                    let path = require('path');
                    let result = path.relative(path.dirname(parent.node.path), util.documentContext.path);
                    result = result.startsWith('..') ? result : './' + result;
                    return result !== value;
                  },
                  parentMap: 'parent3',
                  query: `ClassKeyword~OpenBraceToken`,
                  insertAfter: true,
                  replace: (context) => {
                    return `\n@ViewChild('${util.documentContext.snippetParameters[1]}') ${util.documentContext.snippetParameters[1]}!: any;`;
                  },
                  children: [
                    {
                      parentMap: 'item',
                      query: String.raw`ImportDeclaration:has(StringLiteral[value=\'@angular/core']):has(Identifier[value=ViewChild])`,
                      nullable: true,
                      callback: (context) => {
                        return !context.node ? { value: `import { ViewChild } from '@angular/core';\n`, range: [0, 0] } : undefined;
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  await util.updateChangeList(result);
};
module.exports.parameters = [];
