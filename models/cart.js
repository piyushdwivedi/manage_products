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
                console.log('Couldnt write', err);
            })
        });
    }
}
