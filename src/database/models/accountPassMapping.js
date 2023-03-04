const ezParkSequelize=require('./index');
const sequelize = require('sequelize');

const accountPassMapping = ezParkSequelize.define('accountPassMapping', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {type: sequelize.STRING, allowNull: false},
    password: {type: sequelize.STRING, allowNull: false},
    spaceId: {type:sequelize.INTEGER},
},{timestamps: false});

module.exports = accountPassMapping;