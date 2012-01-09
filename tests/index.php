<!DOCTYPE HTML>
<html>
<head>
  <title>Jasmine Test Runner</title>

  <style>
	  iframe {
		  width: 100%;
	  }
	  
  </style>

</head>
<body>
	<?php
		$versions = explode(",", "1.7.1,1.7,1.6.4,1.6.3,1.6.2,1.6.1,1.6,1.5.2,1.5.1,1.5,1.4.4,1.4.3,1.4.2,1.4.1,1.4");
		foreach($versions as $version) {
			echo "<iframe src=\"testSuite.php?jquery-version=$version\"></iframe>";
		}
	?>

</body>
</html>
