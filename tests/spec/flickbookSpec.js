describe("jquery.flickbook", function() {
	var image;

	beforeEach(function () {
        jasmine.getFixtures().set('<img id="image" src="../img/Image0281.jpg" />');
        image = $('#image');
    });
	
	afterEach(function () {
		jQuery.fn.flickbook.fetchedImages = {};
	});
	
	function checkCount(opts, expectedCount) {
		runs(function() {
			image.flickbook(opts);
		});
		waits(1000);
		runs(function(){
			var fetched = image.data("flickbook-images"),
				count = 0;
			for(var key in fetched) {
				if(fetched.hasOwnProperty(key)) {
					count++;
				}
			}
			expect(count).toBe(expectedCount);
		});
	}
	
	describe("Image loading", function(){
		it("uses all available images", function() {
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0284.jpg"],
				keepOriginalImage: false
			}, 3);
		});
		it("doesn't try to use unavailable images", function() {
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0290.jpg"],
				keepOriginalImage: false
			}, 2);
		});
		it("can handle strings as values for images", function() {
			checkCount({
				images:"../img/Image0282.jpg,../img/Image0283.jpg",
				keepOriginalImage: false
			}, 2);
		});
		it("gets images from data-images when it exists", function() {
			image.attr("data-flickbook-images", "../img/Image0284.jpg,../img/Image0285.jpg");
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0284.jpg"],
				keepOriginalImage: false
			}, 2);
		});
		it("only tries to fetch an image when not already fetched", function() {
			var fetched = jQuery.fn.flickbook.fetchedImages;
			runs(function(){
				fetched["../img/Image0282.jpg"] = "test_value";
				image.flickbook({
					images: ["../img/Image0282.jpg"],
					keepOriginalImage: false
				});
			});
			waits(1000);
			runs(function(){
				expect(fetched["../img/Image0282.jpg"]).toBe("test_value");
			});
		});
		it("keeps the original image when requested to do so", function() {
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0284.jpg"],
				keepOriginalImage: true
			}, 4);
		});
		it("defaults to keeping the original image", function() {
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0284.jpg"]
			}, 4);
		});
		it("removes the original image when requested", function() {
			checkCount({
				images:["../img/Image0282.jpg","../img/Image0283.jpg","../img/Image0284.jpg"],
				keepOriginalImage: false
			}, 3);
		});
		it("doesn't duplicate when initial src equals the first image in the data", function() {
			checkCount({
				images:["../img/Image0281.jpg","../img/Image0283.jpg","../img/Image0284.jpg"],
				keepOriginalImage: true
			}, 3);
		});
		it("won't try and initialise twice on the same element", function() {
			runs(function() {
				image.addClass("flickbooked").flickbook({
					images:["../img/Image0281.jpg","../img/Image0283.jpg","../img/Image0284.jpg"]
				});
			});
			waits(1000);
			runs(function(){
				expect(image.data("flickbook-images")).toBeUndefined();
			})
		});
		it("won't initialise when no images provided", function() {
			runs(function() {
				image.addClass("flickbooked").flickbook({
					images:null
				});
			});
			waits(1000);
			runs(function(){
				expect(image.data("flickbook-images")).toBeUndefined();
			})
		});
		
