function testSuite() {
	describe("jquery.flickbook", function() {
		  it("makes testing JavaScript awesome!", function() {
			expect(true).toBeTrue();
		  });
	});
}

function testAllJquerys() {
	var jqueryInclude = document.getElementById("jquery"),
		head = document.getElementsByTagName("head")[0],
		versions = "1.6,1.7.1,1.5.1".split(",");
		
		
	function runSuite() {
		describe("jquery-" + version, testSuite);
		switchjQuery();
	}
	
	function switchjQuery() {
		version = versions.shift();
	//	jQuery = $ = null;
		jqueryInclude = document.createElement("script");
		jqueryInclude.type = "text/javascript";
		if (jqueryInclude.addEventListener){  
		  jqueryInclude.addEventListener('load', runSuite, false);   
		} else if (jqueryInclude.attachEvent){  
		  jqueryInclude.attachEvent('onload', runSuite);  
		}  
		head.appendChild(jqueryInclude);
		jqueryInclude.src = "../../jquery/jquery-" + version + ".js";
	}
	
	switchjQuery()
}

testAllJquerys();