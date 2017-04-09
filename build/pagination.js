(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.pagination = factory());
}(this, (function () { 'use strict';

function addEvent(elem, type, handler) {
    if (elem.addEventListener) {
        addEvent = function addEvent(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        };
    } else if (elem.attachEvent) {
        addEvent = function addEvent(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        };
    } else {
        addEvent = function addEvent(elem, type, handler) {
            elem['on' + type] = handler;
        };
    }
    addEvent(elem, type, handler);
}

function getEvent(event) {
    if (event) {
        getEvent = function getEvent(event) {
            return event;
        };
    } else {
        getEvent = function getEvent(event) {
            return window.event;
        };
    }
    return getEvent(event);
}

function getTarget(event) {
    if (event.target) {
        getTarget = function getTarget(event) {
            return event.target;
        };
    } else {
        getTarget = function getTarget(event) {
            return event.srcElement;
        };
    }
    return getTarget(event);
}

function extend(src, dst) {
    var keys = Object.keys(dst);
    for (var i = 0, len = keys.length; i < len; i++) {
        src[keys[i]] = dst[keys[i]];
    }
    return src;
}
function replace(str, replacement) {
    return str.replace(/{{.*}}/, replacement);
}

function PageSet(container, options) {

    this.container = container;

    this.config = extend({
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
    item.href = replace(this.config.link_to, linkNum);
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

    addEvent(this.container, 'click', function (event) {
        var e = getEvent(event);
        var target = getTarget(e);

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
    console.info(index);
    if (index < 1 || index > this.total_pages) {
        return;
    }
    this.render(index - this.offsetIndex);
    this.config.callback(event, index - this.offSetIndex);
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

return pagination;

})));
