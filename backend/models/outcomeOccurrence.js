const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBCharacteristicModel} = require("./ClientFunctionalities/characteristic");
const {GDBOutcomeModel} = require("./outcome");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");

const GDBOutcomeOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBOutcomeModel, internalKey: 'occurrenceOf'},
  startDate:{type: Date, internalKey: 'hasStartDate'},
  endDate: {type: Date, internalKey: 'hasEndDate'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
}, {
  rdfTypes: [':OutcomeOccurrence'], name: 'outcomeOccurrence'
});

module.exports = {
  GDBOutcomeOccurrenceModel
}