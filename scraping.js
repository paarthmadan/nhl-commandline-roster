//requires dependencies

var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');

//create arrays
var names = [];
var playerUrls = [];
var teamUrls = [];
var teamNames = [];






//fetches variety of team names, to output to users to choose from
request("https://www.nhl.com/info/teams", function(err, resp, html){
	prompt.start();
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

//calls function, to start user-based interactions
startProgram();


});

//http request to team website

var playerSearch = function(teamUrl, teamFinal){

	console.log("Players on team:");


request(teamUrl, function(err, resp, body){
	if(!err && resp.statusCode == 200){
		//store DOM into var
		var $ = cheerio.load(body);


		//scrape using selectors
		$('a', '.data').each(function(){
			var href = $(this).attr('href');
			playerUrls.push(href);
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
		playerStats(teamFinal);
	}
	//error message
	else{
		console.log("failure");
		//if error, prints status code
		console.log(resp.statusCode);

		if(resp.statusCode == 404){
			console.log("Incorrect team name (Ensure spelling, and casing is correct)");
		}


	}


});




}


var playerStats = function(teamFinal){

	var currentName;


	
	console.log("\n" + "Enter players name, as seen above (correct spelling and casing!)" + "\n");


	
	prompt.get(['plrName'], function (err,result){
		var name = result.plrName;
		currentName = name;



		var playerIndexNumber;
	var indexFound = false;
	var counter = 0;
	while(indexFound == false || counter >= names.length){
		if(names[counter] == currentName){
			indexFound = true;
			playerIndexNumber = counter;
		}


		counter++;
	}


	console.log(teamFinal + ".nhl.com" + playerUrls[playerIndexNumber]);



	});

	

}



var startProgram = function(){
console.log("\n" + "NHL Teams to View:" + "\n");

 var printedCounter = 1;

for(var z = 0; z < teamNames.length; z++){


	process.stdout.write(teamNames[z] + "    ");
	if(printedCounter % 5 == 0){
		console.log();
	}

	printedCounter++;
}


console.log("\n" + "Type team name, as written above" + "\n");


//use prompt to ask users for teamname

prompt.get(['TeamName'], function (err, result) {

    var teamFinal = result.TeamName;
    var finalUrl = "http://"+ teamFinal + ".nhl.com/club/roster.htm";
    // console.log(finalUrl);


//calls function with team url
    playerSearch(finalUrl , teamFinal);

    
  });

}