const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const connectToMongoDb = require('./util/database').connectToMongoDb;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'templates');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1).then(user => {
    //     req.user = user;
    //     next();
    // }).catch(err => {
    //     console.log('Cant find user 1');
    // });
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

connectToMongoDb(() => {
    app.listen(3000);
});


