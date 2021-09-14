`Rollup`和`Babel`集成用于转换新的js特征

~~~js
npm i @rollup/plugin-babel --dev
~~~

`@rollup/plugin-commonjs必须放在@rollup/plugin-babel前面`

~~~js
When using `@rollup/plugin-babel` with` @rollup/plugin-commonjs` in the same Rollup 
configuration, it's important to note that @rollup/plugin-commonjs must be placed 
before this plugin in the plugins array for the two to work together properly. e.g.
~~~

~~~js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};
~~~

<br/>

### 配置

需要在项目中添加`babel`的配置文件`babel.config.json`

~~~js
npm i @babel/core @babel/preset-env @babel/plugin-transform-runtime --dev

npm i @babel/runtime-corejs3
~~~

~~~js
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false // "modules": false ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。
    }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 3
    }]
  ]
}
~~~

https://www.npmjs.com/package/@rollup/plugin-babel