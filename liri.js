
// Requirements to grab packages
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

// Take in user input
const command = process.argv[2];
const input = process.argv.slice(3).join("+");

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
    concertThis();
    break;
}


function concertThis() {
  axios
    .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {
      let data = response.data;

      for (i = 0; i < data.length; i++) {
        console.log(`Venue: ${data[i].venue.name}
Location: ${data[i].venue.city}`)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};