const express = require('express')
const bodyParser = require('body-parser');
const activeRouter = express.Router();
const activeTransactionstbl = require('../database/models/activeTransactions')
const tblTransactions = require('../database/models/tbTransactions');
const calculateCharges = require('../utils/calculateCharge');
const convertQueryTime = require('../utils/commonFunctions');
const tblCompanySpace= require('../database/models/tblCompany_Space_Mapping');
const users = require('../database/models/users');
const tblSpaceId = require('../database/models/tblSpace_ID_Mapping');
const updateParking = require('../utils/parkingSlots');
const addGuest = require('../utils/guestOperations');
activeRouter.use(bodyParser.json());

activeRouter.route('/validateParking')
    .post(async(req, res)=> {
        try{
            let usrId = req.body.userId || null;
            if(!usrId || !((/[a-zA-Z0-9]{28}/gm.test(usrId) || (/[0-9]{4}/gm.test(usrId)))) ){
                throw new Error("invalid Request Body");
            }
            let oprId = req.body.operatorId || null;
            if(!oprId || oprId==='-1'){
                throw new Error("invalid Request Body");
            }
            var parkInfo;
            let intime;
            try{
                parkInfo = await activeTransactionstbl.findOrCreate({
                    where: {
                        userId: usrId
                    },
                    defaults: {
                        userId: usrId,
                        operatorId: oprId,
                        vehicleType: req.body.vehicleType
                    },
                    raw: true
                });
                intime = parkInfo[0].inTime;
                if(parkInfo[1]=== true) {
                    parkInfo[0]["dataValues"]["entry"]=true;
                    parkInfo[0]= convertQueryTime(parkInfo[0]["dataValues"]);
                    if(usrId.length===4) {
                        let isGuestAdded = await addGuest(req.body);
                        console.log(isGuestAdded?("Added Guest"+usrId):("Unable to add guest"+usrId));
                    }
                    else{
                        await updateParking(usrId, true);
                    }
                    return res.status(200).send(parkInfo[0]);
                }
                else {
                    //var amount = await calculateCharges(oprId, req.body.vehicleType, intime);
                    var transaction= await tblTransactions.create({
                        userId: usrId,
                        operatorId: oprId,
                        vehicleType: req.body.vehicleType,
                        inTime: intime
                    });
                    activeTransactionstbl.destroy({
                        where: {
                            userId : parkInfo[0].userId,
                            operatorId : parkInfo[0].operatorId
                        }
                    });
                    transaction["dataValues"]["entry"]=false;
                    transaction= convertQueryTime(transaction["dataValues"]);
                    if(usrId.length!=4)
                        await updateParking(usrId, false);
                    return res.status(200).send(transaction);
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
            transactions= convertQueryTime(transactions);
            res.status(200).send(transactions);
        } catch(e){
            console.log(e)
            res.status(400).send(e);
        }
    })

module.exports = activeRouter;