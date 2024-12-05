const {
  GDBClientModel,
  GDBPhoneNumberModel,
  GDBAddressModel,
  GDBQOModel
} = require("../../models");
const {SPARQL, GraphDB} = require('graphdb-utils');
const {FieldTypes} = require("../characteristics");
const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBNoteModel} = require("../../models/ClientFunctionalities/note");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");
const {MDBUsageModel} = require("../../models/usage");
const {parsePhoneNumber, combinePhoneNumber} = require("../../helpers/phoneNumber");
const {GDBServiceModel} = require("../../models/service/service");
const {GDBProgramModel} = require("../../models/program/program");
const {Server400Error} = require("../../utils");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBVolunteerModel} = require("../../models/volunteer");
const {GDBAppointmentModel} = require("../../models/appointment");
const {GDBCalendarEventModel} = require("../../models/calendarEvent");
const {GDBPersonModel} = require("../../models/person");
const {GDBServiceOccurrenceModel} = require("../../models/service/serviceOccurrence");
const {GDBProgramOccurrenceModel} = require("../../models/program/programOccurrence");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {noQuestion} = require('./checkers')
const {
  serviceOccurrenceInternalTypeCreateTreater, serviceOccurrenceInternalTypeFetchTreater,
  serviceOccurrenceInternalTypeUpdateTreater
} = require("./serviceOccurrenceInternalTypeTreater");
const {
  programOccurrenceInternalTypeCreateTreater, programOccurrenceInternalTypeFetchTreater,
  programOccurrenceInternalTypeUpdateTreater
} = require("./programOccurrenceInternalTypeTreater");
const {
  fetchCharacteristicQuestionsInternalTypesBasedOnForms,
  implementCharacteristicOccurrence,
  getPredefinedProperty
} = require("./helperFunctions");
const {GDBReferralModel} = require("../../models/referral");
const {
  serviceInternalTypeCreateTreater,
  serviceInternalTypeFetchTreater,
  serviceInternalTypeUpdateTreater,
  afterCreateService,
  afterUpdateService,
  afterDeleteService
} = require("./serviceInternalTypeTreater");
const {
  programInternalTypeCreateTreater,
  programInternalTypeFetchTreater,
  programInternalTypeUpdateTreater,
  afterCreateProgram,
  afterUpdateProgram,
  afterDeleteProgram
} = require("./programInternalTypeTreater");
const {
  referralInternalTypeCreateTreater,
  referralInternalTypeFetchTreater,
  referralInternalTypeUpdateTreater
} = require("./referralInternalTypeTreater");
const {GDBServiceRegistrationModel} = require("../../models/serviceRegistration");
const {GDBProgramRegistrationModel} = require("../../models/programRegistration");
const {
  serviceRegistrationInternalTypeCreateTreater, serviceRegistrationInternalTypeFetchTreater,
  serviceRegistrationInternalTypeUpdateTreater
} = require("./serviceRegistration");
const {
  programRegistrationInternalTypeCreateTreater, programRegistrationInternalTypeFetchTreater,
  programRegistrationInternalTypeUpdateTreater
} = require("./programRegistration");
const {
  appointmentInternalTypeCreateTreater,
  appointmentInternalTypeFetchTreater,
  appointmentInternalTypeUpdateTreater
} = require("./appointment");
const {
  calendarEventInternalTypeCreateTreater,
  calendarEventInternalTypeFetchTreater,
  calendarEventInternalTypeUpdateTreater,
} = require("./calendarEvent");
const {GDBServiceProvisionModel} = require("../../models/serviceProvision");
const {GDBProgramProvisionModel} = require("../../models/programProvision");
const {GDBNeedSatisfierOccurrenceModel} = require("../../models/needSatisfierOccurrence");
const {GDBNeedOccurrenceModel} = require("../../models/need/needOccurrence");
const {GDBOutcomeOccurrenceModel} = require("../../models/outcome/outcomeOccurrence");
const {GDBClientAssessmentModel} = require("../../models/clientAssessment");
const {
  serviceProvisionInternalTypeCreateTreater, serviceProvisionInternalTypeFetchTreater,
  serviceProvisionInternalTypeUpdateTreater
} = require("./serviceProvision");
const {
  programProvisionInternalTypeCreateTreater, programProvisionInternalTypeFetchTreater,
  programProvisionInternalTypeUpdateTreater
} = require("./programProvision");
const {
  clientInternalTypeUpdateTreater, clientInternalTypeCreateTreater, clientInternalTypeFetchTreater
} = require("./clientInternalTypeTreater");
const {
  needOccurrenceInternalTypeUpdateTreater,
  needOccurrenceInternalTypeCreateTreater,
  needOccurrenceInternalTypeFetchTreater,
  beforeDeleteNeedOccurrence
} = require("./needOccurrenceInternalTypeTreater");
const {
  outcomeOccurrenceInternalTypeUpdateTreater,
  outcomeOccurrenceInternalTypeCreateTreater,
  outcomeOccurrenceInternalTypeFetchTreater,
  beforeDeleteOutcomeOccurrence
} = require("./outcomeOccurrenceInternalTypeTreater");
const {
  clientAssessmentInternalTypeUpdateTreater,
  clientAssessmentInternalTypeCreateTreater,
  clientAssessmentInternalTypeFetchTreater,
  beforeCreateClientAssessment,
  beforeUpdateClientAssessment
} = require("./clientAssessmentInternalTypeTreater");
const {
  personInternalTypeUpdateTreater,
  personInternalTypeCreateTreater,
  personInternalTypeFetchTreater
} = require("./person");
const {
  volunteerInternalTypeCreateTreater,
  volunteerInternalTypeFetchTreater,
  volunteerInternalTypeUpdateTreater,
  afterCreateVolunteer,
  afterUpdateVolunteer,
  afterDeleteVolunteer
} = require("./volunteerInternalTypeTreater");
const {GDBEligibilityModel} = require("../../models/eligibility");
const genericType2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
  'volunteer': GDBVolunteerModel,
  'service': GDBServiceModel,
  'program': GDBProgramModel,
  'appointment': GDBAppointmentModel,
  'calendarEvent': GDBCalendarEventModel,
  'serviceOccurrence': GDBServiceOccurrenceModel,
  'programOccurrence': GDBProgramOccurrenceModel,
  'referral': GDBReferralModel,
  'serviceRegistration': GDBServiceRegistrationModel,
  'serviceProvision': GDBServiceProvisionModel,
  'programRegistration': GDBProgramRegistrationModel,
  'programProvision': GDBProgramProvisionModel,
  'needSatisfierOccurrence': GDBNeedSatisfierOccurrenceModel,
  'needOccurrence': GDBNeedOccurrenceModel,
  'outcomeOccurrence': GDBOutcomeOccurrenceModel,
  'clientAssessment': GDBClientAssessmentModel,
  'person': GDBPersonModel,
};

