const express = require('express');
const app = express();

const transactionRouter = require("./src/routes/transactionRouter");

const hostname="localhost";
const port = process.env.PORT || 8000;

app.use('/health/stats', function(req,res) {
    res.send("EzPark - Stands Up");
});

app.use('/', transactionRouter);

app.listen(port, hostname, ()=> {
    console.log("Server is running at :",port);
})