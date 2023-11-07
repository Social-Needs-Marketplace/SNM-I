const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBAddressModel} = require('./address')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBQOModel} = require("./ClientFunctionalities/questionOccurrence");

const GDBOrganizationModel = createGraphDBModel({
  name: {type: String, internalKey: 'tove_org:hasName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress'},
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrences: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  partner: {type: Boolean, internalKey: ':isPartner'},
  endpointUrl: {type: String, internalKey: ':hasEndpointUrl'},
  endpointPort: {type: Number, internalKey: ':hasEndpointNumber'},
}, {
  rdfTypes: [':Organization'], name: 'organization'
});

module.exports = {
  GDBOrganizationModel
}
