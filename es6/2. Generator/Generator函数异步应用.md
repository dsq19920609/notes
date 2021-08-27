#### Generator函数的应用

#### 常见的异步编程方法：

* 回调函数

* 事件监听

* 发布/订阅

* Promise

<br/>

#### 基本概念

##### 异步

所谓"异步"，简单来说就是一个任务不是连续完成的，先执行第一个阶段，然后转去执行其他任务，等异步执行完成后，在回头执行第二个阶段。

比如：有一个任务读取文件进行处理，任务第一段是向操作系统发出请求，要求读取文件。然后程序执行其他任务，等操作系统返回文件，再接着执行任务的第二个阶段，这种不连续的操作，叫做异步，也可以叫做非阻塞IO。

如果在读取文件时，等待，则是同步，是阻塞的IO操作。

<br/>

#### 回调函数

~~~js
// 异步的读取文件，读取完成调用callback函数
const fs = require('fs');

fs.readFile('./index.html', 'utf-8', (err, data) => {
  console.log(data);
});
~~~

<br/>


#### Promise

~~~js
// node提供的promise异步API
const fs = require('fs').promises;

fs.readFile('./index.html', 'utf-8').then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
~~~

<br/>


#### Generator函数  

Generator函数可以通过`yield`表达式，封装多个异步操作，可以看成Generator是`异步操作容器` 

协程：  

第一步，协程`A`开始执行。  

第二步，协程`A`执行到一半，进入暂停，执行权转移到协程`B`。

第三步，（一段时间后）协程`B`交还执行权。

第四步，协程`A`恢复执行。

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。Generator 函数的执行方法如下。

~~~js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
~~~

异步任务封装：

~~~js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();

var result = g.next();

result.value.then(data => data.json()).then((data) => {
  g.next(data); // 将异步的结果，作为yield表达式的值，继续执行
});
~~~

#### Thunk函数

thunk函数是自动执行Generator函数的一种方法。

javascript中的thunk函数：  

将`多参函数变`成只接受`回调函数作`为参数的`单参数函数`。

~~~js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);

// fs.readFile(filename, callbak) => Thunk(filename)(callback);
~~~

上面代码中`fs`模块的`readFile`方法是一个多参数函数，两个参数分别是文件名和回调函数，已经转换处理后，它变成一个`单参数函数`，只接收`回调函数`作为参数，这个单参函数版本，就是`thunk函数`。

任何函数，只要参数有`回调函数`，就能写成thunk函数的形式：`(..args, callback) => { ... ; callback(); }`

简化的thunk函数转换器：
~~~js
// ES5版本
var thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return function (callback) {
      args.push(callback);
      return fn.apply(this, args);
    }
  }
}

// ES6版本
const thunk = function(fn) {
  return function(...args) {
    return function(callback) {
      return fn.call(this, ...args, callback);
    }
  }
}
~~~

~~~js
var readFileThunk = thunk(fs.readFile);
readFileThunk(fileA)(callback); // => fs.readFile(fileA, callback)
~~~


<br/>

