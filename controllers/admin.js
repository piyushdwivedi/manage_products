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
  console.log('posting product...');
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = !!req.query.edit;
  const prodId = req.params.productId;
  Product.getProductById(prodId, product => {
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
  const updatedProd = new Product(productId, title, imageUrl, description, price);
  updatedProd.save();
  res.redirect('/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
