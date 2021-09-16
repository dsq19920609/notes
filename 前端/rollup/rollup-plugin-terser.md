
`rollup-plugin-uglify`只能翻译`es5`语法，如果要转义`es6+`语法，使用`rollup-plugin-terser`

<br/>

用于压缩输出的文件

~~~js
yarn add rollup-plugin-terser --dev
# Or with npm: 
npm i rollup-plugin-terser --save-dev
~~~

使用：

~~~js
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";
 
rollup({
  input: "main.js",
  plugins: [terser()],
});
~~~

<br/>

### 配置

详细配置：https://www.npmjs.com/package/rollup-plugin-terser
