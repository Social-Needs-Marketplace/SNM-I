const {GDBServiceProviderModel} = require("../../models");
const {GDBOrganizationModel} = require("../../models/organization");
const {createSingleGenericHelper, fetchSingleGenericHelper, deleteSingleGenericHelper, updateSingleGenericHelper} = require("./index");
const {Server400Error} = require("../../utils");
const {PredefinedCharacteristics} = require("../characteristics");
const { afterCreateVolunteer, afterUpdateVolunteer, afterDeleteVolunteer } = require("./volunteerInternalTypeTreater");
const { afterUpdateOrganization, afterDeleteOrganization } = require("./organizationInternalTypeTreater");

const createSingleServiceProvider = async (req, res, next) => {
  const {providerType, data} = req.body;
  if (!providerType || !data)
    return res.status(400).json({message: 'Type or data is not given'});
  try {
    const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: []});
    if (!!homeOrganization && providerType === 'organization'
        && data.fields[PredefinedCharacteristics['Organization Status']?._uri.split('#')[1]] === 'Home') {
      return res.status(400).json({message: 'Cannot create more than one home organization'});
    }

    const provider = await GDBServiceProviderModel({type: providerType});
    provider[providerType] = await createSingleGenericHelper(data, providerType);
    if (provider[providerType]) {
      await provider.save();

      if (providerType === 'volunteer') {
        await afterCreateVolunteer(data);
      }

      return res.status(200).json({success: true});
    } else {
      return res.status(400).json({message: 'Fail to create the provider'});
    }
  } catch (e) {
    next(e);
  }

};

const fetchMultipleServiceProviders = async (req, res, next) => {
  try {
    const data = await GDBServiceProviderModel.find({},
      {
        populates: ['organization.characteristicOccurrences.occurrenceOf',
          'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
          'volunteer.questionOccurrence', 'organization.address', 'volunteer.address',
          'volunteer.organization',]
      });
    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e);
  }
};

const updateServiceProvider = async (req, res, next) => {
  const {data, providerType} = req.body;
  const {id} = req.params;
  if (!providerType || !data || !id)
    return res.status(400).json({success: false, message: 'Type, data or id is not given'});
  try{
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;

    const homeOrganization = await GDBOrganizationModel.findOne({status: 'Home'}, {populates: []});
    const homeServiceProvider = await GDBServiceProviderModel.findOne({'organization': homeOrganization}, {populates: ['organization']});
    if (!!homeOrganization && homeServiceProvider._id != id && providerType === 'organization'
        && data.fields[PredefinedCharacteristics['Organization Status']?._uri.split('#')[1]] === 'Home') {
      return res.status(400).json({message: 'Cannot create more than one home organization'});
    }

    const { oldGeneric, generic } = await updateSingleGenericHelper(genericId, data, providerType);
    provider[providerType] = generic;
    await provider.save();

    if (providerType === 'volunteer') {
      await afterUpdateVolunteer(data, oldGeneric);
    } else {
      await afterUpdateOrganization(data, oldGeneric);
    }

    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}

const getProviderById = async (providerId) => {
  if (!providerId)
    throw new Server400Error('No id is given');
  const provider = await GDBServiceProviderModel.findOne({_id: providerId},
    {
      populates: ['organization', 'volunteer',]
    });
  if (!provider)
    throw new Server400Error('No such provider');

  return provider;
};

const fetchSingleServiceProvider = async (req, res, next) => {
  const {id} = req.params;
  try {
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;
    provider[providerType] = await fetchSingleGenericHelper(providerType, genericId);
    return res.status(200).json({provider, success: true});
  } catch (e) {
    next(e);
  }

};

const deleteSingleServiceProvider = async (req, res, next) => {
  const {id} = req.params;
  try {
    const provider = await getProviderById(id);
    const providerType = provider.type;
    const genericId = provider[providerType]._id;

    // delete the generic
    const oldGeneric = await deleteSingleGenericHelper(providerType, genericId);
    // delete the provider
    await GDBServiceProviderModel.findByIdAndDelete(id);

    if (providerType === 'volunteer') {
      await afterDeleteVolunteer(oldGeneric);
    } else {
      await afterDeleteOrganization(oldGeneric);
    }

    return res.status(200).json({success: true});

  } catch (e) {
    next(e);
  }

};

module.exports = {
  createSingleServiceProvider, fetchMultipleServiceProviders, fetchSingleServiceProvider, deleteSingleServiceProvider,
  updateServiceProvider, getProviderById
};
