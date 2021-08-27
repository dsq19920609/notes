#### @babel/preset-react

此预设始终包含以下插件：

* `@babel/plugin-syntax-jsx`

* `@babel/plugin-transform-react-jsx`

* `@babel/plugin-transform-react-display-name`

如果开启了`development`参数还将包括下面插件：

* `@babel/plugin-transform-react-jsx-self`

* `@babel/plugin-transform-react-jsx-source`

<br/>

#### 用法

<h5>1、通过配置文件</h5>

~~~json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
~~~

<h5>2、通过命令行工具</h5>

~~~
npx babel --presets @babel/preset-react index.js
~~~


<h5>3、通过Node API</h5>

~~~js
require("@babel/core").transformSync("code", {
  presets: ["@babel/preset-react"]
})
~~~

> 实例：

~~~json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": "3.6.5"
    }],
    ["@babel/preset-react", {
      
    }]
  ]
}

~~~

jsx被转换

~~~js
// 源函数组件
export default function() {
  return (
    <div>dd</div>
  )
}

// 转换后
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  return /*#__PURE__*/React.createElement("div", null, "dd");
}
~~~

~~~js
// 源class组件
import React, { Component } from 'react';

class DD extends Component {
  
  render() {
    return (
      <div>d</div>
    )
  }
}

export default DD;

// 转换后代码

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DD = /*#__PURE__*/function (_Component) {
  _inherits(DD, _Component);

  var _super = _createSuper(DD);

  function DD() {
    _classCallCheck(this, DD);

    return _super.apply(this, arguments);
  }

  _createClass(DD, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", null, "d");
    }
  }]);

  return DD;
}(_react.Component);

var _default = DD;
exports["default"] = _default;
~~~

<br/>

#### 参数

`1、runtime:`

`classic | automatic`，默认值为 `classic`

用于决定使用哪个运行时。

当设置为 `automatic` 时，将自动导入（import）JSX 转换而来的函数。当设置为 classic 时，不会自动导入（import）任何东西。

当为：`automatic`
~~~js
 var _jsxRuntime = require("react/jsx-runtime");

 _createClass(DD, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: "d"
      });
    }
  }]);
~~~

`2、development:`

`boolean` 类型，默认值为 `false`.

这可以用于开启特定于开发环境的某些行为，例如添加 `__source` 和 `__self`。

~~~js
 var _jsxFileName = "E:\\babel-pro\\demo1\\src\\dd.js";
 
 _createClass(DD, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7,
          columnNumber: 7
        }
      }, "d");
    }
  }]);

~~~



