const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description
  }).then(resp => {
    console.log('Product created');
    res.redirect('/admin/products');
  }).catch(err => {
    console.log('Error creating product', err);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = !!req.query.edit;
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode,
      product,
      prodId
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {productId, title, imageUrl, price, description,} = req.body;
  Product.findByPk(productId).then(product => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  }).then(resp => {
    console.log('UPDATED the db!');
    res.redirect('/products');
  }).catch(err => {
    console.log(err);
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const {productId} = req.body;
  Product.findByPk(productId).then(product => {
    return product.destroy();
  }).then(response => {
    console.log('DELETED');
    res.redirect('/admin/products');
  }).catch(err => {
    console.log('FAILED to delete!!');
  });
}
exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log('Couldnt fetch products: ', err);
  });
};
