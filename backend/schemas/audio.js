const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const AudioSchema = new Schema(
    {
        Date: { type: Number, required: true },
        LocationID: { type: ObjectIdSchema, required: true },
        Votes: { type: Number, default: 0 },
        Artist: { type: String, required: true },
        Title: { type: String, required: true }
    }
);

module.exports = mongoose.model("Audio", AudioSchema);
