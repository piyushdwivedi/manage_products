const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
    static addProduct(id, itemPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            if (existingProduct) {
                updateProduct = {...existingProduct};
                updateProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;
            } else {
                updateProduct = {
                    id, 
                    qty: 1
                };
                cart.products = [...cart.products, updateProduct];
            }
            cart.totalPrice += +itemPrice; 
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) return;
            console.log('itemPrice', price);
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) return;
            const prodQty = product.qty;
            updatedCart.products = updatedCart.products.filter(item => {
                return item.id !== id;
            });
            updatedCart.totalPrice = updatedCart.totalPrice - (price * prodQty);
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log('Couldnt write', err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) cb(null);
            cb(cart);
        });
    }
}
