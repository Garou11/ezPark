const express = require('express');
const app = express();

const transactionRouter = require("./src/routes/transactionRouter");
const activeRouter = require('./src/routes/activeRouter');
const authRouter = require('./src/routes/authRouter');
const loader = require('./src/loader');

const hostname="localhost";
const port = process.env.PORT || 8000;

app.use('/health/stats', function(req,res) {
    res.send("EzPark - Stands Up");
});
app.use('/', loader);
app.use('/', transactionRouter);
app.use('/',activeRouter);
app.use('/',authRouter);

app.listen(port, hostname, ()=> {
    console.log("Server is running at :",port);
})