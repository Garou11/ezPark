const tblCompanySpace = require('../database/models/tblCompany_Space_Mapping');
const users = require('../database/models/users');

const updateParking = async function (usrId, isEntry) {
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

        let slotUpdate = await tblCompanySpace.increment('availableSlots',
            {
                by: updateSlot,
                where: {
                    companyId: company.companyId
                }
            }
        );
        return;
    } catch (e) {
        console.log(e);
        return;
    }
}

module.exports = updateParking;