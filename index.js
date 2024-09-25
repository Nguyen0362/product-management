const express = require('express');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();
const systemConfig = require('./config/system');

const app = express();
const port = process.env.PORT;

const database = require('./config/database');
database.connect();

const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

app.set('views', `${__dirname}/views`); //Tìm đến thư mục tên là views 
app.set('view engine', 'pug'); //template engine sử dụng: pug 

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Khai báo biến toàn cục cho file pug 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//parser application/json
app.use(bodyParser.json())

//flash
app.use(cookieParser('JHSNDJS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//Khai báo đường dẫn
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

