const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');
const shopRout = express.Router();

shopRout.get('/', (req, res, next) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'templates', 'shop.html'));
});

module.exports = shopRout;