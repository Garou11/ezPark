const express = require('express')
const bodyParser = require('body-parser');
const transactionRouter = express.Router();
const tblTransactions = require('../database/models/tbTransactions')

transactionRouter.use(bodyParser.json());

transactionRouter.route('/getAllTransactions')
    .get(async(req, res)=> {
        try{
            let usrId = parseInt(req.query.userId) || null;
            if(!usrId){
                throw new Error("invalid Request Body");
            }

            const transactions = await tblTransactions.findAll({
                where: {
                    userId: usrId
                },
                order: [['inTime', 'DESC']],
                raw: true
            });

            res.status(200).send(transactions);
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = transactionRouter;