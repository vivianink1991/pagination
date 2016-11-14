
该组件提供了分页页码显示的功能，根据不同的参数配置可以生成不同的显示效果。

## 使用说明

```js
import pagination from 'pagination'; 
pagination(container, options);
```

## 参数说明

### container

承载分页的dom元素。

### options

包括以下内容：

#### total_items

总的数据条目数。

#### items_per_page

每页所展示的条目数，默认10。

#### current

初始化页码组件时选中的页码，默认是1。在设置时请与`page_index`的设置方式保持一致。

#### page_index

页码起始序号(类似数组下标)，只能是0或1，默认是1。

#### num_pages

最多能显示的页码数, 默认是5。

#### first_text

指定首页文字，默认值为1。传入`null`值表示不显示首页按钮。

#### last_text

指定尾页文字，默认值为`{{total_pages}}`。传入`null`值表示不显示尾页按钮。

#### ellipse_text

页码省略显示的文本内容，默认`...`。

#### prev_text

前一页按钮的文本内容，默认`<`。

#### next_text

下一页按钮的文本内容，默认`>`。

#### link_to

设置页码的href值，默认为`#page={{page_num}}`, 当href中包含`{{page_num}}`时，会替换`{{page_num}}`为对应的页码数。

#### callback(event, index)

点击页码后的回调函数，以加载新的内容等。该回调函数需要两个参数:

0. `event`
    
    例如用于阻止点击后的默认行为 `event.preventDefault();`

0. `index`

    新的页码

#### load_first_page

为`true`则初始化组件后调用`callback(event, index)`，默认`false`。

#### style_prefix

用于指定样式类名的前缀，默认为`pagination`。

## 返回值

返回值包含以下方法：

### getStatus()

返回值：

```js
{
    current, //当前页
    total_items, //总条目数
    total_pages //总页数
}
```

### go(index)

跳转到参数`index`所指定的页码数。

### goPrev()

向前一页

### goNext()

向后一页

## 开发说明

开发中所使用的包可直接运行命令：
```
npm install
```
也可以按以下说明进行一一安装。

### 开发环境

使用babel进行编译：
`npm install babel-cli`

开发时使用了库[requirejs](https://github.com/requirejs/requirejs),需在根目录下配置`.babelrc`为：
```
{
  "presets": ["es2015", stage-2"],
  "plugins": [
    "transform-es2015-modules-umd"
  ]
}
```

并进行安装：
```
npm install babel-preset-es2015
npm install babel-plugin-transform-es2015-modules-umd
npm install babel-preset-stage-2
```
之后运行命令：
```
npm run jsnext
```
在目录js中生成了编译好的js文件。

### 打包
使用了[rollup](https://github.com/rollup/rollup):
```
npm install babel-preset-es2015-rollup
```
在根目录下配置文件`rollup_config.js`：
```
    import babel from 'rollup-plugin-babel';

    export default {
      entry: 'jsnext/core.js',
      dest: 'build/pagination.js',
      plugins: [
        babel({
          exclude: 'node_modules/**',
        })
      ],
      format: 'umd'
    };
```
并更改`.babelrc`为：
```
{
  "presets": ["es2015-rollup"]
}
```
运行`npm run build`

在`build`目录中生成打包好的文件`paginaiton.js`

###压缩
```
npm install uglify-js
```
运行 `npm run publish`

在`build`目录下生成了压缩的文件`pagination.min.js`



