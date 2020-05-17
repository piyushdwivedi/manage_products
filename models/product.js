
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, description, imageUrl, price) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  save() {
    const db = getDb();
    return db.collection('products').insertOne(this).then(result => {
      console.log('inserted successfully', result);
    }).catch(err => {
      console.log('Couldnt insert the item in products', err);
    })
  }
}

module.exports = Product;