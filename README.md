# NHL ROSTER CLI - Node.js

### What is it?

##### A command line interface, created by Paarth Madan, using Node.js

  - Fetches all current teams in the NHL
  - Fetches players and goalies on respective teams
  - Fetches players/goalies background information, and current statistics (+/- , points, goals, save % etc.)
  - Categorizes stats based on number (EG: points > 50, colour = red)
  - Easy and short terminal commands, for fast and efficient stat watching!

### Current Status
Fetches teams, players / goalies, background information and technical stats. Differentiates by type of player (RW, LW, Goalie)
### What's Left
Categorization of Stats (EG: Colour Coordination of Amount of Points), Shortcuts (command line '-h' style), and perhaps the creation of an NHL API.

### Packages Used
request - https://www.npmjs.com/package/request
```sh
$ npm install request
```
cheerio - https://www.npmjs.com/package/cheerio
```sh
$ npm install cheerio
```

prompt - https://www.npmjs.com/package/prompt
```sh
$ npm install prompt
```


### Development

This project is being developed through the use of Node.js (the only real dev language =) ). Because of the frequent screen scraping, HTML, JS, and jQuery were also of use.

#### Created by Paarth Madan



