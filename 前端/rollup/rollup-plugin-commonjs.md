### 基本配置
~~~js
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: [
    {
      format: 'es',
      file: './es/bundle.es.js'
    },
    {
      format: 'cjs',
      file: './lib/bundle.cjs.js'
    }
  ],
  external: ['lodash'],
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}
~~~

`@rollup/plugin-commonjs`主要用于处理`node`模块或者`CommonJs`模块的引用，因为`rollup`只能处理`es`模块，因此需要将`node`模块转换成`es`模块供`rollup`处理。

<br/>

### 举例

如下代码引入的`lodash`模块和`data.js`都是`CommonJs`模块，因此必须通过`@rollup/plugin-commonjs`进行处理，否则会报错(`打包cjs和es的时候会将lodash所有代码都打包进去，因此可以通过external: ['lodash']将lodash作为peerDependencies`)

~~~js
// index.js
import { cat, getName } from './src/data';
import _ from 'lodash';

console.log(getName(cat));

console.log(_.isEmpty([]));
~~~

~~~js
// data.js
const cat = {
  name: 'yiyi',
  age: 2
};

const getName = (cat) => {
  return cat.name;
};

module.exports = {
  cat,
  getName
}
~~~

<br/>

### 支持的配置项

[最新的配置项](https://www.npmjs.com/package/@rollup/plugin-commonjs)

~~~js
commonjs({
  // Some modules contain dynamic require calls, or require modules that contain circular dependencies, 
  // which are not handled well by static imports. Including those modules as dynamicRequireTargets will 
  // simulate a CommonJS (NodeJS-like) environment for them with support for dynamic and circular dependencies.
  dynamicRequireTargets: {   // Default: []
    // include using a glob pattern (either a string or an array of strings)
    'node_modules/logform/*.js',

    // exclude files that are known to not be required dynamically, this allows for better optimizations
    '!node_modules/logform/index.js',
    '!node_modules/logform/format.js',
    '!node_modules/logform/levels.js',
    '!node_modules/logform/browser.js'
  },
  // non-CommonJS modules will be ignored, but you can also
  // specifically include/exclude files
  include: 'node_modules/**',  // Default: undefined
  exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
  // these values can also be regular expressions
  // include: /node_modules/

  // search for files other than .js files (must already
  // be transpiled by a previous plugin!)
  extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]

  // if true then uses of `global` won't be dealt with by this plugin
  ignoreGlobal: false,  // Default: false

  // if false then skip sourceMap generation for CommonJS modules
  sourceMap: false,  // Default: true

  // explicitly specify unresolvable named exports
  // (see below for more details)
  namedExports: { 'react': ['createElement', 'Component' ] },  // Default: undefined

  // sometimes you have to leave require statements
  // unconverted. Pass an array containing the IDs
  // or a `id => boolean` function. Only use this
  // option if you know what you're doing!
  ignore: [ 'conditional-runtime-dependency' ]
})
~~~