const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.findAll().then(prods => {
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
  Product.findByPk(productId).then(product => {
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
  Product.findAll().then(prods => {
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
  req.user.getCart().then(cart => {
    return cart.getProducts();
  }).then(products => {
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
  let storedCart;
  let newQty = 1;
  req.user.getCart().then(cart => {
    storedCart = cart;
    return cart.getProducts({where: {id: productId}});
  }).then(products => {
    let product;
    if(products.length) {
      product = products[0];
    }
    if(product) {
      const oldQty = product.cartItem.quantity;
      newQty = oldQty + 1;
      return product;
    }
    return Product.findByPk(productId);
    }).then(product => {
      storedCart.addProduct(product, {
        through: {quantity: newQty}
      }).catch(err => {
      console.log('Couldnt find product by id', err);
    })
  }).then(response => {
    res.redirect('/cart');
  }).catch(err => {
    console.log('Something went wrong', err);
  })
}

exports.postDeleteItem = (req, res, next) => {
  const {productId} = req.body;
  req.user.getCart().then(cart => {
    return cart.getProducts({where: {id: productId}});
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  }).then(response => {
    res.redirect('/cart');
  }).catch(err => {
    console.log('Deleting from cart failed', err);
  });
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}).then(orders => {
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
  req.user.getCart().then(cart => {
    currentCart = cart;
    return cart.getProducts();
  }).then(products => {
    return req.user.createOrder().then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        console.log('returning product', product);
        return product;
      }));
    }).catch(err => {
      console.log('Couldnt create order', err);
    })
  }).then(response => {
    return currentCart.setProducts(null);
  }).then(response =>{
    res.redirect('/orders');
  }).catch(err => {
    console.log(err);
  });
};
