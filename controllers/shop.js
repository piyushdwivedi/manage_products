const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(prods => {
    res.render('shop/product-list', {
      prods,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log('Couldnt fetch products - Products',err);
  });
};

exports.getProduct = (req, res, next) => {
  const {productId} = req.params;
  Product.findById(productId).then(product => {
    res.render('shop/product-detail', {
      product, 
      pageTitle: product.title, 
      path: '/products'
    })
  }).catch(err => {
    console.log('Couldnt get the product');
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(prods => {
    res.render('shop/index', {
      prods,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log('Couldnt fetch products - Shop', err);
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products
    });
  }).catch(err => {
    console.log('Couldnt get products in cart', err);
  });
};

exports.postCart = (req, res, next) => {
  const {productId} = req.body;
  Product.findById(productId).then(product => {
    req.user.addToCart(product);
    res.redirect('/cart');
  }).then(result => {
    console.log('Added to cart');
  })
}

exports.postDeleteItem = (req, res, next) => {
  const {productId} = req.body;
  req.user.deleteFromCart(productId).then(response => {
    res.redirect('/cart');
  }).catch(err => {
    console.log('Deleting from cart failed', err);
  });
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then(orders => {
    console.log('orders....', orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders
    });
  }).catch(err => {
    console.log('Couldnt fetch orders', err);
  })
};

exports.postOrder = (req, res, next) => {
  let currentCart;
  req.user.addOrder().then(response =>{
    res.redirect('/orders');
  }).catch(err => {
    console.log(err);
  });
};
