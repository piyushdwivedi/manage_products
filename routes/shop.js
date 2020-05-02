const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');
const shopRout = express.Router();

shopRout.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {products: products, docTitle: 'Shop', path: 'shop'});
});

module.exports = shopRout;