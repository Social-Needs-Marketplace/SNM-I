const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {findCharacteristicById, updateCharacteristicHelper,
  createCharacteristicHelper, updateOptions, updateFieldType} = require("./characteristicsHelper");


const createCharacteristic = async (req, res, next) => {
  const {label, name, codes, dataType, fieldType, options, optionsFromClass, description} = req.body;
  const data = {
    label,
    name,
    codes,
    dataType,
    fieldType,
    options,
    optionsFromClass,
    description,
  };

  try{
    await createCharacteristicHelper(data);
    return res.status(202).json({success: true, message: 'Successfully update Characteristic.'});
  }catch (e){
    next(e)
  }

}

const updateCharacteristic = async (req, res, next) => {
  const id = req.params.id;
  const {label, name, dataType, fieldType, options, optionsFromClass, description} = req.body;
  const updateData = {
    label,
    name,
    dataType,
    fieldType,
    options,
    optionsFromClass,
    description,
  };

  try{
    await updateCharacteristicHelper(id, updateData);
    await updateOptions(id, options);
    await updateFieldType(id, fieldType);
    return res.status(202).json({success: true, message: 'Successfully update Characteristic.'});
  }catch (e){
    next(e)
  }

}

const fetchCharacteristic = async (req, res, next) => {
  try{
    const id = req.params.id;
    const characteristic = await findCharacteristicById(id);
    return res.status(200).json({characteristic, success:true});
  }catch (e){
    next(e)
  }
}

const fetchCharacteristics = async (req, res, next) => {
  try{
    const rawData = await GDBCharacteristicModel.find({},
      {populates: ['implementation.fieldType', 'implementation.options']});
    const data = rawData.map((characteristic) => {
      return {
        id: characteristic._id,
        description: characteristic.description,
        codes: characteristic.codes,
        implementation: characteristic.implementation,
      }
    })
    return res.status(200).json({data, success:true});
  }catch (e){
    next(e)
  }
}

const deleteCharacteristic = async (req, res, next) => {
  try{
    const id = req.params.id;
    await GDBCharacteristicModel.findByIdAndDelete(id);
    return res.status(200).json({success:true});
  }catch (e){
    next(e)
  }
}


module.exports = {createCharacteristic, updateCharacteristic, fetchCharacteristic,
  fetchCharacteristics, deleteCharacteristic}