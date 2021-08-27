#### 基本概念

* Generator是ES6提供的一种异步解决方案。

* Generator是一个状态机，封装了多个内部状态。

* Generator函数返回一个`遍历器对象(Iterator Object)`，是一个遍历器对象生成函数，`遍历器对象`可以遍历Generator函数内部的每一个状态。

* 调用`遍历器对象`的`next()`方法可以遍历Generator内部的状态，至到遇到`yield表达式`或`return语句`

* object[Symbol.iterator] = Generator，对象的`Symbol.iterator`属性，指向改对象的默认遍历器生成函数，而Generator函数返回遍历器对象，同时`for ...of ` 和扩展符`...`都会调用对象的`Symbol.iterator`属性。

特征：

* `function`关键字与函数名之间有一个`*`

* 函数体内使用`yield`表达式，定义不同的内部状态

* `yield`表达式只能用在Generator函数中，其他地方会报错。

* `yield`表达式如果在另一个表达式中，必须放在圆括号里面



基本形式：

~~~js
const g = function* gen(params) {
  yield 'hello';
  yield 'world';
  return 'ended';
};

const iter = g();

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

/* 
调用遍历器对象的next()方法，遍历Generator内部的状态，done为true是表示结束
改函数有三个内部状态：hello, world, return语句

{ value: 'hello', done: false }
{ value: 'world', done: false }
{ value: 'ended', done: true }
{ value: undefined, done: true }
**/
~~~

<br/>

#### yield表达式  

遍历器对象`next`方法运行逻辑：  

1、遇到`yield`表达式，就暂停后面的操作，并将紧跟在`yield`表达式后面的值，作为返回对象的`value`值。

2、下一次调用`next`方法，再继续执行，直到遇到下一个`yield`表达式。

3、如果没有`yield`表达式，就一直运行到函数结束，直到`return`语句为止，将`return`的返回值作为返回对象的`value`值。

4、如果没有`return`语句，则返回对象的`value`值为undefined ({value: undefined, done: true})。


当Generator函数中没有`yield`表达式:  变成了`暂缓执行函数`  

~~~js
const g = function* gen(params) {
  console.log('end');
};

const iter = g();

// 执行改函数
iter.next();
~~~

<br/>

#### next()方法参数  

`yield`表达式本身没有返回值，或者说总是返回`undefined`, `next`方法可以带一个参数，该参数可以被当作上一个`yield`表达式的返回值。

~~~js
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
~~~

上面代码先定义了一个可以无限运行的 Generator 函数f，如果next方法没有参数，每次运行到yield表达式，变量reset的值总是`undefined`。当next方法带一个参数true时，变量reset就被重置为这个参数（即true），因此i会等于-1，下一轮循环就会从-1开始递增。

~~~js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

let gen = foo(5);
let result = gen.next();

while(!result.done) {
  console.log(result.value);
  result = gen.next(result.value);
}
// 6, 4
~~~


<br/>

#### 与Iterator接口的关系  

任意对象的`Symbol.iterator`属性，等于该对象的`遍历器生成函数`，调用该函数返回一个`遍历器对象`， 因为Generator是遍历器生成函数，因此因此可以把Generator函数赋值给对象的`Symbol.iterator`属性，从而使得该对象有Iterator接口。

~~~js
const obj = {
  [Symbol.iterator]: function *() {
    yield 1;
    yield 2;
    yield 3;
  }
};

console.log([...obj]);
// [1, 2, 3]
~~~

**含有Symbol.iterator属性的对象可以通过for ...of 和 '...' 遍历**

**将对象的Symbol.iterator属性和Generator函数结合起来使用**

<br/>

#### for ... of循环  

`for...of` 可以自动遍历Generator函数运行时生成的`Iterator`对象，且此时不需要调用next()方法。

~~~js
function *gen() {
  yield 1;
  yield 2;
  return 3;
};

for (item of gen()) {
  console.log(item);
}
// 1 2
// 一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象, 因此没有返回3
~~~

~~~js
// 斐波那契数列
function *fibonacci() {
  let [prev, curr] = [0, 1];
  for(;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (sum of fibonacci()) {
  if (sum > 1000) break;
  console.log(sum);
}
~~~

~~~js
function *objectEntries() {
  const keys = Object.keys(this);
  for (key of keys) {
    yield [key, this[key]]
  }
}

const person = {
  name: 'dong',
  age: 12,
  [Symbol.iterator]: objectEntries
}
for (item of person) {
  console.log(item);
}
/**
[ 'name', 'dong' ]
[ 'age', 12 ] 
*/
~~~


<br/>

#### Generator.prototype.throw()

Generator函数返回的`遍历器对象`都有一个`throw`方法，可以在函数体外抛出错误，然后在函数体内捕获。必须在`遍历器对象`调用`next`方法启动后，调用`throw`才能被内部异常捕获，否则要抛出到外面，异常被内部捕获后，如果后面仍然有yield表达式，仍然可以正常遍历。

~~~js
// 第一个iter.throw()被Generator内部异常处理捕获，第二次被外面的异常处理捕获
function* foo(x) {
  try {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
  } catch(e) {
    console.log('内部获取异常');
  }
  return (x + y + z);
}

let iter = foo(5);
let result = iter.next();

while(!result.done) {
  try {
    iter.throw(new Error('错误'));
    iter.throw(new Error('错误'));
  } catch(e) {
    console.log('外部异常捕获');
  }
  result = iter.next(result.value);
}
// 内部获取异常
// 外部异常捕获
~~~


#### Generator.prototype.return()

Generator函数返回的`遍历器对象`，还有一个`return`方法，可以返回给定的值，并终结遍历Generator函数。

基本使用：
~~~js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true } || 没值时 {value: undefined, done: true}
g.next()        // { value: undefined, done: true }
~~~

如果代码中有`try... finally`代码块，并且正在执行try代码块，则`return()`方法，会立刻进入finally代码块，执行完毕后，整个函数才结束。

~~~js
function* gen() {
  try {
    yield 1;
    yield 2;
  } finally {
    yield 3;
    yield 4;
  }
}

var g = gen();

console.log(g.next());
console.log(g.return());
console.log(g.next());
console.log(g.next());
/**
{ value: 1, done: false }
{ value: 3, done: false }
{ value: 4, done: false }
{ value: undefined, done: true }

遍历器对象调用return时，没有执行yield 2，直接进入finally代码块
*/
~~~


<br/>

#### yield* 表达式

ES6提供了`yield*`表达式，用于在一个Generator函数中执行另一个Generator函数

如果`yield`后面跟一个`遍历器对象`，需要在`yield`后面加`*(yield* iterator)`,表明它返回的是一个遍历器对象，这种称为`yield*`表达式。

~~~js
// 有点像koa中中间件的执行顺序，递归执行，将嵌套的调用扁平化。
function *test1() {
  yield 1;
  yield 2;
}

function *test2() {
  yield 3;
  yield* test1();
  yield 4;
}

function *test3() {
  yield 5;
  yield* test2();
  yield 6;
}

const iter = test3();
for(item of iter) {
  console.log(item);
}
// 5, 3, 1, 2, 4, 6
~~~

> 实际上，任何数据结构只要有 `Iterator` 接口，就可以被`yield*`遍历。

因此我们常见的数组、Map、Set，Generator函数返回的遍历器对象，都可被`yield*`遍历。


<br/>

#### Generator函数的this

Generator函数总是返回一个`遍历器对象`，ES6规定这个这个遍历器对象是Generator的实例，也继承了Generator的原型prototype上的方法(throw, return, next)


<br/>

#### 应用



