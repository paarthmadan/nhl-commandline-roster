var request = require('request');
var cheerio = require('cheerio');
var urls = [];


request('http://mapleleafs.nhl.com/club/roster.htm', function(err, resp, body){
	if(!err && resp.statusCode == 200){
		
		var $ = cheerio.load(body);

		$('a', '.data').each(function(){
			var url = $(this).text();
			urls.push(url);
		});



		console.log(urls);

	}

	else{
		console.log(resp.statusCode);
	}


});