const genericType2Populates = {
  'serviceProvision': ['address', 'needOccurrence', 'serviceOccurrence', 'needSatisfierOccurrence'],
  'programProvision' : ['address', 'needOccurrence', 'programOccurrence', 'needSatisfierOccurrence'],
  'serviceRegistration': ['address', 'needOccurrence', 'serviceOccurrence'],
  'programRegistration' : ['address', 'needOccurrence', 'programOccurrence'],
  'needOccurrence': ['address', 'occurrenceOf', 'client'],
  'outcomeOccurrence': ['address', 'occurrenceOf', 'client'],
  'needSatisfierOccurrence': ['address'],
  'clientAssessment': ['address', 'client'],
  'referral': ['address', 'client'],
  'service': ['serviceProvider.organization.address', 'serviceProvider.volunteer.address'],
  'program': ['serviceProvider.organization.address', 'serviceProvider.volunteer.address', 'serviceProvider.organization', 'serviceProvider.volunteer', 'manager'],
  'serviceOccurrence': ['address', 'occurrenceOf'],
  'programOccurrence': ['address', 'occurrenceOf'],
  'client': ['address', 'needs'],
  'appointment': ['address', 'referral'],
  'calendarEvent': ['address', 'referral'],
  'person': ['address'],
  'volunteer': ['partnerOrganizations', 'organization', 'address'],
};

const genericType2Checker = {
    'service': noQuestion,
    'serviceOccurrence': noQuestion,
    'programOccurrence': noQuestion,
    'program': noQuestion
};


const genericType2BeforeCreateTreater = {
  'clientAssessment': beforeCreateClientAssessment
}

const genericType2BeforeUpdateTreater = {
  'clientAssessment': beforeUpdateClientAssessment
}

const genericType2BeforeDeleteTreater = {
  'needOccurrence': beforeDeleteNeedOccurrence,
  'outcomeOccurrence': beforeDeleteOutcomeOccurrence
}