//		it("uses the image root template properly", function() {});
//		it("works properly when images is an integer", function() {});
		
	});	  
	
	describe("starting and stopping of animations", function(){
		var speed = 100;
		
		function initSlowFB (obj) {
			image.flickbook($.extend(true, {}, {
				images: "../img/Image0281.jpg,../img/Image0282.jpg,../img/Image0283.jpg,../img/Image0284.jpg,../img/Image0285.jpg,../img/Image0286.jpg,../img/Image0287.jpg",
				speed: speed
			}, obj));
		};
		
		function pauseThen(func) {
			waits(3*speed);
			runs(func);
		}
		
		// note te way to check is to check ifplaying is true aor if the interval is not null
		it("defaults to start and stop on mouseover/out events", function() {
			var imageSrc;
			runs(function() {
				initSlowFB();
				image.trigger("mouseover");
			});
			pauseThen(function() {
				expect(image.attr("src")).toNotBe("../img/Image0281.jpg");
				image.trigger("mouseout");
				imageSrc = image.attr("src");
			});
			pauseThen(function() {
				expect(image.attr("src")).toBe(imageSrc);
			});
		});
		it("allows default events to be overridden", function() {
			var src;
			runs(function() {
				initSlowFB({
					startEvent: "click",
					stopEvent: "focus"
				});
				image.trigger("mouseover");
			});
			pauseThen(function() {
				//check mouseover didn't start the flickbook
				expect(image.attr("src")).toBe("../img/Image0281.jpg");
				//start the flickbook
				image.trigger("click");
			});
			pauseThen(function() {
				src = image.attr("src")
				//check flickbook has started
				expect(src).toNotBe("../img/Image0281.jpg");
				image.trigger("mouseout");
			});
			pauseThen(function() {
				//chcek flickbook is not stopped
				expect(image.attr("src")).toNotBe(src);
				//stop the flickbook
				image.trigger("focus");
				src = image.attr("src");
			});
			pauseThen(function() {
				//check flickbook is stopped
				expect(image.attr("src")).toBe(src);
			});
		});
		it("can handle multiple events for starting the plugin", function() {
			var src;
			runs(function() {
				initSlowFB({
					startEvent: "mouseover click"
				});
				image.trigger("mouseover");
			});
			pauseThen(function() {
				src = image.attr("src")
				//check flickbook has started
				expect(src).toNotBe("../img/Image0281.jpg");
				image.trigger("stop.flickbook");
			});
			runs(function() {
				image.trigger("click");
			});
			pauseThen(function() {
				src = image.attr("src")
				//check flickbook has started
				expect(src).toNotBe("../img/Image0281.jpg");
				image.trigger("stop.flickbook");
			});
		});
		it("can handle multiple events for stopping the plugin", function() {
			var src;
			runs(function() {
				initSlowFB({
					stopEvent: "mouseout click"
				});
				image.trigger("start.flickbook");
			});
			pauseThen(function() {
				image.trigger("mouseout");
				src = image.attr("src");
			});
			pauseThen(function() {
				//check flickbook is stopped
				expect(image.attr("src")).toBe(src);
			});			
			runs(function() {
				image.trigger("start.flickbook");
			});
			pauseThen(function() {
				image.trigger("click");
				src = image.attr("src");
			});
			pauseThen(function() {
				//check flickbook is stopped
				expect(image.attr("src")).toBe(src);
			});			
		});
		it("can have the same event starting and stopping the plugin", function() {
			var src;
			runs(function() {
				initSlowFB({
					startEvent: "click",
					stopEvent: "click"
				});
				image.trigger("click");
			});
			pauseThen(function() {
				src = image.attr("src")
				//check flickbook has started
				expect(src).toNotBe("../img/Image0281.jpg");
				image.trigger("click");
				src = image.attr("src");
			});
			pauseThen(function() {
				//check flickbook is stopped
				expect(image.attr("src")).toBe(src);
			});	
		});
		it("can have the same event starting and stopping the plugin when there are lots of events in play", function() {
			var src;
			runs(function() {
				initSlowFB({
					startEvent: "click mouseover focus",
					stopEvent: "click focus mouseout"
				});
				image.trigger("click");
			});
			pauseThen(function() {
				src = image.attr("src")
				//check flickbook has started
				expect(src).toNotBe("../img/Image0281.jpg");
				image.trigger("click");
				src = image.attr("src");
			});
			pauseThen(function() {
				//check flickbook is stopped
				expect(image.attr("src")).toBe(src);
			});
		});
		it("doesn't start automatically by default", function() {
			runs(function() {
				initSlowFB();
			});
			pauseThen(function() {
				expect(image.attr("src")).toBe("../img/Image0281.jpg");
			});
		});
		it("starts automatically when autolad is true", function() {
			runs(function() {
				initSlowFB({autoStart: true});
			});
			pauseThen(function() {
				expect(image.attr("src")).toNotBe("../img/Image0281.jpg");
			});
		});
		it("returns flickbook to start when onstop is set to reset", function() {
			runs(function() {
				initSlowFB({onStop: "reset"});
				image.trigger("start.flickbook");
			});
			pauseThen(function() {
				image.trigger("stop.flickbook");
				expect(image.attr("src")).toBe("../img/Image0281.jpg");
			});
		});
		it("by default returns flickbook to start", function() {
			runs(function() {
				initSlowFB();
				image.trigger("start.flickbook");
			});
			pauseThen(function() {
				image.trigger("stop.flickbook");
				expect(image.attr("src")).toBe("../img/Image0281.jpg");
			});
		});
		it("pauses when onstop is set to pause", function() {
			var imageSrc;
			runs(function() {
				initSlowFB({onStop: "pause"});
				image.trigger("start.flickbook");
			});
			pauseThen(function() {
				image.trigger("stop.flickbook");
				imageSrc = image.attr("src");
			});
			pauseThen(function() {
				expect(((image.attr("src") !== "../img/Image0281.jpg") && (imageSrc === image.attr("src")))).toBe(true);
			});
		});
	});	 
	

});
