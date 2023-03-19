const express = require('express')
const bodyParser = require('body-parser');
const authRouter = express.Router();
const operators = require('../database/models/operators');
const tblSpaceId = require('../database/models/tblSpace_ID_Mapping');

authRouter.use(bodyParser.json());

authRouter.route('/operatorAuth')
    .get(async(req, res)=> {
        try{
            let validationString = req.query.validationCode || null;
            if(!validationString || !req.query.officeSpace){
                throw new Error("invalid Request");
            }

            var operator = await operators.findAll({
                include: [
                    {
                        model: tblSpaceId,
                        where: {
                            spaceName: req.query.officeSpace
                        }
                    }
                ],
                attributes: ['operatorId','operator'] ,
                where: {
                    operatorId: validationString
                },
                raw: true
            });
            if(operator && operator.length>0) {
                operator[0]['success'] = true;
                res.status(200).send(operator);
            }
            else
                throw new Error('not found')
        } catch(e){
            res.status(400).send([{success: false}]);
        }
    })

module.exports = authRouter;