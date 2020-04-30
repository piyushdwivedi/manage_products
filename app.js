const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const path = require('path');

const rootDir = require('./util/path');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'templates', 'not-found.html'));;
})
app.listen(3000);