/**
 * @name jQuery.flickbook
 * @public
 * @function
 * @description	Turns an image into a flickbook type widget, which cycles through a series of images
 * @param {Object} opts	Object that sets configurable options (see $.fn.flickbook.defaults)
 */
$.fn.flickbook = function(opts) {
	
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
    function fetchImages(images, originalSrc, keepOriginal) {
				
		/**
		 * @name loadImage
		 * @private
		 * @function
		 * @description preloads an image
		 *				(This is put in a function in order to maintain a reference to the index of teh image when the callback runs asynchronously)
		 * @param {Array} index		Position of the image in the images array
		 */
		function loadImage(index) {
			var loader = $("<img style=\"display:none\" src=\"" + images[index] + "\">").appendTo($body).load(function () {
				result[index + shift] = images[index];
				cache[arr[index]] = true;
				loader.remove();
			});
		}
		
		var shift = 0,
			$body = $("body"),
			result = [],
			cache = $.fn.flickbook.fetchedImages,
			i = 0,
			il = images.length;
		
		// Put the original image at the start of the results when required
		if(keepOriginal && (originalSrc != images[0])) {
			result[0] = originalSrc;
			cache[originalSrc] = true;
			shift = 1;
		}
		
        for(; i<il; i++) {
            if (cache[images[i]]) {
				result[i + shift] = images[i];
			} else {
				loadImage(i);
			}
        }
		
        // can return result synchronously as it is a reference and will still get populated by the asynchronous image load callbacks
		return result;
    }
	
	/**
	 * @name processEvents
	 * @private
	 * @function
	 * @description	Analyses the events that stop and start the plugin and pulls out all the events used to both stop and start the plugin
	 */
	function processEvents() {
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

	opts = $.extend($.fn.flickbook.defaults, opts);
	
	var index,
		binder = $.fn.on ? "on": "bind";
	
    if (typeof opts.images === "string") {
		opts.images = opts.images.split(",");
	} else if (!$.isArray(opts.images)){
		return;
	}
   
	processEvents();
    
	return this.each(function() {
		
		/**
		 * @name start
		 * @function
		 * @private
		 * @description	Starts cycling through the available images
		 */
		function start () {
			if (!playing) {
				to = setInterval(function() {
					index = (index+1) % imageCount;
					showImage();
				}, opts.speed);
				playing = true;
			}
		}

		/**
		 * @name stop
		 * @function
		 * @private
		 * @description	Stops cycling through the available images
		 */
		function stop() {
			if (playing) {
				clearInterval(to);
				if (opts.onStop === "reset") {
					index = 0;
				}
				showImage();
				playing = false;
			}
		}

		/**
		 * @name start
		 * @function
		 * @private
		 * @description	displays the next available image
		 */
		function showImage() {
			var attempts = 0;
			while(!images[index] && attempts < imageCount) {
				index = (index+1) % imageCount;
				attempts++;
			}
            $this.attr("src", images[index]);
        }
		
		var $this = $(this),
			images,
			imageCount,
			playing = false,
			to,
			index = -1;
		
		images = ($this.data("flickbook-images") || opts.images.slice());
		
		if($this.hasClass("flickbooked")) {
			return;
		}
		
		if(!$.isArray(images)) {
			images = images.split(",");
		}
		imageCount = images.length

		images = fetchImages(images, $this.attr("src"), opts.keepOriginalImage);
		$this.data("flickbook-images", images);
		
		$this[binder]("start.flickbook", start)
			[binder]("stop.flickbook", stop)
			[binder](opts.stopEvents, function() {
				$this.trigger("stop.flickbook");
			})
			[binder](opts.startEvents, function() {
				$this.trigger("start.flickbook");
			})
			[binder](opts.stopStartEvents, function() {
				playing ? $this.trigger("stop.flickbook") : $this.trigger("start.flickbook");
			});
		
		opts.autoStart && start();
    });
}

$.fn.flickbook.defaults = {
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
};

//list of already fetched images available to all instances
$.fn.flickbook.fetchedImages = {};

