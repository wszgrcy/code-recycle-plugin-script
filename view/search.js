function replaceCaseInsensitive(str, find, replace) {
  let result = '';
  let findLower = find.toLowerCase();
  let index = 0;

  while (index < str.length) {
    if (str.substring(index).toLowerCase().startsWith(findLower)) {
      result += replace;
      index += find.length;
    } else {
      result += str[index];
      index++;
    }
  }

  return result;
}
function replaceI(str, find, replace, caseSensitive) {
  if (caseSensitive) {
    return str.replaceAll(find, replace);
  } else {
    return replaceCaseInsensitive(str, find, replace);
  }
}
/** @type {import('/home/chen/my-project/code-factory-plugin/dist/script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let ignore = (await rule.globalVariable.getValue('ignore')) ?? true;
  rule.globalVariable.setValue('ignore', ignore);
  let list = await rule.globalVariable.getValue('nodeList');
  return rule.view.grid({
    list: [
      {
        x: 0,
        y: 0,
        cols: 4,
        config: await rule.view.select(
          'languageConfig',
          {
            label: 'languageConfig',
            preset: true,
            multiple: false,
            presetName: 'languageConfig',
            placeholder: '',
          },
          undefined,
          (item) => {},
          (item) => {},
        ),
      },
      {
        x: 0,
        y: 1,
        cols: 2,
        config: await rule.view.input('selector', {
          type: 'input',
          color: '',
          label: 'selector',
          placeholder: '',
        }),
      },
      {
        x: 0,
        y: 2,
        cols: 2,
        fixed: false,
        config: await rule.view.input('find', {
          type: 'input',
          label: '*find',
          placeholder: '',
          color: '',
        }),
      },
      {
        x: 0,
        y: 3,
        cols: 4,
        fixed: false,
        config: await rule.view.input('replace', {
          type: 'input',
          label: 'replace',
          placeholder: '',
          color: '',
        }),
      },
      {
        x: 2,
        y: 2,
        cols: 1,
        fixed: true,
        config: await rule.view.checkbox('case-sensitive', {
          color: 'primary',
          icon: 'case-sensitive',
          fontSet: 'vscode',
          type: 'icon',
        }),
      },
      {
        x: 2,
        y: 1,
        cols: 1,
        fixed: false,
        config: await rule.view.input('glob', {
          type: 'input',
          label: 'glob',
          placeholder: '',
          color: '',
        }),
      },
      {
        x: 0,
        y: 4,
        cols: 2,
        fixed: false,
        config: await rule.view.button(
          { label: 'find', color: 'primary', type: 'flat' },
          async () => {
            let ignore = await rule.globalVariable.getValue('ignore');
            let result = await rule.read.contentResolveByFileQueryBlock(
              0,
              await rule.globalVariable.getValue('glob'),
              undefined,
              await rule.globalVariable.getValue('languageConfig'),
              true,
              ignore
                ? Object.entries(await rule.read.setting(`search.exclude`))
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                : undefined,
            );
            let list = [];
            for (const item of result) {
              list.push(
                ...(await rule.query.nodeQuery(
                  item,
                  await rule.globalVariable.getValue('selector'),
                  true,
                )),
              );
            }
            let regexp = await rule.globalVariable.getValue('regexp');
            let caseSensitive =
              await rule.globalVariable.getValue('case-sensitive');
            let find = (await rule.globalVariable.getValue('find')) || '';
            if (!caseSensitive) {
              find = find.toLocaleLowerCase();
            }
            list = list.filter((item) => {
              if (!find) {
                return true;
              }
              let value = item.node.value;
              if (!caseSensitive) {
                value = value.toLocaleLowerCase();
              }
              if (regexp) {
                return new RegExp(find).test(value);
              }
              return value.includes(find);
            });

            await rule.globalVariable.setValue('nodeList', list);
          },
        ),
      },
      {
        x: 2,
        y: 4,
        cols: 2,
        fixed: false,
        config: await rule.view.button(
          { label: 'replace', color: 'accent', type: 'flat' },
          async () => {
            let replace = await rule.globalVariable.getValue('replace');
            let find = (await rule.globalVariable.getValue('find')) || '';
            if (!replace) {
              return;
            }
            let ignore = await rule.globalVariable.getValue('ignore');
            let caseSensitive =
              await rule.globalVariable.getValue('case-sensitive');
            let list =
              (await rule.globalVariable.getValue('nodeListResult')) ||
              (await rule.globalVariable.getValue('nodeList'));
            let regexp = await rule.globalVariable.getValue('regexp');
            find = regexp ? new RegExp(find, ignore ? 'i' : '') : find;
            list = list.map((item) => {
              let value = item.node.value;
              if (!find) {
                item.node.value = replace;
              } else if (regexp) {
                item.node.value = value.replace(find, replace);
              } else {
                item.node.value = replaceI(value, find, replace, caseSensitive);
              }
              return item;
            });
            await rule.operator.replaceNode(
              list,
              (item) => item,
              (item) => item.node.range,
              (item) => item.node.value,
            );
            rule.globalVariable.setValue('nodeList', undefined);
          },
        ),
      },
      {
        x: 3,
        y: 2,
        cols: 1,
        fixed: true,
        config: await rule.view.checkbox('regexp', {
          color: 'primary',
          icon: 'regex',
          fontSet: 'vscode',
          type: 'icon',
        }),
      },
      {
        x: 3,
        y: 1,
        cols: 1,
        fixed: true,
        config: await rule.view.checkbox('ignore', {
          color: 'primary',
          icon: 'exclude',
          fontSet: 'vscode',
          type: 'icon',
        }),
      },
      {
        x: 0,
        y: 5,
        cols: 4,
        fixed: false,
        config: list
          ? await rule.view.showData(
              'nodeListResult',
              {
                type: 'node-list',
              },
              list,
            )
          : undefined,
      },
    ],
  });
};
module.exports.parameters = [];
