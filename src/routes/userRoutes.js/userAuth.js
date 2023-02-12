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

            if (!req.body.userId || req.body.userId==="null"|| req.body.userId === "") {
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
            res.status(400).send({ "success": false });
            return;
        }
    });

module.exports = userAuth;