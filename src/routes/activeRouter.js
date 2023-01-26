const express = require('express')
const bodyParser = require('body-parser');
const activeRouter = express.Router();
const activeTransactionstbl = require('../database/models/activeTransactions')
const tblTransactions = require('../database/models/tbTransactions');
const calculateCharges = require('../utils/calculateCharge');

activeRouter.use(bodyParser.json());

activeRouter.route('/validateParking')
    .post(async(req, res)=> {
        try{
            let usrId = req.body.userId || null;
            if(!usrId || usrId==='-1'){
                throw new Error("invalid Request Body");
            }
            let oprId = req.body.operatorId || null;
            if(!oprId || oprId==='-1'){
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
                    parkInfo[0]["dataValues"]["entry"]=true;
                    res.status(200).send(parkInfo[0]);
                }
                else {
                    var amount = await calculateCharges(oprId, req.body.vehicleType, parkInfo[0].inTime);
                    const transaction= await tblTransactions.create({
                        userId: usrId,
                        operatorId: oprId,
                        vehicleType: req.body.vehicleType,
                        inTime: parkInfo[0].inTime,
                        charges: amount
                    });
                    parkInfo[0].destroy();
                    transaction["dataValues"]["entry"]=false;
                    res.status(200).send(transaction);
                }
            }catch(e){
                throw new Error(e);
            }
            
        } catch(e){
            res.status(400).send(e);
        }
    })
    .get(async function(req,res) {
        try{
            let usrId = req.query.userId || null;
            let optrId = req.query.operatorId || null;
            if(!usrId && !optrId){
                throw new Error("invalid Request Body");
            }

            var transactions;
            if(usrId && usrId!="null"){
                transactions = await activeTransactionstbl.findAll({
                    where: {
                        userId: usrId
                    },
                    raw: true
                });
            }
            else if(optrId && optrId!="null") {
                transactions = await activeTransactionstbl.findAll({
                    where: {
                        operatorId: optrId
                    },
                    order: [['inTime', 'DESC']],
                    raw: true
                });
            }
            
            res.status(200).send(transactions);
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = activeRouter;