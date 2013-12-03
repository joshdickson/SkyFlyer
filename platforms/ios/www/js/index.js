/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // console.log('received an event...');
        
//        var views = new ViewManager();

//        console.log('Received Event: ' + id);
        
        // console.log('test');
        
//
        customFunction(app);
    }
};

var inventoryCanvasTimeouts = [];
var views;

function customFunction(app) {
    // console.log('called custom function');
    

    $('#attack-unit-canvas').attr('width', '320px');
    $('#attack-unit-canvas').attr('height', '658px');

    // $('#opponent-score-drawing-canvas').attr('width', '40px');
    // $('#opponent-score-drawing-canvas').attr('height', '40px');

    views = new ViewManager;
    doImageLoadProcedure();

    // set up the global variable for drawing timeouts
}

function doImageLoadProcedure() {
    var imageURLs = [''];
}
