# Flickbook

A jQuery plugin for cycling through a stack of images

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com//grunt-scaffolding/master/dist/flickbook.min.js
[max]: https://raw.github.com//grunt-scaffolding/master/dist/flickbook.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/flickbook.min.js"></script>
<script>
jQuery(function($) {
  	$.('img').flickbook({
	  	images: 'img1.jpg,img2.jpg,img3.jpg',
	  	speed: 100,
        startEvent: "click",
        stopEvent: "click", 
        autoStart: false,
        onStop: "reset", 
    }); 
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
