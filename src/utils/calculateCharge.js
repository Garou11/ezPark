const config = require('./operatorConfig.json');

const charge = async function(optrId, vehicleType, start) {
    const optrConfig= config.optrId.vehicleType;
    var end = new Date.now();
    var diff = end-start;
    var convertTime = Math.round(diff/1000);
    while(convertTime!=0){

    }
}

module.exports = charge;