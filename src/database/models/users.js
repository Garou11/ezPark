const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblCompanySpace = require('./tblCompany_Space_Mapping');

const users = ezParkSequelize.define('users', {
    userId: {
        type: sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {type: sequelize.STRING},
    companyId: {type: sequelize.INTEGER}
},{timestamps: false});

users.belongsTo(tblCompanySpace, {foreignkey: 'companyId', sourceKey:'companyId'});
module.exports = users;