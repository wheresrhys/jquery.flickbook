$.fn.flickBook = function(opts) {
	opts = $.extend($.fn.flickBook.defaults, opts);
	var index = false;
    if (opts.images instanceof Array) { 
		if(!opts.images.length) return;
	} else if (typeof opts.images == "string"){
		opts.images = string.split(",");
	} else if (typeof opts.images == "number" && root.match(/{\w}/)) {
		index = 1;
	} else {
		return;
	}
    var images = [],
        imageCount = opts.images.length;
   
    function fetchImages() {
        for(var i = 0; i<imageCount; i++) {
            fetchImage(i);
        }
        function fetchImage(index) {
            var loader = $("<img style=\"display:none\" src=\"" + opts.images[index] + "\">").appendTo($("body")).load(function () {
                images[index] = opts.images[index];
                loader.remove();
            });
        }
    }
    fetchImages();
    
	return $(this).each(function() {
		var hereImages = opts.images.slice(),
			hereImageCount = imageCount,
			$this = $(this);
		if ($this.attr("src")) {
			hereImageCount = imageCount+1;
			hereImages.push($this.attr("src"));
		}
        var to,
            index = -1;
            $this.hover(function() {
            to = setInterval(function() {
                    index = (index+1) % hereImageCount;
                    while(!hereImages[index]){
                        index = (index+1) % hereImageCount;
                    }
                    showImage();
                }, opts.speed);
            }, function() {
                clearInterval(to);
                index = hereImageCount-1;
                showImage();
            });
            
            
        function showImage() {
            $this.attr("src", hereImages[index]);
        }
    });
}

$.fn.flickBook.defaults = {
	images: null, // can take arrya, cooma separted string or an integer. idf one has same src as img element then ignore it
	speed: 100,
	root: "", // can be a tring, on to which teh image is appended, or a string with {} into which teh image is insterted
	imageType: "separate", // vertical sprite, horizontal sprite
	startEvent: "hover", // or click, dbl click
	stopEvent: "blur" // or click, dbl click, hover
};