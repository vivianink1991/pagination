define(['exports', './event', './util'], function (exports, _event, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    /**
     * 分页组件构造函数
     *
     * @param {Node} container 承载组件的DOM节点
     * @param {Object} option 组件配置项
     */
    /**
     * @file 本文件实现了分页组件的核心功能。
     *       主要包括分页组件类PageSet、对外暴露的接口pagination以及配置项合法性检查函数checkOptions。
     * @author Jiaxin Li(vivianink@126.com)
     */

    function PageSet(container, options) {

        this.container = container;

        this.config = (0, _util.extend)({
            items_per_page: 10,
            current: 1,
            page_index: 1,
            num_pages: 5,
            first_text: '1',
            last_text: '{{total_pages}}',
            ellipse_text: '...',
            prev_text: '&lt',
            next_text: '&gt',
            link_to: '#page={{page_num}}',
            callback: function callback(event, index) {},
            load_first_page: false,
            style_prefix: 'pagination'
        }, options || {});

        this.total_pages = Math.ceil(this.config.total_items / this.config.items_per_page);
        this.config.num_pages = this.config.num_pages > this.total_pages ? this.total_pages : this.config.num_pages;
        this.config.current = this.config.current > this.total_pages ? this.total_pages : this.config.current;
        this.offsetIndex = Math.abs(this.config.page_index - 1); //页码文本=this.current + offsetIndex
    }

    /**
    * 生成页码元件
    *
    * @param {String} nodeName 元件标签类型，包括'a' 和'span'两种
    * @param {String} nodeType a标签的状态类型，包括'num'、'prev'、'next'、'first'和'last'
    * @param {String} text 元件内的文本内容
    * @param {String} className 元件类名
    * @param {Number} currentText 标签代表的页码值（从1开始）
    *
    * @return {Node} DOM节点
    */
    PageSet.prototype.createPageItem = function (_ref) {
        var nodeName = _ref.nodeName,
            nodeType = _ref.nodeType,
            text = _ref.text,
            className = _ref.className,
            currentText = _ref.currentText;


        var item = document.createElement(nodeName);

        if (nodeName === 'a') {
            switch (nodeType) {
                case 'num':
                    this.setATag(item, text);
                    break;

                case 'prev':
                    this.setATag(item, currentText - 1);
                    break;

                case 'next':
                    this.setATag(item, currentText + 1);
                    break;

                case 'first':
                    this.setATag(item, 1);
                    break;

                case 'last':
                    this.setATag(item, this.total_pages);
                    break;

                default:
                    return;
            }
        }
        if (className) {
            item.className = this.config.style_prefix + '_' + className;
        }
        item.innerHTML = text;
        return item;
    };

    /**
    * 设置a标签
    *
    * @ param {Node} a标签节点
    * @ param {Number} 页码值（从1开始）
    *
    * @return {Node} a标签节点
    */
    PageSet.prototype.setATag = function (item, numText) {
        var linkNum = numText - this.offsetIndex;
        item.href = (0, _util.replace)(this.config.link_to, linkNum);
        item.setAttribute('data-num', linkNum);
        return item;
    };

    /**
    * 根据当前点击的页码值渲染页码组件
    *
    * @param {String} 当前点击的页码值（从this.config.page_index开始）
    */
    PageSet.prototype.render = function (current) {
        this.container.innerHTML = '';
        this.current = parseInt(current);
        var currentText = this.current + this.offsetIndex;

        var prevItem = null;
        if (currentText === 1) {
            prevItem = this.createPageItem({
                text: this.config.prev_text,
                nodeName: 'span',
                nodeType: 'prev',
                className: 'disable_prev'
            });
        } else {
            prevItem = this.createPageItem({
                text: this.config.prev_text,
                nodeName: 'a',
                nodeType: 'prev',
                currentText: currentText
            });
        }

        this.container.appendChild(prevItem);

        if (currentText < this.config.num_pages) {
            for (var i = 1; i <= this.config.num_pages; i++) {
                if (i !== currentText) {
                    this.container.appendChild(this.createPageItem({
                        text: i,
                        nodeName: 'a',
                        nodeType: 'num' }));
                } else {
                    this.container.appendChild(this.createPageItem({
                        text: currentText,
                        nodeName: 'span',
                        nodeType: 'num',
                        className: 'current' }));
                }
            }

            if (this.config.last_text && this.config.num_pages < this.total_pages - 1 || !this.config.last_text && this.config.num_pages < this.total_pages) {

                this.container.appendChild(this.createPageItem({
                    text: this.config.ellipse_text,
                    nodeName: 'span',
                    className: 'ellipse' }));

                this.config.last_text && this.container.appendChild(this.createPageItem({
                    text: this.config.last_text.replace(/{{.*}}/, this.total_pages), //如果设置了则不会替换
                    nodeName: 'a',
                    nodeType: 'last' }));
            }
        } else {
            var rtEdge = Math.floor((this.config.num_pages - 1) / 2);
            while (currentText + rtEdge > this.total_pages) {
                rtEdge--;
            }
            var ltEdge = this.config.num_pages - 1 - rtEdge;

            if (this.config.num_pages != this.total_pages) {

                this.config.first_text && this.container.appendChild(this.createPageItem({
                    text: this.config.first_text,
                    nodeName: 'a',
                    nodeType: 'first' }));

                if (currentText - ltEdge > 2) {
                    this.container.appendChild(this.createPageItem({
                        text: this.config.ellipse_text,
                        nodeName: 'span',
                        className: 'ellipse' }));
                }
            }

            while (ltEdge) {
                this.container.appendChild(this.createPageItem({
                    text: current - ltEdge,
                    nodeName: 'a',
                    nodeType: 'num' }));
                ltEdge--;
            }
            this.container.appendChild(this.createPageItem({
                text: currentText,
                nodeName: 'span',
                className: 'current' }));

            var rtCount = 1;
            while (rtCount <= rtEdge) {
                this.container.appendChild(this.createPageItem({
                    text: currentText + rtCount,
                    nodeName: 'a',
                    nodeType: 'num' }));
                rtCount++;
            }

            if (rtCount + currentText < this.total_pages) {
                this.container.appendChild(this.createPageItem({
                    text: this.config.ellipse_text,
                    nodeName: 'span',
                    className: 'ellipse' }));
            }

            if (this.config.last_text && rtCount - 1 + currentText < this.total_pages) {
                this.container.appendChild(this.createPageItem({
                    text: this.config.last_text.replace(/{{.*}}/, this.total_pages),
                    nodeName: 'a',
                    nodeType: 'last' }));
            }
        }

        var nextItem = null;
        if (currentText === this.total_pages) {
            nextItem = this.createPageItem({
                text: this.config.next_text,
                nodeName: 'span',
                className: 'disable_next' });
        } else {
            nextItem = this.createPageItem({
                text: this.config.next_text,
                nodeName: 'a',
                nodeType: 'next',
                currentText: currentText });
        }
        this.container.appendChild(nextItem);
    };

    PageSet.prototype.addEventHandler = function () {

        (0, _event.addEvent)(this.container, 'click', function (event) {
            var e = (0, _event.getEvent)(event);
            var target = (0, _event.getTarget)(e);

            if (target.nodeName.toUpperCase() === 'A') {
                var index = target.getAttribute('data-num');
                this.config.callback(e, index);
                this.render(index);
            }
        }.bind(this));
    };

    PageSet.prototype.getStatus = function () {
        return {
            total_pages: this.total_pages,
            total_items: this.config.total_items,
            current: this.current
        };
    };

    PageSet.prototype.go = function (index) {
        index = parseInt(index);
        if (index < 1 || index > this.total_pages) {
            return;
        }
        this.render(index - this.offsetIndex);
        this.config.callback(event, index - this.offsetIndex);
    };

    PageSet.prototype.goPrev = function () {
        if (this.current + this.offsetIndex === 1) {
            return;
        }
        this.render(this.current - 1);
        this.config.callback(event, this.current);
    };

    PageSet.prototype.goNext = function () {
        if (this.current + this.offsetIndex === this.total_pages) {
            return;
        }
        this.render(this.current + 1);
        this.config.callback(event, this.current);
    };

    function checkOptions(options) {
        if (!/^[1-9]\d*$/.test(options.total_items)) {
            return false;
        }

        if ('page_index' in options && !/^[01]$/.test(options.page_index)) {
            delete options.page_index;
        }

        if ('items_per_page' in options && (!/^[1-9]\d*$/.test(options.items_per_page) || options.items_per_page > options.total_items)) {
            delete options.items_per_page;
        }

        if ('num_pages' in options && !/^[1-9]\d*$/.test(options.num_pages)) {
            delete options.num_pages;
        }

        if ('current' in options && !/^[1-9]\d*$/.test(options.current)) {
            delete options.current;
        }

        if ('load_first_page' in options && !/^(true)$| ^(flase)$/.test(options.load_first_page)) {
            delete options.load_first_page;
        }

        return options;
    }

    function pagination(container, options) {
        options = checkOptions(options);
        if (!options) {
            return;
        }
        var page = new PageSet(container, options);
        page.container.className += ' ' + page.config.style_prefix;
        page.render(page.config.current);

        if (page.config.load_first_page === true) {
            page.config.callback(event, page.config.page_index);
        }

        page.addEventHandler();

        return {
            getStatus: page.getStatus.bind(page),
            go: page.go.bind(page),
            goPrev: page.goPrev.bind(page),
            goNext: page.goNext.bind(page)
        };
    }
    exports.default = pagination;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzbmV4dC9jb3JlLmpzIl0sIm5hbWVzIjpbIlBhZ2VTZXQiLCJjb250YWluZXIiLCJvcHRpb25zIiwiY29uZmlnIiwiaXRlbXNfcGVyX3BhZ2UiLCJjdXJyZW50IiwicGFnZV9pbmRleCIsIm51bV9wYWdlcyIsImZpcnN0X3RleHQiLCJsYXN0X3RleHQiLCJlbGxpcHNlX3RleHQiLCJwcmV2X3RleHQiLCJuZXh0X3RleHQiLCJsaW5rX3RvIiwiY2FsbGJhY2siLCJldmVudCIsImluZGV4IiwibG9hZF9maXJzdF9wYWdlIiwic3R5bGVfcHJlZml4IiwidG90YWxfcGFnZXMiLCJNYXRoIiwiY2VpbCIsInRvdGFsX2l0ZW1zIiwib2Zmc2V0SW5kZXgiLCJhYnMiLCJwcm90b3R5cGUiLCJjcmVhdGVQYWdlSXRlbSIsIm5vZGVOYW1lIiwibm9kZVR5cGUiLCJ0ZXh0IiwiY2xhc3NOYW1lIiwiY3VycmVudFRleHQiLCJpdGVtIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QVRhZyIsImlubmVySFRNTCIsIm51bVRleHQiLCJsaW5rTnVtIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInJlbmRlciIsInBhcnNlSW50IiwicHJldkl0ZW0iLCJhcHBlbmRDaGlsZCIsImkiLCJyZXBsYWNlIiwicnRFZGdlIiwiZmxvb3IiLCJsdEVkZ2UiLCJydENvdW50IiwibmV4dEl0ZW0iLCJhZGRFdmVudEhhbmRsZXIiLCJlIiwidGFyZ2V0IiwidG9VcHBlckNhc2UiLCJnZXRBdHRyaWJ1dGUiLCJiaW5kIiwiZ2V0U3RhdHVzIiwiZ28iLCJnb1ByZXYiLCJnb05leHQiLCJjaGVja09wdGlvbnMiLCJ0ZXN0IiwicGFnaW5hdGlvbiIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBU0E7Ozs7OztBQVRBOzs7Ozs7QUFlQSxhQUFTQSxPQUFULENBQWlCQyxTQUFqQixFQUE0QkMsT0FBNUIsRUFBcUM7O0FBRWpDLGFBQUtELFNBQUwsR0FBaUJBLFNBQWpCOztBQUVB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LElBQVosQ0FBaUJRLElBQWpCLENBSEw7QUFJSEosb0JBQVFJLEtBQUtKLE1BQUwsQ0FBWUosSUFBWixDQUFpQlEsSUFBakI7QUFKTCxTQUFQO0FBTUg7c0JBQ2NELFUiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUg5pys5paH5Lu25a6e546w5LqG5YiG6aG157uE5Lu255qE5qC45b+D5Yqf6IO944CCXG4gKiAgICAgICDkuLvopoHljIXmi6zliIbpobXnu4Tku7bnsbtQYWdlU2V044CB5a+55aSW5pq06Zyy55qE5o6l5Y+jcGFnaW5hdGlvbuS7peWPiumFjee9rumhueWQiOazleaAp+ajgOafpeWHveaVsGNoZWNrT3B0aW9uc+OAglxuICogQGF1dGhvciBKaWF4aW4gTGkodml2aWFuaW5rQDEyNi5jb20pXG4gKi9cblxuaW1wb3J0IHthZGRFdmVudCwgZ2V0RXZlbnQsIGdldFRhcmdldCwgcHJldmVudERlZmF1bHR9IGZyb20gJy4vZXZlbnQnO1xuaW1wb3J0IHtleHRlbmQsIHJlcGxhY2V9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICog5YiG6aG157uE5Lu25p6E6YCg5Ye95pWwXG4gKlxuICogQHBhcmFtIHtOb2RlfSBjb250YWluZXIg5om/6L2957uE5Lu255qERE9N6IqC54K5XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIOe7hOS7tumFjee9rumhuVxuICovXG5mdW5jdGlvbiBQYWdlU2V0KGNvbnRhaW5lciwgb3B0aW9ucykge1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7IFxuXG4gICAgdGhpcy5jb25maWcgPSBleHRlbmQoe1xuICAgICAgICBpdGVtc19wZXJfcGFnZTogMTAsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHBhZ2VfaW5kZXg6IDEsXG4gICAgICAgIG51bV9wYWdlczogNSxcbiAgICAgICAgZmlyc3RfdGV4dDogJzEnLFxuICAgICAgICBsYXN0X3RleHQ6ICd7e3RvdGFsX3BhZ2VzfX0nLFxuICAgICAgICBlbGxpcHNlX3RleHQ6ICcuLi4nLFxuICAgICAgICBwcmV2X3RleHQ6ICcmbHQnLFxuICAgICAgICBuZXh0X3RleHQ6ICcmZ3QnLFxuICAgICAgICBsaW5rX3RvOiAnI3BhZ2U9e3twYWdlX251bX19JyxcbiAgICAgICAgY2FsbGJhY2s6IChldmVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9maXJzdF9wYWdlOiBmYWxzZSxcbiAgICAgICAgc3R5bGVfcHJlZml4OiAncGFnaW5hdGlvbidcbiAgICB9LCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMudG90YWxfcGFnZXMgPSBNYXRoLmNlaWwodGhpcy5jb25maWcudG90YWxfaXRlbXMgLyB0aGlzLmNvbmZpZy5pdGVtc19wZXJfcGFnZSk7XG4gICAgdGhpcy5jb25maWcubnVtX3BhZ2VzID0gdGhpcy5jb25maWcubnVtX3BhZ2VzID4gdGhpcy50b3RhbF9wYWdlcyA/IHRoaXMudG90YWxfcGFnZXMgOiB0aGlzLmNvbmZpZy5udW1fcGFnZXM7XG4gICAgdGhpcy5jb25maWcuY3VycmVudCA9IHRoaXMuY29uZmlnLmN1cnJlbnQgPiB0aGlzLnRvdGFsX3BhZ2VzID8gdGhpcy50b3RhbF9wYWdlcyA6IHRoaXMuY29uZmlnLmN1cnJlbnQ7XG4gICAgdGhpcy5vZmZzZXRJbmRleCA9IE1hdGguYWJzKHRoaXMuY29uZmlnLnBhZ2VfaW5kZXggLSAxKTsgLy/pobXnoIHmlofmnKw9dGhpcy5jdXJyZW50ICsgb2Zmc2V0SW5kZXhcbn1cblxuLyoqXG4qIOeUn+aIkOmhteeggeWFg+S7tlxuKlxuKiBAcGFyYW0ge1N0cmluZ30gbm9kZU5hbWUg5YWD5Lu25qCH562+57G75Z6L77yM5YyF5ousJ2EnIOWSjCdzcGFuJ+S4pOenjVxuKiBAcGFyYW0ge1N0cmluZ30gbm9kZVR5cGUgYeagh+etvueahOeKtuaAgeexu+Wei++8jOWMheaLrCdudW0n44CBJ3ByZXYn44CBJ25leHQn44CBJ2ZpcnN0J+WSjCdsYXN0J1xuKiBAcGFyYW0ge1N0cmluZ30gdGV4dCDlhYPku7blhoXnmoTmlofmnKzlhoXlrrlcbiogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSDlhYPku7bnsbvlkI1cbiogQHBhcmFtIHtOdW1iZXJ9IGN1cnJlbnRUZXh0IOagh+etvuS7o+ihqOeahOmhteeggeWAvO+8iOS7jjHlvIDlp4vvvIlcbipcbiogQHJldHVybiB7Tm9kZX0gRE9N6IqC54K5XG4qL1xuUGFnZVNldC5wcm90b3R5cGUuY3JlYXRlUGFnZUl0ZW0gPSBmdW5jdGlvbih7bm9kZU5hbWUsIG5vZGVUeXBlLCB0ZXh0LCBjbGFzc05hbWUsIGN1cnJlbnRUZXh0fSkge1xuXG4gICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGlmIChub2RlTmFtZSA9PT0gJ2EnKSB7XG4gICAgICAgIHN3aXRjaCAobm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBVGFnKGl0ZW0sIHRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdwcmV2JzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgY3VycmVudFRleHQgLSAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBVGFnKGl0ZW0sIGN1cnJlbnRUZXh0ICsgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2ZpcnN0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xhc3QnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QVRhZyhpdGVtLCB0aGlzLnRvdGFsX3BhZ2VzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IHRoaXMuY29uZmlnLnN0eWxlX3ByZWZpeCArICdfJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gICAgaXRlbS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4qIOiuvue9rmHmoIfnrb5cbipcbiogQCBwYXJhbSB7Tm9kZX0gYeagh+etvuiKgueCuVxuKiBAIHBhcmFtIHtOdW1iZXJ9IOmhteeggeWAvO+8iOS7jjHlvIDlp4vvvIlcbipcbiogQHJldHVybiB7Tm9kZX0gYeagh+etvuiKgueCuVxuKi9cblBhZ2VTZXQucHJvdG90eXBlLnNldEFUYWcgPSBmdW5jdGlvbihpdGVtLCBudW1UZXh0KSB7XG4gICAgbGV0IGxpbmtOdW0gPSBudW1UZXh0IC0gdGhpcy5vZmZzZXRJbmRleDtcbiAgICBpdGVtLmhyZWYgPSByZXBsYWNlKHRoaXMuY29uZmlnLmxpbmtfdG8sIGxpbmtOdW0pO1xuICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLW51bScsIGxpbmtOdW0pO1xuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4qIOagueaNruW9k+WJjeeCueWHu+eahOmhteeggeWAvOa4suafk+mhteeggee7hOS7tlxuKlxuKiBAcGFyYW0ge1N0cmluZ30g5b2T5YmN54K55Ye755qE6aG156CB5YC877yI5LuOdGhpcy5jb25maWcucGFnZV9pbmRleOW8gOWni++8iVxuKi9cblBhZ2VTZXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGN1cnJlbnQpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLmN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50KTtcbiAgICBsZXQgY3VycmVudFRleHQgPSB0aGlzLmN1cnJlbnQgKyB0aGlzLm9mZnNldEluZGV4OyBcblxuICAgIGxldCBwcmV2SXRlbSA9IG51bGw7XG4gICAgaWYgKGN1cnJlbnRUZXh0ID09PSAxKSB7XG4gICAgICAgIHByZXZJdGVtID0gdGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5wcmV2X3RleHQsXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLCBcbiAgICAgICAgICAgIG5vZGVUeXBlOiAncHJldicsIFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGlzYWJsZV9wcmV2J1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2SXRlbSA9IHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcucHJldl90ZXh0LCBcbiAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsIFxuICAgICAgICAgICAgbm9kZVR5cGU6ICdwcmV2JyxcbiAgICAgICAgICAgIGN1cnJlbnRUZXh0OiBjdXJyZW50VGV4dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2SXRlbSk7XG5cbiAgICBpZiAoY3VycmVudFRleHQgPCB0aGlzLmNvbmZpZy5udW1fcGFnZXMpIHsgXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMuY29uZmlnLm51bV9wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gY3VycmVudFRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaSwgXG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsIFxuICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogJ251bSd9KVxuICAgICAgICAgICAgICAgICk7ICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGN1cnJlbnRUZXh0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnc3BhbicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2N1cnJlbnQnfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPCAodGhpcy50b3RhbF9wYWdlcyAtIDEpIHx8IFxuICAgICAgICAgICAgIXRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPCB0aGlzLnRvdGFsX3BhZ2VzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmVsbGlwc2VfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJywgXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZWxsaXBzZSd9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5sYXN0X3RleHQgJiYgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcubGFzdF90ZXh0LnJlcGxhY2UoL3t7Lip9fS8sIHRoaXMudG90YWxfcGFnZXMpLCAvL+WmguaenOiuvue9ruS6huWImeS4jeS8muabv+aNolxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdsYXN0J30pXG4gICAgICAgICAgICApOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSBlbHNlIHsgXG4gICAgICAgIGxldCBydEVkZ2UgPSBNYXRoLmZsb29yKCh0aGlzLmNvbmZpZy5udW1fcGFnZXMgLSAxKSAvIDIpO1xuICAgICAgICB3aGlsZSAoY3VycmVudFRleHQgKyBydEVkZ2UgPiB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgICAgICBydEVkZ2UtLTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbHRFZGdlID0gdGhpcy5jb25maWcubnVtX3BhZ2VzIC0gMSAtIHJ0RWRnZTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcubnVtX3BhZ2VzICE9IHRoaXMudG90YWxfcGFnZXMpIHtcblxuICAgICAgICAgICAgdGhpcy5jb25maWcuZmlyc3RfdGV4dCAmJiB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHsgXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcuZmlyc3RfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdhJyxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogJ2ZpcnN0J30pKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRUZXh0IC0gbHRFZGdlID4gMikgeyBcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcuZWxsaXBzZV90ZXh0LCBcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZWxsaXBzZSd9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAobHRFZGdlKSB7IFxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogY3VycmVudCAtIGx0RWRnZSwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdhJyxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogJ251bSd9KSk7XG4gICAgICAgICAgICBsdEVkZ2UtLTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHsgXG4gICAgICAgICAgICB0ZXh0OiBjdXJyZW50VGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY3VycmVudCd9KSk7XG5cbiAgICAgICAgbGV0IHJ0Q291bnQgPSAxO1xuICAgICAgICB3aGlsZSAocnRDb3VudCA8PSBydEVkZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oeyBcbiAgICAgICAgICAgICAgICB0ZXh0OiBjdXJyZW50VGV4dCArIHJ0Q291bnQsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nfSkpO1xuICAgICAgICAgICAgcnRDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJ0Q291bnQgKyBjdXJyZW50VGV4dCA8IHRoaXMudG90YWxfcGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmVsbGlwc2VfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdlbGxpcHNlJ30pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiAocnRDb3VudCAtIDEgKyBjdXJyZW50VGV4dCA8IHRoaXMudG90YWxfcGFnZXMpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5sYXN0X3RleHQucmVwbGFjZSgve3suKn19LywgdGhpcy50b3RhbF9wYWdlcyksIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdsYXN0J30pXG4gICAgICAgICAgICApOyAgICAgICAgICAgICAgXG4gICAgICAgIH0gXG4gICAgfVxuICAgXG4gICAgbGV0IG5leHRJdGVtID0gbnVsbDtcbiAgICBpZiAoY3VycmVudFRleHQgPT09IHRoaXMudG90YWxfcGFnZXMpIHtcbiAgICAgICAgbmV4dEl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5leHRfdGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLCBcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rpc2FibGVfbmV4dCd9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dEl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5leHRfdGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ2EnLFxuICAgICAgICAgICAgbm9kZVR5cGU6ICduZXh0JyxcbiAgICAgICAgICAgIGN1cnJlbnRUZXh0OiBjdXJyZW50VGV4dH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dEl0ZW0pO1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuYWRkRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICBhZGRFdmVudCh0aGlzLmNvbnRhaW5lciwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGUgPSBnZXRFdmVudChldmVudCk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG5cbiAgICAgICAgaWYgKHRhcmdldC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnQScpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbnVtJyk7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhlLCBpbmRleCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcihpbmRleCk7XG4gICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgfS5iaW5kKHRoaXMpKTsgICBcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmdldFN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvdGFsX3BhZ2VzOiB0aGlzLnRvdGFsX3BhZ2VzLFxuICAgICAgICB0b3RhbF9pdGVtczogdGhpcy5jb25maWcudG90YWxfaXRlbXMsXG4gICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCBcbiAgICB9O1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuZ28gPSBmdW5jdGlvbihpbmRleCkge1xuICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpO1xuICAgIGlmIChpbmRleCA8IDEgfHwgaW5kZXggPiB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoaW5kZXggLSB0aGlzLm9mZnNldEluZGV4KTtcbiAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhldmVudCwgaW5kZXggLSB0aGlzLm9mZnNldEluZGV4KTtcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmdvUHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyB0aGlzLm9mZnNldEluZGV4ID09PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIodGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5jb25maWcuY2FsbGJhY2soZXZlbnQsIHRoaXMuY3VycmVudCk7XG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgdGhpcy5vZmZzZXRJbmRleCA9PT0gdGhpcy50b3RhbF9wYWdlcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKHRoaXMuY3VycmVudCArIDEpO1xuICAgIHRoaXMuY29uZmlnLmNhbGxiYWNrKGV2ZW50LCB0aGlzLmN1cnJlbnQpOyAgICBcbn07XG5cbmZ1bmN0aW9uIGNoZWNrT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKCEvXlsxLTldXFxkKiQvLnRlc3Qob3B0aW9ucy50b3RhbF9pdGVtcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgncGFnZV9pbmRleCcgaW4gb3B0aW9ucyAmJiAhL15bMDFdJC8udGVzdChvcHRpb25zLnBhZ2VfaW5kZXgpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLnBhZ2VfaW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKCdpdGVtc19wZXJfcGFnZScgaW4gb3B0aW9ucyAmJiAoIS9eWzEtOV1cXGQqJC8udGVzdChvcHRpb25zLml0ZW1zX3Blcl9wYWdlKSB8fCBvcHRpb25zLml0ZW1zX3Blcl9wYWdlID4gb3B0aW9ucy50b3RhbF9pdGVtcykpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuaXRlbXNfcGVyX3BhZ2U7XG4gICAgfVxuXG4gICAgaWYgKCdudW1fcGFnZXMnIGluIG9wdGlvbnMgJiYgIS9eWzEtOV1cXGQqJC8udGVzdChvcHRpb25zLm51bV9wYWdlcykpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMubnVtX3BhZ2VzO1xuICAgIH1cblxuICAgIGlmICgnY3VycmVudCcgaW4gb3B0aW9ucyAmJiAhL15bMS05XVxcZCokLy50ZXN0KG9wdGlvbnMuY3VycmVudCkpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuY3VycmVudDtcbiAgICB9XG5cbiAgICBpZiAoJ2xvYWRfZmlyc3RfcGFnZScgaW4gb3B0aW9ucyAmJiAhL14odHJ1ZSkkfCBeKGZsYXNlKSQvLnRlc3Qob3B0aW9ucy5sb2FkX2ZpcnN0X3BhZ2UpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmxvYWRfZmlyc3RfcGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gcGFnaW5hdGlvbihjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gY2hlY2tPcHRpb25zKG9wdGlvbnMpO1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwYWdlID0gbmV3IFBhZ2VTZXQoY29udGFpbmVyLCBvcHRpb25zKTtcbiAgICBwYWdlLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3BhZ2UuY29uZmlnLnN0eWxlX3ByZWZpeH1gO1xuICAgIHBhZ2UucmVuZGVyKHBhZ2UuY29uZmlnLmN1cnJlbnQpO1xuXG4gICAgaWYgKHBhZ2UuY29uZmlnLmxvYWRfZmlyc3RfcGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICBwYWdlLmNvbmZpZy5jYWxsYmFjayhldmVudCwgcGFnZS5jb25maWcucGFnZV9pbmRleCk7XG4gICAgfVxuXG4gICAgcGFnZS5hZGRFdmVudEhhbmRsZXIoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0YXR1czogcGFnZS5nZXRTdGF0dXMuYmluZChwYWdlKSxcbiAgICAgICAgZ286IHBhZ2UuZ28uYmluZChwYWdlKSxcbiAgICAgICAgZ29QcmV2OiBwYWdlLmdvUHJldi5iaW5kKHBhZ2UpLFxuICAgICAgICBnb05leHQ6IHBhZ2UuZ29OZXh0LmJpbmQocGFnZSlcbiAgICB9OyAgXG59XG5leHBvcnQgZGVmYXVsdCBwYWdpbmF0aW9uOyJdfQ==