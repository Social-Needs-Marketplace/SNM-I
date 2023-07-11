const {createGraphDBModel, DeleteType, Types} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");
const {GDBNeedSatisfierModel} = require("./needSatisfier");
const {GDBServiceProviderModel} = require("./serviceProvider");

const GDBProgramModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  code: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  characteristicOccurrence: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  serviceProvider: {type: GDBServiceProviderModel, internalKey: ':hasServiceProvider'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  mode: {type: Types.NamedIndividual, internalKey: ':hasMode'},
  needSatisfier: {type: [GDBNeedSatisfierModel], internalKey: ':hasNeedSatisfier'}
}, {
  rdfTypes: [':Program'], name: 'program'
});

module.exports = {
  GDBProgramModel
}