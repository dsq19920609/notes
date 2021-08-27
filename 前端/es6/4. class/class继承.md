#### 基本形式

~~~js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
~~~


子类必须在`constructor`方法中调用`super方法`，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。


`父类的静态属性和静态方法都是被子类继承，参考上一节`。

<br/>

#### super()

`super关键字即可以当函数使用，也可以当对象使用`

第一种情况: `super`作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次`super`函数。

~~~js
class Parent {
  constructor() {
    console.log(new.target.name); 
  }
}

class Child extends Parent {
  constructor() {
    super();
  }
}

new Parent(); // Parent
new Child(); // Child
~~~

`super`虽然代表时父类Parent的构造函数，但是返回的是Child类的实例，即`super`内部的this指的是`B`的实例，
因此`super()`相当于`Parent.prototype.constructor.call(this)`

第二种情况：`super`作为对象时，在普通方法中，指向父类的原型对象，在静态方法中指向父类。


ES6规定：在子类普通方法中通过`super`调用父类的方法时，方法内部的this指向当前的子类实例。

~~~js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
// 即便A中this.print = this.print.bind(this), 在B中调用A的方法时，内部的this依然是B的实例。
// 执行时类似：super.print.call(this);
~~~

`由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字`

<br/>

#### 原生构造函数的继承

原生构造函数是指语言内置的构造函数，通常用来生成数据结构。

* Boolean()

* Number()

* String()

* Object()

* Function()

* Array()

* Date()

* RegExp()

* Error()

以前ES5中上面的内置对象都是无法继承的，ES6运行继承原生构造函数定义的子类，因为ES6先创建父类实例对象`this`,然后再用子类的构造函数修饰`this`,使得父类所有的行为都可以继承。

~~~js
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1
~~~

继承原生构造函数并添加方法：
~~~js
class VersionArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}
var x = new VersionArray();

x.push(1);
x.push(2);
console.log(x); // [1, 2]

x.commit();
console.log(x.history) // [[], [1, 2]]
~~~

继承`Error`内置对象：
~~~js
class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}
~~~