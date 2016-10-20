## **调用说明**
    ```pagination(container, options)```

## **参数说明**

### **container**
承载分页的dom元素

### **options**
包括以下内容：

#### **total_items**
总的数据条目数

#### **items_per_page**
每页所展示的条目数，默认10

#### **current_page**
初始化时选中的页码，默认1

#### **page_index**
页码起始顺序号，默认1

#### **num_display_entries**
ellipse_text前能看到的页码个数，默认10

#### **num_edge_entries**
ellipse_text后能看到的页码个数，默认1

#### **prev_text**
前一页按钮的文本内容，默认'&lt;'

#### **next_text**
下一页按钮的文本内容，默认'&gt;'

#### **ellipse_text**
页码省略显示的文本内容，默认'...'

#### **link_to**
设置页码链接的href值，默认'#'

#### **callback**
点击页码后的回调函数，以加载新的内容。该回调函数需要传入一个参数new_index, 表示新的页码数。

#### **load_first_page**
为真则callback会被调用，默认flase