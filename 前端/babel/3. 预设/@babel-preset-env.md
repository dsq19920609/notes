#### targets

`string | Array<string> | {[string]: string}`

描述项目支持的目标环境。

三种方式：

1、添加 .browserslistrc

~~~js
> 0.25%
not dead
~~~

2、package.json中 browserlist

~~~json
{
  ...
  "browserlist": "> 0.25%, not dead"
  ...
}
~~~

3、@babel/preset-env中targets

~~~json
{
  "targets": "> 0.25%, not dead"
}
~~~

浏览器：`chrome`、`opera`、`edge`、`firefox`、`safari`、`ie`、`ios`、`android`、`node`、`electorn`

~~~json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "edge": "17",
        "firefox": "60",
        "chrome": "67",
        "safari": "11.1"
      }
    }]
  ]
}
~~~

在`targets.browsers`中指定

~~~js
{
    "presets": [
        ["env": {
            "targets" : {
                "browsers": "last 2 versions",
                "esmodules": true, // 指定该选项，将会忽略browserslist, 仅支持那些那些原生支持es6 module的浏览器
                "safari": true , // 启用safari前沿技术
                "node": "true" || "current" //兼容当前node版本代码
            }
        }]
    ]
}
~~~

`targets.esmodules`: boolean

当`esmodules`为true时，es2015+的语法不在转换，但是如果有`@babel/plugin-transform-runtime`的话，新的api仍然通过`@babel/runtime-corejs3`替换。

~~~js
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "esmodules": true
      }
    }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", { 
      "corejs": 3
    }]
  ]
}
~~~
转换后代码如下：

~~~js
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _demo = require("./demo");

var _context;

(0, _demo.getName)();
(0, _map.default)(_context = [1, 2, 3]).call(_context, n => n + 1);
var p = new _promise.default((resolve, reject) => {
  (0, _setTimeout2.default)(() => {
    resolve(12);
  }, 3000);
});

class A {
  constructor(name) {
    this.name = name;
  }

}

var [m, n, ...rest] = [1, 2, 5, 6];
console.log((0, _includes.default)(rest).call(rest, 6));
~~~

<br/>

#### loose

启用松散式的代码转换，假如某个插件支持这个option，转换后的代码，会更加简单，代码量更少，但是不会严格遵循ES的规格，通常默认是false。

可以缩短编译时间，可以减少编译后代码体积

比如class转换：
~~~js
// 源代码
class A {
  constructor(name) {
    this.name = name;
  }
}

// false
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var A = function A(name) {
  _classCallCheck(this, A);
  this.name = name;
};

// true 缺少了校验，精简了代码体积
var A = function A(name) {
  this.name = name;
};
~~~

<br/>

#### modules

`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto".`

将代码编译成不同规范的代码

常用：
* "cjs":  是 "commonjs"的别名

* "amd":

* "umd":

~~~js
// 源代码
import { getName } from './demo';
getName();
[1, 2, 3].map((n) => n + 1);

// false  保留ES模块
import { getName } from './demo';
getName();
[1, 2, 3].map(function (n) {
  return n + 1;
});

// 默认
var _demo = require("./demo");

(0, _demo.getName)();
[1, 2, 3].map(function (n) {
  return n + 1;
});

// cjs
var _demo = require("./demo");

(0, _demo.getName)();
[1, 2, 3].map(function (n) {
  return n + 1;
});

// amd
define(["./demo"], function (_demo) {
  (0, _demo.getName)();
  [1, 2, 3].map(function (n) {
    return n + 1;
  });
});

// umd => amd | cjs | esm
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./demo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./demo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.demo);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_demo) {
  "use strict";

  (0, _demo.getName)();
  [1, 2, 3].map(function (n) {
    return n + 1;
  });
});
~~~

<br/>

#### useBuiltIns | corejs

`"usage" | "entry" | false, 默认 false.`

绝对`@babel/preset-env`如何处理`polyfill`

因为@babel/polyfill 过时了，因此推荐使用core-js, 同时通过corejs配置项设置corejs的版本
当值为"usage"和"entry"时，同时需要添加core-js 再通过corejs配置项设置core-js版本

~~~json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage | entry | false",
      "corejs": "3.6.5"
    }]
  ]
}
~~~

`false`:

默认值，不引入polyfill，即不转换es6+新特性

`entry`: 入口导入`polyfill`

只在`入口模块`处导入`polyfills`，你需要`根模块`写上`import "core-js"` 和 `import "regenerator-runtime/runtime"`，babel 会自动展开全部必要模块导入`import "core-js/modules/X"`，X 是根据你配置的目标环境选择出来的 polyfill，如es.string.pad-start、es.array.unscopables.flat。注意，如果你没有写import "core-js"，则不会展开任何导入（import）语句。

`usage`: 每个文件按需导入`core-js`

babel 会根据`你配置的目标环境targets`，在你使用到一些`ES6特性X`的时候，自动补充`import "core-js/modules/X"`。

`corejs:`

只在`useBuiltIns: entry | usage`时有用，指定`core-js`的版本。

~~~js
// 源代码
import { getName } from './demo';

getName();
[1, 2, 3].map((n) => n + 1);
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(12);
  }, 3000);
});
class A {
  constructor(name) {
    this.name = name;
  }
}
const [m, n, ...rest] = [1, 2, 5, 6];

console.log(rest.includes(6));

// usage : 在页面头部导入core-js代码。

"use strict";

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/web.timers.js");

var _demo = require("./demo");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _demo.getName)();
[1, 2, 3].map(function (n) {
  return n + 1;
});
var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(12);
  }, 3000);
});

var A = function A(name) {
  _classCallCheck(this, A);

  this.name = name;
};

var m = 1,
    n = 2,
    rest = [5, 6];
console.log(rest.includes(6));
~~~

<br/>

#### include

`Array<string|RegExp>, defaults to [].`

An array of plugins to always include.


<br/>

#### exclude

`Array<string|RegExp>, defaults to [].`

An array of plugins to always exclude/remove.