// this dict will be shared by all generic types with internal types as their properties
// os going to be used by generic services/ serviceOccurrence/ appointment / referral ...
const genericType2InternalTypeCreateTreater = {
  'serviceOccurrence': serviceOccurrenceInternalTypeCreateTreater,
  'service': serviceInternalTypeCreateTreater,
  'programOccurrence': programOccurrenceInternalTypeCreateTreater,
  'program': programInternalTypeCreateTreater,
  'referral': referralInternalTypeCreateTreater,
  'serviceRegistration': serviceRegistrationInternalTypeCreateTreater,
  'programRegistration': programRegistrationInternalTypeCreateTreater,
  'appointment': appointmentInternalTypeCreateTreater,
  'calendarEvent': calendarEventInternalTypeCreateTreater,
  'serviceProvision': serviceProvisionInternalTypeCreateTreater,
  'programProvision': programProvisionInternalTypeCreateTreater,
  'client': clientInternalTypeCreateTreater,
  'needOccurrence': needOccurrenceInternalTypeCreateTreater,
  'outcomeOccurrence': outcomeOccurrenceInternalTypeCreateTreater,
  'clientAssessment': clientAssessmentInternalTypeCreateTreater,
  'person': personInternalTypeCreateTreater,
  'volunteer': volunteerInternalTypeCreateTreater
};

const genericType2InternalTypeFetchTreater = {
  'serviceOccurrence': serviceOccurrenceInternalTypeFetchTreater,
  'service': serviceInternalTypeFetchTreater,
  'programOccurrence': programOccurrenceInternalTypeFetchTreater,
  'program': programInternalTypeFetchTreater,
  'referral': referralInternalTypeFetchTreater,
  'serviceRegistration': serviceRegistrationInternalTypeFetchTreater,
  'programRegistration': programRegistrationInternalTypeFetchTreater,
  'appointment': appointmentInternalTypeFetchTreater,
  'calendarEvent': calendarEventInternalTypeFetchTreater,
  'serviceProvision': serviceProvisionInternalTypeFetchTreater,
  'programProvision': programProvisionInternalTypeFetchTreater,
  'client': clientInternalTypeFetchTreater,
  'needOccurrence': needOccurrenceInternalTypeFetchTreater,
  'outcomeOccurrence': outcomeOccurrenceInternalTypeFetchTreater,
  'clientAssessment': clientAssessmentInternalTypeFetchTreater,
  'person': personInternalTypeFetchTreater,
  'volunteer': volunteerInternalTypeFetchTreater
};

const genericType2InternalTypeUpdateTreater = {
  'serviceOccurrence': serviceOccurrenceInternalTypeUpdateTreater,
  'service': serviceInternalTypeUpdateTreater,
  'programOccurrence': programOccurrenceInternalTypeUpdateTreater,
  'program' : programInternalTypeUpdateTreater,
  'referral': referralInternalTypeUpdateTreater,
  'serviceRegistration': serviceRegistrationInternalTypeUpdateTreater,
  'programRegistration': programRegistrationInternalTypeUpdateTreater,
  'appointment': appointmentInternalTypeUpdateTreater,
  'calendarEvent': calendarEventInternalTypeUpdateTreater,
  'serviceProvision': serviceProvisionInternalTypeUpdateTreater,
  'programProvision': programProvisionInternalTypeUpdateTreater,
  'client': clientInternalTypeUpdateTreater,
  'needOccurrence': needOccurrenceInternalTypeUpdateTreater,
  'outcomeOccurrence': outcomeOccurrenceInternalTypeUpdateTreater,
  'clientAssessment': clientAssessmentInternalTypeUpdateTreater,
  'person': personInternalTypeUpdateTreater,
  'volunteer': volunteerInternalTypeUpdateTreater
};

const genericType2AfterCreateTreater = {
  'program': afterCreateProgram,
  'service': afterCreateService,
  'volunteer': afterCreateVolunteer
}

const genericType2AfterUpdateTreater = {
  'program': afterUpdateProgram,
  'service': afterUpdateService,
  'volunteer': afterUpdateVolunteer
}

const genericType2AfterDeleteTreater = {
  'program': afterDeleteProgram,
  'service': afterDeleteService,
  'volunteer': afterDeleteVolunteer
}

const {graphdb} = require('../../config');

const specialField2Model = {
  'address': GDBAddressModel,
  'phoneNumber': GDBPhoneNumberModel
};

const {extractAllIndexes} = require('../../helpers/stringProcess');

