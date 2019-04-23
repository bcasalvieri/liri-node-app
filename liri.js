
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

      for (let i = 0; i < data.length; i++) {
        // convert data[i].datetime to MM/DD/YYYY
        let convertedDate = moment(data[i].datetime).format("MM/DD/YYYY");

        // print results to terminal
        console.log(`Venue: ${data[i].venue.name}
Location: ${data[i].venue.city}
Date: ${convertedDate}
        
`);

        // add results to log.txt
        fs.appendFile("log.txt", `Venue: ${data[i].venue.name}
Location: ${data[i].venue.city}
Date: ${convertedDate}

`, function(error) {
          if (error) {
            console.log(error);
          };
        });
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};


function spotifyThis() {
  if (input === "") {
    input = "The Sign Ace of Base"
  };
  
  spotify
    .search({
       type: 'track', 
       query: input
    })
    .then(function(response) {
      const tracks = response.tracks.items;

      // print results to terminal
      tracks.forEach(song => console.log(`Artist(s): ${song.artists[0].name}
Song Name: ${song.name}
Preview Song: ${song.preview_url}
Album: ${song.album.name}
      
`));

      // add results to log.txt
      tracks.forEach(song => fs.appendFile("log.txt", `Artist(s): ${song.artists[0].name}
Song Name: ${song.name}
Preview Song: ${song.preview_url}
Album: ${song.album.name}
            
`, function(error) {
        if (error) {
          console.log(error);
        };
      }));
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
      // print results to terminal
      console.log(`Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Country: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}

`);

      // add results to log.txt
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