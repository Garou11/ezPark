const express = require('express');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const transactionRouter = express.Router();
const mysql=require('mysql');

transactionRouter.use(bodyParser.json());

transactionRouter.route('/getAllTransactions')
    .get(async(req, res)=> {
        try{
            let usrId = parseInt(req.query.userId) || null;
            if(!usrId){
                throw new Error("invalid Request Body");
            }

            var con = mysql.createConnection({
            host: "localhost",
            user: "yourusername",
            password: "yourpassword"
            });

            var sql= "SELECT * FROM transactions WHERE userId = ? ORDER BY createdOn DESC"; 

            con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql,[usrId], function (err, result) {
                if (err) throw err;
                res.data=result;
                console.log("Result: " + result);
              });
            });

            res.status(200).send(res);
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = transactionRouter;