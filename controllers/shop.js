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