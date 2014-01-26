/**
 * util.js
 * Joshua Dickson
 */

 var annimationCustomCounter = 0;

/**
 * Ease an object from one location to another using a basic transient
 */
function easeToFinalLocation(obj, loc, currentPosition, finalPosition) {

    annimationCustomCounter++;
	
    $("<style id='annimationrule" + annimationCustomCounter + "' type='text/css'> .animate-" + annimationCustomCounter + " {" +
            "-webkit-animation: animation-name-" + annimationCustomCounter + " .7s ease-in-out;" + 
            " } </style>").appendTo("head");

    var stringbuilder = '';
    var pivots = 4;
    var finalLocation = finalPosition;

    for(var i = 1; i < pivots; i++) {
        var isAlternate = (i % 2);
        if(finalLocation < 0) {
            isAlternate = -isAlternate;
        }
        stringbuilder = stringbuilder.concat( (i*(100 / pivots)) + "% {  " + loc + ": " + 
            (finalLocation + (isAlternate * getExpMult(4, (i/pivots)) * 100)) +  "px; }");
    };

    $("<style id='annimationkeyset" + annimationCustomCounter + "' type='text/css'> @-webkit-keyframes animation-name-" + annimationCustomCounter + " {" +
        "0% {  " + loc + ": " + currentPosition + "px; }" +
        stringbuilder +
        "100% { " + loc + ": " + finalLocation + "px; }" +
    "}) </style>").appendTo('head');

    var anim = obj;
    
    $(anim).on('webkitAnimationEnd', function(anim) {
        obj.css(loc, finalLocation + 'px');
        obj.removeClass('animate-' + annimationCustomCounter);

        $('#annimationrule' + annimationCustomCounter).attr('disabled', 'disabled');
        $('#annimationrule' + annimationCustomCounter).remove();

        $('#annimationkeyset' + annimationCustomCounter).attr('disabled', 'disabled');
        $('#annimationkeyset' + annimationCustomCounter).remove();

        obj.unbind('webkitAnimationEnd');

    });

    $(anim).addClass('animate-' + annimationCustomCounter);

};

function easeToFinalLocation3d(obj, xOrigin, xFinal, yOrigin, yFinal, timeout) {

    var deltaX = xFinal - xOrigin;
    var deltaY = yFinal - yOrigin;

    annimationCustomCounter++;
    
    $("<style id='annimationrule" + annimationCustomCounter + "' type='text/css'> .animate-" + annimationCustomCounter + " {" +
            "-webkit-animation: animation-name-" + annimationCustomCounter + " " + timeout + " ease-in-out;" + 
            " } </style>").appendTo("head");

    var stringbuilder = '';
    var pivots = 4;

    // console.log(deltaX + ', ' + deltaY);

    var hyp = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    // console.log('hyp: ' + hyp);

    if(hyp < 100) {
        // console.log(xOrigin + ', ' + yOrigin);
    }
    

    for(var i = 1; i < pivots; i++) {
        var isXAlternate = (i % 2);
        var isYAlternate = (i % 2);

        var mult = 1;
        if(!isXAlternate) mult = -1;

        var multiplier = (60 + (Math.random() * 40))/100;
        
        var hypMod = (mult * getExpMult(4, (i/pivots)) * hyp * multiplier);

        // console.log("Mod: " + hypMod);

        var angle = Math.atan2(deltaY, deltaX);

        // if(hyp < 100) {
        //     // console.log((xFinal + (hypMod * Math.cos(angle))) + ", " + (yOrigin + (hypMod * Math.sin(angle))));
        // }

        // stringbuilder = stringbuilder.concat( (i*(100 / pivots)) + "% {  " + 
        //     'top' + ": " + (yFinal + (hypMod * Math.sin(angle))) +  "px;" + 
        //     'left' + ": " + (xFinal + (hypMod * Math.cos(angle))) +  "px;}"
        // );

        stringbuilder = stringbuilder.concat( (i*(100 / pivots)) + "% {  " + 
            'top' + ": " + (yFinal + (hypMod * Math.sin(angle))) +  "px;" + 
            'left' + ": " + (xFinal + (hypMod * Math.cos(angle))) +  "px;}"
        );
    };

    // if(hyp < 100) {
    //     // console.log(xFinal + ', ' + yFinal);
    // }

    console.log(xOrigin, xFinal);


    $("<style id='annimationkeyset" + annimationCustomCounter + "' type='text/css'> @-webkit-keyframes animation-name-" + annimationCustomCounter + " {" +
        "0% {  left: " + xOrigin + "px; top: " + yOrigin + "px; } " +
        stringbuilder +
        "100% {  left: " + xFinal + "px; top: " + yFinal + "px; }" +
    "}) </style>").appendTo('head');

    // console.log("<style id='annimationkeyset" + annimationCustomCounter + "' type='text/css'> @-webkit-keyframes animation-name-" + annimationCustomCounter + " {" +
    //     "0% {  left: " + xOrigin + "px; top: " + yOrigin + "px; }" +
    //     // stringbuilder +
    //     "100% {  left: " + xFinal + "px; top: " + yFinal + "px; }" +
    // "}) </style>");

    var anim = obj;

    obj.css('top', yFinal + 'px');
    obj.css('left', xFinal + 'px');
    
    

    function animateCleanUp(counter) {

        console.log('over');

        obj.removeClass('animate-' + counter);

        $('#annimationrule' + counter).attr('disabled', 'disabled');
        $('#annimationrule' + counter).remove();

        $('#annimationkeyset' + counter).attr('disabled', 'disabled');
        $('#annimationkeyset' + counter).remove();

        obj.unbind('webkitAnimationEnd');
    }

    // $(anim).on('webkitAnimationEnd', animateCleanUp);

    $(anim).addClass('animate-' + annimationCustomCounter);

    var returnable = {};
    returnable.funct = animateCleanUp;
    returnable.arg = annimationCustomCounter;

    return returnable;

}

// load all the small images that are rendered in the attack builder view
var smallImages = [];
var names = ['mustang', 'liberator', 'rocket', 'spitfire'];
for(var i = 0; i < names.length; i++) {
    var imageObj = new Image();
    imageObj.src = 'img/' + names[i] + '-small.png';
    smallImages.push(imageObj);
}

var images = [];
for(var i = 0; i < names.length; i++) {
    var imageObj = new Image();
    imageObj.src = 'img/' + names[i] + '.png';
    images.push(imageObj);
}

var gearImage = new Image();
gearImage.src = 'img/gear.png';