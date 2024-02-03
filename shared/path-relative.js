/**
 *
 * @type {(filePath:string,importPath:string,util:import('../script.define').Util) => string} */
module.exports = (filePath, importPath, util) => {
  let result = util.path.relative(util.path.dirname(filePath), importPath);
  return (result.startsWith('..') ? result : './' + result).slice(0, -3);
};
