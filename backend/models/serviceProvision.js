const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBNeedOccurrenceModel} = require("./needOccurrence");
const {GDBServiceOccurrenceModel} = require("./serviceOccurrence");
const {GDBClientModel} = require("./ClientFunctionalities/client");
const {GDBNeedSatisfierModel} = require("./needSatisfier");

const GDBServiceProvisionModel = createGraphDBModel({
  needOccurrence: {type: GDBNeedOccurrenceModel, internalKey: ':forNeedOccurrence'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  client: {type: GDBClientModel, internalKey: ':hasClient'},
  needSatisfierOccurrence: {type: GDBNeedSatisfierModelm, internalKey: ':hasNeedSatisfierOccurrence'},
}, {
  rdfTypes: [':Service'], name: 'service'
});

module.exports = {
  GDBServiceProvisionModel
}