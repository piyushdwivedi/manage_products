const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin');
const shopRouteer = require('./routes/shop');
const path = require('path');

const rootDir = require('./util/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'templates');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(adminData.routes);
app.use(shopRouteer);

app.use((req, res, next) => {
    res.status(404).render('not-found', {docTitle: 'Page Not Found', msg: '404! Invalid URL.'})
})
app.listen(3000);