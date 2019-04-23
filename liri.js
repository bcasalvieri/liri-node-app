
// Requirements to grab packages
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const moment = require("moment");

// Take in user input
let command = process.argv[2];
let input = process.argv.slice(3).join(" ");

// switch statement for commands
switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
};


function concertThis() {
  axios
    .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {
      const data = response.data;

      for (i = 0; i < data.length; i++) {
        // convert data[i].datetime to MM/DD/YYYY
        let convertedDate = moment(data[i].datetime).format("MM/DD/YYYY");

        console.log(`Venue: ${data[i].venue.name}
Location: ${data[i].venue.city}
Date: ${convertedDate}
        
`);

        fs.appendFile("log.txt", `Venue: ${data[i].venue.name}
Location: ${data[i].venue.city}
Date: ${convertedDate}

`, function(error) {
          if (error) {
            console.log(error);
          }
          else {
            console.log("Content Added!");
          };
        });
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};


function spotifyThis() {
  spotify
    .search({
       type: 'track', 
       query: input
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
};


function movieThis() {
  if (input === "") {
    input = "Mr. Nobody"
  };

  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + input)
    .then(function(response) {
      console.log(`Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Country: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}

`);

      fs.appendFile("log.txt", `Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Country: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}

`, function(error) {
        if (error) {
          console.log(error);
        }
        else {
          console.log("Content Added!");
        };
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};


function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    };

    let dataArr = data.split(",");
    
    command = dataArr[0];
    input = dataArr[1];

    switch (command) {
      case "concert-this":
        concertThis();
        break;
      case "spotify-this-song":
        spotifyThis();
        break;
      case "movie-this":
        movieThis();
        break;
    };
  });
};