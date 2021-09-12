https://editorconfig.org/

因为并不是所有的人都使用VS code，所以为了在同样的项目下保持一致，比如tab的宽度或者行尾要不要有分号，我们可以使用`.editorconfig`来统一这些配置。

推荐的配置：

~~~js
# EditorConfig is awesome: http://EditorConfig.org

# top-most EditorConfig file
root = true

[*.md]
trim_trailing_whitespace = false

[*.js]
trim_trailing_whitespace = true

# Unix-style newlines with a newline ending every file
[*]
indent_style = space
indent_size = 2
# 保证在任何操作系统上都有统一的行尾结束字符
end_of_line = lf
charset = utf-8
insert_final_newline = true
max_line_length = 100

~~~