const GOOGLE_API_KEY = "AIzaSyCEQQ1KxrsWt4Km6a7E_A_vTgBTNk8Tms8";
const searchRadius = 500;
const landmarkTypes = ["museum", "amusement_park", "art_gallery", "library", "church", "city_hall"];
const https = require("https");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const Polyline = require("@mapbox/polyline");

exports.getNearbyAttractionsFunc = function (req, res) {
    const lat = req.query.lat;
    const lon = req.query.lon;

    var landmarks = [];

    landmarkTypes.forEach(function(landmarkType) {
      var query = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${searchRadius}&type=${landmarkType}&key=${GOOGLE_API_KEY}`;

      let data = '';

      console.log("request sent.");
      https.get(query, (queryRes) => {
          console.log("response received.");

          queryRes.on('data', (chunk) => {
              data += chunk;
          });

          queryRes.on('end', () => {


              JSON.parse(data).results.forEach(function (result) {
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
    })
};

exports.getGoogleRouteFunc = function (req, res) {
    var placeIDs = req.query.places.split(",");
    var optimise = req.query.optimise;

    if (placeIDs.length < 2) {
        res.send("Whatever.");

        return;
    }

    const originID = `place_id:${placeIDs[0]}`;
    const destID = `place_id:${placeIDs[placeIDs.length - 1]}`;
    const travelMode = "walking";

    var waypoints = "";
    for (i = 1; i < placeIDs.length - 1; i++) {
        waypoints += `|place_id:${placeIDs[i]}`;
    }

    if (optimise && waypoints.length != 0) {
        waypoints = "optimize:true" + waypoints;
    }

    var endpoint = "https://maps.googleapis.com/maps/api/directions/json?";

    var query = `${endpoint}origin=${originID}&destination=${destID}&key=${GOOGLE_API_KEY}`;

    if (waypoints.length != 0) {
        query += `&waypoints=${waypoints}`;
    }

    console.log(query);

    var data = '';

    console.log("request sent.");
    https.get(query, (queryRes) => {
        console.log("response received.");

        queryRes.on('data', (chunk) => {
            data += chunk;
        });

        queryRes.on('end', () => {
            var dataJSON = JSON.parse(data);

            if (dataJSON.status != "OK") {
                res.send(`Error occurred during direction service query. Status: ${dataJSON.status}
          Message: ${dataJSON.error_message}`);
                return;
            }

            var overview_string = dataJSON.routes[0].overview_polyline.points;
            var points = Polyline.decode(overview_string);

            var formattedRoutes = [];
            points.forEach(function (point) {
                formattedRoutes.push({
                    latitude: point[0],
                    longitude: point[1]
                });
            })

            res.json({
                routes: formattedRoutes
            });
        });

    }).on("error", (err) => {
        console.log("Error :" + err.message);
    });

};