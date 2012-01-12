<!DOCTYPE HTML>
<html>
<head>
  <title>Flickbook tests</title>

  <style>
	  iframe {
		  width: 100%;
	  }
	  
  </style>

</head>
<body>
	<h1>Flickbook tests</h1>
	<script type="text/javascript">
		var versions = "1.7.1,1.7,1.6.4,1.6.3,1.6.2,1.6.1,1.6,1.5.2,1.5.1,1.5".split(","),
			body = document.getElementsByTagName("body")[0];
				
		window.nextTest = function(failed) {
			if(!failed) {
				var iframes = document.getElementsByTagName("iframe");
				body.removeChild(iframes[iframes.length-1]);
			}
			var version = versions.shift();
			if (!version) return;
			
			var	iframe = document.createElement("iframe");
			
			body.appendChild(iframe);
			iframe.src = "testSuite.php?jquery-version=" + version<?php echo (isset($_GET["min"])) ? "&min=true" : "" ?>;
		}
		
		nextTest(true);
	</script>
	
</body>
</html>
