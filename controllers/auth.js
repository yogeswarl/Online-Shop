exports.getLogin = (req, res, next) => {
	// const isLoggedIn = req.get('Cookie')==='true';
	console.log(req.session.isLoggedIn)
 	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: false
	});
};
exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn= true;
	// res.setHeader('Set-Cookie','loggedIn=true'); //HttpOnly makes the site protected from XSS attacks. 
	res.redirect('/')
};
