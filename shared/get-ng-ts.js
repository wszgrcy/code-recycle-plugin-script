/** @type {(option:import('/home/chen/my-project/code-factory-plugin/dist/script.define').NodeQueryOption,util:import('/home/chen/my-project/code-factory-plugin/dist/script.define').Util)=>import('/home/chen/my-project/code-factory-plugin/dist/script.define').NodeQueryOption} */

module.exports = (option, util) => {
  return {
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
                  let result = util.path.relative(
                    util.path.dirname(parent.node.path),
                    util.documentContext.path,
                  );
                  result = result.startsWith('..') ? result : './' + result;
                  return result !== value;
                },
                parentMap: 'parent3',
                ...option,
              },
            ],
          },
        ],
      },
    ],
  };
};
