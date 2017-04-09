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
                if (i === currentText) {
                    this.container.appendChild(this.createPageItem({
                        text: currentText,
                        nodeName: 'span',
                        nodeType: 'num',
                        className: 'current' }));
                } else {
                    this.container.appendChild(this.createPageItem({
                        text: i,
                        nodeName: 'a',
                        nodeType: 'num' }));
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
        if (index < 1 || index > this.total_pages) {
            return;
        }
        this.render(index - this.offSetIndex);
        this.config.callback(event, index - this.offSetIndex);
    };

    PageSet.prototype.goPrev = function () {
        if (this.current + this.offSetIndex === 1) {
            return;
        }
        this.render(this.current - 1);
        this.config.callback(event, this.current);
    };

    PageSet.prototype.goNext = function () {
        if (this.current + this.offSetIndex === this.total_pages) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzbmV4dC9jb3JlLmpzIl0sIm5hbWVzIjpbIlBhZ2VTZXQiLCJjb250YWluZXIiLCJvcHRpb25zIiwiY29uZmlnIiwiaXRlbXNfcGVyX3BhZ2UiLCJjdXJyZW50IiwicGFnZV9pbmRleCIsIm51bV9wYWdlcyIsImZpcnN0X3RleHQiLCJsYXN0X3RleHQiLCJlbGxpcHNlX3RleHQiLCJwcmV2X3RleHQiLCJuZXh0X3RleHQiLCJsaW5rX3RvIiwiY2FsbGJhY2siLCJldmVudCIsImluZGV4IiwibG9hZF9maXJzdF9wYWdlIiwic3R5bGVfcHJlZml4IiwidG90YWxfcGFnZXMiLCJNYXRoIiwiY2VpbCIsInRvdGFsX2l0ZW1zIiwib2Zmc2V0SW5kZXgiLCJhYnMiLCJwcm90b3R5cGUiLCJjcmVhdGVQYWdlSXRlbSIsIm5vZGVOYW1lIiwibm9kZVR5cGUiLCJ0ZXh0IiwiY2xhc3NOYW1lIiwiY3VycmVudFRleHQiLCJpdGVtIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QVRhZyIsImlubmVySFRNTCIsIm51bVRleHQiLCJsaW5rTnVtIiwiaHJlZiIsInNldEF0dHJpYnV0ZSIsInJlbmRlciIsInBhcnNlSW50IiwicHJldkl0ZW0iLCJhcHBlbmRDaGlsZCIsImkiLCJyZXBsYWNlIiwicnRFZGdlIiwiZmxvb3IiLCJsdEVkZ2UiLCJydENvdW50IiwibmV4dEl0ZW0iLCJhZGRFdmVudEhhbmRsZXIiLCJlIiwidGFyZ2V0IiwidG9VcHBlckNhc2UiLCJnZXRBdHRyaWJ1dGUiLCJiaW5kIiwiZ2V0U3RhdHVzIiwiZ28iLCJvZmZTZXRJbmRleCIsImdvUHJldiIsImdvTmV4dCIsImNoZWNrT3B0aW9ucyIsInRlc3QiLCJwYWdpbmF0aW9uIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQSxhQUFTQSxPQUFULENBQWlCQyxTQUFqQixFQUE0QkMsT0FBNUIsRUFBcUM7O0FBRWpDLGFBQUtELFNBQUwsR0FBaUJBLFNBQWpCOztBQUVBLGFBQUtF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QjtBQUpMLFNBQVA7QUFNSDtzQkFDY0QsVSIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthZGRFdmVudCwgZ2V0RXZlbnQsIGdldFRhcmdldCwgcHJldmVudERlZmF1bHR9IGZyb20gJy4vZXZlbnQnO1xuaW1wb3J0IHtleHRlbmQsIHJlcGxhY2V9IGZyb20gJy4vdXRpbCc7XG5cbmZ1bmN0aW9uIFBhZ2VTZXQoY29udGFpbmVyLCBvcHRpb25zKSB7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjsgXG5cbiAgICB0aGlzLmNvbmZpZyA9IGV4dGVuZCh7XG4gICAgICAgIGl0ZW1zX3Blcl9wYWdlOiAxMCxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgcGFnZV9pbmRleDogMSxcbiAgICAgICAgbnVtX3BhZ2VzOiA1LFxuICAgICAgICBmaXJzdF90ZXh0OiAnMScsXG4gICAgICAgIGxhc3RfdGV4dDogJ3t7dG90YWxfcGFnZXN9fScsXG4gICAgICAgIGVsbGlwc2VfdGV4dDogJy4uLicsXG4gICAgICAgIHByZXZfdGV4dDogJyZsdCcsXG4gICAgICAgIG5leHRfdGV4dDogJyZndCcsXG4gICAgICAgIGxpbmtfdG86ICcjcGFnZT17e3BhZ2VfbnVtfX0nLFxuICAgICAgICBjYWxsYmFjazogKGV2ZW50LCBpbmRleCkgPT4ge1xuICAgICAgICB9LFxuICAgICAgICBsb2FkX2ZpcnN0X3BhZ2U6IGZhbHNlLFxuICAgICAgICBzdHlsZV9wcmVmaXg6ICdwYWdpbmF0aW9uJ1xuICAgIH0sIG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy50b3RhbF9wYWdlcyA9IE1hdGguY2VpbCh0aGlzLmNvbmZpZy50b3RhbF9pdGVtcyAvIHRoaXMuY29uZmlnLml0ZW1zX3Blcl9wYWdlKTtcbiAgICB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPSB0aGlzLmNvbmZpZy5udW1fcGFnZXMgPiB0aGlzLnRvdGFsX3BhZ2VzID8gdGhpcy50b3RhbF9wYWdlcyA6IHRoaXMuY29uZmlnLm51bV9wYWdlcztcbiAgICB0aGlzLmNvbmZpZy5jdXJyZW50ID0gdGhpcy5jb25maWcuY3VycmVudCA+IHRoaXMudG90YWxfcGFnZXMgPyB0aGlzLnRvdGFsX3BhZ2VzIDogdGhpcy5jb25maWcuY3VycmVudDtcbiAgICB0aGlzLm9mZnNldEluZGV4ID0gTWF0aC5hYnModGhpcy5jb25maWcucGFnZV9pbmRleCAtIDEpOyAvL+mhteeggeaWh+acrD1jdXJyZW50ICsgb2Zmc2V0SW5kZXhcbn1cblxuUGFnZVNldC5wcm90b3R5cGUuY3JlYXRlUGFnZUl0ZW0gPSBmdW5jdGlvbih7bm9kZU5hbWUsIG5vZGVUeXBlLCB0ZXh0LCBjbGFzc05hbWUsIGN1cnJlbnRUZXh0fSkge1xuXG4gICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGlmIChub2RlTmFtZSA9PT0gJ2EnKSB7XG4gICAgICAgIHN3aXRjaCAobm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ251bSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBVGFnKGl0ZW0sIHRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdwcmV2JzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgY3VycmVudFRleHQgLSAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBVGFnKGl0ZW0sIGN1cnJlbnRUZXh0ICsgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2ZpcnN0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFUYWcoaXRlbSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xhc3QnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QVRhZyhpdGVtLCB0aGlzLnRvdGFsX3BhZ2VzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IHRoaXMuY29uZmlnLnN0eWxlX3ByZWZpeCArICdfJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gICAgaXRlbS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIHJldHVybiBpdGVtO1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuc2V0QVRhZyA9IGZ1bmN0aW9uKGl0ZW0sIG51bVRleHQpIHtcbiAgICBsZXQgbGlua051bSA9IG51bVRleHQgLSB0aGlzLm9mZnNldEluZGV4O1xuICAgIGl0ZW0uaHJlZiA9IHJlcGxhY2UodGhpcy5jb25maWcubGlua190bywgbGlua051bSk7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbnVtJywgbGlua051bSk7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjdXJyZW50KSB7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5jdXJyZW50ID0gcGFyc2VJbnQoY3VycmVudCk7XG4gICAgbGV0IGN1cnJlbnRUZXh0ID0gdGhpcy5jdXJyZW50ICsgdGhpcy5vZmZzZXRJbmRleDsgXG5cbiAgICBsZXQgcHJldkl0ZW0gPSBudWxsO1xuICAgIGlmIChjdXJyZW50VGV4dCA9PT0gMSkge1xuICAgICAgICBwcmV2SXRlbSA9IHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcucHJldl90ZXh0LFxuICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJywgXG4gICAgICAgICAgICBub2RlVHlwZTogJ3ByZXYnLCBcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Rpc2FibGVfcHJldidcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJldkl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLnByZXZfdGV4dCwgXG4gICAgICAgICAgICBub2RlTmFtZTogJ2EnLCBcbiAgICAgICAgICAgIG5vZGVUeXBlOiAncHJldicsXG4gICAgICAgICAgICBjdXJyZW50VGV4dDogY3VycmVudFRleHRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHJldkl0ZW0pO1xuXG4gICAgaWYgKGN1cnJlbnRUZXh0IDwgdGhpcy5jb25maWcubnVtX3BhZ2VzKSB7IFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLmNvbmZpZy5udW1fcGFnZXM7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPT09IGN1cnJlbnRUZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjdXJyZW50VGV4dCwgXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogJ3NwYW4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAnbnVtJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjdXJyZW50J30pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGksIFxuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogJ2EnLCBcbiAgICAgICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nfSlcbiAgICAgICAgICAgICAgICApOyAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXN0X3RleHQgJiYgdGhpcy5jb25maWcubnVtX3BhZ2VzIDwgKHRoaXMudG90YWxfcGFnZXMgLSAxKSB8fCBcbiAgICAgICAgICAgICF0aGlzLmNvbmZpZy5sYXN0X3RleHQgJiYgdGhpcy5jb25maWcubnVtX3BhZ2VzIDwgdGhpcy50b3RhbF9wYWdlcykge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5lbGxpcHNlX3RleHQsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnc3BhbicsIFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2VsbGlwc2UnfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jb25maWcubGFzdF90ZXh0ICYmIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmxhc3RfdGV4dC5yZXBsYWNlKC97ey4qfX0vLCB0aGlzLnRvdGFsX3BhZ2VzKSwgLy/lpoLmnpzorr7nva7kuobliJnkuI3kvJrmm7/mjaJcbiAgICAgICAgICAgICAgICBub2RlTmFtZTogJ2EnLFxuICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAnbGFzdCd9KVxuICAgICAgICAgICAgKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7IFxuICAgICAgICBsZXQgcnRFZGdlID0gTWF0aC5mbG9vcigodGhpcy5jb25maWcubnVtX3BhZ2VzIC0gMSkgLyAyKTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRUZXh0ICsgcnRFZGdlID4gdGhpcy50b3RhbF9wYWdlcykge1xuICAgICAgICAgICAgcnRFZGdlLS07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGx0RWRnZSA9IHRoaXMuY29uZmlnLm51bV9wYWdlcyAtIDEgLSBydEVkZ2U7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm51bV9wYWdlcyAhPSB0aGlzLnRvdGFsX3BhZ2VzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmZpcnN0X3RleHQgJiYgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7IFxuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmZpcnN0X3RleHQsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdmaXJzdCd9KSk7XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50VGV4dCAtIGx0RWRnZSA+IDIpIHsgXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlnLmVsbGlwc2VfdGV4dCwgXG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2VsbGlwc2UnfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGx0RWRnZSkgeyBcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUGFnZUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IGN1cnJlbnQgLSBsdEVkZ2UsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnYScsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6ICdudW0nfSkpO1xuICAgICAgICAgICAgbHRFZGdlLS07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7IFxuICAgICAgICAgICAgdGV4dDogY3VycmVudFRleHQsIFxuICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2N1cnJlbnQnfSkpO1xuXG4gICAgICAgIGxldCBydENvdW50ID0gMTtcbiAgICAgICAgd2hpbGUgKHJ0Q291bnQgPD0gcnRFZGdlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHsgXG4gICAgICAgICAgICAgICAgdGV4dDogY3VycmVudFRleHQgKyBydENvdW50LCBcbiAgICAgICAgICAgICAgICBub2RlTmFtZTogJ2EnLFxuICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAnbnVtJ30pKTtcbiAgICAgICAgICAgIHJ0Q291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChydENvdW50ICsgY3VycmVudFRleHQgPCB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVBhZ2VJdGVtKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5lbGxpcHNlX3RleHQsIFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAnc3BhbicsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZWxsaXBzZSd9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXN0X3RleHQgJiYgKHJ0Q291bnQgLSAxICsgY3VycmVudFRleHQgPCB0aGlzLnRvdGFsX3BhZ2VzKSkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maWcubGFzdF90ZXh0LnJlcGxhY2UoL3t7Lip9fS8sIHRoaXMudG90YWxfcGFnZXMpLCBcbiAgICAgICAgICAgICAgICBub2RlTmFtZTogJ2EnLFxuICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAnbGFzdCd9KVxuICAgICAgICAgICAgKTsgICAgICAgICAgICAgIFxuICAgICAgICB9IFxuICAgIH1cbiAgIFxuICAgIGxldCBuZXh0SXRlbSA9IG51bGw7XG4gICAgaWYgKGN1cnJlbnRUZXh0ID09PSB0aGlzLnRvdGFsX3BhZ2VzKSB7XG4gICAgICAgIG5leHRJdGVtID0gdGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5uZXh0X3RleHQsIFxuICAgICAgICAgICAgbm9kZU5hbWU6ICdzcGFuJywgXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdkaXNhYmxlX25leHQnfVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRJdGVtID0gdGhpcy5jcmVhdGVQYWdlSXRlbSh7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5uZXh0X3RleHQsIFxuICAgICAgICAgICAgbm9kZU5hbWU6ICdhJyxcbiAgICAgICAgICAgIG5vZGVUeXBlOiAnbmV4dCcsXG4gICAgICAgICAgICBjdXJyZW50VGV4dDogY3VycmVudFRleHR9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKG5leHRJdGVtKTtcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmFkZEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgYWRkRXZlbnQodGhpcy5jb250YWluZXIsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBlID0gZ2V0RXZlbnQoZXZlbnQpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuXG4gICAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0EnKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW51bScpO1xuICAgICAgICAgICAgdGhpcy5jb25maWcuY2FsbGJhY2soZSwgaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoaW5kZXgpO1xuICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgIH0uYmluZCh0aGlzKSk7ICAgXG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5nZXRTdGF0dXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0b3RhbF9wYWdlczogdGhpcy50b3RhbF9wYWdlcyxcbiAgICAgICAgdG90YWxfaXRlbXM6IHRoaXMuY29uZmlnLnRvdGFsX2l0ZW1zLFxuICAgICAgICBjdXJyZW50OiB0aGlzLmN1cnJlbnQgXG4gICAgfTtcbn07XG5cblBhZ2VTZXQucHJvdG90eXBlLmdvID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCAxIHx8IGluZGV4ID4gdGhpcy50b3RhbF9wYWdlcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKGluZGV4IC0gdGhpcy5vZmZTZXRJbmRleCk7XG4gICAgdGhpcy5jb25maWcuY2FsbGJhY2soZXZlbnQsIGluZGV4IC0gdGhpcy5vZmZTZXRJbmRleCk7XG59O1xuXG5QYWdlU2V0LnByb3RvdHlwZS5nb1ByZXYgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgdGhpcy5vZmZTZXRJbmRleCA9PT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuY29uZmlnLmNhbGxiYWNrKGV2ZW50LCB0aGlzLmN1cnJlbnQpO1xufTtcblxuUGFnZVNldC5wcm90b3R5cGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIHRoaXMub2ZmU2V0SW5kZXggPT09IHRoaXMudG90YWxfcGFnZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcih0aGlzLmN1cnJlbnQgKyAxKTtcbiAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhldmVudCwgdGhpcy5jdXJyZW50KTsgICAgXG59O1xuXG5mdW5jdGlvbiBjaGVja09wdGlvbnMob3B0aW9ucykge1xuICAgIGlmICghL15bMS05XVxcZCokLy50ZXN0KG9wdGlvbnMudG90YWxfaXRlbXMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoJ3BhZ2VfaW5kZXgnIGluIG9wdGlvbnMgJiYgIS9eWzAxXSQvLnRlc3Qob3B0aW9ucy5wYWdlX2luZGV4KSkge1xuICAgICAgICBkZWxldGUgb3B0aW9ucy5wYWdlX2luZGV4O1xuICAgIH1cblxuICAgIGlmICgnaXRlbXNfcGVyX3BhZ2UnIGluIG9wdGlvbnMgJiYgKCEvXlsxLTldXFxkKiQvLnRlc3Qob3B0aW9ucy5pdGVtc19wZXJfcGFnZSkgfHwgb3B0aW9ucy5pdGVtc19wZXJfcGFnZSA+IG9wdGlvbnMudG90YWxfaXRlbXMpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLml0ZW1zX3Blcl9wYWdlO1xuICAgIH1cblxuICAgIGlmICgnbnVtX3BhZ2VzJyBpbiBvcHRpb25zICYmICEvXlsxLTldXFxkKiQvLnRlc3Qob3B0aW9ucy5udW1fcGFnZXMpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLm51bV9wYWdlcztcbiAgICB9XG5cbiAgICBpZiAoJ2N1cnJlbnQnIGluIG9wdGlvbnMgJiYgIS9eWzEtOV1cXGQqJC8udGVzdChvcHRpb25zLmN1cnJlbnQpKSB7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCdsb2FkX2ZpcnN0X3BhZ2UnIGluIG9wdGlvbnMgJiYgIS9eKHRydWUpJHwgXihmbGFzZSkkLy50ZXN0KG9wdGlvbnMubG9hZF9maXJzdF9wYWdlKSkge1xuICAgICAgICBkZWxldGUgb3B0aW9ucy5sb2FkX2ZpcnN0X3BhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHBhZ2luYXRpb24oY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGNoZWNrT3B0aW9ucyhvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgcGFnZSA9IG5ldyBQYWdlU2V0KGNvbnRhaW5lciwgb3B0aW9ucyk7XG4gICAgcGFnZS5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwYWdlLmNvbmZpZy5zdHlsZV9wcmVmaXh9YDtcbiAgICBwYWdlLnJlbmRlcihwYWdlLmNvbmZpZy5jdXJyZW50KTtcblxuICAgIGlmIChwYWdlLmNvbmZpZy5sb2FkX2ZpcnN0X3BhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgcGFnZS5jb25maWcuY2FsbGJhY2soZXZlbnQsIHBhZ2UuY29uZmlnLnBhZ2VfaW5kZXgpO1xuICAgIH1cblxuICAgIHBhZ2UuYWRkRXZlbnRIYW5kbGVyKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTdGF0dXM6IHBhZ2UuZ2V0U3RhdHVzLmJpbmQocGFnZSksXG4gICAgICAgIGdvOiBwYWdlLmdvLmJpbmQocGFnZSksXG4gICAgICAgIGdvUHJldjogcGFnZS5nb1ByZXYuYmluZChwYWdlKSxcbiAgICAgICAgZ29OZXh0OiBwYWdlLmdvTmV4dC5iaW5kKHBhZ2UpXG4gICAgfTsgIFxufVxuZXhwb3J0IGRlZmF1bHQgcGFnaW5hdGlvbjsiXX0=