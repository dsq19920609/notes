#### 概述

ES6模块方案前前端的模块化规范`CommonJS`和`AMD`规范，一个用于服务器端，一个用于浏览器端,
`ES6`的模块化方案可以在服务器端和浏览器端同时使用。

ES6模块的设计思想是尽量的`静态化`，使得编译时就能确定模块的依赖关系，以及输入和输出的变量(`Rollup中tree-shaking就是利用ES6模块的静态化分析`)。

`CommonJS`和`AMD`模块，都是在运行时确定依赖关系。

~~~js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
~~~
上面代码的实质是整体加载`fs`模块，生成一个`_fs`对象，然后再从对象上面读取3个方法，这种加载称为`运行时加载`，因为只有运行时才能得到这个对象，导致完全没法在编译时做`静态优化`

~~~js
// ES6模块
import { stat, exists, readFile } from 'fs';
~~~
上面代码的实质是从`fs`模块加载3个方法，其他方法不加载,这种加载称为`静态加载`,即ES6可以在编译时完成模块加载，可以多代码进行`静态分析`，比如：`类型检查`, `Tree-shaking`等。


<br/>

#### 严格模式

在ES6模块中，顶层的this指向`undefined`,即不应该在顶层使用`this`, node环境中this指向`Global`对象，浏览器环境中this指向`Window`对象。

<br/>

#### export

导出模块

1、单个导出
~~~js
export let name = 'dong';

export function foo() {};
~~~

2、多个导出
~~~js
function foo1() {};
function foo2() {};
export { foo1, foo2 };
~~~

3、导出重命名`as`
~~~js
function foo1() {};
export { foo1 as foo }
~~~

4、export default

~~~js
// 1、写法1
export default function () {
  console.log('foo');
}

// 2、写法2
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// 3、写法3
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';

~~~

<br/>

#### import

导入模块

~~~js
// 1、基本导入
import { firstName, lastName, year } from './profile.js';

// 2、导入重命名
import { lastName as surname } from './profile.js';

// 3、整体加载 *
import * as circle from './circle';

~~~

通过 `Babel转码`，CommonJS 模块的`require`命令和 ES6 模块的`import`命令，可以写在同一个模块里面，但是最好不要这样做。因为import在静态解析阶段执行，所以它是一个模块之中最早执行的。


<br/>

#### import和export复合使用

如果在一个模块之中，先输入后输出同一个模块，`import`语句可以与`export`语句写在一起。

~~~js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
~~~


~~~js
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';

// 默认接口也可以改名为具名接口。
export { default as es6 } from './someModule';

// ES2020补充
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
~~~

<br/>

#### 多个模块合并成一个模块

~~~js
// 导出
export { db } from './db';
export { user } from './user';

// 导入
import { db, user } from './index';
~~~

<br/>

#### import() 函数

动态加载模块或者叫做运行时加载模块。

`import()`类似于node的`require`方法，区别是前者是异步加载，后者是同步加载。

~~~js
import(specifier) 

// specifier指定所加载的模块的位置
// import返回一个Promise对象
~~~

基本使用：

~~~js
import('./data').then((data) => {
  console.log(data.default); // {name: "dong", age: 23}
});

// data.js
export default {
  name: 'dong',
  age: 23
}
~~~

进阶使用：

~~~js
// 1、同时加载多个模块
 Promise.all([import('./data'), import('./data1')]).then(() => {

 }).catch(() => {});

 // 2、用在async中
 async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
~~~

适用场合：

1、按需加载(react组件中可以使用)：
~~~js
import('./data').then((data) => {
  console.log(data.default);
}).catch((err) => {
  console.log(err);
});
~~~

2、条件加载：

~~~js
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
~~~

3、动态模块路径：
~~~js
import(f())
.then(...);

// 根据f函数返回的路径进行加载
~~~