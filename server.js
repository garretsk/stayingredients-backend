let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let passport = require("passport");
const router = express.Router();

const users = require("./routes/api/users");

const app = express();
const nodemailer = require("nodemailer");
let cors = require("cors");
require("dotenv").config();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// DB Config
let database = require('./database/db').db;

// Connect to MongoDB
mongoose.connect(
  database,
  { useNewUrlParser: true }
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./database/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server up and running on port ' + port));

// Transporter middleware
app.use(express.json());
app.use(cors());

// Transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`Server is ready to take messages: ${success}`);
});

app.post("/contact", function (req, res) {
  let text;
  text = "Sender: " + req.body.fname + " " + req.body.lname + "\n";
  text += "Email: " + req.body.email + "\n\n";
  text += req.body.message;

  let mailOptions = {
    from: `${req.body.email}`,
    to: process.env.EMAIL,
    subject: `Message from: ${req.body.fname}`,
    text: text,
  };

  transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    console.log("Error " + err);
    res.json({
      status: "fail",
    });
  }
  else {
    console.log("Message sent successfully");
    res.json({ status: "success" });
  }
  });
});