function addEvent(elem, type, handler) {
    if (document.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else if (document.attachEvent) {
        elem.attachEvent('on' + type, handler);
    } else {
        elem['on' + type] = handler;
    }
}

function removeEvent(elem, type, handler) {
    if (document.removeEventListener) {
        elem.removeEventListener(type, handler, false);
    } else if (document.attachEvent) {
        elem.detachEvent('on' + type, handler);
    } else {
        elem['on' + type] = null;
    }
}

function getEvent(event) {
    return event ? event : window.event;
}

function getTarget(event) {
    return event.target || event.srcElement;
}

function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }   
}

export {
    addEvent,
    removeEvent,
    getEvent,
    getTarget,
    preventDefault
};

