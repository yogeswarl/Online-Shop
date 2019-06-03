const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
);
const getProductsFromFile = (cb) => {
	//make sure to call the class directly on the instantiated object using 'this'
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		}else {
        cb(JSON.parse(fileContent));
        }
	});
};
module.exports = class product {
	constructor(t) {
		this.title = t;
	}
	save() {
        getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
        });
        fs.readFile(p, (err,fileContent) => {});
	}

	static fetchAll(cb) {
        getProductsFromFile(cb); 
    }
};
