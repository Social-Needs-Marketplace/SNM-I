const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBServiceOccurrenceModel} = require("./service/serviceOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBReferralModel} = require("./referral");
const {GDBAppointmentModel} = require("./appointment");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBServiceRegistrationModel = createGraphDBModel({
  serviceOccurence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  appointment: {type: GDBAppointmentModel, internalKey: ':hasAppointment'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceRegistration'], name: 'serviceRegistration'
});

module.exports = {
  GDBServiceRegistrationModel
}