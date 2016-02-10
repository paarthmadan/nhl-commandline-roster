var request = require('request');
var cheerio = require('cheerio');
var names = [];
var teamUrls = [];
var teamNames = [];



//fetches variety of team names, to output to users to choose from
request("https://www.nhl.com/info/teams", function(err, resp, html){
	var $ = cheerio.load(html);
	//selects team names
	$('a.team-city', 'section.marketing-block.marketing-body.teams').each(function(){
		var teamHref = $(this).attr('href');
		
		teamUrls.push(teamHref);

	});


	//clean up teamUrls to isolate team name

	for(var x = 0; x < teamUrls.length; x++){

		var tempName = teamUrls[x].split(".");

		var firstSegment = tempName[0];

		var finalString = "";
		for(var i = 7; i < firstSegment.length; i++){
			finalString += firstSegment[i];
		}

		teamNames.push(finalString);





	}



console.log(teamNames);

});

//http request to team website

var playerSearch = function(teamUrl){

request(teamUrl, function(err, resp, body){
	if(!err && resp.statusCode == 200){
		//store DOM into var
		var $ = cheerio.load(body);
		//scrape using selectors
		$('a', '.data').each(function(){
			var name = $(this).text();
			names.push(name);





		});


		//clean using collection of if statements
		for(var i = 0; i < names.length; i++){

			var firstChar = names[i].charAt(0);
			var secondChar = names[i].charAt(1);
			var thirdChar = names[i].charAt(2);

			if(firstChar != '\n' && firstChar != '#' && firstChar + secondChar + thirdChar != "Age"){
				console.log(names[i]);
			}
		}

	}
	//error message
	else{
		console.log("failure");
	}
});


}

//calls function with given teamUrl
// playerSearch(teamUrl);
