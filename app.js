const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

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

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));//syntax to sends a file with status code.
	res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
