
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
  // if no user input, search for Backstreet Boys concerts
  if (input === "") {
    input = "Backstreet Boys";
  };

  axios
    .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {
      const concertsArr = response.data;

      // loop through data array
      concertsArr.forEach(concert => {
        // convert concert date to correct format
        let convertedDate = moment(concert.datetime).format("MM/DD/YYYY");

        // print results to terminal
        console.log(`Venue: ${concert.venue.name}
Location: ${concert.venue.city}
Date: ${convertedDate}
        
`);

        // add results to log.txt
        fs.appendFile("log.txt", `Venue: ${concert.venue.name}
Location: ${concert.venue.city}
Date: ${convertedDate}
                
`, function(error) {
          if (error) {
            console.log(error);
          };
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};


function spotifyThis() {
  // if no user input, search for The Sign by Ace of Base
  if (input === "") {
    input = "The Sign Ace of Base"
  };
  
  spotify
    .search({
       type: 'track', 
       query: input
    })
    .then(function(response) {
      const tracksArr = response.tracks.items;

      tracksArr.forEach(song => {
        // print results to terminal
        console.log(`Artist(s): ${song.artists[0].name}
Song Name: ${song.name}
Preview Song: ${song.preview_url}
Album: ${song.album.name}
      
`);

        // add results to log.txt
        fs.appendFile("log.txt", `Artist(s): ${song.artists[0].name}
Song Name: ${song.name}
Preview Song: ${song.preview_url}
Album: ${song.album.name}
            
`, function(error) {
          if (error) {
            console.log(error);
          };
        });
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};


function movieThis() {
  // if no user input, search for Mr. Nobody
  if (input === "") {
    input = "Mr. Nobody"
  };

  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + input)
    .then(function(response) {

      let movieData = response.data

      // print results to terminal
      console.log(`Title: ${movieData.Title}
Release Year: ${movieData.Year}
IMDB Rating: ${movieData.imdbRating}
Rotten Tomatoes Rating: ${movieData.Ratings[1].Value}
Country: ${movieData.Country}
Language: ${movieData.Language}
Plot: ${movieData.Plot}
Actors: ${movieData.Actors}

`);

      // add results to log.txt
      fs.appendFile("log.txt", `Title: ${movieData.Title}
Release Year: ${movieData.Year}
IMDB Rating: ${movieData.imdbRating}
Rotten Tomatoes Rating: ${movieData.Ratings[1].Value}
Country: ${movieData.Country}
Language: ${movieData.Language}
Plot: ${movieData.Plot}
Actors: ${movieData.Actors}

`, function(error) {
        if (error) {
          console.log(error);
        };
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};


function doWhatItSays() {
  // read random.txt
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    };

    // split string in random.txt into array
    let dataArr = data.split(",");
    
    // reassign command and input variables using dataArr
    command = dataArr[0];
    input = dataArr[1];

    // pass command and input variables through switch statement to run approriate function
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