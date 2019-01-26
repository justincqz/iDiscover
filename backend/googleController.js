exports.get_close_landmarks = function(req, res) {
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


};

exports.get_planned_route = function(req, res) {
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

      res.json({
        "routes": dataJSON.routes
      });
    });

  }).on("error", (err) => {
    console.log("Error :" + err.message);
  });

};
