const path = require("path");
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer')

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new mongoDBStore({
	uri:process.env.DB_SERVER,
	collection: "sessions"
});
const csrfProtect = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'images');
	},
	filename: (req, file, cb) => {
	  cb(null, new Date().toISOString() + '-' + file.originalname);
	}
  });

  const fileFilter = (req, file, cb) => {
	if (
	  file.mimetype === 'image/png' ||
	  file.mimetype === 'image/jpg' ||
	  file.mimetype === 'image/jpeg'
	) {
	  cb(null, true);
	} else {
	  cb(null, false);
	}
  };
  
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	multer({ storage: fileStorage}).single('image')
  );
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

app.use((req,res,next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken= req.csrfToken();
	next();
})

app.use((req, res, next) => {
	// throw new Error('dummy') synchronous errors can be thrown this way
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if(!user){
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err)); //Inside async code you need to wrap it inside next()
		});
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.get500);
app.use(errorController.get404);

app.use((error,req,res,next)=>{
	res
		.status(500)
		.render("500", {
			pageTitle: "Error!",
			path: "/500",
			isAuthenticated: req.session.isLoggedIn,
		});
})

mongoose
	.connect(process.env.DB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
