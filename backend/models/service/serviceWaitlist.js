const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");




//These might need tweaking, need to figure out what things we need for this model
const {GDBServiceModel} = require("./service");
const {GDBClientModel} = require("../ClientFunctionalities/client");
const { GDBCOModel } = require("../ClientFunctionalities/characteristicOccurrence");
const { GDBServiceOccurenceModel } = require("./serviceOccurrence");



const GDBServiceWaitlistModel = createGraphDBModel({

    clients: {type: [GDBClientModel], internalKey: ':hasClient'},
    serviceOccurrence: {type: GDBServiceOccurenceModel, internalKey: ':hasServiceOccurence'}
},
{  
    rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
}

);
module.exports = {
    GDBServiceWaitlistModel
  }