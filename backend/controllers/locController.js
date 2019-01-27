const Location = require("../schemas/location");
const Audio = require("../schemas/audio");
const Route = require("../schemas/route");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

function convertObjectID(l) {
    console.log(l);
    var res = [];
    for (var i = 0; i < l.length; i++) {
        res.push(ObjectId(l[i]));
    }
    return res;
}

exports.getInfoLocationIDFunc = function (req, res) {
    const id = req.body.data.placeID;
    const name = req.body.data.name;
    const type = "Museum";
    const lat = req.body.data.lat;
    const lon = req.body.data.lon;

    Location.findOne(
        { PlaceID: id },
        (err, loc) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                if (loc == null) {
                    let location = Location();
                    location.Longitude = lon;
                    location.Latitude = lat;
                    location.Name = name;
                    location.Type = type;
                    location.PlaceID = id;
                    location.save(err => {
                        if (err) {
                            return res.json({ success: false, err: err });
                        } else {
                            return res.json({ success: true, location: location, routes: [], audios: [] });
                        }
                    })
                } else {

                    var audioIDs = convertObjectID(loc.AudioIDs);
                    var routeIDs = convertObjectID(loc.RouteIDs);
                    Audio.find(
                        { _id: { $in: audioIDs } },
                        (err, audios) => {
                            if (err) {
                                return res.json({ success: false, err: err });
                            } else {
                                Route.find(
                                    { _id: { $in: routeIDs } },
                                    (err, routes) => {
                                        if (err) {
                                            return res.json({ success: false, err: err });
                                        } else {
                                            return res.json({ success: true, location: loc, routes: routes, audios: audios });
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        }
    )
}

exports.updateLocationWithAudioFunc = function (req, res) {
    const id = req.body.placeID;
    const audioID = ObjectId(req.body.audioID);
    Location.findOneAndUpdate(
        { 'PlaceID': id },
        { '$push': { 'AudioIDs': audioID } },
        (err, _) => {
            if (err) {
                return res.json({
                    success: false,
                    error: err
                })
            }
            return res.json({
                success: true,
            })
        }
    );
}

exports.newLocationFunc = function (req, res) {
    let location = new Location();
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const name = req.body.name;
    const type = req.body.type;

    if (!latitude || !longitude || !name) {
        return res.json({
            first: req.body,
            success: false,
            error: "Invalid Inputs"
        });
    }

    location.Latitude = latitude;
    location.Longitude = longitude;
    location.Name = name;
    location.Type = type;
    location.save(err => {
        if (err) {
            return res.json({ success: false, err: err });
        } else {
            return res.json({ success: true, location: location })
        }
    })
}

exports.getLocationsFunc = function (req, res) {
    Location.find({}, null, (err, locs) => {
        if (err) {
            return res.json({
                success: false,
                error: "Invalid request for locations"
            })
        } else {
            console.log("Got all locations")
            console.log(locs);
            return res.json({ success: true, locs: locs });
        }
    })
}

exports.getLocationByNameFunc = function (req, res) {
    const name = req.params.name;
    Location.findOne({ 'Name': name }, null,
        (err, loc) => {
            if (err) return res.json({
                success: false,
                error: err
            })
            if (!loc) {
                console.log("nothing");
                return res.json({
                    success: false,
                    loc: loc
                });
            }
            console.log('%s', loc.Name);
            return res.json({ success: true, loc: loc });
        });
}

exports.getLocationByLongLatFunc = function (req, res) {
    const longtitude = req.params.longtitude;
    const latitude = req.params.latitude;
    Location.findOne({ 'Longtiude': longtitude, 'Latitude': latitude }, null,
        (err, loc) => {
            if (err) return res.json({
                success: false,
                error: err
            })
            if (!loc) {
                console.log("nothing");
                return res.json({
                    success: false,
                    loc: loc
                });
            }
            console.log('%s %s %s', loc.Name, loc.Longtitude, loc.Latitude);
            return res.json({ success: true, loc: loc });
        });
}
