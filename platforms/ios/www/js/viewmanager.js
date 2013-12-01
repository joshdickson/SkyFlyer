/**
 * viewmanager.js
 * Joshua Dickson
 */

 function ViewManager() {

	var activeView;
	var views = {};
	var staticViews = [];

	this.refresh = function() {
		_.each(views, function(view) {
			view.render();
		});
		_.each(staticViews, function(view) {
			view.refresh();
		});
	}

	this.transitionCallback = function(request, transitionTime, message) {
		activeView.undelegateEvents();
		if(activeView.deactivateChildViews) activeView.deactivateChildViews();
		// console.log("rec'd request to go to: " + request);
		// set the requested view as active after the timeout period...
		setTimeout(function() {
			activeView = views[request];
			activeView.delegateEvents();
			if(activeView.set) activeView.set(message);
			if(activeView.activateChildViews) activeView.activateChildViews();
			// console.log('going to :' + request);
		}, transitionTime);
	};

	this._setNonActiveViews = function() {
		_.each(views, function(view) {
			if(view != activeView) {
				view.undelegateEvents();
				if(view.deactivateChildViews) view.deactivateChildViews();
			}
		});
	}

	// set the static views
	staticViews.push(new OpponentView);
	staticViews.push(new GameStatsView);

    
	// configure dynamic views...
	views['gameHome'] = new GameHomeView({ transition: this.transitionCallback });
	views['attackBuilder'] = new AttackBuilderView({ transition: this.transitionCallback });
	views['transition'] = new TransitionView({transition: this.transitionCallback });
//
//	// set the active view
	activeView = views['gameHome'];
	this._setNonActiveViews();

}