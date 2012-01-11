<!DOCTYPE HTML>
<html>
<head>
  <title>Jasmine Test Runner</title>
  <link rel="stylesheet" type="text/css" href="lib/jasmine-1.1.0/jasmine.css">
  <script type="text/javascript" src="lib/jasmine-1.1.0/jasmine.js"></script>
  <script type="text/javascript" src="lib/jasmine-1.1.0/jasmine-html.js"></script>
  <script type="text/javascript" src="lib/jasmine-jquery.js"></script>
  <!-- include source files here... -->
  <script id="jquery" type="text/javascript" src="../../jquery/jquery-<?php echo $_GET["jquery-version"] ?>.js"></script>
  <script type="text/javascript" src="../src/jquery.flickbook.js"></script>
  

  <!-- include spec files here... -->
  <script type="text/javascript" src="spec/flickbookSpec.js"></script>


</head>
<body>
<h1>Testing with jQuery <?php echo $_GET["jquery-version"] ?></h1>
<script type="text/javascript">
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
	jasmine.getEnv().execute();
  

</script>

</body>
</html>
