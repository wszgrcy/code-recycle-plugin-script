/** @type {import('/home/chen/my-project/code-factory-plugin/dist/script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
    let result = await util.changeList([
        {
            path: './def1.ts', list: [
                {
                    query: `VariableDeclarationList`,
                },
                {
                    query: `NumericLiteral`,
                    children: [
                        { parentMap: 'parent2.0', query: `Identifier`, replace: `changed` }
                    ]
                },
            ]
        }
    ])
    await util.updateChangeList(result)
}
module.exports.parameters = []