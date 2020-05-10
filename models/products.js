const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProducts = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return cb([]);
        return cb(JSON.parse(fileContent));
    });
}
module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProducts(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log('Error', err);
            });
        });
    }

    static fetchAll(cb) {
        getProducts(cb);
    }
}