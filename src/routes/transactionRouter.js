const express = require('express')
const bodyParser = require('body-parser');
const transactionRouter = express.Router();
const tblTransactions = require('../database/models/tbTransactions')

transactionRouter.use(bodyParser.json());

transactionRouter.route('/getAllTransactions')
    .get(async(req, res)=> {
        try{
            let usrId = req.query.userId || null;
            let optrId = req.query.operatorId || null;
            if(!usrId && !optrId){
                throw new Error("invalid Request Body");
            }

            var transactions;
            if(usrId && usrId!="null"){
                transactions = await tblTransactions.findAll({
                    where: {
                        userId: usrId
                    },
                    order: [['inTime', 'DESC']],
                    raw: true
                });
            }
            else if(optrId && optrId!="null") {
                transactions = await tblTransactions.findAll({
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

module.exports = transactionRouter;