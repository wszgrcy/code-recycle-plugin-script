/** @type {import('../script.define').ScriptFunction} */
module.exports = async (util, rule, host, injector) => {
    let result = await util.changeList([
        {
            path: './def1.ts', list: [
                {
                    query: `VariableDeclarationList`,
                },
                {
                    query: `StringLiteral`,
                    children: [
                        { parentMap: 'parent2.0', query: `Identifier`, replace: `changed` }
                    ]
                },
            ]
        }
    ])
    await util.updateChangeList(result)
}
