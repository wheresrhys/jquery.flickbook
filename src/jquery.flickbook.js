/*!
 * @name jQuery.flickbook
 * @description	Turns an image into a flickbook type widget, which cycles through a series of images
 * Licensed under the MIT license
*/
;(function ( $, window, document, undefined ) {

    var pluginName = 'flickbook',
		binder = $.fn.on ? "on": "bind"; // ensures backwards compatibility with versiosn prior to 1.7


    /**
	 *	@name Plugin
	 *	@constructor
	 *	@private
	 *	@param {HTML Element} element	The element to initialise the plugin for
	 *	@param {Object} options			Configuration options for theis instance of the plugin
	 */
    function Plugin( element, options ) {
        this.el = element;
		this.$el = $(element);
		this.opts = options;
        this._name = pluginName;
        this.init();
    }
	
	Plugin.prototype.playing = false;
	Plugin.prototype.index = -1;

	/**
	 * @name Plugin.init
	 * @function
	 * @private
	 * @description	initialises the plugin
	 */	
    Plugin.prototype.init = function () {
		var that = this;
		this.imageSrcs = (this.$el.data(pluginName + "-images") || this.opts.images.slice());
		
		if(!$.isArray(this.imageSrcs)) {
			this.imageSrcs = this.imageSrcs.split(",");
		}
		this.imageCount = this.imageSrcs.length

		this.fetchImages();
		this.$el.data(pluginName + "-images", this.images);
		
		this.$el[binder]("start." + pluginName, $.proxy(this, "start"))
			[binder]("stop." + pluginName, $.proxy(this, "stop"))
			[binder](this.opts.stopEvent, function() {
				that.$el.trigger("stop." + pluginName);
			})
			[binder](this.opts.startEvent, function() {
				that.$el.trigger("start." + pluginName);
			})
			[binder](this.opts.stopStartEvent, function() {
				that.playing ? that.$el.trigger("stop." + pluginName) : that.$el.trigger("start." + pluginName);
			});
		
		this.opts.autoStart && this.start();
    };

	/**
	 * @name Plugin.start
	 * @function
	 * @private
	 * @description	Starts cycling through the available images
	 */
	Plugin.prototype.start = function () {
		var that = this;
		var oldIndex;
		if (!this.playing) {
			this.to = setInterval(function() {
				
				if(that.opts.random) {
					oldIndex = that.index;
					// Prevent plugin randomly choosing to show the same image again
					while(oldIndex === that.index) {
						that.index = Math.floor(Math.random() * that.imageCount) ;
					}
				} else {
					that.index = (that.index+1) % that.imageCount;
				}
				that.showImage();
			}, this.opts.speed);
			this.playing = true;
		}
		
	}

	/**
	 * @name Plugin.stop
	 * @function
	 * @private
	 * @description	Stops cycling through the available images
	 */
	Plugin.prototype.stop = function () {
		if (this.playing) {
			clearInterval(this.to);
			if (this.opts.onStop === "reset") {
				this.index = 0;
			}
			this.showImage();
			this.playing = false;
		}
	}
	
	/**
	 * @name Plugin.showImage
	 * @function
	 * @private
	 * @description	displays the next available image
	 */
	Plugin.prototype.showImage = function () {
		var attempts = 0;
		while(!this.images[this.index] && attempts < this.imageCount) {
			this.index = (this.index+1) % this.imageCount;
			attempts++;
		}
		this.$el.attr("src", this.images[this.index]);
	}
	
	/**
	 * @name Plugin.loadImage
	 * @private
	 * @function
	 * @description preloads an image
	 * @param {Integer} index	Position of the image in the Plugin.imageSrcs array
	 * @param {Integer} shift	How many positions to shift the reference to the image in the Plugin.images array
	 */
	Plugin.prototype.loadImage = function (index, shift) {
		var that = this; 
		$("<img src=\"" + that.imageSrcs[index] + "\">").load(function () {
			that.images[index + shift] = that.imageSrcs[index];
			$.fn.flickbook.fetchedImages[that.imageSrcs[index]] = true;
		});
	}

	/**
	 * @name Plugin.fetchImages
	 * @private
	 * @function
	 * @description preloads all images required by an instance of $.flickbook
	 */
    Plugin.prototype.fetchImages = function () {
				
		var shift = 0,
			originalSrc = this.$el.attr("src");
		this.images = [];
		
		// Put the original image at the start of the results when required
		if(this.opts.keepOriginalImage && (originalSrc != this.imageSrcs[0])) {
			this.images[0] = originalSrc;
			$.fn.flickbook.fetchedImages[originalSrc] = true;
			shift = 1;
		}
		
        for(var i = 0, il = this.imageSrcs.length; i<il; i++) {
            if ($.fn.flickbook.fetchedImages[this.imageSrcs[i]]) {
				this.images[i + shift] = this.imageSrcs[i];
			} else {
				this.loadImage(i, shift);
			}
        }
    }

	/**
	 * @name processEvents
	 * @private
	 * @function
	 * @description	Analyses the events that stop and start the plugin and pulls out all the events used to both stop and start the plugin
	 * @param {Object} opts	The options object for this call of $.flickbook
	 */
	function processEvents(opts) {
		var tempStart = opts.startEvent.split(" ").sort(),
			tempStop = opts.stopEvent.split(" ").sort(),
			stopEvents = [], 
			startEvents = [], 
			stopStartEvents = [];
		startEventLoop: for(var i=0, il = tempStart.length;i<il;i++) {
			for(var j=0, jl = tempStop.length;j<jl;j++) {
				if(tempStart[i] === tempStop[j]) {
					stopStartEvents.push(tempStart[i])
					tempStop.splice(j,1);
					continue startEventLoop;
				}
			}
			startEvents.push(tempStart[i])
		}
		opts.startEvent = startEvents.join(" ");
		opts.stopEvent = tempStop.join(" ");
		opts.stopStartEvent = stopStartEvents.join(" ");
	}

    /**
	 * @name jQuery.flickbook
	 * @public
	 * @function
	 * @description	Cycles through images
	 * @param {Object} options	Object containing configurable options (see jQuery.flickbook.defaults for more info)
	 */
    $.fn[pluginName] = function ( options ) {
		
		options = $.extend( {}, $.fn[pluginName].defaults, options) ;
		
		if (typeof options.images === "string") {
			options.images = options.images.split(",");
		} else if (!$.isArray(options.images)){
			return;
		}
		
		processEvents(options);
		
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }
	
	
	$.fn[pluginName].fetchedImages = {};
	
	/**
	 * @name jQuery.flickbook.defaults
	 * @public
	 * @description	Object containing default configuration for the plugin
	 * @param {String|Array} images	Array or CSV of image urls to cuycle through
	 * @param {Integer} speed		Interval between each image change in ms
	 * @param {String} startEvent	Name of event (or space separated list of events) that should trigger starting of the plugin
	 * @param {String} stopEvent	Name of event (or space separated list of events) that should trigger stopping of the plugin
	 * @param {Boolean} autoStart	Whether or not to start the plugin automatically
	 * @param {String} onStop		Action to take after plugin is stopped: "reset" -> return to first image
	 *																		"pause" -> stay on the last image to be displayed
	 * @param {Boolean} keepOriginalImage	Whether or not to include the original image src in the list of images to cycle through
	 * @param {Boolean} random	changes the order of cycling through images to random
	 */
	$.fn[pluginName].defaults = {
		images: null,
	//	padImageIntegersBy: 0,
		speed: 100,
	//	root: "", // can be a string, on to which teh image is appended, or a string with {{}} into which teh image is insterted
	//	imageType: "separate", // vertical sprite, horizontal sprite
		startEvent: "mouseover",
		stopEvent: "mouseout", 
		autoStart: false,
		onStop: "reset", 
		keepOriginalImage: true,
		random: false 
		// to do include the jiggling around effect          
	};
	

})( jQuery, window, document );