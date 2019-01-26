const Audio = require("../schemas/audio");
const moment = require("moment");
const mongoose = require("mongoose");
const Location = require("../schemas/location");
var ObjectId = mongoose.Types.ObjectId;

exports.uploadAudioFileFunc = function (req, res) {
    console.log(req.file);
    console.log(req.file.path);
    res.send(rand);
};

exports.getAudioFileFunc = function (req, res) {
    const name = req.params.name;
    res.sendfile("uploads/track-" + name);
}

exports.newAudioFunc = function (req, res) {
    let audio = new Audio();

    const title = req.body.title;
    const locationID = req.body.locationID;
    const artist = req.body.nickname;

    if (!title || !locationID || !artist) {
        return res.json({
            first: req.body,
            success: false,
            error: "Invalid Inputs"
        });
    }

    audio.Date = moment().unix();
    audio.Title = title;
    audio.LocationID = ObjectId(locationID);
    audio.Artist = artist;

    audio.save(err => {
        if (err) {
            return res.json({ success: false, err: err });
        } else {
            Location.findOneAndUpdate(
                { _id: audio.LocationID },
                { $push: { AudioIDs: audio._id } },
                (err, _) => {
                    if (err) {
                        return res.json({ success: false, err: err });
                    } else {
                        return res.json({ success: true, audio: audio })
                    }
                }
            )
        }
    })
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
