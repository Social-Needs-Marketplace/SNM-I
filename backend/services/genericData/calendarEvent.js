const {getPredefinedProperty} = require("./helperFunctions");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("graphdb-utils");
const FORMTYPE = 'calendarEvent';

const calendarEventInternalTypeCreateTreater = async (internalType, instanceData, value) => { 
  // Get the property name from the internalType
  const property = getPredefinedProperty(FORMTYPE, internalType);
  // If the property is client, person or user, then set the value to the instanceData
  if (property === 'client' || property === 'person' || property === 'user' || property === 'referral') {
    instanceData[property] = value;
  }
};

const calendarEventInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema; 
  // for each property in data, if the property is client, person or user, then set the value to the result
  for (const property in data) {
    if (property === 'client' || property === 'person' || property === 'user' || property === 'referral') {
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[property].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = SPARQL.ensureFullURI(data[property]);
    }
  }
  return result;
};

const calendarEventInternalTypeUpdateTreater = async (internalType, value, result) => {
  await calendarEventInternalTypeCreateTreater(internalType, result, value);
}

module.exports = {calendarEventInternalTypeCreateTreater, calendarEventInternalTypeFetchTreater, calendarEventInternalTypeUpdateTreater}