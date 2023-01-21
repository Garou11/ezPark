const express = require('express')
const bodyParser = require('body-parser');
const activeRouter = express.Router();
const activeTransactionstbl = require('../database/models/activeTransactions')
const tblTransactions = require('../database/models/tbTransactions');

activeRouter.use(bodyParser.json());

activeRouter.route('/validateParking')
    .post(async(req, res)=> {
        try{
            let usrId = parseInt(req.body.userId) || null;
            if(!usrId){
                throw new Error("invalid Request Body");
            }
            let oprId = parseInt(req.body.operatorId) || null;
            if(!oprId){
                throw new Error("invalid Request Body");
            }
            var parkInfo;
            try{
                parkInfo = await activeTransactionstbl.findOrCreate({
                    where: {
                        userId: usrId
                    },
                    defaults: {
                        userId: usrId,
                        operatorId: oprId,
                        vehicleType: req.body.vehicleType
                    }
                });
                if(parkInfo[1]=== true) {
                    res.status(200).send(parkInfo[0]);
                }
                else {
                    const transaction= await tblTransactions.create({
                        userId: usrId,
                        operatorId: oprId,
                        vehicleType: req.body.vehicleType,
                        inTime: parkInfo[0].inTime,
                        charges: 50
                    });
                    parkInfo[0].destroy();
                    res.status(200).send(transaction);
                }
            }catch(e){
                throw new Error(e);
            }
            
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = activeRouter;