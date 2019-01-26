const express = require('express');
const app = express();
const https = require("https");
const GOOGLE_API_KEY = "AIzaSyCEQQ1KxrsWt4Km6a7E_A_vTgBTNk8Tms8";

// meters
const searchRadius = 500;

const landmarkType = "museum";

app.get('/landmarks/', function(req, res) {
  const lat = req.query.lat;
  const lon = req.query.lon;

  var query = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${searchRadius}&type=${landmarkType}&key=${GOOGLE_API_KEY}`;

  let data = '';

  console.log("request sent.");
  https.get(query, (queryRes) => {
    console.log("response received.");

    queryRes.on('data', (chunk) => {
      data += chunk;
    });

    queryRes.on('end', () => {

      var landmarks = [];
      JSON.parse(data).results.forEach(function(result) {

        var landmarkJSON = {
          name: result.name,
          placeID: result.place_id,
          lat: result.geometry.location.lat,
          lon: result.geometry.location.lng
        };

        landmarks.push(landmarkJSON);
      });

      res.json({
        landmarks
      });
    });

  }).on("error", (err) => {
    console.log("Error :" + err.message);
  });


});

app.listen(8080);
