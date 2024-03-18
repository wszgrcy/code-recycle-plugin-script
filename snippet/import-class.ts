import { ScriptFunction, ContentResolveItem } from '../script.define';
import { join } from 'path';
let fn: ScriptFunction = async (util, rule, host, injector) => {
  let importName = util.documentContext.snippetParameters![1];
  let _ = util.lodash;
  let className = _.upperFirst(_.camelCase(importName));
  let rootCtx = util.initContext();
  await util.changeList(
    [
      {
        path: `*.ts`,
        name: 'classPath',
        glob: true,
        list: [
          {
            query: `export class ${className}`,
            mode: 'like',
            optional: true,
            callback(context, index) {
              let classPathCtx = context.getContext('root.classPath');
              classPathCtx.data = context.node!.path!;
            },
          },
        ],
      },
    ],
    rootCtx
  );
  let filePath = rootCtx.getContext('root.classPath').data;
  if (!filePath) {
    await util.changeList([
      {
        type: 'copy',
        from: join(__dirname, './template/__name@dasherize__.ts'),
        to: './',
        pathTemplate: '@angular-devkit',
        contentTemplate: '@angular-devkit',
        templateContext: { name: importName },
      },
    ]);
    let changedRecord = host.records();
    filePath = util.path.normalize((changedRecord[0] as any).path);
  }
  let pathRelative = require('../shared/path-relative');
  let changed = await util.changeList([
    {
      path: util.filePathGroup.currentPath,
      list: [
        {
          range: [0, 0],
          replace: `import {${className}} from '${pathRelative(util.filePathGroup.currentPath, filePath, util)}'\n`,
        },
        {
          range: util.documentContext.insertRange![0].range,
          replace: `let ${importName} = new ${className}()`,
        },
      ],
    },
  ]);

  await util.updateChangeList(changed);
};

export default fn;
