### 1、标题
# h1
## h2
### h3
#### h4
##### h5
###### h6

### 2、段落
(中间添加空白分隔行)  
这个段落一

这是段落二

### 3、换行
两种方式
* 通过段落,中间加空白分隔行
* 行结尾两个或者多个空格结束一行，然后return

### 4、粗体
在单词或者短语前后添加两个*或者_(下划线两边要有空格)
* 这个一个**加粗**文本
* 这是一个 __加粗__ 文本

### 5、斜体
在单词或者短语前后添加一个*或者__(下划线两边要有空格)
* 这是一个*斜体*
* 这是一个 _斜体_

### 6、斜体，加粗
需要三个* 或者 _
* 这是***斜体加粗***
* 这是 ___斜体加粗___

### 7、块引用
要创建blockquote，请>在段落前面添加一个。
> 这个一个代码块

多个块引用在每个段前都添加>
> this is markdown1  
> this is markdown2  
> this is markdown3  

嵌套引用块  
块引用可以嵌套。>>在要嵌套的段落前面添加一个。
> this is out
>> this is inner

具有其他元素的块引用
> #### 标题
> 列表
> * 1
> * 2

### 8、清单
您可以将项目组织成有序和无序列表。
 
**有序列表**  
要创建有序列表，请在订单项中添加数字和句点。数字不必按数字顺序排列，但列表应以数字开头。  
1、name  
2、age  
3、gender  

**无须列表**  
要创建无序列表，请在订单项前添加破折号（**-**），星号（**2**）或加号（**+**）。缩进一个或多个项目以创建嵌套列表。

- First item
- Second item
- Third item
    - Indented item
    - Indented item
      - Indented item
      - Indented item
        - Indented item
- Fourth item

**在列表中添加元素**   
要在保留列表连续性的同时在列表中添加另一个元素，请将该元素缩进**四个空格**或**一个制表符**，如以下示例所示。  
*   This is the first list item.
*   Here's the second list item.   
    I need to add another paragraph below the second list item.
*   And here's the third list item.

***块引用***  
* this are some text
  >this some words

***代码块***   
**代码块通常缩进四个空格或一个制表符**。当它们在列表中时，将它们缩进**八个空格**或**两个选项卡**。

1.  Open the file.
2.  Find the following code block on line 21:

        <html>
          <head>
            <title>Test</title>
          </head>

3.  Update the title to match the name of your website.

***图片***  
1.  Open the file containing the Linux mascot.
2.  Marvel at its beauty.

    ![这是一张图片](/assets/images/landing.png)

3.  Close the file.


### 9、代码  
要将单词或短语表示为代码，请将其括在勾号（`）中。   

At the command prompt, type `nano`.	

**转义刻度线**  
如果要表示为代码的单词或短语包含一个或多个刻度线，可以通过将单词或短语括在双刻度线（``）中来对其进行转义。

``Use `code` in your Markdown file.``	

**代码块**  
要创建代码块，请在代码块的每一行缩进**至少四个空格**或**一个制表符**。

    <html>
      <head>
      </head>
    </html>

### 10、水平线  
要创建水平线***，请单独在一行上使用三个或更多的星号（），破折号（---）或下划线（___）。

    ***
    ---
    ___
    <hr/>
***
---
___
<hr/>


### 11、链接
要创建链接，请将链接文本括在方括号（例如[Duck Duck Go]）中，然后立即在URL后面加上括号（例如(https://duckduckgo.com)）中的URL 。

> My favorite search engine is [Duck Duck Go](https://duckduckgo.com).

***添加标题***
> My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").

***网址或者邮件地址***  
要将URL或电子邮件地址快速转换为链接，请将其括在尖括号中。  

<fake@example.com>  
<https://markdown.p2hp.com>  

***格式化链接***
为了强调链接，请在方括号和括号之前和之后添加星号。


I love supporting the **[EFF](https://eff.org)**.  
This is the **[Markdown Guide](https://markdown.p2hp.com)**.


### 12、转义字符  
要显示原本用于格式化 Markdown 文档的字符，请在字符前面添加反斜杠字符 (\) 。  

    \* 如果没有开头的反斜杠字符的话，这一行将显示为无序列表。
\* 如果没有开头的反斜杠字符的话，这一行将显示为无序列表。

***可转义的字符***

    \ : 反斜杠
    ` : backtick 
    * : 星号
    _ : 下划线
    {}: 花括号
    []: 方括号
    <>: 尖括号
    ()：圆括号
    # ：井号
    + ：加号
    - ：减号
    ！：感叹号
    | : 管道符
    . :句号


### 13、html标签

可以在md格式文档中嵌入html标签和style样式  
    
     dong <span style="color:red;font-size: 16px;">shao</span> qiang

效果如下：dong <b style="color:red;font-size: 16px;">shao</b> qiang   



### 14、围栏代码块  

四个空白符或者制表符，或者~~~ 或者 ```

```
{
"firstName": "John",
"lastName": "Smith",
"age": 25
}
```

效果如下：
~~~
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
~~~  

**代码高亮**  
许多 Markdown 解析器都支持围栏代码块的语法高亮功能。此功能允许你为编写代码所用的编程语言添加带颜色的语法高亮显示。如需添加语法高亮，请在围栏代码块前的反引号旁指定所用的编程语言。   
~~~
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
~~~~

~~~js
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
~~~ 

**代码高亮支持的语言**

列出前端常用的:

| 名称      | 关键字 |
|  :---       |    :--:     |
| Shell      | bash, shell       |
| CSS   | css        |
| Java	    |  java         |
| JavaScript    |  js, jscript, javascript         |
| text    |  text, plain        |
| SASS&SCSS	    |  sass, scss         |
| SQL    |  sql         |


### 15、表格
如需添加表格，请使用三个或更多个连字符（---）来为每个列创建表头，并使用管道符（|）来分隔每个列。你还可以在表格的任意一侧添加管道符。  

~~~
| Syntax      | Description | content |
|  :---       |    :--:     |  ---:   |
| Header      | Title       |  text   |
| Paragraph   | Text        |  text   |
| markdown    |  js         |  text   |

:--- 代表左对齐
:--: 居中对齐
---: 代表右对齐

~~~
效果如下：

| Syntax      | Description | content |
|  :---       |    :--:     |  ---:   |
| Header      | Title       |  text   |
| Paragraph   | Text        |  text   |
| markdown    |  js         |  text   |

### 16、禁止将url转换为链接
如果你不希望自动将 URL 转换为链接，则可以通过反引号 将 URL 表示为代码 。

~~~
`http://www.example.com`
~~~

`http://www.example.com`

### 17、删除线
~~~
这就是 ~~删除线~~
~~~
这就是 ~~删除线~~
