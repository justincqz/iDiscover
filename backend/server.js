const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const multer = require("multer");
const moment = require("moment");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const userController = require("./controllers/userController");
const mapController = require("./controllers/mapController");
const locController = require("./controllers/locController");
const audioController = require("./controllers/audioController");
const routeController = require("./controllers/routeController");

const dbRoute = "mongodb://admin:admin99@ds063929.mlab.com:63929/breadcrumbs";

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use("/api", router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
app.set('view engine', 'ejs');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        rand = moment().unix() + "_" + file.originalname + ".m4a";

        callback(null, file.fieldname + '-' + rand);
    }
})

var upload = multer({
    storage: storage
});


router.post("/newUser", userController.newUserFunc);
router.post("/getUser", userController.getUserFunc);
router.post("/updateUserAudio", userController.updateUserAudioFunc);

router.post("/uploadAudioFile", upload.single('track'), audioController.uploadAudioFileFunc);
router.get("/getAudioFile/:name", audioController.getAudioFileFunc);
router.post("/upvoteAudio", audioController.upvoteAudioFunc);
router.post("/downvoteAudio", audioController.downvoteAudioFunc);

router.post("/getInfoLocationID", locController.getInfoLocationIDFunc);
router.post("/updateLocationWithAudio", locController.updateLocationWithAudioFunc);
router.post("/newLocation", locController.newLocationFunc);
router.get("/getLocations", locController.getLocationsFunc);
router.get("/getLocationByName", locController.getLocationByNameFunc);
router.get("/getLocationByLongLat", locController.getLocationByLongLatFunc);

router.post("/upvoteRoute", routeController.upvoteRouteFunc);
router.post("/downvoteRoute", routeController.downvoteRouteFunc);
router.post("/newRoute", routeController.newRouteFunc);
router.post("/getRoute", routeController.getRouteFunc);

router.get("/getNearbyAttractions", mapController.getNearbyAttractionsFunc);
router.get("/getGoogleRoute", mapController.getGoogleRouteFunc);
