define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function addEvent(elem, type, handler) {
        if (elem.addEventListener) {
            exports.addEvent = addEvent = function addEvent(elem, type, handler) {
                elem.addEventListener(type, handler, false);
            };
        } else if (elem.attachEvent) {
            exports.addEvent = addEvent = function addEvent(elem, type, handler) {
                elem.attachEvent('on' + type, handler);
            };
        } else {
            exports.addEvent = addEvent = function addEvent(elem, type, handler) {
                elem['on' + type] = handler;
            };
        }
        addEvent(elem, type, handler);
    }

    function removeEvent(elem, type, handler) {
        if (elem.removeEventListener) {
            exports.removeEvent = removeEvent = function removeEvent(elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            };
        } else if (elem.attachEvent) {
            exports.removeEvent = removeEvent = function removeEvent(elem, type, handler) {
                elem.detachEvent('on' + type, handler);
            };
        } else {
            exports.removeEvent = removeEvent = function removeEvent(elem, type, handler) {
                elem['on' + type] = null;
            };
        }
        removeEvent(elem, type, handler);
    }

    function getEvent(event) {
        if (event) {
            exports.getEvent = getEvent = function getEvent(event) {
                return event;
            };
        } else {
            exports.getEvent = getEvent = function getEvent(event) {
                return window.event;
            };
        }
        return getEvent(event);
    }

    function getTarget(event) {
        if (event.target) {
            exports.getTarget = getTarget = function getTarget(event) {
                return event.target;
            };
        } else {
            exports.getTarget = getTarget = function getTarget(event) {
                return event.srcElement;
            };
        }
        return getTarget(event);
    }

    function preventDefault(event) {
        if (event.preventDefault) {
            exports.preventDefault = preventDefault = function preventDefault(event) {
                event.preventDefault();
            };
        } else {
            exports.preventDefault = preventDefault = function preventDefault(event) {
                event.returnValue = false;
            };
        }
        preventDefault(event);
    }

    exports.addEvent = addEvent;
    exports.removeEvent = removeEvent;
    exports.getEvent = getEvent;
    exports.getTarget = getTarget;
    exports.preventDefault = preventDefault;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzbmV4dC9ldmVudC5qcyJdLCJuYW1lcyI6WyJhZGRFdmVudCIsImVsZW0iLCJ0eXBlIiwiaGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsInJlbW92ZUV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRldGFjaEV2ZW50IiwiZ2V0RXZlbnQiLCJldmVudCIsIndpbmRvdyIsImdldFRhcmdldCIsInRhcmdldCIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxhQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEJDLE9BQTlCLEVBQXVDO0FBQ25DLFlBQUlGLEtBQUtHLGdCQUFULEVBQTJCO0FBQ3ZCLG9CQXdFSkosUUF4RUksY0FBVyxrQkFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBeUI7QUFDaENGLHFCQUFLRyxnQkFBTCxDQUFzQkYsSUFBdEIsRUFBNEJDLE9BQTVCLEVBQXFDLEtBQXJDO0FBQ0gsYUFGRDtBQUdILFNBSkQsTUFJTyxJQUFJRixLQUFLSSxXQUFULEVBQXNCO0FBQ3pCLG9CQW9FSkwsUUFwRUksY0FBVyxrQkFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBeUI7QUFDaENGLHFCQUFLSSxXQUFMLENBQWlCLE9BQU9ILElBQXhCLEVBQThCQyxPQUE5QjtBQUNILGFBRkQ7QUFHSCxTQUpNLE1BSUE7QUFDSCxvQkFnRUpILFFBaEVJLGNBQVcsa0JBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxPQUFiLEVBQXlCO0FBQ2hDRixxQkFBSyxPQUFPQyxJQUFaLElBQW9CQyxPQUFwQjtBQUNILGFBRkQ7QUFHSDtBQUNESCxpQkFBU0MsSUFBVCxFQUFlQyxJQUFmLEVBQXFCQyxPQUFyQjtBQUNIOztBQUVELGFBQVNHLFdBQVQsQ0FBcUJMLElBQXJCLEVBQTJCQyxJQUEzQixFQUFpQ0MsT0FBakMsRUFBMEM7QUFDdEMsWUFBSUYsS0FBS00sbUJBQVQsRUFBOEI7QUFDMUIsb0JBd0RKRCxXQXhESSxpQkFBYyxxQkFBQ0wsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBeUI7QUFDbkNGLHFCQUFLTSxtQkFBTCxDQUF5QkwsSUFBekIsRUFBK0JDLE9BQS9CLEVBQXdDLEtBQXhDO0FBQ0gsYUFGRDtBQUdILFNBSkQsTUFJTyxJQUFJRixLQUFLSSxXQUFULEVBQXNCO0FBQ3pCLG9CQW9ESkMsV0FwREksaUJBQWMscUJBQUNMLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxPQUFiLEVBQXlCO0FBQ25DRixxQkFBS08sV0FBTCxDQUFpQixPQUFPTixJQUF4QixFQUE4QkMsT0FBOUI7QUFDSCxhQUZEO0FBR0gsU0FKTSxNQUlBO0FBQ0gsb0JBZ0RKRyxXQWhESSxpQkFBYyxxQkFBQ0wsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBeUI7QUFDbkNGLHFCQUFLLE9BQU9DLElBQVosSUFBb0IsSUFBcEI7QUFDSCxhQUZEO0FBR0g7QUFDREksb0JBQVlMLElBQVosRUFBa0JDLElBQWxCLEVBQXdCQyxPQUF4QjtBQUNIOztBQUVELGFBQVNNLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCO0FBQ3JCLFlBQUlBLEtBQUosRUFBVztBQUNQLG9CQXdDSkQsUUF4Q0ksY0FBVyx5QkFBUztBQUNoQix1QkFBT0MsS0FBUDtBQUNILGFBRkQ7QUFHSCxTQUpELE1BSU87QUFDSCxvQkFvQ0pELFFBcENJLGNBQVcseUJBQVM7QUFDaEIsdUJBQU9FLE9BQU9ELEtBQWQ7QUFDSCxhQUZEO0FBR0g7QUFDRCxlQUFPRCxTQUFTQyxLQUFULENBQVA7QUFDSDs7QUFFRCxhQUFTRSxTQUFULENBQW1CRixLQUFuQixFQUEwQjtBQUN0QixZQUFJQSxNQUFNRyxNQUFWLEVBQWtCO0FBQ2Qsb0JBNEJKRCxTQTVCSSxlQUFZLDBCQUFTO0FBQ2pCLHVCQUFPRixNQUFNRyxNQUFiO0FBQ0gsYUFGRDtBQUdILFNBSkQsTUFJTztBQUNILG9CQXdCSkQsU0F4QkksZUFBWSwwQkFBUztBQUNqQix1QkFBT0YsTUFBTUksVUFBYjtBQUNILGFBRkQ7QUFHSDtBQUNELGVBQU9GLFVBQVVGLEtBQVYsQ0FBUDtBQUNIOztBQUVELGFBQVNLLGNBQVQsQ0FBd0JMLEtBQXhCLEVBQStCO0FBQzNCLFlBQUlBLE1BQU1LLGNBQVYsRUFBMEI7QUFDdEIsb0JBZ0JKQSxjQWhCSSxvQkFBaUIsK0JBQVM7QUFDdEJMLHNCQUFNSyxjQUFOO0FBQ0gsYUFGRDtBQUdILFNBSkQsTUFJTztBQUNILG9CQVlKQSxjQVpJLG9CQUFpQiwrQkFBUztBQUN0Qkwsc0JBQU1NLFdBQU4sR0FBb0IsS0FBcEI7QUFDSCxhQUZEO0FBR0g7QUFDREQsdUJBQWVMLEtBQWY7QUFDSDs7WUFHR1YsUSxHQUFBQSxRO1lBQ0FNLFcsR0FBQUEsVztZQUNBRyxRLEdBQUFBLFE7WUFDQUcsUyxHQUFBQSxTO1lBQ0FHLGMsR0FBQUEsYyIsImZpbGUiOiJldmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGFkZEV2ZW50KGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGFkZEV2ZW50ID0gKGVsZW0sIHR5cGUsIGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7ICAgICBcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgYWRkRXZlbnQgPSAoZWxlbSwgdHlwZSwgaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7ICBcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhZGRFdmVudCA9IChlbGVtLCB0eXBlLCBoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICBlbGVtWydvbicgKyB0eXBlXSA9IGhhbmRsZXI7ICAgIFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhZGRFdmVudChlbGVtLCB0eXBlLCBoYW5kbGVyKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZWxlbSwgdHlwZSwgaGFuZGxlcikge1xuICAgIGlmIChlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgcmVtb3ZlRXZlbnQgPSAoZWxlbSwgdHlwZSwgaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTsgXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIHJlbW92ZUV2ZW50ID0gKGVsZW0sIHR5cGUsIGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIGVsZW0uZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZUV2ZW50ID0gKGVsZW0sIHR5cGUsIGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIGVsZW1bJ29uJyArIHR5cGVdID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW1vdmVFdmVudChlbGVtLCB0eXBlLCBoYW5kbGVyKTtcbn1cblxuZnVuY3Rpb24gZ2V0RXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZ2V0RXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQ7IFxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdldEV2ZW50ID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5ldmVudDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2V0RXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRUYXJnZXQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIGdldFRhcmdldCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBldmVudC50YXJnZXQ7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0VGFyZ2V0ID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBnZXRUYXJnZXQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChldmVudCkge1xuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBwcmV2ZW50RGVmYXVsdCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmVudERlZmF1bHQgPSBldmVudCA9PiB7XG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlOyAgIFxuICAgICAgICB9XG4gICAgfVxuICAgIHByZXZlbnREZWZhdWx0KGV2ZW50KTsgICBcbn1cblxuZXhwb3J0IHtcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgICBnZXRFdmVudCxcbiAgICBnZXRUYXJnZXQsXG4gICAgcHJldmVudERlZmF1bHRcbn07XG5cbiJdfQ==