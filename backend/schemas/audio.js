const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const AudioSchema = new Schema(
    {
        Date: { type: Date, required: true },
        LocationID: { type: ObjectIdSchema, required: true }
    }
);

module.exports = mongoose.model("Location", LocationSchema);
