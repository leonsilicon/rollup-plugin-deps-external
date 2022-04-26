# rollup-plugin-external-deps

[Rollup](https://rollupjs.org/) plugin to automatically exclude package.json dependencies from your bundle.

Most of the code is borrowed from the excellent [rollup-plugin-auto-external](https://github.com/stevenbenisek/rollup-plugin-auto-external) package.

## Install

```shell
npm install --save-dev rollup-plugin-external-deps
```

## Usage

Add the `externalDeps` plugin to your Rollup configuration:

```js
import externalDeps from 'rollup-plugin-external-deps';

export default {
  input: 'index.js',
  plugins: [externalDeps()],
};
```

You can pass options to the plugin as well:

```js
import path from 'path';
import externalDeps from 'rollup-plugin-external-deps';

export default {
  input: 'index.js',
  plugins: [
    externalDeps({
      builtins: false,
      dependencies: true,
      packagePath: path.resolve('./packages/module/package.json'),
      peerDependencies: false,
    }),
  ],
};
```

`rollup-plugin-external-deps` is compatible with an existing Rollup `external` function.

```js
import externalDeps from 'rollup-plugin-external-deps';

export default {
  input: 'index.js',
  external: (id) => id.includes('babel-runtime'),
  plugins: [externalDeps()],
};
```

## Options

### `builtins`

Type: `boolean`
\
Default: `true`

Add all Node.js builtin modules as externals.

### `dependencies`

Type: `boolean`
\
Default: `true`

### `packagePath`

Type: `string`
\
Default: `process.cwd()`

Path to a package.json file or its containing directory.

### `peerDependencies`

Type: `boolean`
\
Default: `true`.
