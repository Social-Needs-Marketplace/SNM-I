const {findClientById, createClientHelper, updateClientHelper, findOrganizationById} = require("./clientHelper");

const {MDBDynamicFormModel} = require("../../models/dynamicForm");
const {GDBCharacteristicModel, GDBClientModel, GDBQOModel, GDBOrganizationModel} = require("../../models");
const {GDBQuestionModel} = require("../../models/ClientFunctionalities/question");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");

const fieldParser = (fieldName) => {
  return fieldName.split('_')
}

const createClientOrganization = async (req, res, next) => {
  const data = req.body;
  const {option} = req.params

  if(!data.formId){
    return res.status(400).json({success: false, message: 'No form Id is given'})
  }
  const form = await MDBDynamicFormModel.findById(data.formId)
  if(form.formType !== 'client' && option === 'client'){
    return res.status(400).json({success: false, message: 'The form is not for client'})
  }
  if(form.formType !== 'organization' && option === 'organization'){
    return res.status(400).json({success: false, message: 'The form is not for organization'})
  }
  if(!form.formStructure){
    return res.status(400).json({success: false, message: 'The form structure is undefined'})
  }
  // TODO: verify if questions and characteristics are in the form

  if(!data.fields){
    return res.status(400).json({success: false, message: 'Please provide the fields'})
  }

  try{
    const characteristicIds = []
    const characteristicValues = []
    const questionIds = []
    const questionValues = []

    for (let field in data.fields) {
      const value = data.fields[field]
      const [fieldType, fieldId] = fieldParser(field)
      if(fieldType === 'characteristic'){
        characteristicIds.push(fieldId)
        characteristicValues.push(value)
      }else if(fieldType === 'question'){
        questionIds.push(fieldId)
        questionValues.push(value)
      }
    }
    const newClient = GDBClientModel({characteristicOccurrences: [], questionOccurrences: []})
    const newOrganization = GDBOrganizationModel({characteristicOccurrences: [], questionOccurrences: []})
    if(characteristicIds.length > 0){
      const characteristics = await GDBCharacteristicModel.find({_id: {$in: characteristicIds}}, {populates: ['implementation']})
      characteristics.forEach((characteristic, index) => {
        const newCO = GDBCOModel({occurrenceOf: characteristic})
        if(characteristic.implementation.valueDataType === 'xsd:string'){
          // TODO: check if the dataType of input value is correct
          newCO.dataStringValue = characteristicValues[index]
        }else if(characteristic.implementation.valueDataType === 'xsd:number'){
          newCO.dataNumberValue = characteristicValues[index]
        }else if(characteristic.implementation.valueDataType === 'xsd:boolean'){
          newCO.dataBooleanValue = characteristicValues[index]
        }else if(characteristic.implementation.valueDataType === 'xsd:datetimes'){
          newCO.dataDateValue = characteristicValues[index]
        }else if(characteristic.implementation.valueDataType === "owl:NamedIndividual"){
          newCO.objectValues = [... characteristicValues[index]]
        }
        if(option === 'client'){
          newClient.characteristicOccurrences.push(newCO)
        }else if(option === 'organization'){
          newOrganization.characteristicOccurrences.push(newCO)
        }

      })
    }
    if(questionIds.length > 0){
      const questions = await GDBQuestionModel.find({_id: {$in: questionIds}})
      questions.forEach((question, index) => {
        const newQO = GDBQOModel({occurrenceOf: question, stringValue: questionValues[index]})
        if(option === 'client'){
          newClient.questionOccurrences.push(newQO)
        }else if(option === 'organization'){
          newOrganization.questionOccurrences.push(newQO)
        }

      })
    }

    if(option === 'client'){
      newClient.save()
      return res.status(202).json({success: true, message: 'Successfully created a client'})
    }else if(option === 'organization'){
      newOrganization.save()
      return res.status(202).json({success: true, message: 'Successfully created an organization'})
    }

  }catch (e) {
    next(e)
  }

}

const fetchClientOrOrganization = async (req, res, next) => {
  try{
    const {id, option} = req.params;

    if(option === 'client'){
      const client = await findClientById(id);
      return res.status(202).json({client, success: true, message: 'Successfully fetched a client.'})
    }

    if(option === 'organization'){
      const organization = await findOrganizationById(id);
      return res.status(202).json({organization, success: true, message: 'Successfully fetched an organization.'})
    }

  } catch (e) {
    next(e)
  }
}


module.exports = {createClientOrganization, fetchClientOrOrganization}