const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const UserSchema = new Schema(
    {
        AudioNames: { type: [String], default: [] },
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        Email: { type: String, required: true },
        Password: { type: String, required: true },
        Salt: { type: String, required: true },
        Nickname: { type: String, required: true }
    }
);

module.exports = mongoose.model("User", UserSchema);
