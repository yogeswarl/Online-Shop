const products = [];

module.exports = class product {
     constructor(t){
        this.title = t;
    }
    save() {
        products.push(this);
    }

    static fetchAll() {   //make sure to call the class directly on the instantiated object using 'this'
        return products;
    }
}