const express = require('express')
const bodyParser = require('body-parser');
const authRouter = express.Router();
const operators = require('../database/models/operators')

authRouter.use(bodyParser.json());

authRouter.route('/operatorAuth')
    .get(async(req, res)=> {
        try{
            let validationString = req.query.validationCode || null;
            if(!validationString){
                throw new Error("invalid Request");
            }

            var operator = await operators.findAll({
                attributes: ['operatorId','operator'] ,
                where: {
                    validationCode: validationString
                },
                raw: true
            });
            
            res.status(200).send(operator);
        } catch(e){
            res.status(400).send(e);
        }
    })

module.exports = authRouter;