const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");

// const hbs = require("express-handlebars"); //adds express-handlebars templating engine

const app = express();

// app.engine(
// 	"hbs",
// 	hbs({
// 		layoutsDir: "views/layout/",
// 		defaultLayout: "main-layout",
// 		extname: "hbs"
// 	})
// ); //custom engine addition with layout needs, real cumbersome
app.set("view engine","ejs");
// app.set("view engine", "hbs"); //changed view engine to handlebars and this is also the file name extension
// app.set("view engine", "pug");  //available as an engine support, remove this to set engine as pug
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes); 
app.use(shopRoutes);

app.use(errorController.error404);

app.listen(3000);
