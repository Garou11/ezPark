const tblCompanySpace = require('../database/models/tblCompany_Space_Mapping');
const users = require('../database/models/users');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const updateParking = async function (usrId, vehicle, isEntry) {
    try {
        let company = await users.findOne({
            where: {
                userId: usrId
            },
            attributes: ['companyId'],
            raw: true
        });
        console.log(company);
        updateSlot = isEntry ? -1 : 1;

        var slotColoumn = vehicle=='Car'? 'availableCarSlots': 'availableScooterSlots';

        let slotUpdate;
        if (isEntry) {
            slotUpdate = await tblCompanySpace.increment(slotColoumn,
                {
                    by: updateSlot,
                    where: {
                        companyId: company.companyId,
                        availableSlots: {
                            [Op.gt]: 0
                        }
                    }
                }
            );
        }
        else {
            slotUpdate = await tblCompanySpace.increment(slotColoumn,
                {
                    by: updateSlot,
                    where: {
                        companyId: company.companyId
                    }
                }
            );
        }
        if (slotUpdate[0][1] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

module.exports = updateParking;