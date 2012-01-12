/**
 * @name jQuery.flickbook
 * @public
 * @function
 * @description	Turns an image into a flickbook type widget, which cycles through a series of images
 * @param {Object} opts	Object that sets configurable options (see $.fn.flickbook.defaults)
 */


/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/
;(function ( $, window, document, undefined ) {


    // Create the defaults once
    var pluginName = 'flickbook',
        defaults = {
			images: null, // can take arrya, cooma separted string or an integer. idf one has same src as img element then ignore it
			padImageIntegersBy: 0,
			speed: 100,
			root: "", // can be a string, on to which teh image is appended, or a string with {{}} into which teh image is insterted
		//	imageType: "separate", // vertical sprite, horizontal sprite
			startEvent: "mouseover", // or click, dbl click
			stopEvent: "mouseout", // or click, dbl click, hover
			autoStart: false,
			onStop: "reset", // or pause
			keepOriginalImage: true,// last, false
			random: false 
			// to do include the jiggling around effect          
        },
		binder = $.fn.on ? "on": "bind";



    // The actual plugin constructor
    function Plugin( element, options ) {
        this.el = element;
		this.$el = $(element);
		this.opts = options;
        this._name = pluginName;

        this.init();
    }
	
	/**
	 * @name start
	 * @function
	 * @private
	 * @description	Starts cycling through the available images
	 */
	Plugin.prototype.start = function () {
		var that = this;
		if (!this.playing) {
			this.to = setInterval(function() {
				that.index = (that.index+1) % that.imageCount;
				that.showImage();
			}, this.opts.speed);
			this.playing = true;
		}
	}

	/**
	 * @name stop
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
	 * @name start
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
	
	Plugin.prototype.playing = false;
	Plugin.prototype.index = -1;
	
    Plugin.prototype.init = function () {
		var that = this;
		this.images = (this.$el.data(pluginName + "-images") || this.opts.images.slice());
		
		
		if(!$.isArray(this.images)) {
			this.images = this.images.split(",");
		}
		this.imageCount = this.images.length

		this.fetchImages();
		this.$el.data(pluginName + "-images", this.images);
		
		this.$el[binder]("start." + pluginName, $.proxy(this, "start"))
			[binder]("stop." + pluginName, $.proxy(this, "stop"))
			[binder](this.opts.stopEvents, function() {
				that.$el.trigger("stop." + pluginName);
			})
			[binder](this.opts.startEvents, function() {
				that.$el.trigger("start." + pluginName);
			})
			[binder](this.opts.stopStartEvents, function() {
				that.playing ? that.$el.trigger("stop." + pluginName) : that.$el.trigger("start." + pluginName);
			});
		
		this.opts.autoStart && this.start();
    };


	/**
	 * @name loadImage
	 * @private
	 * @function
	 * @description preloads an image
	 *				(This is put in a function in order to maintain a reference to the index of teh image when the callback runs asynchronously)
	 * @param {Array} index		Position of the image in the images array
	 */
	Plugin.prototype.loadImage = function (index, shift) {
		var that = this,
			loader = $("<img style=\"display:none\" src=\"" + that.imageSrcs[index] + "\">").load(function () {
				that.images[index + shift] = that.imageSrcs[index];
				$.fn.flickbook.fetchedImages[that.imageSrcs[index]] = true;
			});
	}

	/**
	 * @name fetchImages
	 * @private
	 * @function
	 * @description preloads all images required by an instance of $.flickbook
	 * @param {Array} images	Array of urls of the images
	 * @param {String} originalSrc	Initial value of the image's src attribute
	 * @param {Boolean} keepOriginal	Whether or not to include teh original image src in the list of images to be cycled through
	 * @return {Array}	Array containing url of each image fetched (won't necessarily be fully populated when returned, but is gradually populated as each image load event fires)
	 */
    Plugin.prototype.fetchImages = function () {
				
		var shift = 0,
			originalSrc = this.$el.attr("src");
		this.imageSrcs = this.images;
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
		opts.startEvents = startEvents.join(" ");
		opts.stopEvents = tempStop.join(" ");
		opts.stopStartEvents = stopStartEvents.join(" ");
	}

	
    
   

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.flickbook = function ( options ) {
		
		options = $.extend( {}, defaults, options) ;
		
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
	
	$.fn.flickbook.fetchedImages = {};

})( jQuery, window, document );