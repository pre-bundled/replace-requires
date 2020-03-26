'use strict'

var detective = require("./pre-bundled/node_modules/detective")
var patch = require("./pre-bundled/node_modules/patch-text")
var hasRequire = require("./pre-bundled/node_modules/has-require")
var extend = require("./pre-bundled/node_modules/xtend")

module.exports = function replaceRequires (code, replacements) {
  var checker = new hasRequire.Checker(code)
  var ids = Object.keys(replacements)
  if (!ids.some(checker.has, checker)) return code
  return patch(code, detective
    .find(code, {nodes: true})
    .nodes
    .filter(requireLiteral)
    .map(function (node) {
      return extend(node, {replacement: replacements[node.arguments[0].value]})
    })
    .filter(function (node) {
      return node.replacement != null
    }))

}

function requireLiteral (node) {
  var arg = node.arguments[0]
  return arg && arg.type === 'Literal'
}
