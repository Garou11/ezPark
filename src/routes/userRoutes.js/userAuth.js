const express = require('express')
const bodyParser = require('body-parser');
const userAuth = express.Router();
const users = require('../../database/models/users');
const tblCompanySpace = require('../../database/models/tblCompany_Space_Mapping');
const tblSpaceId = require('../../database/models/tblSpace_ID_Mapping');
userAuth.use(bodyParser.json());

userAuth.route('/sendDetails')
    .post(async (req, res) => {
        try {
            if (!req.body.userId || req.body.userId === "null" || req.body.userId === "") {
                const companySpace = await tblCompanySpace.findOne({
                    include: [
                        {
                            model: tblSpaceId
                        }
                    ],
                    where: {
                        companyId: parseInt(req.body.companyCode)
                    },
                    raw: true
                });
                if (companySpace['tblSpace_ID_Mapping.spaceName'] != req.body.officeSpaceName) {
                    throw new Error('Invalid Office Space Name')
                }
            }
            else {
                const userDetails = await users.create({
                    userId: req.body.userId,
                    phoneNumber: req.body.phoneNumber,
                    companyId: parseInt(req.body.companyCode)
                });
            }
            res.status(200).send({ "success": true });
            return;
        } catch (err) {
            console.log(err);
            res.status(200).send({ "success": false });
            return;
        }
    });

userAuth.route('/userDetails')
    .get(async (req, res) => {
        try {
            let usrId = req.query.userId;
            let userDeatils = await users.findOne({
                include: [
                    {
                        model: tblCompanySpace,
                        attributes: ['companyName', 'spaceId', 'totalSlots', 'availableSlots'],
                    }
                ],
                where: {
                    userId: usrId
                },
                attributes: ['userId', 'phoneNumber', 'companyId'],
                raw: true
            });
            if (userDeatils["tblCompany_Space_Mapping.availableSlots"] < 0) {
                userDeatils["tblCompany_Space_Mapping.availableSlots"] = 0;
            }
            userDeatils= JSON.stringify(userDeatils, (k, v) => v && typeof v === 'object' ? v : '' + v);
            return res.status(200).send(userDeatils);
        } catch (e) {
            console.log(e);
            return res.status(400).send(e);
        }
    })

module.exports = userAuth;
