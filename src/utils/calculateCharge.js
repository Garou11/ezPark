const config = require('./operatorConfig.json');
const operators = require('../database/models/operators');
const sequelize= require('sequelize');

const charge = async function(optrId, vehicleType, start) {
    const costConfig = await operators.findOne({
        attributes:['chargeConfig'],
        where: {
            operatorId: optrId
        },
        raw: true
    });
    var optrConfig=costConfig[vehicleType]
    var end = Date.now();
    var diff = end-start;
    var convertTime = Math.round(diff/1000);
    var charges=0;
    var prevTime=0;
    for(key in optrConfig){
        if(key != "n"){
            if(convertTime>(parseInt(key)-prevTime)){
                convertTime = convertTime- (parseInt(key)-prevTime);
            }
            else{
                convertTime=0;
            } 
            charges = (optrConfig[key]);
            prevTime=parseInt(key);   
        }
        else{
            charges= charges + optrConfig[key]*convertTime;
            convertTime=0;
        }
        if(convertTime===0){
            break;
        }
    }
    return charges;
}

module.exports = charge;