async function fetchSingleGenericHelper(genericType, id) {

  if (!genericType2Model[genericType]) {
    throw new Server400Error('Invalid generic type.');
    // return res.status(400).json({success: false, message: 'Invalid generic type.'});
  }

  const data = await genericType2Model[genericType].findOne({_id: id},
    {populates: ['characteristicOccurrences.occurrenceOf.implementation', 'questionOccurrences']});

  if (!data) {
    throw new Server400Error('Generic not found.');
  }

  const inter = await GDBInternalTypeModel.findById(1);

  let result = {}
  if (genericType2InternalTypeFetchTreater[genericType])
    result = await genericType2InternalTypeFetchTreater[genericType](data) || {};

  // Copy the values to occurrence.value regardless of its type.
  if (data.characteristicOccurrences)
    for (const co of data.characteristicOccurrences) {

      // Assign full URI
      if (co.objectValue) {
        // when object is a phoneNumber
        await co.populate('occurrenceOf.implementation');
        if (co.occurrenceOf.implementation.fieldType === FieldTypes.PhoneNumberField._uri) {
          const id = co.objectValue.split('_')[1];
          co.objectValue = combinePhoneNumber(await GDBPhoneNumberModel.findOne({_id: id}));
        } else if (co.occurrenceOf.implementation.fieldType === FieldTypes.AddressField._uri) {
          const id = co.objectValue.split('_')[1];
          const address = (await GDBAddressModel.findOne({_id: id})).toJSON();

          // Get full URI
          if (address.streetType) address.streetType = SPARQL.ensureFullURI(address.streetType);
          if (address.streetDirection) address.streetDirection = SPARQL.ensureFullURI(address.streetDirection);
          if (address.state) address.state = SPARQL.ensureFullURI(address.state);

          co.objectValue = address;

        } else if (co.occurrenceOf.implementation.fieldType === FieldTypes.EligibilityField._uri) {
          const id = co.objectValue.split('_')[1];
          co.objectValue = (await GDBEligibilityModel.findOne({_id: id})).toJSON();
          if (co.objectValue.formulaJSON) co.objectValue.formulaJSON = JSON.parse(co.objectValue.formulaJSON);
        }

      } else if (co.multipleObjectValues) {
        co.multipleObjectValues = co.multipleObjectValues.map(value => SPARQL.ensureFullURI(value));
      }
      const coName = co.occurrenceOf.individualName
        ? co.occurrenceOf.individualName.replace(':', '')
        : SPARQL.ensurePrefixedURI(co.occurrenceOf).replace(':', '');
      result[coName] =
        co.dataStringValue ?? co.dataNumberValue ?? co.dataBooleanValue ?? co.dataDateValue
        ?? co.objectValue ?? co.multipleObjectValues;
    }

  if (data.questionOccurrences)
    for (const qo of data.questionOccurrences) {
      result[SPARQL.ensurePrefixedURI(qo.occurrenceOf).replace(':', '')] = qo.stringValue;
    }

  return result;
}

async function fetchSingleGeneric(req, res, next) {
  try {
    const {genericType, id} = req.params;

    const result = await fetchSingleGenericHelper(genericType, id);
    if (result)
      return res.status(200).json({data: result, success: true});
  } catch (e) {
    next(e);
  }
}

async function addIdToUsage(option, genericType, id) {
  let usage = await MDBUsageModel.findOne({option: option, genericType: genericType});
  if (!usage)
    usage = new MDBUsageModel({option: option, genericType: genericType, optionKeys: []});
  // check whether the characteristic linked to this option
  if (!usage.optionKeys.includes(id))
    usage.optionKeys.push(id);
  await usage.save();
}


async function deleteIdFromUsageAfterChecking(option, genericType, id) {
  // check if this option's occurrence is linked with another instance of the genericType
  const key = option + 'Occurrences';
  const value = ':' + option + "_" + id;
  const x = await genericType2Model[genericType].find({[key]: {occurrenceOf: value}});
  if (x.length === 0) {
    // then we have to remove the id from the usage
    const usage = await MDBUsageModel.findOne({option: option, genericType: genericType});
    if (usage) {
      usage.optionKeys = usage.optionKeys.filter((key) => (key !== id));
      await usage.save();
    }
  }

}

