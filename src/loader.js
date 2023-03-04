const express = require('express');
const userAuth = require('./routes/userRoutes.js/userAuth');
const loginRouter = require('./routes/userRoutes.js/dashBoardLogin');
const loader = express();

loader.use('/dashBoard',loginRouter);
loader.use('/users', userAuth);

module.exports = loader;