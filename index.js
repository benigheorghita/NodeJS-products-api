const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

require('./db/setup.js');

app.use('/api/login', require('./routes/api/login.js'));
app.use('/api/produse', require('./routes/api/produse.js'));

app.listen(3000, () => {
    console.log("Am luat-o din loc");
});