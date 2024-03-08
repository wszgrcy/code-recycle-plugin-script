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
/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
  let ignore = (await rule.globalVariable.get('ignore')) ?? true;
  rule.globalVariable.set('ignore', ignore);
  let list = await rule.globalVariable.get('nodeList');
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
            multiple: false,
            placeholder: '',
          },
          util.parserList,
          (item) => `${item.use}/${item.language}`,
          (item) => item
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
        config: await rule.view.button({ label: 'find', color: 'primary', type: 'flat' }, async () => {
          let ignore = await rule.globalVariable.get('ignore');
          let result = await rule.read.fileResolveByPattern(await rule.globalVariable.get('glob'), undefined, {
            queryMode: 0,
            languageOption: await rule.globalVariable.get('languageConfig'),
            all: true,
            ignore: ignore
              ? Object.entries(await rule.read.setting(`search.exclude`))
                  .filter(([key, value]) => value)
                  .map(([key]) => key)
              : undefined,
          });
          let list = [];
          for (const item of result) {
            list.push(...(await rule.query.selector(item, await rule.globalVariable.get('selector'), true)));
          }
          let regexp = await rule.globalVariable.get('regexp');
          let caseSensitive = await rule.globalVariable.get('case-sensitive');
          let find = (await rule.globalVariable.get('find')) || '';
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

          await rule.globalVariable.set('nodeList', list);
        }),
      },
      {
        x: 2,
        y: 4,
        cols: 2,
        fixed: false,
        config: await rule.view.button({ label: 'replace', color: 'accent', type: 'flat' }, async () => {
          let replace = await rule.globalVariable.get('replace');
          let find = (await rule.globalVariable.get('find')) || '';
          if (!replace) {
            return;
          }
          let ignore = await rule.globalVariable.get('ignore');
          let caseSensitive = await rule.globalVariable.get('case-sensitive');
          let list = (await rule.globalVariable.get('nodeListResult')) || (await rule.globalVariable.get('nodeList'));
          let regexp = await rule.globalVariable.get('regexp');
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
            (item) => item.node.value
          );
          rule.globalVariable.set('nodeList', undefined);
        }),
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
              list
            )
          : undefined,
      },
    ],
  });
};
module.exports.parameters = [];
