// attacktiles.js trial


// This will allow a couple of things - a click and drag to reposition, and
// a tap to remove a single
var AttackWaveView = Backbone.View.extend({

	className: 'attack-inventory-icon-2',

	template: _.template($('#attack-unit-template2').html()),

	events: {
		'touchmove'			: 'touchMove',
		'touchend'			: 'touchEnd'
	},

	initialize: function(attrs) {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.free);
		this.parent = attrs.parent;
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		// set the image if necessary
		var image = this.$el.find('.tile-image');
		var source = $(image).attr('src');
		if(source !== 'img/' + this.model.get('unit').get('pieceName').toLowerCase() + '-small.png') {
			// make the image swap
			$(image).attr('src', 'img/' + this.model.get('unit').get('pieceName').toLowerCase() + '-small.png');
		}



		return this;
	},

	touchMove: function() {
		this.parent.trigger('touchMove', this.model);
	},

	touchEnd: function() {
		this.parent.trigger('touchEnd', this.model);
	},

	free: function() {
		this.remove();
	}


});



// The overarching view to handle all of this?
var AttackView = Backbone.View.extend({

	el: $('#game-container-canvas-wrapper-2'),

	initialize: function(attrs) {
		this.listenTo(attrs.collection, 'add', this.addWave);
		this.listenTo(attrs.collection, 'newTileRender', this.renderNew);
		this.listenTo(attrs.collection, 'existingTileRender', this.renderExisting);
		this.on('touchMove', this.touchMove);
		this.on('touchEnd', this.touchEnd);
		this.collection = attrs.collection;
		this.killSwitch = [];
	},

	addWave: function(wave) {
		var view = new AttackWaveView({ model: wave, parent: this });
		this.$el.append(view.render().el);
		// this.renderNew();
	},

	touchMove: function(model) {
		this._touchMoveTrigger = true;
	},

	touchEnd: function(model) {
		if(this._touchMoveTrigger) {
			this._touchMoveTrigger = undefined;
			console.log('Saw drag event for model - nothing happening yet');
			
		} else {	
			var startingSize = this.collection.length;		
			GameModel.removeFromAttack(model);
			this.merge();

			// tile(s) were dropped, must re-render
			if(startingSize != this.collection.length) {
				this.dropRender();
			}
		}

	},

	dropRender: function() {
		this.checkKills();
		console.log('running drop render for elem: ' + this.collection.length);
		var coords = this._getLocationSet(this.collection.length);
		
		var children = this.$el.children();
		var colors = ['AD3939', '39AD8E', '6A39AD', '3962AD', 'ad399b', '39a1ad', 'ad6239', 'ad3962'];

		for(var i = 0; i < this.collection.length; i++) {
			this.killSwitch.push(easeToFinalLocation3d($(children[i]), $(children[i]).position().left, coords[i].x, $(children[i]).position().top, coords[i].y, '0.35s'));
			$(children[i]).css('background-color', '#' + colors[i]);
		}
	},

	merge: function() {
		for(var i = 0; i < this.collection.length - 1; i++) {
			if(this.collection.at(i).get('unit') === this.collection.at(i+1).get('unit')) {
				this.collection.at(i).set('count', 
					this.collection.at(i).get('count') + this.collection.at(i+1).get('count'));
				this.collection.at(i+1).trigger('remove');
				this.collection.remove(this.collection.at(i+1));
				i--;
			}
		}
	},

	_getLocationSet: function(size) {
		var yOffset = 225;
		var xOffset = 68;
		var coordinates = [];

		for(var i = 0; i < size; i++) {
			if(size < 5) {
				coordinates.push({
					x: ((320-((size - 1) * xOffset))/2) + (i * xOffset) - 30,
					y: yOffset
				});
			} else {
				if(i < 4) {
					coordinates.push({
						x: ((320-(3*68))/2) + (i * xOffset) - 30,
						y: yOffset - 34 
					});
				} else {
					coordinates.push({
						x: ((320-((size - 5) * xOffset))/2) + ((i-4) * xOffset) - 30,
						y: yOffset + 34
					});
				}
			}
		}

		return coordinates;

	},

	renderNew: function(event) {

		this.checkKills();

		var touch =  event.originalEvent.touches[0];

		var coords = this._getLocationSet(this.collection.length);
		var children = this.$el.children();
		var renderContainers = this.$el.find('.attack-inventory-icon-2');
		var colors = ['AD3939', '39AD8E', '6A39AD', '3962AD', 'ad399b', '39a1ad', 'ad6239', 'ad3962'];

		for(var i = 0; i < children.length - 1; i++) {
			this.killSwitch.push(easeToFinalLocation3d($(children[i]), $(children[i]).position().left, coords[i].x, $(children[i]).position().top, coords[i].y, '0.5s'));
			$(renderContainers[i]).css('background-color', '#' + colors[i]);
		};

		// do the last element
		this.killSwitch.push(easeToFinalLocation3d($(children[children.length - 1]), touch.pageX - 30, coords[children.length - 1].x, touch.pageY - 30, coords[children.length - 1].y, '0.5s'));
		$(renderContainers[i]).css('background-color', '#' + colors[children.length - 1]);

	},

	renderExisting: function(event) {

		this.checkKills();

		var touch =  event.originalEvent.touches[0];

		// get the last tile that we are going to make a number of changes to
		var lastTile = this.$el.children().last();

		// now we duplicate the unit
		var clone = lastTile.clone();
		this.$el.append(clone);

		// we can now work with the last two elements... the last element will end up being deleted...
		var trueCount = lastTile.find('.unitCount').text();
		lastTile.find('.unitCount').text('1');
		this.$el.children().last().find('.unitCount').text(this.$el.children().last().find('.unitCount').text() - 1)
		this.killSwitch.push(easeToFinalLocation3d(lastTile, touch.pageX - 30, lastTile.position().left, touch.pageY - 30, lastTile.position().top, '0.5s'));

		setTimeout(function() { lastTile.find('.unitCount').text(trueCount) }, 90);
		setTimeout(function() { clone.remove() }, 90);


	},

	checkKills: function() {
		// remove any of the kill switches in the kill switch array
		_.each(this.killSwitch, function(kill) {
			kill.funct(kill.arg);
		});
	},

	refresh: function() {
		// Empty stub
	}

});

