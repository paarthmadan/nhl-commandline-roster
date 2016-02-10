var request = require('request');
var cheerio = require('cheerio');
var urls = [];


var teamUrl = "http://canadiens.nhl.com/club/roster.htm"

var playerSearch = function(teamUrl){

request(teamUrl, function(err, resp, body){
	if(!err && resp.statusCode == 200){
		
		var $ = cheerio.load(body);

		$('a', '.data').each(function(){
			var url = $(this).text();
			urls.push(url);





		});



		for(var i = 0; i < urls.length; i++){

			var firstChar = urls[i].charAt(0);
			var secondChar = urls[i].charAt(1);
			var thirdChar = urls[i].charAt(2);

			if(firstChar != '\n' && firstChar != '#' && firstChar + secondChar + thirdChar != "Age"){
				console.log(urls[i]);
			}
		}

	}

	else{
		console.log("failure");
	}


});


}


playerSearch(teamUrl);
