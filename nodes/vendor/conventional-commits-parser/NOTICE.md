# Vendored: conventional-commits-parser (CommitParser only), CJS build

`index.cjs` in this directory is the parsing engine of
[`conventional-commits-parser`](https://www.npmjs.com/package/conventional-commits-parser)
version **7.1.0** (MIT, © the conventional-changelog team — see `LICENSE.md`
alongside this file), rebuilt from ESM into plain CommonJS.

## Why this exists

`conventional-commits-parser@7` ships ESM-only (`"type": "module"`, an
`exports` map with no `"require"` condition). This package compiles to
CommonJS (Axiom's frozen TypeScript node signature/build target), and:

- A static `import` of the package compiles to `require()` under
  `module: "commonjs"`, which Node then rejects with
  `ERR_PACKAGE_PATH_NOT_EXPORTED` — confirmed by hand.
- A dynamic `import()` hidden from TypeScript's rewrite (via
  `new Function('s', 'return import(s)')`) works under a plain `node`
  process, but fails under `axiom test`'s Jest runner with "A dynamic
  import callback was invoked without --experimental-vm-modules" — a Jest
  sandboxing limitation that can't be configured around here, since
  `axiom test` invokes the `jest` binary directly rather than through a
  package.json script where a `NODE_OPTIONS` override could be injected.

So this package vendors the one class it actually uses instead.

## How it was built (reproducible)

```bash
npm install conventional-commits-parser@7.1.0   # into a scratch dir
npx esbuild node_modules/conventional-commits-parser/dist/CommitParser.js \
  --bundle --platform=node --format=cjs --target=node18 \
  --outfile=vendor/conventional-commits-parser/index.cjs
```

This is a **module-format transpile only** — every line of parsing logic
(header/body/footer/notes/references/mentions/revert tokenization) is
byte-for-byte the same algorithm as upstream, now expressed as CommonJS
`module.exports`/`require` instead of ESM `export`/`import`. Nothing was
edited, rewritten, or reimplemented.

`CommitParser.js` (the file bundled here) has **zero external npm
dependencies of its own** — it only imports the package's own
`regex.js`/`options.js`/`utils.js`/`types.js`, all bundled in above. The
package's *other* entry points (`stream.js`, the CLI) depend on
`@simple-libs/stream-utils` and `argue-cli`; this package never imports
those files, so they are not part of this vendored bundle and are not a
runtime dependency of `conventional-commit-tools` at all.

## Keeping this in sync

If conventional-commits-parser publishes a new version worth picking up,
re-run the build command above against the new version and diff the
output — do not hand-edit `index.cjs`.
