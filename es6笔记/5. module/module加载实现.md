#### 浏览器加载

默认情况下，浏览器是同步加载javascript脚本，即渲染引擎遇到`<script>`标签就会停下来，等到执行完脚本，再继续向下渲染，如果是外部脚本，这必须加入脚本下载的时间。


如果浏览器加载体积比较大的脚本，浏览器会卡死，所以浏览器运行脚本异步的加载：

* `<script src="path/to/myModule.js" defer></script>`

* `<script src="path/to/myModule.js" async></script>`

`<script>`标签打开`defer`或`async`属性，脚本就会异步加载，渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

`defer`与`async`的区别：`defer`要等整个页面在内存中正常渲染结束(DOM结构完全生成，以及其他脚本执行完成)，才会继续执行。
`async`一旦下载完成，渲染引擎就会中断渲染，执行这个脚本后，再继续渲染。`defer`是渲染完成再执行，`async`是下载完成就执行。
如果有多个`defer`脚本，会按照它们在页面出现顺序加载，而多个`async`脚本是不能保证顺序的。


#### ES6模块与CommonJS模块的差异

* CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用。

* CommonJS模块是运行时加载，ES6模块是编译时输出接口。

* CommonJS模块`require()`是同步加载模块，ES模块的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。

`CommonJS模块输出的是值的拷贝`：也就是说，一旦输出一个值，会被缓存下来，模块内部的变化就不会影响到这个值。

`ES模块`：js引擎对脚本静态分析时，遇到`import`模块加载，就会生成一个`只读的引用`，等到脚本执行时，再根据这个只读引用，到
被加载的那个模块去取值。原始值变了，`import`加载的值也会跟着变。因此`ES6模块是动态引用的，并且不会缓存值`，模块里面的变量绑定其所在的模块。

<br/>

#### Node.js的模块加载方法。

Javascript现在有两种模块(使用webpack或者rollup打包时可以打包成不同格式用于兼容不同环境)：

* ES6模块，简称：`ESM(esm)`

* CommonJS模块，简称：`CJS(cjs)`

CommonJS模块是Node.js专用的，与ES6模块不兼容：

语法上：

CommonJS使用`require()`和`module.exports|exports`

ES6模块使用`import`和`export | export default`

采用不同的加载方案：从Node.js`v13.2`版本开始, Node.js已经默认打开了ES6模块支持。

1、Node要求ES6模块采用`.mjs`后缀文件名，只有脚本里面使用`import`或`export`命令，就必须采用`.mjs`后缀，Node遇到`.mjs`文件，就认为它是ES6模块。

2、如果不希望将后缀改成`.mjs`，可以再在项目的`package.json`文件中，指定`"type":"module"`

~~~json
{
   "type": "module"
}
~~~

一旦设置以后，改目录里面的js脚本，就被解释成ES6模块。如果这个时候还要使用`CommonJS模块`，需要将脚本后缀名改为`.cjs`,如果没有`type`字段，或者`"type":"commonjs"`,则`.js`脚本会被解释成CommonJs模块。


<br/>

