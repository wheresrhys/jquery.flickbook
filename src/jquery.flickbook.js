$.fn.flickbook = function(opts) {
	
    function fetchImages(arr, originalSrc, keepOriginal) {
		var shift = 0,
			$body = $("body");
		// put in a function due to the need to keep a good reference to i
		function loadImage(index) {
			// TODO: can I do better than appending to body?
			var loader = $("<img style=\"display:none\" src=\"" + arr[index] + "\">").appendTo($body).load(function () {
				result[index + shift] = arr[index];
				cache[arr[index]] = true;
				loader.remove();
			});
		}
		
		var result = [],
			cache = $.fn.flickbook.fetchedImages,
			i = 0,
			il = arr.length;
		
		if(keepOriginal && (originalSrc != arr[0])) {
			result[0] = originalSrc;
			cache[originalSrc] = true;
			shift = 1;
		}
		
        for(; i<il; i++) {
            if (cache[arr[i]]) {
				result[i + shift] = arr[i];
			} else {
				loadImage(i);
			}
        }
        // can return result synchronously as it is a reference and will still get populated by the asynchronous callbacks
		return result;
    }
	
	function processEvents() {
		var tempStart = opts.startEvent.split(" ").sort(),
			tempStop = opts.stopEvent.split(" ").sort();
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
		startEvents = startEvents.join(" ");
		stopEvents = tempStop.join(" ");
		stopStartEvents = stopStartEvents.join(" ");
	}

	opts = $.extend($.fn.flickbook.defaults, opts);
	
	var index,
		stopEvents = [], 
		startEvents = [], 
		stopStartEvents = [],
		binder = $.fn.on ? "on": "bind";
	
    if (typeof opts.images === "string"){
		opts.images = opts.images.split(",");
	} else if (!$.isArray(opts.images)){
		return;
	}
   
	processEvents();
    
	return $(this).each(function() {
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
		
		
		//TODO throw some errors
		//
	//	} else if (typeof images == "number" && root.match(/{{\w}}/)) {
	//		index = 1;
	//}
	
		function start () {
			if (!playing) {
				to = setInterval(function() {
					index = (index+1) % imageCount;
					showImage();
				}, opts.speed);
				playing = true;
			}
		}
		
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
		
		function showImage() {
			while(!images[index]){
				index = (index+1) % imageCount;
			}
            $this.attr("src", images[index]);
        }
		
		images = fetchImages(images, $this.attr("src"), opts.keepOriginalImage);
		$this.data("flickbook-images", images);
		
		$this[binder]("start.flickbook", start)
			[binder]("stop.flickbook", stop)
			[binder](stopEvents, function() {
				$this.trigger("stop.flickbook");
			})
			[binder](startEvents, function() {
				$this.trigger("start.flickbook");
			})
			[binder](stopStartEvents, function() {
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

