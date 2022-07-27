const {createGraphDBModel, Types} = require("../../utils/graphdb");
const {GDBCIModel} = require("./characteristicImplementation");

const GDBCharacteristicModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  name: {type: String, internalKey: ':hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  implementation: {type: GDBCIModel, internalKey: ':hasCharacteristicImplementation'},
}, {
  rdfTypes: [':characteristics'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}