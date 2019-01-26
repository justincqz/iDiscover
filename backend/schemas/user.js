const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const UserSchema = new Schema(
    {
        AudioIDs: { type: [ObjectIdSchema], default: [] },
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        Email: { type: String, required: true },
        Password: { type: String, required: true }
    }
);

module.exports = mongoose.model("User", UserSchema);