const createSingleGenericHelper = async (data, genericType) => {
  // check the data package from frontend
  // check if a formId was sent
  if (!data.formId) {
    throw new Server400Error('No form id is given');
    // return res.status(400).json({success: false, message: 'No form id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId);

  // check if the genericType is in genericType2Model
  if (!genericType2Model[genericType])
    throw new Server400Error('Invalid genericType');
  // return res.status(400).json({success: false, message: 'Invalid genericType'})

  // check if the form type is consist with request type(client, serviceProvider, ...)
  if (form.formType !== genericType)
    throw new Server400Error(`The form is not for ${genericType}`);
  // return res.status(400).json({success: false, message: `The form is not for ${genericType}`})

  // check if the form has a structure
  if (!form.formStructure) {
    throw new Server400Error('The form structure is not defined');
    // return res.status(400).json({success: false, message: 'The form structure is not defined'})
  }
  // TODO: verify if questions and characteristics are in the form

  // check if the fields are provided
  if (!data.fields) {
    throw new Server400Error('No fields provided');
    // return res.status(400).json({success: false, message: 'No fields provided'})
  }


  const questions = {};
  const characteristics = {};
  const internalTypes = {};

  // extract questions and characteristics based on fields from the database
  await fetchCharacteristicQuestionsInternalTypesBasedOnForms(characteristics, questions, internalTypes, data.fields);
  if (genericType2Checker[genericType])
    genericType2Checker[genericType](characteristics, questions);

  const instanceData = {characteristicOccurrences: [], questionOccurrences: []};
  // iterating over all fields and create occurrences and store them into instanceData
  for (const [key, value] of Object.entries(data.fields)) {
    if (value == null)
      continue;
    const [type, id] = key.split('_');

    if (type === 'characteristic') {
      const characteristic = characteristics[id];
      const occurrence = {occurrenceOf: characteristic};
      await implementCharacteristicOccurrence(characteristic, occurrence, value);

      // find the usage(given option and geneticType), create a new one if no such
      await addIdToUsage('characteristic', genericType, id);

      if (characteristic.isPredefined) {
        const property = getPredefinedProperty(genericType, characteristic);
        if (property) {
          instanceData[property] = occurrence.dataStringValue ?? occurrence.dataNumberValue ?? occurrence.dataBooleanValue ??
            occurrence.dataDateValue ?? occurrence.objectValue ?? occurrence.multipleObjectValues;
        }
      }

      instanceData.characteristicOccurrences.push(occurrence);

    } else if (type === 'question') {
      await addIdToUsage('question', genericType, id);
      const occurrence = {occurrenceOf: questions[id], stringValue: value};
      instanceData.questionOccurrences.push(occurrence);
    }
  }

  if (genericType2BeforeCreateTreater[genericType])
    await genericType2BeforeCreateTreater[genericType](instanceData, internalTypes, data.fields);

  for (const [key, value] of Object.entries(data.fields)) {
    if (value == null)
      continue;
    const [type, id] = key.split('_');

    if (type === 'internalType') {
      await addIdToUsage('internalType', genericType, id);

      const internalType = internalTypes[id];
      await genericType2InternalTypeCreateTreater[genericType](internalType, instanceData, value);
    }
  }

  if (instanceData.characteristicOccurrences.length === 0)
    delete instanceData.characteristicOccurrences;
  if (instanceData.questionOccurrences.length === 0)
    delete instanceData.questionOccurrences

  return instanceData;

};

const createSingleGeneric = async (req, res, next) => {
  const data = req.body;
  // genericType will be 'client', 'serviceProvider',...
  const {genericType} = req.params;

  try {
    const instanceData = await createSingleGenericHelper(data, genericType);
    // add createDate to person
    if (genericType === 'person'){
      instanceData['createDate'] = new Date();
    }
    if (instanceData) {
      // the instance data is stored into graphdb
      const newGeneric = genericType2Model[genericType](instanceData);
      await newGeneric.save();

      if (genericType2AfterCreateTreater[genericType])
        await genericType2AfterCreateTreater[genericType](data, req);
  
      return res.status(202).json({success: true, message: `Successfully created a/an ${genericType}`, createdId: newGeneric._id});
    }

  } catch (e) {
    next(e);
  }

};

async function updateSingleGenericHelper(genericId, data, genericType) {
  const generic = await genericType2Model[genericType].findOne({_id: genericId}, {
    populates: ['characteristicOccurrences',
      'questionOccurrences']
  });
  if (!generic) {
    throw new Server400Error(`No such ${genericType}`);
  }
  if (!data.formId) {
    throw new Server400Error('No form id was provided');
  }
  const form = await MDBDynamicFormModel.findById(data.formId);
  for (let key of Object.keys(genericType2Model)) {
    if (form.formType !== key && genericType === key) {
      throw new Server400Error(`The form is not for ${key}`);
    }
  }
  if (!form.formStructure) {
    throw new Server400Error('The form structure is not defined');
  }
  // TODO: verify if questions and characteristics are in the form
  if (!data.fields) {
    throw new Server400Error('No fields provided');
  }

  // fetch characteristics and questions from GDB
  const questions = {};
  const characteristics = {};
  const internalTypes = {};
  await fetchCharacteristicQuestionsInternalTypesBasedOnForms(characteristics, questions, internalTypes, data.fields);

  // check should we update or create a characteristicOccurrence or questionOccurrence
  // in other words, is there a characteristicOccurrence/questionOccurrence belong to this user,
  // and related to the characteristic/question
  for (const [key, value] of Object.entries(data.fields)) {
    const [type, id] = key.split('_');
    if (type === 'characteristic') {
      // find out all possible COs related to this characteristic
      let query = `
        PREFIX : <http://snmi#>
        select * where { 
	          ?co ?p :characteristic_${id}.
            ?co a :CharacteristicOccurrence.
        }`;
      const possibleCharacteristicOccurrencesIds = [];
      await GraphDB.sendSelectQuery(query, false, ({co, p}) => {
        possibleCharacteristicOccurrencesIds.push(co.value.split('_')[1]);
      });
      // check if there is a CO in possibleCharacteristicOccurrencesIds is related to this generic
      if (!generic.characteristicOccurrences)
        generic.characteristicOccurrences = [];
      const existedCO = generic.characteristicOccurrences.filter((co) => {
        return possibleCharacteristicOccurrencesIds.filter((id) => {
          return id === co._id;
        }).length > 0;
      })[0];


      const characteristic = characteristics[id];

      if (!existedCO && value != null) { // have to create a new CO and add the characteristic's id to the usage
        await addIdToUsage('characteristic', genericType, id);
        const occurrence = {occurrenceOf: characteristic};
        await implementCharacteristicOccurrence(characteristic, occurrence, value);
        generic.characteristicOccurrences.push(occurrence);
        // update the generic's property if needed
        if (characteristic.isPredefined) {
          const property = getPredefinedProperty(genericType, characteristic);
          if (property) {
            generic[property] = occurrence.dataStringValue ?? occurrence.dataNumberValue ?? occurrence.dataBooleanValue ?? occurrence.dataDateValue
              ?? occurrence.objectValue ?? occurrence.multipleObjectValues;
          }
        }
      } else if (existedCO && value != null) { // just add the value on existedCO
        await implementCharacteristicOccurrence(characteristic, existedCO, value);
        if (characteristic.isPredefined) {
          const property = getPredefinedProperty(genericType, characteristic);
          if (property) {
            generic[property] = existedCO.dataStringValue ?? existedCO.dataNumberValue ?? existedCO.dataBooleanValue ?? existedCO.dataDateValue ??
              existedCO.objectValue ?? existedCO.multipleObjectValues;
          }
        }
      } else if (existedCO && value == null) { // when the user wants to remove the occurrence
        await existedCO.populate('occurrenceOf');
        if (existedCO.objectValue) { // remove the objectValue if necessary
          const [fieldType, id] = existedCO.objectValue.split('_');
          await specialField2Model[fieldType]?.findByIdAndDelete(id);
        }
        await GDBCOModel.findByIdAndDelete(existedCO._id); // remove the occurrence
        // also have to remove from usage if necessary
        await deleteIdFromUsageAfterChecking('characteristic', genericType, existedCO.occurrenceOf._id);
      }

    }

    if (type === 'question') {
      // find out all possible QOs related to this question
      let query = `
        PREFIX : <http://snmi#>
        select * where { 
	          ?qo ?p :question_${id}.
            ?qo a :QuestionOccurrence.
        }`;
      const possibleQuestionOccurrencesIds = [];
      await GraphDB.sendSelectQuery(query, false, ({qo, p}) => {
        possibleQuestionOccurrencesIds.push(qo.value.split('_')[1]);
      });
      // check if there is a QO in possibleQuestionOccurrencesIds is related to this generic
      if (!generic.questionOccurrences)
        generic.questionOccurrences = [];
      const existedQO = generic.questionOccurrences.filter((qo) => {
        return possibleQuestionOccurrencesIds.filter((id) => {
          return id === qo._id;
        }).length > 0;
      })[0];

      if (!existedQO && value) { // create a new QO
        await addIdToUsage('question', genericType, id);
        const occurrence = {occurrenceOf: questions[id], stringValue: value};
        generic.questionOccurrences.push(occurrence);
      } else if (existedQO && value) { // update the question
        existedQO.stringValue = value;
      } else if (existedQO && !value) { // remove the occurrence
        await GDBQOModel.findByIdAndDelete(existedQO._id);
        await existedQO.populate('occurrenceOf');
        await deleteIdFromUsageAfterChecking('question', genericType, existedQO.occurrenceOf._id);
      }

    }
  }

  if (genericType2BeforeUpdateTreater[genericType])
    await genericType2BeforeUpdateTreater[genericType](generic, internalTypes, data.fields);

  const oldGeneric = generic.toJSON();

  // TODO: Fix the issue where the new value is undefined, it never triggers the genericType2InternalTypeUpdateTreater()
  for (const [key, value] of Object.entries(data.fields)) {
    const [type, id] = key.split('_');
    if (type === 'internalType') {
      if (genericType2InternalTypeUpdateTreater[genericType]) {
        await genericType2InternalTypeUpdateTreater[genericType](internalTypes[id], value, generic);
      } else {
        throw Error(`Cannot find internal type ${genericType}`)
      }
    }
  }

  return { oldGeneric, generic };
}

// what should we do if the field is empty
async function updateSingleGeneric(req, res, next) {
  const data = req.body;
  const {id, genericType} = req.params;

  try {
    // check the data package from frontend
    // checking if a generic id is provided
    if (!id) {
      return res.status(400).json({success: false, message: `No ${genericType} id is given`});
    }
    const { oldGeneric, generic } = await updateSingleGenericHelper(id, data, genericType);
    await generic.save();

    if (genericType2AfterUpdateTreater[genericType])
      await genericType2AfterUpdateTreater[genericType](data, oldGeneric, req);

    res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}

async function deleteSingleGenericHelper(genericType, id) {
  if (!genericType || !id)
    throw new Server400Error('genericType or id is not given');

  const generic = await genericType2Model[genericType].findOne({_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']});
  if (!generic)
    throw new Server400Error('Invalid genericType or id');

  if (genericType2BeforeDeleteTreater[genericType])
    genericType2BeforeDeleteTreater[genericType](generic);

  const oldGeneric = generic.toJSON();

  const characteristicsOccurrences = generic.characteristicOccurrences;
  const questionsOccurrences = generic.questionOccurrences;
  const note = generic.note;
  // delete notes
  await GDBNoteModel.findByIdAndDelete(note?._id);

  // recursively delete characteristicsOccurrences, including phoneNumber and Address
  // todo: other special fields
  if (characteristicsOccurrences) {
    for (let characteristicOccurrence of characteristicsOccurrences) {
      await characteristicOccurrence.populate('occurrenceOf');
      if (characteristicOccurrence.objectValue) {
        const [fieldType, id] = characteristicOccurrence.objectValue.split('_');
        await specialField2Model[fieldType]?.findByIdAndDelete(id);
      }
      await GDBCOModel.findByIdAndDelete(characteristicOccurrence._id);
      await deleteIdFromUsageAfterChecking('characteristic', genericType, characteristicOccurrence.occurrenceOf._id);
    }
  }

  // recursively delete questionOccurrences
  if (questionsOccurrences) {
    for (let questionOccurrence of questionsOccurrences) {
      await GDBQOModel.findByIdAndDelete(questionOccurrence._id);
      await questionOccurrence.populate('occurrenceOf');
      await deleteIdFromUsageAfterChecking('question', genericType, questionOccurrence.occurrenceOf._id);
    }
  }
  await genericType2Model[genericType].findByIdAndDelete(id);

  return oldGeneric;
}

async function deleteSingleGeneric(req, res, next) {
  try {
    // check the package from frontend
    const {genericType, id} = req.params;
    const oldGeneric = await deleteSingleGenericHelper(genericType, id);

    if (genericType2AfterDeleteTreater[genericType])
      await genericType2AfterDeleteTreater[genericType](oldGeneric, req);

    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}

async function fetchGenericDatasHelper(genericType) {
  if (!genericType2Model[genericType])
    return null;
  const extraPopulates = genericType2Populates[genericType] || [];
  const data = await genericType2Model[genericType].find({},
    {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence', ...extraPopulates]});
  return data;
}

const fetchGenericDatas = async (req, res, next) => {
  const {genericType} = req.params;
  try {
    const result = await fetchGenericDatasHelper(genericType);
    if (!result) {
      return res.status(400).json({success: false, message: 'No such generic type'});
    }
    return res.status(200).json({data: result, success: true});
  } catch (e) {
    next(e);
  }
};

const searchGenericDatas = async (req, res, next) => {
  const {genericType} = req.params;

  let connector_search_result;
  let fts_search_result;
  try {
    if (!genericType2Model[genericType])
      return res.status(400).json({success: false, message: 'No such generic type'})
    const extraPopulates = genericType2Populates[genericType] || [];

    let data = [];

    if (req.query.searchitem === undefined || req.query.searchitem === "") {
      // nothing is entered in the search bar
      // or it's just requesting all the objects
      data = await genericType2Model[genericType].find({},
          {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence', ...extraPopulates]});
    } else {
      fts_search_result = await fts_search(genericType, req.query.searchitem + '*');
      connector_search_result = await connector_search(genericType, req.query.searchitem + '*');
      // merge the two arrays
      let array = [...new Set([...fts_search_result, ...connector_search_result])];

      if (array.length !== 0) {
        let data_array = [];
        for (let i = 0; i < array.length; i++) {
          data_array.push(await genericType2Model[genericType].find({_uri: array[i]},
              {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence', ...extraPopulates]}));
        }
        data = data_array.flat();
      }

    }

    return res.status(200).json({data, success: true});

  } catch (e) {
    next(e);
  }


};



async function fts_search(searchtype, searchitem) {
    // The initial query sent to the database
    const baseURI = graphdb.addr + "/repositories/snmi?query=";
    let query = "";

    search_type_in_string = ['service', 'program', 'serviceProvision', 'client']
    search_type_in_object = [':Service', ':Program', ':ServiceProvision', ':Client']

    let search_object = '';
    // if search type is in search_type_in_string, set search_object to the corresponding object
    for (let i = 0; i < search_type_in_string.length; i++) {
        if (searchtype === search_type_in_string[i]) {
            search_object = search_type_in_object[i];
            break
        }
    }

    // FTS search part
    const sparqlQuery =
        `
            PREFIX onto: <http://www.ontotext.com/>
            PREFIX : <http://snmi#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            select distinct ?e0
            where 
            {
                BIND("${searchitem}" AS ?searchitem)
                
                # Search :Service objects
                {
                    ?e0 ?p0 ?o0 .
                    ?e0 rdf:type ${search_object} .
                }.
                
                # Check if the object itself contains the search item
                {
                    ?o0 onto:fts ?searchitem .
                }
                UNION
                # Check if the object contains object containing the search item
                {   
                    ?o0 ?p1 ?o1 .
                    
                    {
                        ?o1 onto:fts ?searchitem .
                    }
                    UNION
                    {
                        ?o1 ?p2 ?o2 .
                        ?o2 onto:fts ?searchitem .
                    }
                }
            }            
        `;

    query = baseURI + encodeURIComponent(sparqlQuery);

    const response = await fetch(query);
    const text = await response.text();
    return extractAllIndexes(searchtype, text);

}

async function connector_search(searchtype, searchitem) {
    // The initial query sent to the database
    const baseURI = graphdb.addr + "/repositories/snmi?query=";

    let query = "";

    search_type_in_string = ['service', 'program', 'serviceProvision', 'client']
    search_type_in_object = [':Service', ':Program', ':ServiceProvision', ':Client']

    let search_object = '';
    // if search type is in search_type_in_string, set search_object to the corresponding object
    for (let i = 0; i < search_type_in_string.length; i++) {
        if (searchtype === search_type_in_string[i]) {
            search_object = search_type_in_object[i];
            break
        }
    }

    // FTS search part
    const sparqlQuery =
        `
            PREFIX onto: <http://www.ontotext.com/>
            PREFIX : <http://snmi#>
            
            PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
            PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            select distinct ?e0
            where 
            {                
                # Search :Service objects
                {
                    ?e0 ?p0 ?o0 .
                    ?e0 rdf:type ${search_object} .
                }.
                
                {
                    ?search a luc-index:service_connector ;
                    luc:query "${searchitem}" ;
                    luc:entities ?e0 .
                }
                UNION
                {
                    ?search a luc-index:program_connector ;
                    luc:query "${searchitem}" ;
                    luc:entities ?e0 .
                }
                UNION
                {
                    ?search a luc-index:client_connector ;
                    luc:query "${searchitem}" ;
                    luc:entities ?e0 .
                }
                UNION
                {
                    ?search a luc-index:characteristicoccurrence_connector ;
                    luc:query "${searchitem}" ;
                    luc:entities ?o0 .
                }
                UNION
                {
                    ?search a luc-index:address_connector ;
                    luc:query "${searchitem}" ;
                    luc:entities ?o0 .
                }
            }        
        `;

    query = baseURI + encodeURIComponent(sparqlQuery);

    const response = await fetch(query);
    const text = await response.text();
    return extractAllIndexes(text);

}


module.exports = {
  genericType2Model,
  fetchSingleGeneric, createSingleGeneric, updateSingleGeneric, deleteSingleGeneric, fetchGenericDatas, searchGenericDatas,
  createSingleGenericHelper, fetchSingleGenericHelper, deleteSingleGenericHelper, updateSingleGenericHelper,
  fetchGenericDatasHelper
};