#### Thunkfiy模块
~~~js
function thunkify(fn){
  assert('function' == typeof fn, 'function required');

  return function(){
    // 参数拷贝 类数组 -> 数组
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called;

      // 回调函数push
      args.push(function(){
        if (called) return;
        called = true;
        // 调用done回调函数，called为了防止callback多次调用
        // 比如fs.rendFile()的callback则，arguments为(err, data)
        done.apply(null, arguments);
      });

      // fn('package.json', (err, str) => {})
      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
~~~

**其实就是：fn(a, callback) => thunkify(fn)(a)(callback)**

~~~js
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
~~~

#### Generator函数的流程管理

1、对于同步操作：

下面可以使Generator函数自动执行

~~~js
function* gen() {
  yield 1;
  yield 2;
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
~~~

2、对于异步操作：

##### 利用thunk函数
~~~js
const fs = require('fs');
const thunkify = require('thunkify');
const readFileThunk = thunkify(fs.readFile);

function *gen() {
  const t1 = yield fs.readFile('./index.html', () => {}),
  const t2 = yield fs.readFile('./client.js', () => {});
  console.log(t1.toString());
  console.log(t2.toString());
};

const g = gen();
/**
* 如何让gen自动执行
因为yield后面都是异步操作，所以正确逻辑应该是，在异步的回调函数中调用g.next(data)
让Generator继续执行下去，显然，fs.readFile()的回调函数callback无法做到。
*/
~~~

利用thunk函数将要`执行的部分`和`回调部分`分开。

~~~js
const fs = require('fs');
const thunkify = require('thunkify');
const readFileThunk = thunkify(fs.readFile);

function *gen() {
  const t1 = yield readFileThunk('./index.html')
  const t2 = yield readFileThunk('./client.js');
  console.log(t1.toString());
  console.log(t2.toString());
}

const g = gen();

const t1 = g.next();

t1.value((err, data) => {
  if (err) throw err;
  const t2 = g.next(data);
  t2.value((err, data) => {
    if (err) throw err;
    g.next(data);
  })
});
~~~

将`callback`提取后的自动执行程序：
~~~js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

run(gen);
~~~

##### 利用Promise控制流程：
~~~js
const fs = require('fs');


function *gen() {
  const t1 = yield new Promise((resolve, reject) => {
    fs.readFile('./index.html', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
  const t2 = yield new Promise((resolve, reject) => {
    fs.readFile('./client.js', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
  console.log(t1.toString());
  console.log(t2.toString());
}

const g = gen();

const t1 = g.next();
t1.value.then((data) => {
  const t2 = g.next(data);
  t2.value.then((data) => {
    g.next(data);
  });
});
~~~

Promise的自动执行程序：
~~~js
function run(fn) {
  const gen = fn();

  function next(data) {
    const result = gen.next(data);
    if (result.done) return;
    result.value.then((data) => {
      next(data);
    })
  }
  next();
}

run(gen);
~~~

<br/>

#### Co模块

~~~js
// 自动执行Generator函数
const co = require('co');
const fs = require('fs').promises;

function *gen() {
  const f1 = yield fs.readFile('./index.html');
  const f2 = yield fs.readFile('./client.js');
  console.log(f1.toString());
  console.log(f2.toString());
}


co(gen).then(() => {
  console.log('执行完成');
})
~~~

> 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 `Thunk 函数`或 `Promise 对象`。如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co。


#### co模块的原理  

Generator就是一个异步操作的容器，他的自动执行需要一种机制，当异步操作完成时，能够自动交回执行权，即Generator函数继续执行。

* `回调函数`：将异步操作包装成`Thunk`函数，在回调函数里面继续执行Generator函数

* `Promise对象`：将异步操作包装成Promise对象，用 `then`方法使Generator函数继续执行。

参考上面的Generator函数异步操作的自动控制流程

co模块其实就是将两种自动执行器(`Thunk函数`和`Promise对象`)，包装成一个模块，使用co的前提是，Generator函数的`yield`命令后面，只能是
`Thunk函数`或者`Promise对象`，如果数组或者对象的成员，全部都是Promise对象，也可以使用co。

处理Promise数组：

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。

~~~js
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);
~~~

#### co源码

co接受一个Generator函数作为参数，返回一个Promise

value: Thunk函数，Promise对象，Promise数组，Object对象(每个成员为promise)

~~~js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
  });
}
~~~

~~~js
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1)

  // 返回一个promise
  return new Promise(function(resolve, reject) {
    // gen的参数 将gen赋值为遍历器对象
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    // generator函数校验
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      // 确保每一步返回值为promise value: Thunk函数，Promise对象，Promise数组，Object对象(每个成员为promise)
      var value = toPromise.call(ctx, ret.value);
      // promise 链式调用 将gen.next()封装成onFulfilled，便于错误处理
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}


function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

function objectToPromise(obj){
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

function isObject(val) {
  return Object == val.constructor;
}

~~~