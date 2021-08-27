推荐文章：
https://juejin.cn/post/6844903792865984520

#### @babel/preset-typescript

包含插件

* `@babel/plugin-transform-typescript`

> 你需要为 @babel/cli 和 @babel/node 命令行工具指定 --extensions ".ts" 参数，以使其能够处理 .ts 文件。

<br/>

可以通过`babel.config.json配置文件`、`命令行cli`、`Node API`来使用`@babel/preset-typescript`。

<br/>

#### 注意

有了 `@babel/preset-typescript` ，配置 TypeScript 环境确实方便了很多。需要注意的是，`@babel/preset-typescript` `只做语法转换，不做类型检查`，因为类型检查的任务可以交给 IDE （或者用 tsc）去做。另外，Babel 负责两件事：
* 语法转换，由各种 transform 插件、helpers 完成

* 对于可 polyfill 的 API 的提供，由 `corejs` 实现。`@babel/plugin-transform-runtime` 插件可用于减少生成代码的量，以及对 corejs 提供的 API 与 runtime 提供的帮助函数（helpers）进行模块隔离。


<br>

#### 转换ts

1、添加`preset`

~~~json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": "3.6.5"
    }],
    ["@babel/preset-typescript", {

    }]
  ]
}
~~~

2、添加`tsconfig.json`文件

~~~json
{
  "compilerOptions": {
    // Target latest version of ECMAScript.
    "target": "esnext",
    // Search under node_modules for non-relative imports.
    "moduleResolution": "node",
    // Process & infer types from .js files.
    "allowJs": true,
    // Don't emit; allow Babel to transform files.
    "noEmit": true,
    // Enable strictest settings like strictNullChecks & noImplicitAny.
    "strict": true,
    // Disallow features that require cross-file information for emit.
    "isolatedModules": true,
    // Import non-ES modules as default imports.
    "esModuleInterop": true
  },
  "include": ["src"]
}
~~~

3、使用`@babel/cli`执行编译

`script`添加`"compile": "babel src --out-dir lib --extensions .ts "`

4、执行 `npm run compile`

~~~js
// 转换前
const a:string = 'dong';

interface Person {
  name: string,
  age: number
}

const p: Person = {
  name: 'dong',
  age: 23
};

const getInfo = (p: Person) => {
  console.log(p.name, p.age);
}

getInfo(p);

// 转换后
var a = 'dong';
var p = {
  name: 'dong',
  age3: 23
};

var getInfo = function getInfo(p) {
  console.log(p.name, p.age);
};

getInfo(p);
~~~
<br/>

5、webpack中使用

`webpack.config.js:`

~~~js
const path = require("path")

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.[chunkhash:7].js"
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader"
      }
    ]
  }
}

// rule可以是下面的写法
rules: [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ]
    }
  }
]
~~~

`scipt.js`

~~~js
const webpack = require("webpack")
const config = require(`../webpack.config`)

const compiler = webpack(config)
compiler.run((err, stat) => {
  if (err) throw err
  console.log(stat.toString({
    colors: true
  }))
});
~~~

`运行`

添加`"pack": "node ./build/script.js"`

运行：`npm run pack`

<br/>

#### 参数

`1、isTSX:`

`boolean` 类型，默认值为 `false`

强制开启 `jsx` 解析。否则，尖括号将被视为 typescript 的类型断言（type assertion） `var foo = <string>bar`;。另外，`isTSX: true` 需要 `allExtensions: true`

`2、allExtensions:`

`boolean` 类型，默认值为 `false`

将每个文件都作为 TS 或 TSX （取决于` isTSX` 参数）进行解析。

`3、jsxPragma：`

`string` 类型，默认值为 `React`。

替换编译 JSX 表达式时所使用的函数。这样我们就能知道是 import 而不是 type import，因此不应将其删除。

`4、allowNamespaces：`

`boolean` 类型，使用 `@babel/plugin-transform-typescript` 的默认设置。

开启Typescript命名空间的编译

`5、allowDeclareFields：`

`boolean` 类型，默认值为 `false`。











