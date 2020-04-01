const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
	"mongodb+srv://yogeswar:Yogi2198@cluster-test-p9hqd.mongodb.net/shop";
const app = express();

const store = new mongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions"
});
const csrfProtect = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "session message",
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(csrfProtect)
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});
app.use((req,res,next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken= req.csrfToken();
	next();
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
