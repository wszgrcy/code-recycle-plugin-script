import { ScriptFunction, ContentResolveItem } from '../script.define';

let fn: ScriptFunction = async (util, rule, host, injector) => {
  return async () => {
    let ignore = (await rule.globalVariable.get('ignore')) ?? true;
    rule.globalVariable.set('ignore', ignore);
    let list = (await rule.globalVariable.get('nodeList')) as ContentResolveItem[];
    let replaceObj = {};
    if (list) {
      for (const item of list) {
        for (const key in item.node!.infer) {
          if (!replaceObj[key]) {
            replaceObj[key] = { config: await rule.view.input(`infer-${key}`, { label: key, type: 'input' }) };
          }
        }
      }
    }
    return rule.view.grid({
      list: [
        [
          {
            cols: 3,
            config: await rule.view.input('selector', {
              type: 'textarea',
              color: '',
              label: 'selector',
              placeholder: '',
            }),
          },
          {
            cols: 1,
            fixed: true,
            config: await rule.view.checkbox('ignore', {
              color: 'primary',
              icon: 'exclude',
              fontSet: 'vscode',
              type: 'icon',
            }),
          },
        ],

        ...(Object.values(replaceObj) as any[]),
        {
          cols: 3,
          fixed: false,
          config: await rule.view.input('glob', {
            type: 'input',
            label: 'glob',
            placeholder: '',
            color: '',
          }),
        },
        {
          cols: 3,
          fixed: false,
          config: await rule.view.button({ label: 'find', color: 'primary', type: 'flat' }, async () => {
            let ignore = await rule.globalVariable.get('ignore');
            let result = await rule.read.fileResolveByPattern((await rule.globalVariable.get('glob')) || '**/*.{ts,js}', undefined, {
              queryMode: 0,
              all: true,
              ignore: ignore
                ? Object.entries(await rule.read.setting(`search.exclude`))
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                : undefined,
            });

            let list: ContentResolveItem[] = [];
            for (const item of result!) {
              let nodeList = await rule.query.like(item, await rule.globalVariable.get('selector'), Infinity);
              list.push(...nodeList);
            }
            await rule.globalVariable.set('nodeList', list);
          }),
        },
        {
          cols: 2,
          fixed: false,
          config: await rule.view.button({ label: 'replace', color: 'accent', type: 'flat' }, async () => {
            let keyObj = Object.keys(replaceObj);

            let list: ContentResolveItem[] =
              (await rule.globalVariable.get('nodeListResult')) || (await rule.globalVariable.get('nodeList'));
            // rule.hint.outputLog('节点', list.length);

            let changedList: any[] = [];
            for (const item of list) {
              for (const key of keyObj) {
                if (item.node!.infer[key]) {
                  let replaceVar = rule.resolve.queryStatement(await rule.globalVariable.get(`infer-${key}`))({
                    infer: (value) => (item.node!.infer[value] as any).value,
                  });
                  (item.node!.infer[key] as any).value = replaceVar;
                  changedList.push({ file: item, node: item.node!.infer[key] });
                }
              }
            }

            await rule.operator.replaceNode(
              changedList,
              (item) => item.file,
              (item) => item.node.range,
              (item) => item.node.value
            );
            rule.globalVariable.set('nodeList', undefined);
          }),
        },

        {
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
};
export default fn;
