const { createGraphDBModel, DeleteType } = require("graphdb-utils");
const { GDBClientModel } = require("./ClientFunctionalities/client");
const { GDBUserAccountModel } = require("./userAccount");
const {GDBPersonModel} = require("./person");
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");
const {GDBAddressModel} = require('./address');
const { GDBReferralModel } = require("./referral");

const GDBCalendarEventModel = createGraphDBModel ({
  client: {type: GDBClientModel, internalKey: ':forClient'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  person: {type: GDBPersonModel, internalKey: ':hasPerson'},
  user: {type: GDBUserAccountModel, internalKey: ':withUser'},
  status: {type: String, internalKey: ':hasCalendarEventStatus'},
  referral: {type: GDBReferralModel, internalKey: ':hasReferral'},
  characteristicOccurrences : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  idInPartnerDeployment: {type: String, internalKey: ':hasIdInPartnerDeployment'},
}, {
  rdfTypes: [':CalendarEvent'], name: 'calendarEvent'
});

module.exports = {
  GDBCalendarEventModel
}