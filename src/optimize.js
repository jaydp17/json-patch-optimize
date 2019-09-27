const jsonPatch = require('json8-patch');

/**
 * @typedef {Object} Patch
 * @prop {"add" | "remove"} op
 * @prop {string} path
 * @prop {*} value
 */

/**
 *
 * @param {Object} doc
 * @param {Patch[]} patches
 */
function optimize(doc, patches) {
  const copyDoc = JSON.parse(JSON.stringify(doc));
  const { doc: outputDoc } = jsonPatch.apply(copyDoc, patches);
  return jsonPatch.diff(doc, outputDoc);
}

module.exports = optimize;
