const moment= require('moment') ;

const convertTZ = function (date) {
    var format = 'DD/MM/YYYY HH:mm:ss';

    return moment(date, format).tz('Asia/Kolkata').format(format);   
}

const convertQueryTime = function(queryObject){
    if(Array.isArray(queryObject)){
        queryObject.forEach(query => {
            if(query.inTime)
                query.inTime=convertTZ(query.inTime);
            if(query.outTime)
                query.outTime=convertTZ(query.outTime);
        });
    }
    else {
        if(queryObject.inTime)
                queryObject.inTime=convertTZ(queryObject.inTime);
        if(queryObject.outTime)
            queryObject.outTime=convertTZ(queryObject.outTime);
    }
    
    return queryObject;
}

module.exports= convertQueryTime;