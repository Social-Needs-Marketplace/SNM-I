const {createGraphDBModel, DeleteType, Types, getGraphDBModel} = require("../utils/graphdb");
const {GDBProgramOccurrenceModel} = require("./program/programOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBReferralModel} = require("./referral");
const {GDBAppointmentModel} = require("./appointment");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBNeedOccurrenceModel} = require("./need/needOccurrence");

const GDBProgramRegistrationModel = createGraphDBModel({
  programOccurrence: {type: GDBProgramOccurrenceModel, internalKey: ':hasProgramOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':hasNeedOccurrence'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  appointment: {type: GDBAppointmentModel, internalKey: ':hasAppointment'},
  characteristicOccurrence: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ProgramRegistration'], name: 'programRegistration'
});

module.exports = {
  GDBProgramRegistrationModel
}
