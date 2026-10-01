/**
 * Babel configuration used by babel-jest.
 *
 * Several transitive dependencies of @actions/github (the @octokit/* packages,
 * universal-user-agent and before-after-hook) are published as ESM only. Jest 29
 * loads modules through its own CommonJS registry, so those files must be
 * transpiled to CommonJS before they can be required from the tests. The
 * matching allowlist lives in the jest.transformIgnorePatterns entry in
 * package.json. The published action itself is unaffected: it runs the ncc
 * bundle in dist/, which resolves these modules at build time.
 */
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}
