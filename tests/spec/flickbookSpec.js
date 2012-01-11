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
			var fetched = image.data("flickbook-images");
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
		
		// note te way to check is to check ifplaying is true aor if the interval is not null
		it("defaults to mousein and out events", function() {});
		it("default events can be overridden", function() {});
		it("can handle multiple events for starting the plugin", function() {});
		it("can handle multiple events for stopping the plugin", function() {});
		it("can have the same event starting and stopping the plugin", function() {});
		it("can have the same event starting and stopping the plugin when there are lots of events in play", function() {});
		it("starts automatically when autolad is true", function() {});
		it("returns flickbook to start when onstop is set to reset", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
	});	 
	
	describe("preloading of images", function(){
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
		it("", function() {});
	});	 

});
