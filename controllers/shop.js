const Product = require("../model/product");

exports.getProducts = (req, res, next) => {
	const products = Product.fetchAll(products => {
		res.render("shop/product-list", {
			prods: products,
			pageTitle: "All Products",
			path: "/products"
		});
	});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; //name should match with the name after the colon in the shop.js file = '
	console.log(prodId);
	res.redirect('/');
};

exports.getIndex = (req,res, next ) => {
	Product.fetchAll(products => {
		res.render("shop/index", {
			prods: products,
			pageTitle: "Shop",
			path: "/"
		});
	});
};

exports.getCart = (req,res,next) =>{
	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart'
	});
};

exports.getOrders = (req,res,next) =>{
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Order'
	});
};

exports.getCheckout = (req,res,next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle : 'Checkout'
	});
};