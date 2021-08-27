# Promise/A+规范

> 原文地址：https://promisesaplus.com/

#### 1、术语

1.1 "promise"是一个对象或者函数，它拥有一个符合文档中描述行为的`then`方法。

1.2 "thenable"是一个有`then`方法的对象或者函数。

1.3 "value"是一个合法的javascript值(包括undefined, 一个thenable或者promise)。

1.4 "exception"是一个使用在`throw`语句中的抛出来的值。

1.5 "reason"是一个用来表示promise拒绝原因的值。

<br/>

#### 2、要求

#### 2.1 promise状态  

一个promise有三种状态：pending, fulfilled, rejected   

2.1.1 当处于`pending`状态时，promise:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.1.1 可能转化为任何其他状态

2.1.2 当处于`fulfilled`状态时，promise:  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.2.1 禁止转换成其他状态

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.2.1 必须有一个无法更改的值

2.1.3 当处于`rejectd`状态时，promise:  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.3.1 禁止转换成其他状态

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.3.1 必须有一个无法更改的原因

在这里，无法更改意味着全等(例如`===`),但是不代表深比较相等  


<br/>

#### 2.2 then方法

promise必须包含一个`then`方法来访问它当前或者最终的值或者原因  

Promise的`then`方法接收两个参数：  

~~~js
promise.then(onFulfilled, onRejected)
~~~

2.1.1 `onFulfilled`和`onRejected`函数有可选的参数：  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.1.1 如果`onFulfilled`不是一个函数，那么必须忽略掉

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.1.2 如果`onRejected`不是一个函数，那么必须忽略掉

2.2.2 如果`onFulfilled`是一个函数：  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.2.1 它必须在promise到fulfilled状态后触发，promise的值是它的第一个参数

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.2.2 它在promise达到fulfilled状态之前，禁止触发

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.2.3 它禁止触发多次


2.2.3 如果`onRejected`是一个函数：  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.3.1 它必须在promise到rejected状态后触发，promise的原因是它的第一个参数

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.3.2 它在promise到达rejected状态之前，禁止触发

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.3.3 它禁止触发多次

2.2.4 `onFulfilled`或者`onRejected`只有在执行上下文堆栈只有平台代码时才能被触发。

2.2.5 `onFulfilled`和`onRejected`必须作为函数被调用。

2.2.6 `then`方法可能在相同的promise中被调用多次。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.6.1 如果promise到了fulfilled状态，那么所有的onFulfilled回调函数都必须按照他们原有的顺序进行调用执行。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.6.2 如果promise到了rejected状态，那么所有onRejected回调函数都必须按照他们原有的顺序进行调用执行。

2.2.7 `then`方法必须返回一个promise:

~~~js
const promise2 = premise1.then(onFulfilled, onRejected);
~~~

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.7.1

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.7.2

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.7.3

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2.7.4


