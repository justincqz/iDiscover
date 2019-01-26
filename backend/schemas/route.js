const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const RouteSchema = new Schema(
    {
        AudioIDs: { type: [ObjectIdSchema], default: [] },
        Title: { type: String, required: true },
        Description: { type: String, required: true },
        Votes: { type: Number, default: 0 }
    }
);

module.exports = mongoose.model("Route", RouteSchema);
