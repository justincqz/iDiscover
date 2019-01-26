const User = require("../schemas/user");
const sjcl = require("sjcl");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.newUserFunc = function (req, res) {
    let user = new User();
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const nickname = req.body.nickname;

    const saltBits = sjcl.random.randomWords(8);
    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 1000, 256);
    var key = sjcl.codec.base64.fromBits(derivedKey);

    const salt = sjcl.codec.base64.fromBits(saltBits)

    // TODO: Test the complexity of password

    const emailAddress = req.body.emailAddress;
    // TODO: Check the uniqueness of the email address

    if (!firstName || !lastName || !emailAddress) {
        return res.json({
            first: req.body,
            success: false,
            error: "Invalid Inputs"
        })
    }

    console.log(password);
    user.FirstName = firstName;
    user.LastName = lastName;
    user.Email = emailAddress;
    user.Password = key;
    user.Salt = salt;
    user.Nickname = nickname

    user.save(err => {
        if (err) {
            return res.json({ success: false, err: err });
        } else {
            return res.json({ success: true, user: user })
        }
    })
}

exports.getUserFunc = function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);

    User.findOne(
        { Email: email },
        (err, user) => {
            if (err) {
                console.log("Reached here");
                return res.json({ success: false, err: err });
            } else {
                console.log(user);
                if (user == {}) {
                    return res.json({ success: false, message: "User not found!" });
                } else {
                    const salt = user.Salt;
                    const saltBits = sjcl.codec.base64.toBits(salt);
                    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 1000, 256);
                    const key = sjcl.codec.base64.fromBits(derivedKey);
                    if (key == user.Password) {
                        return res.json({ success: true, user: user, message: "Login successful!" });
                    } else {
                        return res.json({ success: false, message: "Incorrect password!" })
                    }
                }
            }
        }
    );
}

exports.updateUserAudioFunc = function (req, res) {
    const email = req.body.email;
    const audioID = ObjectID(req.body.id);

    User.findOneAndUpdate(
        { Email: email },
        { $push: { AudioNames: audioName } },
        (err, _) => {
            if (err) {
                return res.json({ success: false, err: err });
            } else {
                return res.json({ success: true });
            }
        }
    )
}
