const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, description, imageUrl, price, id, userId) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.id = id ? new mongoDb.ObjectId(id) : '';
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbAction;
    // edit product
    if (this.id) {
      dbAction = db.collection('products')
                .updateOne({
                  _id: this.id
                }, {
                  $set: this
                });
    } else { // create product
      dbAction = db.collection('products').insertOne(this);
    }
    return dbAction.then(result => {
      console.log('inserted successfully', result);
    }).catch(err => {
      console.log('Couldnt insert the item in products', err);
    })
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .then(products => {
        return products;
      }).catch(err => {
        console.log('Products not found', err);
      }) 
  }

  static findById(pId) {
    const db = getDb();
    return db.collection('products')
      .find({_id: new mongoDb.ObjectId(pId)}).next()
      .then(product => {
        return product;
      }).catch(err => {
        console.log('Couldnt find product with Id', pId, err);
      })
  }

  static deleteById(pId) {
    const db = getDb();
    return db.collection('products')
      .deleteOne({_id: new mongoDb.ObjectId(pId)})
      .then(resp => {
        console.log('deleted');
      }).catch(err => {
        console.log('Delete failed', err);
      });
  }
}

module.exports = Product;