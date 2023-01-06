const express = require('express');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const qrRouter = express.Router();

qrRouter.use(bodyParser.json());

var options = {
    type: String
  }

qrRouter.route('/fetchQR')
    .get(async(req, res)=> {
        try{
            let usrId = parseInt(req.body.id) || null;
            if(!usrId){
                throw new Error("invalid Request Body");
            }

            let totalAmount = 50; //to be fetched from a function

            let qrData = {
                id : usrId,
                amount: totalAmount
            }

            let stringQRdata = JSON.stringify(qrData);
            QRCode.toString(stringQRdata,options, function (err, qrcode) {
                if(err) return console.log("error occurred");
                console.log(qrcode);
            })

            console.log(typeof(qrcode));

            res.status(200).send(qr);
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = qrRouter;