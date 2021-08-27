# @rollup/plugin-commonjs

`npm install @rollup/plugin-commonjs`

一些库可以导出成你可以正常导入的ES6模块，但是目前，npm中的大多数包都是以CommonJS模块的形式出现的，在他们更改之前，我们需要将CommonJs模块转换成ES6模块，供Rollup来处理(`require/module.exports => import/export`)

这个插件就是用来将CommonJS转换成ES2015模块的。

** 请注意- `@rollup/plugin-commonjs`应该用在其他插件转换之前- 这是防止其他插件破坏了CommonJS的检查
