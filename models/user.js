const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this.id = id;
    }

    static findById(userId) {
        const db = getDb();
        const _id = new mongoDb.ObjectId(userId);
        return db.collection('users').findOne({_id});
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProdIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === product._id.toString();
        });
        let newQty = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProdIndex > -1) {
            newQty = this.cart.items[cartProdIndex].quantity + 1;
            updatedCartItems[cartProdIndex].quantity = newQty;
        } else {
            updatedCartItems.push({
                productId: new mongoDb.ObjectId(product._id),
                quantity: 1
            });
        }

        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new mongoDb.ObjectId(this.id)},
            { $set: { cart: updatedCart} }
        );
    }

    getCart() {
        const db = getDb();
        const prodIds = this.cart.items.map(p => p.productId);
        return db.collection('products').find({
            _id: { $in: prodIds}
        }).toArray().then(products => {
            return products.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(item => {
                        return item.productId.toString() === p._id.toString();
                    }).quantity
                }
            });
        });
    }

    deleteFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new mongoDb.ObjectId(this.id)},
            { $set: { cart: {items: updatedCartItems}}}
        );
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: this.id,
                    name: this.name
                }
            }
            return db.collection('orders').insertOne(order)
        }).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne(
                { _id: new mongoDb.ObjectId(this.id)},
                { $set: { cart: {items: []}}}
            );
        })
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({
            'user._id': new mongoDb.ObjectId(this.id)
        }).toArray();
    }
}

module.exports = User;