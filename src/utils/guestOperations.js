const guestUsers = require('../database/models/guestUsers');
const sequelize = require('sequelize');

const addGuest = async function (data) {
    try {
        let guest = await guestUsers.create({
            vehicleNumber: data.userId,
            meta: data
        });
        if (guest) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

module.exports=addGuest;