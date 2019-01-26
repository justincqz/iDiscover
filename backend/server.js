const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const sjcl = require("sjcl");
const API_PORT = 3001;
const app = express();
const router = express.Router();

const Location = require('./schemas/location')


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

router.get("/", (req, res) => {
    console.log("SUCCESSFUL GET REQUEST");
})
/*
router.post("/newUser", (req, res) =>{
    let user = new User();
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password;
    sjcl.encrypt(password, req.body.password);
    // TODO: Test the complexcity of password
    
    const emailAddress = req.body.emailAddress;
    // TODO: Check the uniqueness of the email address

    if (!firstName || !lastName || !emailAddress) {
        return res.json({
            first:req.body,
            success: false,
            error:"Invalid Inputs"
        });
    }
    user.FirstName = firstName;
    user.LastName = lastName;
    user.Email = emailAddress;
    user.Password = password;
    user.save(err => {
        return res.json({success: err != null, error: err})
    })
})*/

router.post("/newLocation", (req, res) => {
    let location = new Location();
    const Latitude = req.body.Latitude;
    const Longtitude = req.body.Longtitude;
    const Name = req.body.Name;
    
    if (!Latitude || !Longtitude || !Name) {
        return res.json({
            first:req.body,
            success: false,
            error:"Invalid Inputs"
        });
    }

    location.Latitude = Latitude;
    location.Longtitude = Longtitude;
    location.Name = Name;
    location.save(err => {
        return res.json({success: err != null, error: err})
    })
})

router.get("/locations", (req, res) => {
    Location.find({}, null, (err, locs) => {
        if (err) {
            return res.json({
                success: false,
                error: "Invalid request for locations"
            })
        } else {
            console.log("Got all locations")
            console.log(locs);
            return res.json({success: true, locs: locs});
        }
    })
})

router.get("/location/:name", (req, res) => {
    const Name = req.params.name;
    Location.findOne({'Name': Name},null,
                    (err, loc) => {
                        if (err) return res.json({
                            success: false,
                            error: err
                        })
                        if (!loc) {
                            console.log("nothing");
                             return res.json({
                                 success: false,
                                 loc: loc
                             });
                        }
                        console.log('%s', loc.Name);
                        return res.json({success: true, loc: loc});
                    });
})

router.get("/location/:longitude/:latitude", (req, res) => {
    const Longtitude = req.params.Longtitude;
    const Latitude = req.params.Latitude;
    Location.findOne({'Longtiude': Longtitude, 'Latitude': Latitude},null,
                    (err, loc) => {
                        if (err) return res.json({
                            success: false,
                            error: err
                        })
                        if (!loc) {
                            console.log("nothing");
                             return res.json({
                                 success: false,
                                 loc: loc
                             });
                        }
                        console.log('%s %s %s', loc.Name, loc.Longtitude, loc.Latitude);
                        return res.json({success: true, loc: loc});
                    });
})