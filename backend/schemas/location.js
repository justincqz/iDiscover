const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const LocationSchema = new Schema(
    {
        Longitude: { type: Number, required: true },
        Latitude: { type: Number, required: true },
        Name: { type: String, required: true },
        AudioIDs: { type: [ObjectIdSchema], default: [] },
        RouteIDs: { type: [ObjectIdSchema], default: [] },
        Type: { type: String, required: true },
        PlaceID: { type: String, required: true }
    }
);

module.exports = mongoose.model("Location", LocationSchema);
