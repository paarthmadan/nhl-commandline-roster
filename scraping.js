//requires dependencies

var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var chalk = require('chalk');

//create arrays
var names = [];
var playerUrls = [];
var teamUrls = [];
var teamNames = [];


var longStringCheck = "\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\tShoots:\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t";
var techHeadings = [];
techHeadings = ["Year" ,"Games Played",
				"Goals", "Assists",
				 "Points", "+/-", 
				 "Penalties in Minutes" , 
				 "PowerPlay Goals", "PowerPlay Points",
				 "Short-handed Goals" , "Short-handed Points",
				 "Game-winning goals", "Overtime Goals", 
				 "Shots", "Shooting Percentage"];

var infoHeadings = ["Jersey Number", "Height", 
					"Weight", "Shooting Hand", 
					"Date of Birth", "Area of Birth"];

var longestLength = 21;


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

	var stats = [];
	var techStats = [];
	var playerIndexNumber;


	var currentName;


	
	console.log("\n" + "Enter players name, as seen above (correct spelling and casing!)" + "\n");


	
	prompt.get(['plrName'], function (err,result){
		var name = result.plrName;
		currentName = name;



		
	var indexFound = false;
	var counter = 0;
	while(indexFound == false){
			
			if(names[counter].toUpperCase() == currentName.toUpperCase()){
				indexFound = true;
				playerIndexNumber = counter;
			}


		counter++;
	}


	var playerStatsUrl = "http://" + teamFinal + ".nhl.com" + playerUrls[playerIndexNumber];
	// console.log(playerStatsUrl);

	request(playerStatsUrl, function(err, resp, html){

			if(!err && resp.statusCode == 200){

					var $ = cheerio.load(html);

					$('div.plyrTmbStatLine', 'div#tombstoneStats').each(function(){

						//string filtering and cleaning

						var text = $(this).text();
						var split = text.split(" ");
						var pusher;
						var subject = split[0];


							if(subject == "Number:"){
								pusher = split[1];
							}else if(subject == "Height:"){
								pusher = split[1] + split[2];
							}else if(subject == "Weight:"){
								pusher = split[1];
							}else if(subject == longStringCheck){
								pusher = split[1];
							}else if(subject == "\n\t\t\t\t\t\t\t\t\t\t\tBorn:"){
								pusher = split[1] + " "+ split[2] +" "+ split[3].substring(0,4);
							}else if(subject == "Birthplace:"){
								pusher = split[1] + " " + split[2]+ " "+ split[3]; 
								// + split[4];
							}
						
						stats.push(pusher);
					
					});

					console.log("\n" + "Player Statistics:" + "\n");


					var diff = longestLength - "Name".length;

					for(var j = 0; j < diff; j++){
								process.stdout.write(" ");
							}
					process.stdout.write("Name:\t" + names[playerIndexNumber] + "\n");



					for(var i = 0; i < 6; i++){
						var diff = longestLength - infoHeadings[i].length;

							if(stats[i] != null)
							{
									for(var j = 0; j < diff; j++){
										process.stdout.write(" ");
									}

							
								process.stdout.write(infoHeadings[i] + ":\t" + stats[i] + "\n");
							}
					}

					process.stdout.write("\n");

					// process.stdout.write("Jersey Number: " + stats[0] + "\n");
					// process.stdout.write("       Height: " + stats[1] + "\n");
					// process.stdout.write("       Weight: " + stats[2] + "\n");
					// process.stdout.write("Shooting Hand: " + stats[3] + "\n");
					// process.stdout.write("Date of Birth: " + stats[4] + "\n");
					// process.stdout.write("Area of Birth: " + stats[5] + "\n\n");
					
			}else{
				console.log("error");
			}



	});


	var temp = playerUrls[playerIndexNumber];
	var id = temp.split("=");

	 var tempLength = id.length;

	var actualId = id[tempLength-1];

	


	request("https://www.nhl.com/player/" + actualId , function(err, resp, html){
		
			var $ = cheerio.load(html);
		
			$('div[class="responsive-datatable__scrollable"]','div[class="player-overview__stats"]').find('tr[data-index="0"]').find('td[data-row=0]').each(function(){
				var text = $(this).children().text();
				techStats.push(text);
				
			});

			$('li[class="player-bio__item"]' , 'ul[class="player-bio__list"]').find('span[class="player-bio__label"]').each(function(){

			

				var gloveText = $(this).text();
				
				if(gloveText == "Gloves:"){
					var isGoalie = true;
					// console.log("Goalie detected");
				}


			});


			process.stdout.write("\n" + "Technical Statistics:" + "\n")

			for(var i = 0; i < 15; i++){
				var diff = longestLength-techHeadings[i].length;
				// var analysisVar = techHeadings[i];
				// var colour;

				// if(analysisVar > definedPoints){
				// 	colour = setColour;
				// }else if...

					if(techStats[i] != null){

							for(var j = 0; j < diff; j++){
								process.stdout.write(" ");
							}


							process.stdout.write(techHeadings[i] + ":\t" + techStats[i] + "\n");
							//chalk.cyan(process.stdout.write("debug"));

					}
			}

			process.stdout.write("\n");


	});




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