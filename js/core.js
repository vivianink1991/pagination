define(['exports', './event', './util'], function (exports, _event, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


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
        this.offsetIndex = Math.abs(this.config.page_index - 1); //页码文本=current + offsetIndex
    }

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

    PageSet.prototype.setATag = function (item, numText) {
        var linkNum = numText - this.offsetIndex;
        item.href = (0, _util.replace)(this.config.link_to, linkNum);
        item.setAttribute('data-num', linkNum);
        return item;
    };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzbmV4dC9jb3JlLmpzIl0sIm5hbWVzIjpbIlBhZ2VTZXQiLCJjb250YWluZXIiLCJvcHRpb25zIiwiY29uZmlnIiwiaXRlbXNfcGVyX3BhZ2UiLCJjdXJyZW50IiwicGFnZV9pbmRleCIsIm51bV9wYWdlcyIsImZpcnN0X3RleHQiLCJsYXN0X3RleHQiLCJlbGxpcHNlX3RleHQiLCJwcmV2X3RleHQiLCJuZXh0X3RleHQiLCJsaW5rX3RvIiwiY2FsbGJhY2siLCJldmVudCIsImluZGV4IiwibG9hZF9maXJzdF9wYWdlIiwic3R5bGVfcHJlZml4IiwidG90YWxfcGFnZXMiLCJNYXRoIiwiY2VpbCIsInRvdGFsX2l0ZW1zIiwib2Zmc2V0SW5kZXgiLCJhYnMiLCJwcm90b3R5cGUiLCJjcmVhdGVQYWdlSXRlbSIsIm5vZGVOYW1lIiwibm9kZVR5cGUiLCJ0ZXh0IiwiY2xhc3NOYW1lIiwiY3VycmVudFRleHQiLCJpdGVtIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QVRhZyIsImlubmVySFRNTCIsIm51bVRleHQiLCJsaW5rTnVtIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInJlbmRlciIsInBhcnNlSW50IiwicHJldkl0ZW0iLCJhcHBlbmRDaGlsZCIsImkiLCJyZXBsYWNlIiwicnRFZGdlIiwiZmxvb3IiLCJsdEVkZ2UiLCJydENvdW50IiwibmV4dEl0ZW0iLCJhZGRFdmVudEhhbmRsZXIiLCJlIiwidGFyZ2V0IiwidG9VcHBlckNhc2UiLCJnZXRBdHRyaWJ1dGUiLCJiaW5kIiwiZ2V0U3RhdHVzIiwiZ28iLCJnb1ByZXYiLCJnb05leHQiLCJjaGVja09wdGlvbnMiLCJ0ZXN0IiwicGFnaW5hdGlvbiIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBR0EsYUFBU0EsT0FBVCxDQUFpQkMsU0FBakIsRUFBNEJDLE9BQTVCLEVBQXFDOztBQUVqQyxhQUFLRCxTQUFMLEdBQWlCQSxTQUFqQjs7QUFFQSxhQUFLRSxNQUFMLEdBQWMsa0JB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QVosQ0FBaUJRLElBQWpCO0FBSkwsU0FBUDtBQU1IO3NCQUNjRCxVIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FkZEV2ZW50LCBnZXRFdmVudCwgZ2V0VGFyZ2V0LCBwcmV2ZW50RGVmYXVsdH0gZnJvbSAnLi9ldmVudCc7XG5pbXBvcnQge2V4dGVuZCwgcmVwbGFjZX0gZnJvbSAnLi91dGlsJztcblxuZnVuY3Rpb24gUGFnZVNldChjb250YWluZXIsIG9wdGlvbnMpIHtcblxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyOyBcblxuICAgIHRoaXMuY29uZmlnID0gZXh0ZW5kKHtcbiAgICAgICAgaXRlbXNfcGVyX3BhZ2U6IDEwLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICBwYWdlX2luZGV4OiAxLFxuICAgICAgICBudW1fcGFnZXM6IDUsXG4gICAgICAgIGZpcnN0X3RleHQ6ICcxJyxcbiAgICAgICAgbGFzdF90ZXh0OiAne3t0b3RhbF9wYWdlc319JyxcbiAgICAgICAgZWxsaXBzZV90ZXh0OiAnLi4uJyxcbiAgICAgICAgcHJldl90ZXh0OiAnJmx0JyxcbiAgICAgICAgbmV4dF90ZXh0OiAnJmd0JyxcbiAgICAgICAgbGlua190bzogJyNwYWdlPXt7cGFnZV9udW19fScsXG4gICAgICAgIGNhbGxiYWNrOiAoZXZlbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRfZmlyc3RfcGFnZTogZmFsc2UsXG4gICAgICAgIHN0eWxlX3ByZWZpeDogJ3BhZ2luYXRpb24nXG4gICAgfSwgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnRvdGFsX3BhZ2VzID0gTWF0aC5jZWlsKHRoaXMuY29uZmlnLnRvdGFsX2l0ZW1zIC8gdGhpcy5jb25maWcuaXRlbXNfcGVyX3BhZ2UpO1xuICAgIHRoaXMuY29uZmlnLm51bV9wYWdlcyA9IHRoaXMuY29uZmlnLm51bV9wYWdlcyA+IHRoaXMudG90YWxfcGFnZXMgPyB0aGlzLnRvdGFsX3BhZ2VzIDogdGhpcy5jb25maWcubnVtX3BhZ2VzO1xuICAgIHRoaXMuY29uZmlnLmN1cnJlbnQgPSB0aGlzLmNvbmZpZy5jdXJyZW50ID4gdGhpcy50b3RhbF9wYWdlcyA/IHRoaXMudG90YWxfcGFnZXMgOiB0aGlzLmNvbmZpZy5jdXJyZW50O1xuICAgIHRoaXMub2Zmc2V0SW5kZXggPSBNYXRoLmFicyh0aGlzLmNvbmZpZy5wYWdlX2luZGV4IC0gMSk7IC8v6aG156CB5paH5pysPWN1cnJlbnQgKyBvZmZzZXRJbmRleFxufVxuXG5QYWdlU2V0LnByb3RvdHlwZS5jcmVhdGVQYWdlSXRlbSA9IGZ1bmN0aW9uKHtub2RlTmFtZSwgbm9kZVR5cGUsIHRleHQsIGNsYXNzTmFtZSwgY3VycmVudFRleHR9KSB7XG5cbiAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgaWYgKG5vZGVOYW1lID09PSAnYScpIHtcbiAgICAgICAgc3dpdGNoIChub2RlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbnVtJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgdGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ByZXYnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QVRhZyhpdGVtLCBjdXJyZW50VGV4dCAtIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgY3VycmVudFRleHQgKyAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QVRhZyhpdGVtLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBVGFnKGl0ZW0sIHRoaXMudG90YWxfcGFnZXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gdGhpcy5jb25maWcuc3R5bGVfcHJlZml4ICsgJ18nICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgICBpdGVtLmlubmVySFRNTCA9IHRleHQ7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5zZXRBVGFnID0gZnVuY3Rpb24oaXRlbSwgbnVtVGV4dCkge1xuICAgIGxldCBsaW5rTnVtID0gbnVtVGV4dCAtIHRoaXMub2Zmc2V0SW5kZXg7XG4gICAgaXRlbS5ocmVmID0gcmVwbGFjZSh0aGlzLmNvbmZpZy5saW5rX3RvLCBsaW5rTnVtKTtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1udW0nLCBsaW5rTnVtKTtcbiAgICByZXR1cm4gaXRlbTtcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGN1cnJlbnQpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLmN1cnJlbnQgPSBwYXJzZUludChjdXJyZW50KTtcbiAgICBsZXQgY3VycmVudFRleHQgPSB0aGlzLmN1cnJlbnQgKyB0aGlzLm9mZnNldEluZGV4OyBcblxuICAgIGxldCBwcmV2SXRlbSA9IG51bGw7XG4gICAgaWYgKGN1cnJlbnRUZXh0ID09PSAxKSB7XG4gICAgICAgIHByZXZJdGVtID0gdGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5wcmV2X3RleHQsXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLCBcbiAgICAgICAgICAgIG5vZGVUeXBlOiAncHJldicsIFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGlzYWJsZV9wcmV2J1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2SXRlbSA9IHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcucHJldl90ZXh0LCBcbiAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsIFxuICAgICAgICAgICAgbm9kZVR5cGU6ICdwcmV2JyxcbiAgICAgICAgICAgIGN1cnJlbnRUZXh0OiBjdXJyZW50VGV4dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2SXRlbSk7XG5cbiAgICBpZiAoY3VycmVudFRleHQgPCB0aGlzLmNvbmZpZy5udW1fcGFnZXMpIHsgXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMuY29uZmlnLm51bV9wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gY3VycmVudFRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaSwgXG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsIFxuICAgICAgICAgICAgICAgICAgICBub2RlVHlwZTogJ251bSd9KVxuICAgICAgICAgICAgICAgICk7ICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGN1cnJlbnRUZXh0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnc3BhbicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2N1cnJlbnQnfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPCAodGhpcy50b3RhbF9wYWdlcyAtIDEpIHx8IFxuICAgICAgICAgICAgIXRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPCB0aGlzLnRvdGFsX3BhZ2VzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmVsbGlwc2VfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJywgXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZWxsaXBzZSd9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5sYXN0X3RleHQgJiYgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcubGFzdF90ZXh0LnJlcGxhY2UoL3t7Lip9fS8sIHRoaXMudG90YWxfcGFnZXMpLCAvL+WmguaenOiuvue9ruS6huWImeS4jeS8muabv+aNolxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdsYXN0J30pXG4gICAgICAgICAgICApOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSBlbHNlIHsgXG4gICAgICAgIGxldCBydEVkZ2UgPSBNYXRoLmZsb29yKCh0aGlzLmNvbmZpZy5udW1fcGFnZXMgLSAxKSAvIDIpO1xuICAgICAgICB3aGlsZSAoY3VycmVudFRleHQgKyBydEVkZ2UgPiB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgICAgICBydEVkZ2UtLTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbHRFZGdlID0gdGhpcy5jb25maWcubnVtX3BhZ2VzIC0gMSAtIHJ0RWRnZTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcubnVtX3BhZ2VzICE9IHRoaXMudG90YWxfcGFnZXMpIHtcblxuICAgICAgICAgICAgdGhpcy5jb25maWcuZmlyc3RfdGV4dCAmJiB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHsgXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcuZmlyc3RfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdhJyxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogJ2ZpcnN0J30pKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRUZXh0IC0gbHRFZGdlID4gMikgeyBcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcuZWxsaXBzZV90ZXh0LCBcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZWxsaXBzZSd9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAobHRFZGdlKSB7IFxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogY3VycmVudCAtIGx0RWRnZSwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdhJyxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogJ251bSd9KSk7XG4gICAgICAgICAgICBsdEVkZ2UtLTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHsgXG4gICAgICAgICAgICB0ZXh0OiBjdXJyZW50VGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY3VycmVudCd9KSk7XG5cbiAgICAgICAgbGV0IHJ0Q291bnQgPSAxO1xuICAgICAgICB3aGlsZSAocnRDb3VudCA8PSBydEVkZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oeyBcbiAgICAgICAgICAgICAgICB0ZXh0OiBjdXJyZW50VGV4dCArIHJ0Q291bnQsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nfSkpO1xuICAgICAgICAgICAgcnRDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJ0Q291bnQgKyBjdXJyZW50VGV4dCA8IHRoaXMudG90YWxfcGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmVsbGlwc2VfdGV4dCwgXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdlbGxpcHNlJ30pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxhc3RfdGV4dCAmJiAocnRDb3VudCAtIDEgKyBjdXJyZW50VGV4dCA8IHRoaXMudG90YWxfcGFnZXMpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5sYXN0X3RleHQucmVwbGFjZSgve3suKn19LywgdGhpcy50b3RhbF9wYWdlcyksIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdsYXN0J30pXG4gICAgICAgICAgICApOyAgICAgICAgICAgICAgXG4gICAgICAgIH0gXG4gICAgfVxuICAgXG4gICAgbGV0IG5leHRJdGVtID0gbnVsbDtcbiAgICBpZiAoY3VycmVudFRleHQgPT09IHRoaXMudG90YWxfcGFnZXMpIHtcbiAgICAgICAgbmV4dEl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5leHRfdGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLCBcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rpc2FibGVfbmV4dCd9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dEl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5leHRfdGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ2EnLFxuICAgICAgICAgICAgbm9kZVR5cGU6ICduZXh0JyxcbiAgICAgICAgICAgIGN1cnJlbnRUZXh0OiBjdXJyZW50VGV4dH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dEl0ZW0pO1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuYWRkRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICBhZGRFdmVudCh0aGlzLmNvbnRhaW5lciwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGUgPSBnZXRFdmVudChldmVudCk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG5cbiAgICAgICAgaWYgKHRhcmdldC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnQScpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbnVtJyk7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhlLCBpbmRleCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcihpbmRleCk7XG4gICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgfS5iaW5kKHRoaXMpKTsgICBcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmdldFN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvdGFsX3BhZ2VzOiB0aGlzLnRvdGFsX3BhZ2VzLFxuICAgICAgICB0b3RhbF9pdGVtczogdGhpcy5jb25maWcudG90YWxfaXRlbXMsXG4gICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCBcbiAgICB9O1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuZ28gPSBmdW5jdGlvbihpbmRleCkge1xuICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpO1xuICAgIGlmIChpbmRleCA8IDEgfHwgaW5kZXggPiB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoaW5kZXggLSB0aGlzLm9mZnNldEluZGV4KTtcbiAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhldmVudCwgaW5kZXggLSB0aGlzLm9mZnNldEluZGV4KTtcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmdvUHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyB0aGlzLm9mZnNldEluZGV4ID09PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIodGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5jb25maWcuY2FsbGJhY2soZXZlbnQsIHRoaXMuY3VycmVudCk7XG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgdGhpcy5vZmZzZXRJbmRleCA9PT0gdGhpcy50b3RhbF9wYWdlcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKHRoaXMuY3VycmVudCArIDEpO1xuICAgIHRoaXMuY29uZmlnLmNhbGxiYWNrKGV2ZW50LCB0aGlzLmN1cnJlbnQpOyAgICBcbn07XG5cbmZ1bmN0aW9uIGNoZWNrT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKCEvXlsxLTldXFxkKiQvLnRlc3Qob3B0aW9ucy50b3RhbF9pdGVtcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgncGFnZV9pbmRleCcgaW4gb3B0aW9ucyAmJiAhL15bMDFdJC8udGVzdChvcHRpb25zLnBhZ2VfaW5kZXgpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLnBhZ2VfaW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKCdpdGVtc19wZXJfcGFnZScgaW4gb3B0aW9ucyAmJiAoIS9eWzEtOV1cXGQqJC8udGVzdChvcHRpb25zLml0ZW1zX3Blcl9wYWdlKSB8fCBvcHRpb25zLml0ZW1zX3Blcl9wYWdlID4gb3B0aW9ucy50b3RhbF9pdGVtcykpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuaXRlbXNfcGVyX3BhZ2U7XG4gICAgfVxuXG4gICAgaWYgKCdudW1fcGFnZXMnIGluIG9wdGlvbnMgJiYgIS9eWzEtOV1cXGQqJC8udGVzdChvcHRpb25zLm51bV9wYWdlcykpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMubnVtX3BhZ2VzO1xuICAgIH1cblxuICAgIGlmICgnY3VycmVudCcgaW4gb3B0aW9ucyAmJiAhL15bMS05XVxcZCokLy50ZXN0KG9wdGlvbnMuY3VycmVudCkpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuY3VycmVudDtcbiAgICB9XG5cbiAgICBpZiAoJ2xvYWRfZmlyc3RfcGFnZScgaW4gb3B0aW9ucyAmJiAhL14odHJ1ZSkkfCBeKGZsYXNlKSQvLnRlc3Qob3B0aW9ucy5sb2FkX2ZpcnN0X3BhZ2UpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmxvYWRfZmlyc3RfcGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gcGFnaW5hdGlvbihjb250YWluZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gY2hlY2tPcHRpb25zKG9wdGlvbnMpO1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwYWdlID0gbmV3IFBhZ2VTZXQoY29udGFpbmVyLCBvcHRpb25zKTtcbiAgICBwYWdlLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3BhZ2UuY29uZmlnLnN0eWxlX3ByZWZpeH1gO1xuICAgIHBhZ2UucmVuZGVyKHBhZ2UuY29uZmlnLmN1cnJlbnQpO1xuXG4gICAgaWYgKHBhZ2UuY29uZmlnLmxvYWRfZmlyc3RfcGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICBwYWdlLmNvbmZpZy5jYWxsYmFjayhldmVudCwgcGFnZS5jb25maWcucGFnZV9pbmRleCk7XG4gICAgfVxuXG4gICAgcGFnZS5hZGRFdmVudEhhbmRsZXIoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0YXR1czogcGFnZS5nZXRTdGF0dXMuYmluZChwYWdlKSxcbiAgICAgICAgZ286IHBhZ2UuZ28uYmluZChwYWdlKSxcbiAgICAgICAgZ29QcmV2OiBwYWdlLmdvUHJldi5iaW5kKHBhZ2UpLFxuICAgICAgICBnb05leHQ6IHBhZ2UuZ29OZXh0LmJpbmQocGFnZSlcbiAgICB9OyAgXG59XG5leHBvcnQgZGVmYXVsdCBwYWdpbmF0aW9uOyJdfQ==