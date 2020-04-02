const bcrypt = require("bcryptjs");
require('dotenv').config();
const nodemailer = require('nodemailer');
const sendGridTransport= require('nodemailer-sendgrid-transport');

const User = require("../models/user");


const transporter = nodemailer.createTransport(sendGridTransport({
	auth:{
		api_key:process.env.SENDGRID_API,
	}
}))
exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	} else{
		message=null;
	}
res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: false,
		errorMessage: message
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if(message.length > 0){
		message = message[0];
	} else{
		message=null;
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
	User.findOne({email:email})
		.then((user) => {
			if(!user){
				req.flash('error','Invalid Email or password')
				return res.redirect('/login')
			}
			bcrypt.compare(password, user.password)
			.then(doMatch => {
				if(doMatch){
					req.session.isLoggedIn = true;
					req.session.user = user;
					return req.session.save((err) => {
						console.log(err)
						res.redirect("/");
					});
				}
				req.flash('error','Invalid Email or password')
				res.redirect('/login')
			})
			.catch(err => console.log(err))		
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
				req.flash('error','pick another email address')
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
						from:'shop@yogesh.in',
						subject:'test mail',
						html:'<h1>My environment works like a charm thanks for being a participant in this</h1>'
					});
				}).catch(err => console.log(err));
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
