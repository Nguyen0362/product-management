const express = require('express');
require('dotenv').config();
const systemConfig = require('./config/system');
const app = express();
const port = process.env.PORT;

const database = require('./config/database');
database.connect();

const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

