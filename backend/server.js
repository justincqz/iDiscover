const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const sjcl = require("sjcl");
const API_PORT = 3001;
const app = express();
const router = express.Router();


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
})
