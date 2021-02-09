function addEvent(elem, type, handler) {
    console.log('test')
    if (elem.addEventListener) {
        addEvent = (elem, type, handler) => {
            elem.addEventListener(type, handler, false);     
        };
    } else if (elem.attachEvent) {
        addEvent = (elem, type, handler) => {
            elem.attachEvent('on' + type, handler);  
        };
    } else {
        addEvent = (elem, type, handler) => {
            elem['on' + type] = handler;    
        };
    }
    addEvent(elem, type, handler);
}

function removeEvent(elem, type, handler) {
    if (elem.removeEventListener) {
        removeEvent = (elem, type, handler) => {
            elem.removeEventListener(type, handler, false); 
        };
    } else if (elem.attachEvent) {
        removeEvent = (elem, type, handler) => {
            elem.detachEvent('on' + type, handler);
        };
    } else {
        removeEvent = (elem, type, handler) => {
            elem['on' + type] = null;
        }
    }
    removeEvent(elem, type, handler);
}

function getEvent(event) {
    if (event) {
        getEvent = event => {
            return event; 
        };
    } else {
        getEvent = event => {
            return window.event;
        }
    }
    return getEvent(event);
}

function getTarget(event) {
    if (event.target) {
        getTarget = event => {
            return event.target;
        };
    } else {
        getTarget = event => {
            return event.srcElement;
        };
    }
    return getTarget(event);
}

function preventDefault(event) {
    if (event.preventDefault) {
        preventDefault = event => {
            event.preventDefault();
        };
    } else {
        preventDefault = event => {
            event.returnValue = false;   
        }
    }
    preventDefault(event);   
}

export {
    addEvent,
    removeEvent,
    getEvent,
    getTarget,
    preventDefault
};

