/**
 * draggable.js
 * @author Joshua Dickson
 * @version 
 *		November 23, 2013
 *		 - Refactored into draggable.js
 */

/**
 * A draggable object that supports movement within a container and which triggers
 * callbacks depending on the location the draggable is released by the user
 */
function Draggable(element, handleElement, begin, callback, callbackObj, contain) {
	
	// cache the element that is draggable
	var element = element;

	// cache the draggable
	var that = this;
    
    // set the sequence for beginning a drag
    $(handleElement).bind('touchstart', function(event) {
        console.log('testing');
        
        that._touchStart = true;
        
        var touches = event.changedTouches;
        console.log(touches);
        console.log('check');
//        if(touches.length == 1) {
//            that._deltaXStart = touches[0].pageX;
//            that._deltaYStart = touches[0].pageY;
//                    this.$el.offset({top: -5});
//        }
        begin();
        
    });
    
    // set the sequence for moving a drag
    $(element).bind('touchmove', function(event) {
                   
//        var touches = event.changedTouches;
//        if(touches.length == 1) {
//            deltaX = touches[0].pageX;
//            deltaY = touches[0].pageY;
//            this.$el.offset({top: -5});
//        }
        
        
                    })

	// set the draggable using the 'draggable' functionality of jQuery UI
//	$(element).draggable({
//		// trigger a callback for the begin of a drag
//		start: function() {
//			begin();
//		},
//
//		// set the containment array
//		containment: contain,
//
//		// set the handle
//		handle: handleElement,
//
//		// trigger the callback for stopping the draggable, automatically disable allowing
//		// the caller to enable via the callback arguments
//		stop: function() {
//			$(element).draggable('disable');
//			callback(this, that.enable, callbackObj);
//		}
//	});

	// (Temporarily) disable this draggable
	this.disable = function() {
		$(element).draggable('disable');
	};

	// (Temporarily) enable this draggable
	this.enable = function() {
		$(element).draggable('enable');
	};
};