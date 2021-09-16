用于`Rollup`和`Typescript`之间的集成。

~~~js
tsc --init // 初始化ts 生成tsconfig.json

npm install @rollup/plugin-typescript --save-dev
~~~

需要提前安装`typescipt`和`tslib`

~~~js
npm install typescript tslib
~~~

使用：
~~~js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
~~~

<br/>

### 配置

详细配置：https://www.npmjs.com/package/@rollup/plugin-typescript


The plugin loads any `compilerOptions` from the `tsconfig.json` file by default. Passing `options` to the plugin directly `overrides` those options:

`@rollup/plugin-typescript`插件默认会加载`tsconfig.json`中的`compilerOptions`，你也可以通过给插件传递参数来覆盖这些参数。



