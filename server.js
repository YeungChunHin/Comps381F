const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const loginPage = require("./routes/front");
const createPhotoPage = require("./routes/createPhoto");
const messagePage = require("./routes/message");
const showMap = require("./routes/showMap");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static(__dirname + "/public"));
app.use("/bootstrap_css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/bootstrap_js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));


app.get("/", loginPage);
app.post("/createPhoto", createPhotoPage);

app.get("/gmap", showMap);
app.post("/message", messagePage);


app.listen(process.env.PORT || 8099);