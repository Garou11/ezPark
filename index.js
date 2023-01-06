const express = require('express');
const app = express();

const qrRouter = require("./src/routes/qrRouter");

const hostname="localhost";
const port = process.env.PORT || 8000;

app.use('/health/stats', function(req,res) {
    res.send("EzPark - Stands Up");
});

app.use('/', qrRouter);

app.listen(port, hostname, ()=> {
    console.log("Server is running at :",port);
})