const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: process.env.SENDGRID_API
		}
	})
);
exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: false,
		errorMessage: message
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		isAuthenticated: false,
		errorMessage: message
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "Invalid Email or password");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect("/");
						});
					}
					req.flash("error", "Invalid Email or password");
					res.redirect("/login");
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash("error", "pick another email address");
				return res.redirect("/signup");
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedpassword) => {
					const user = new User({
						email: email,
						password: hashedpassword,
						cart: { items: [] }
					});
					return user.save();
				})
				.then((result) => {
					res.redirect("/login");
					transporter.sendMail({
						to: email,
						from: "shop@yogesh.in",
						subject: "test mail",
						html:
							"<h1>My environment works like a charm thanks for being a participant in this</h1>"
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/reset", {
		path: "/reset",
		pageTitle: "Reset Password",
		errorMessage: message
	});
};

exports.postReset = (req, res, next) => {
	const email = req.body.email;
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex");
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					req.flash("error", "No account with that email found");
					return res.redirect("/reset");
				}
				user.resetToken = token;
				user.resetExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then((result) => {
				res.redirect("/");
				transporter.sendMail({
					to: email,
					from: "shop@yogesh.in",
					subject: "Reset Password",
					html: `<h1>We know your feeling? even we forget it sometimes</h1>
				<p>click <a href="http://localhost:3000/reset/${token}">here</a></p>
				`
				});
			})
			.catch((err) => console.log(err));
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	console.log(token);
	User.findOne({ resetToken: token, resetExpiration: { $gt: Date.now() } })
		.then((user) => {
			let message = req.flash("error");
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render("auth/new-password", {
				path: "/new-password",
				pageTitle: "New Password",
				errorMessage: message,
				passwordToken: token,
				userId: user._id.toString()
			});
		})
		.catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;
	User.findOne({
		resetToken: passwordToken,
		resetExpiration: { $gt: Date.now() },
		_id:userId
	}).then(user=>{
		resetUser = user
		return bcrypt.hash(newPassword, 12)
	})
	.then(hashedpassword =>{
		resetUser.password  = hashedpassword;
		resetUser.resetToken  = undefined;
		resetUser.resetExpiration  = undefined;
		return resetUser.save();
	})
	.then(result =>{
		res.redirect('/login')
	})
	.catch(err => console.log(err));
};
