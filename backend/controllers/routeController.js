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
        res.push(ObjectId(l[i].LocationID));
    }

    return res;
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
    var audioIDs = req.body.audioIDs;

    console.log(audioIDs)

    audioIDs = convertObjectID(audioIDs);

    route.Title = title;
    route.Description = description;
    route.AudioIDs = audioIDs;

    route.save(err => {
        if (err) {
            return res.json({ success: false, err: err });
        } else {
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
                                { _id: { $in: locations } },
                                (err, locations) => {
                                    if (err) {
                                        return res.json({ success: false, err: err });
                                    } else {
                                        return res.json({ success: true, locations: locations, route: route, audios: audios });
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
}
