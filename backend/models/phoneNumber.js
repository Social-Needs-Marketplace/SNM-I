const {createGraphDBModel, Types} = require("graphdb-utils");
const GDBPhoneNumberModel = createGraphDBModel({
  areaCode: {type: Number, internalKey: 'ic:hasAreaCode'},
  countryCode: {type: Number, internalKey: 'ic:hasCountryCode'},
  phoneNumber: {type: Number, internalKey: 'ic:hasPhoneNumber'},
  phoneType: {type: Types.NamedIndividual, internalKey: 'ic:hasPhoneType'},
}, {rdfTypes: ['ic:PhoneNumber'], name: 'phoneNumber'});

module.exports = {GDBPhoneNumberModel}
