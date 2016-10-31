import {addEvent, getEvent, getTarget, preventDefault} from './event';
import {extend, replace} from './util';

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
        link_to: '{{page_num}}',
        callback: (event, index) => {
            preventDefault(getEvent(event));
        },
        load_first_page: false,
        style_prefix: 'pagination'
    }, options);

    this.total_pages = Math.ceil(this.config.total_items / this.config.items_per_page);
    this.config.num_pages = this.config.num_pages > this.total_pages ? this.total_pages : this.config.num_pages;
    this.config.current = this.config.current > this.total_pages ? this.total_pages : this.config.current;
    this.start_index = Math.abs(this.config.page_index - 1); 
}

PageSet.prototype.createPageItem = function({text, nodeName, nodeType, className, current}) {

    let item = document.createElement(nodeName);
    
    if (nodeName === 'a') {
        switch (nodeType) {
            case 'num':
                this.setATag(item, text);
                break;

            case 'prev':
                this.setATag(item, current - 1);
                break;

            case 'next':
                this.setATag(item, current + 1);
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

PageSet.prototype.setATag = function(item, num) {
    let linkNum = num - this.start_index;
    item.href = replace(this.config.link_to, linkNum);
    item.setAttribute('data-num', linkNum);
    return item;
};

PageSet.prototype.render = function(current) {
    this.container.innerHTML = '';
    this.container.className = this.config.style_prefix;
    current = parseInt(current);
    this.current = current; 
    current = current + this.start_index; 

    let prevItem = null;
    if (current === 1) {
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
            current: current
        });
    }

    this.container.appendChild(prevItem);

    if (current < this.config.num_pages) { 
        for (let i = 1; i <= this.config.num_pages; i++) {
            if ( i === current) {
                this.container.appendChild(this.createPageItem({
                    text: current, 
                    nodeName: 'span', 
                    nodeType: 'num', 
                    className: 'current'})
                );
            } else {
                this.container.appendChild(this.createPageItem({
                    text: i, 
                    nodeName: 'a', 
                    nodeType: 'num'})
                );
            }
        }

        if (this.config.last_text && this.config.num_pages < (this.total_pages - 1) || 
            !this.config.last_text && this.config.num_pages < this.total_pages) {

            this.container.appendChild(this.createPageItem({
                text: this.config.ellipse_text, 
                nodeName: 'span', 
                className: 'ellipse'})
            );
        
            if (this.config.last_text) {
                this.container.appendChild(this.createPageItem({
                    text: this.config.last_text.replace(/{{.*}}/, this.total_pages), 
                    nodeName: 'a',
                    nodeType: 'last'})
                );                
            }
        }
    } else { 
        let rtEdge = Math.floor((this.config.num_pages - 1) / 2);
        while (current + rtEdge > this.total_pages) {
            rtEdge--;
        }
        let ltEdge = this.config.num_pages - 1 - rtEdge;

        if (this.config.num_pages != this.total_pages) {

            if (this.config.first_text) {
                this.container.appendChild(this.createPageItem({ 
                    text: this.config.first_text, 
                    nodeName: 'a',
                    nodeType: 'first'})
                );
            }
            if (current - ltEdge > 2) { 
                this.container.appendChild(this.createPageItem({
                    text: this.config.ellipse_text, 
                    nodeName: 'span',
                    className: 'ellipse'})
                );
            }
        }

        while (ltEdge) { 
            this.container.appendChild(this.createPageItem({
                text: current - ltEdge, 
                nodeName: 'a',
                nodeType: 'num'})
            );
            ltEdge--;
        }
        this.container.appendChild(this.createPageItem({ 
            text: current, 
            nodeName: 'span',
            className: 'current'})
        );

        let rtCount = 1;
        while (rtCount <= rtEdge) {
            this.container.appendChild(this.createPageItem({ 
                text: current + rtCount, 
                nodeName: 'a',
                nodeType: 'num'})
            );
            rtCount++;
        }

        if (rtCount + current < this.total_pages) {
            this.container.appendChild(this.createPageItem({
                text: this.config.ellipse_text, 
                nodeName: 'span',
                className: 'ellipse'})
            );
        }

        if (this.config.last_text && (rtCount - 1 + current < this.total_pages)) {
            this.container.appendChild(this.createPageItem({
                text: this.config.last_text.replace(/{{.*}}/, this.total_pages), 
                nodeName: 'a',
                nodeType: 'last'})
            );              
        } 
    }
   
    let nextItem = null;
    if (current === this.total_pages) {
        nextItem = this.createPageItem({
            text: this.config.next_text, 
            nodeName: 'span', 
            className: 'disable_next'}
        );
    } else {
        nextItem = this.createPageItem({
            text: this.config.next_text, 
            nodeName: 'a',
            nodeType: 'next',
            current: current}
        );
    }
    this.container.appendChild(nextItem);
};

PageSet.prototype.addEventHandler = function() {

    addEvent(this.container, 'click', function(event) {
        let e = getEvent(event);
        let target = getTarget(e);

        if (target.nodeName.toUpperCase() === 'A') {
            let index = target.getAttribute('data-num');
            this.config.callback(e, index);
            this.render(index);
        }                
    }.bind(this));   
};

PageSet.prototype.getStatus = function() {
    return {
        total_pages: this.total_pages,
        total_items: this.config.total_items,
        current: this.current 
    };
};

PageSet.prototype.go = function(index) {
    if (index < 1 || index > this.total_pages) {
        return;
    }
    this.render(index - this.start_index);
    this.config.callback(null, index - this.start_index);
};

PageSet.prototype.goPrev = function() {
    if (this.current + this.start_index === 1) {
        return;
    }
    this.render(this.current - 1);
    this.config.callback(null, this.current);
};

PageSet.prototype.goNext = function() {
    if (this.current + this.start_index === this.total_pages) {
        return;
    }
    this.render(this.current + 1);
    this.config.callback(null, this.current);    
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
    let page = new PageSet(container, options);
    page.render(page.config.current);

    if (page.load_first_page) {
        page.config.callback(null, this.config.page_index);
    }

    page.addEventHandler();

    return {
        getStatus: page.getStatus.bind(page),
        go: page.go.bind(page),
        goPrev: page.goPrev.bind(page),
        goNext: page.goNext.bind(page)
    };  
}

export default pagination;