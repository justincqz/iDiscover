const Route = require("../schemas/route");
const Location = require("../schemas/location");
const Audio = require("../schemas/audio");
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

function getLocationIds(l) {
    var res = [];
    for (var i = 0; i < l.length; i++) {
        res.push(l[i].LocationID);
    }

    return res;
}

function findLocation(id, locations) {
    for (var i = 0; i < locations.length; i++) {
        if (locations[i].PlaceID == id) {
            console.log("here");
            return locations[i];
        }
    }
}

function combineAudioLocs(locations, audios) {
    var clips = [];
    var locationPins = [];
    console.log(audios);
    console.log(locations);
    for (var i = 0; i < audios.length; i++) {
        const location = findLocation(audios[i].LocationID, locations);
        locationPins.push({ "lon": location.Longitude, "lat": location.Latitude });
        clips.push({
            "audio_id": audios[i]._id, "title": audios[i].Title,
            "artist": audios[i].Artist, "type": location.Type, "playcount": audios[i].PlayCount,
            "votes": audios[i].Votes, "filename": audios[i].FileName
        });
    }
    return { "clips": clips, "locationPins": locationPins };
}

function prettifyRouteData(locations, route, audios) {
    var res = combineAudioLocs(locations, audios);
    return {
        "_id": route._id, "title": route.Title, "creator": route.Creator,
        "clips": res.clips, "locationPins": res.locationPins
    };
}

exports.upvoteRouteFunc = function (req, res) {
    const id = req.body.id;

    Route.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $inc: { Vote: 1 } },
        (err, _) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                return res.json({ success: true });
            }
        }
    )
}

exports.downvoteRouteFunc = function (req, res) {
    const id = req.body.id;

    Route.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $inc: { Vote: -1 } },
        (err, _) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                return res.json({ success: true });
            }
        }
    )
}

exports.newRouteFunc = function (req, res) {
    let route = new Route();
    const title = req.body.title;
    const description = req.body.description;
    const creator = req.body.nickname;
    var audioIDs = req.body.audioIDs;

    console.log(audioIDs)

    audioIDs = convertObjectID(audioIDs);

    route.Title = title;
    route.Description = description;
    route.AudioIDs = audioIDs;
    route.Creator = creator;

    route.save(err => {
        if (err) {
            console.log(err);
            console.log(route);
            return res.json({ success: false, err: err });
        } else {
            console.log(route);
            return res.json({ success: true, route: route });
        }
    })
};

exports.getRouteFunc = function (req, res) {
    const routeID = req.body.routeID;

    Route.findOne(
        { _id: ObjectId(routeID) },
        (err, route) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                Audio.find(
                    { _id: { $in: route.AudioIDs } },
                    (err, audios) => {
                        if (err) {
                            return res.json({ success: false, err: err });
                        } else {
                            var locations = getLocationIds(audios);

                            Location.find(
                                { PlaceID: { $in: locations } },
                                (err, locations) => {
                                    if (err) {
                                        return res.json({ success: false, err: err });
                                    } else {
                                        var data = prettifyRouteData(locations, route, audios);
                                        return res.json({ success: true, data: data });
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
}
