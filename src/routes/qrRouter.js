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

    qrRouter.route('/sampleQR')
    .get(async(req, res)=> {
        let response = {
            "data": ["data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"]
        }
        response = JSON.stringify(response);
        QRCode.toString(response,options, function (err, qrcode) {
            if(err) return console.log("error occurred");
            console.log(qrcode);
            console.log(JSON.stringify(qrcode));
            res.status(200).send(JSON.stringify({"data": [qrcode]}));
        })
    })

module.exports = qrRouter;