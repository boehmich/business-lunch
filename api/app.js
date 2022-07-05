const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const invoiceRoutes = require('./routes/invoice.routes');
const userRoutes = require('./routes/user.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost:27017/business-lunch')
    .then(() => {
        console.log("Connected to Database.");
    })
    .catch(() => {
        console.log("Connection failed.");
    });

app.use('/api/invoice/', invoiceRoutes);
app.use('/api/user/', userRoutes);

module.exports = app;