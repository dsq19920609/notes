#### 在线ES6+ => ES5编译器

> 发现babel的在线编译器没有ts的在线编译器好用，ts在线编译器可以将ts代码转换成ES5代码，ts是js的超集，因此可以将js代码转换成ES5。<br/>
地址：https://www.tslang.cn/play/index.html

下面包括了：类属性，原型方法，静态属性和静态方法以及定义在Descriptor对象上的存取器。

> ES6写法：
~~~js
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  isIterator = false;

  getClass = () => {
    return 'getClass';
  }

  static myName = 'dong';

  static getName() {
    return Point.myName;
  }

  get prop() {
    return 'prop';
  }

  set prop(val) {
    console.log(val);
  }

  toString() {
    return `${x} - ${y}`;
  }

}
~~~

> 用ES5实现

~~~js
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.isIterator = false;
        this.getClass = function () {
            return 'getClass';
        };
        this.x = x;
        this.y = y;
    }
    Point.getName = function () {
        return Point.myName;
    };
    Object.defineProperty(Point.prototype, "prop", {
        get: function () {
            return 'prop';
        },
        set: function (val) {
            console.log(val);
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.toString = function () {
        return x + " - " + y;
    };
    Point.myName = 'dong';
    return Point;
}());

~~~

#### 基本用法 

~~~js
// 生成实例对象的ES5实现
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
}

var p = new Point(1, 2);
console.log(p.toString());

// class写法
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

const p = new Point(1, 4);
console.log(p.toString());
~~~

类的所有方法都定义在类的`prototype`属性上，
~~~js
class Point {
  constructor() {
  }

  toString() {
  }

  toValue() {
  }
}

// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
~~~

<br/>

#### constructor

一个类必须有`constructor()`方法，如果没用显示定义，一个空的`constructor()`方法会被默认添加。

~~~js
class Point {
}

// 等同于
class Point {
  constructor() {}
}

const p = new Point();
~~~

`constructor()`默认返回当前实例对象(`this`)，使用`new`初始化时，调用构造函数，返回当前实例对象。

<br/>

#### 类的实例 

实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在class上）。

~~~js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${x}-${y}`;
  }
}

const p = new Point(1, 3);

console.log(p.hasOwnProperty('x')); // true
console.log(p.hasOwnProperty('y'));  // true
console.log(p.hasOwnProperty('toString')); // false
console.log(p.__proto__.hasOwnProperty('toString'));  // true
console.log(p.__proto__.hasOwnProperty('constructor'));  // true
// 可以看到class方法都定义在原型上，constructor构造函数定义在原型上。
~~~

<br/>

#### 取值函数(getter)和存值函数(setter)

~~~js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get props() {
    return this.x;
  }

  set props(val) {
    this.x = val;
  }
}

const p = new Point(1, 3);
p.props = 123;
console.log(p.props); // 123
~~~

ES5: `存值函数和取值函数是设置在属性的 Descriptor 对象上的`。

~~~js
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Point.prototype, "props", {
        get: function () {
            return this.x;
        },
        set: function (val) {
            this.x = val;
        },
        enumerable: true,
        configurable: true
    });
    return Point;
}());
~~~

<br/>

#### class表达式  

##### name属性  

返回class类名称。

##### Generator函数，class遍历器

~~~js
// 遍历器
class Point {
  constructor(...args) {
    this.args = args;
  }

  *[Symbol.iterator]() {
    for (let item of this.args) {
      yield item;
    }
  }
}

const p = new Point(1, 2, 3, 4);
for (let item of p) {
  console.log(item);
}
~~~

##### this

~~~js
class Point {
  constructor(...args) {
    this.args = args;
  }

  getName () {
    console.log(this); // undefined
  }
}

const p = new Point(1, 2, 3, 4);
const { getName } = p;
getName();

// 如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境
// （由于 class 内部是严格模式，所以 this 实际指向的是undefined）
~~~

解决class中this指向问题：react 组件中也是如此做的

1、通过在构造函数中`bind`绑定上下文

~~~js
class Point {
  constructor(...args) {
    this.args = args;
    this.getName = this.getName.bind(this);
  }

  getName () {
    console.log(this);
  }
}
// 
~~~

2、箭头函数

`箭头函数内部的this总是指向定义时所在的对象`

~~~js
class Point {
  constructor(...args) {
    this.args = args;
  }

  getName = () => {
    console.log(this);
  }
}
~~~


<br/>

#### 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“`静态方法`”。

`静态方法中的this指向当前类，而不是类的实例`

~~~js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
~~~

`父类的静态方法可以被子类继承`’

~~~js
class Parent {
  static getName() {
    console.log('name');
    return 'name';
  }
}
Parent.getAge = () => {
  console.log('age');
  return 'age';
};

class Child extends Parent {

}

Child.getName(); // name
Child.getAge();  // age
~~~

<br/>

#### 静态属性

1、静态方法或属性最好通过static关键字去定义，而不是写到外面 

2、子类可以继承父类的静态属性

3、子类可以继承父类的静态方法
~~~js
class Parent {
  static age = 12;
}

Parent.id = "id";

class Child extends Parent {

}

console.log(Child.age);
console.log(Child.id);
~~~

<br/>

#### new.target属性

new是从构造函数生成实例对象的命令。ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，`返回new命令作用于的那个构造函数`。如果构造函数不是通过new命令或Reflect.construct()调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

* class内部调用`new.target`返回当前class

* 子类继承父类时，`new.target`返回子类

~~~js
class Parent {
  constructor() {
    console.log(new.target); // [Function: Child]
  }
}

Parent.id = "id";

class Child extends Parent {
  constructor() {
    super();
    console.log(new.target); // [Function: Child]
  }
}

const c = new Child();
~~~
