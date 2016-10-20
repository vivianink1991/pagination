## **调用说明**
```
    var pages = pagination(container, options);
```

## **参数说明**

### **container**
承载分页的dom元素。

### **options**
包括以下内容：

#### **total_items**
总的数据条目数。

#### **items_per_page**
每页所展示的条目数，默认10。

#### **current_page**
初始化页码组件时选中的页码，默认是0。在设置时请与page_index的设置方式保持一致。

#### **page_index**
页码起始序号(类似数组下标)，只能是0或1，默认是0。

#### **ellipse_before_entries**
ellipse_text前能看到的页码个数，默认10。

#### **ellipse_after_entries**
ellipse_text后能看到的页码个数，默认1。

#### **ellipse_text**
页码省略显示的文本内容，默认'...'。

#### **prev_text**
前一页按钮的文本内容，默认'&lt;'。

#### **next_text**
下一页按钮的文本内容，默认'&gt;'。

#### **link_to**
设置页码的href值，默认'#'。

#### **callback(event, new_index)**
点击页码后的回调函数，以加载新的内容、更新页面跳转模块等。该回调函数需要两个参数，一个是event，主要可用于阻止点击后的默认行为；另一个参数new_index, 表示新的页码数。

#### **load_first_page**
为真则初始化组件时callback会被调用，默认flase。如果在初始化组件时已经通过AJAX加载展示了数据，则一定要设置成false。

##**返回值**
返回值是一个对象，该对象包含两个方法：

###getStatus()
该方法可返回总页码数、总条目数等信息。

###jumpPageTo(index)
调用该方法可直接跳转到参数index所指定的页码数。
