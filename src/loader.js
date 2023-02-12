const express = require('express');
const userAuth = require('./routes/userRoutes.js/userAuth');
const loader = express();

loader.use('/users', userAuth);

module.exports = loader;