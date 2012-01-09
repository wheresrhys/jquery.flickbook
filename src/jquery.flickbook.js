                                                                     
                                                                     
                                                                     
                                             
$.fn.flickBook = function(opts) {
	var fetchedImages = {};
	
    function fetchImages(arr) {
		var result = [];
        for(var i = 0, il = arr.length; i<il; i++) {
            fetchImage(i);
        }
        
		function fetchImage(index) {
			if (fetchedImages[arr[index]]) {
				result[index] = arr[index];
			} else {
				var loader = $("<img style=\"display:none\" src=\"" + arr[index] + "\">").appendTo($("body")).load(function () {
					result[index] = arr[index];
					fetchedImages[arr[index]] = true;
					loader.remove();
				});
			}
        }
		return result;
    }	
	function processEvents() {
		var tempStart = opts.startEvent.split(" ").sort(),
			tempStop = opts.stopEvent.split(" ").sort();
		startEventLoop: for(var i=0, il = tempStart.length;i<il;i++) {
			for(var j=0, jl = tempStop.length;j<jl;j++) {
				if(tempStart[i] == tempStop[j]) {
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

	opts = $.extend($.fn.flickBook.defaults, opts);
	
	var index = false,
		stopEvents = [], 
		startEvents = [], 
		stopStartEvents = [],
		images = [],
        imageCount = opts.images.length,
		binder = $.fn.on ? "on": "bind";
	
    if (typeof opts.images == "string"){
		opts.images = string.split(",");
	} else if (typeof opts.images == "number" && root.match(/{{\w}}/)) {
		index = 1;
	} else if (!$.isArray(opts.images)){
		return;
	}
   
	processEvents();
    
	return $(this).each(function() {
		var $this = $(this),
			hereImages = $this.data("images") || opts.images.slice(),
			hereImageCount = hereImages.length,
			playing = false,
			to,
			index = -1;
		
		if(!$.isArray(hereImages)) {
			hereImages = hereImages.split(",");
		}
		
		function start () {
			if (!playing) {
				to = setInterval(function() {
					index = (index+1) % hereImageCount;
					while(!hereImages[index]){
						index = (index+1) % hereImageCount;
					}
					showImage();
				}, opts.speed);
				playing = true;
			}
		}
		
		function stop() {
			if (playing) {
				clearInterval(to);
				(opts.onStop == "reset") && (index = hereImageCount-1);
				showImage();
				playing = false;
			}
		}
		
		function showImage() {
            $this.attr("src", hereImages[index]);
        }
		
		hereImages = fetchImages(hereImages);
		
		$this[binder]("start.flickBook", start)
			[binder]("stop.flickBook", stop)
			[binder](stopEvents, function() {
				$this.trigger("stop.flickBook");
			})
			[binder](startEvents, function() {
				$this.trigger("start.flickBook");
			})
			[binder](stopStartEvents, function() {
				playing ? $this.trigger("stop.flickBook") : $this.trigger("start.flickBook");
			});
		
		opts.autoStart && start();
    });
}

$.fn.flickBook.defaults = {
	images: null, // can take arrya, cooma separted string or an integer. idf one has same src as img element then ignore it
	speed: 100,
	root: "", // can be a string, on to which teh image is appended, or a string with {{}} into which teh image is insterted
	imageType: "separate", // vertical sprite, horizontal sprite
	startEvent: "mouseover click", // or click, dbl click
	stopEvent: "mouseout click", // or click, dbl click, hover
	autoStart: true,
	onStop: "reset" // or pause
	// to do include the jiggling around effect
};

