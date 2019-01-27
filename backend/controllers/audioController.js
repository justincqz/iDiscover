const Audio = require("../schemas/audio");
const moment = require("moment");
const mongoose = require("mongoose");
const Location = require("../schemas/location");
const User = require("../schemas/user");
var ObjectId = mongoose.Types.ObjectId;

exports.uploadAudioFileFunc = function (req, res) {
    console.log(req.headers);
    const title = req.headers.title;
    const locationID = req.headers.placeid;
    console.log(locationID);
    const artist = req.headers.artist;
    const email = req.headers.email;
    const time = moment().unix();

    Audio.findOne(
        { "Title": artist + "_" + time.toString() },
        (err, audio) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                if (audio == null) {
                    let audio = Audio();
                    audio.Title = artist + "_" + time.toString();
                    audio.LocationID = locationID;
                    audio.Artist = artist;
                    audio.Date = moment().unix();
                    audio.FileName = rand;
                    console.log(audio);
                    audio.save(err => {
                        if (err) {
                            return res.json({ success: false, err: err });
                        } else {
                            User.findOneAndUpdate(
                                { Email: email },
                                { $push: { AudioNames: artist + "_" + time.toString() } },
                                (err, _) => {
                                    if (err) {
                                        return res.json({ success: false, err: err });
                                    } else {
                                        console.log(rand);

                                        Location.findOneAndUpdate(
                                            { PlaceID: audio.LocationID },
                                            { $push: { AudioIDs: audio._id } },
                                            (err, loc) => {
                                                if (err) {
                                                    return res.json({ success: false, err: err });
                                                } else {
                                                    return res.json({ success: true })
                                                }
                                            }
                                        )
                                        res.send(rand);

                                    }
                                }
                            )
                        }
                    })
                } else {
                    return res.json({ success: false, err: "Title has already been chosen!" });
                }
            }
        }
    )
};

exports.getAudioFileFunc = function (req, res) {
    const name = req.params.name;
    res.sendfile("uploads/track-" + name);
}


exports.upvoteAudioFunc = function (req, res) {
    const name = req.body.name;

    Audio.findOneAndUpdate(
        { Name: name },
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

exports.downvoteAudioFunc = function (req, res) {
    const name = req.body.name;

    Audio.findOneAndUpdate(
        { Name: name },
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
