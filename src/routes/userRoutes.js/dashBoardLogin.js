const express = require('express')
const bodyParser = require('body-parser');
const loginRouter = express.Router();
const accountPassMapping = require('../../database/models/accountPassMapping');
loginRouter.use(bodyParser.json());

loginRouter.route('/getUserLogin')
    .get(async (req, res) => {
        try {
            if(!req.query.username && !req.query.pass) {
                throw new Error("login Paramaters missing");
            }
            let usrDetails = await accountPassMapping.findOne({
                where: {
                    username: req.query.username,
                    password: req.query.pass
                },
                raw: true
            });
            if(!usrDetails || !usrDetails.spaceId){
                throw new Error("invalid credentials");
            }
            usrDetails['accessToken']='kgsSucx3PZyrrAaqG2xil40HtObGOJSj';
            res.status(200).send({ "success": true, "data": usrDetails });
            return;
        } catch (err) {
            console.log(err);
            res.status(400).send({ "success": false, "error": err });
            return;
        }
    });

module.exports = loginRouter;