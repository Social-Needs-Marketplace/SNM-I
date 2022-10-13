import React, { useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {defaultAddEditNeedFields} from "../../constants/default_fields";
import {Loading} from "../shared";
import {Chip, Button, Container, Paper, Typography, Divider, IconButton, Grid} from "@mui/material";
import SelectField from '../shared/fields/SelectField.js'
import Dropdown from "../shared/fields/MultiSelectField";
import GeneralField from "../shared/fields/GeneralField";
import RadioField from "../shared/fields/RadioField";
import { fetchCharacteristics,
} from "../../api/characteristicApi";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {createNeedSatisfier, fetchNeedSatisfiers} from "../../api/needSatisfierApi";
import {createNeed, fetchNeed, updateNeed} from "../../api/needApi";
import {useSnackbar} from "notistack";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
}));


export default function AddEditNeed() {

  const classes = useStyles();
  const navigate = useNavigate();
  const {id, option} = useParams();

  const {enqueueSnackbar} = useSnackbar();


  const [state, setState] = useState({
    success: false,
    submitDialog: false,
    loadingButton: false,
    locked: false
  })

  const [errors, setErrors] = useState(
    {}
  )


  const [form, setForm] = useState({
    ...defaultAddEditNeedFields,
  })

  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {characteristics: {}, needSatisfiers: {}};
    Promise.all([
      // fetchAllCodes todo
      fetchCharacteristics().then(characteristics => {
        characteristics.data.map((characteristic)=>{options.characteristics[characteristic.id] = characteristic.name});
      }),
      fetchNeedSatisfiers().then(res => {
        res.needSatisfiers.map(needSatisfier => options.needSatisfiers[needSatisfier._id] = needSatisfier.type)
      })
      // fetchCharacteristicsOptionsFromClass().then(optionsFromClass => newTypes.optionsFromClass = optionsFromClass)
    ]).then(() => {
      if (option === 'edit' && id) {
        return fetchNeed(id).then(res => {
          const need = res.need;
          setForm(need);
        })
      }
    }).then(() => {
      setOptions(options);
      setLoading(false);
    }).catch(e => {
      if (e.json)
        setErrors(e.json);
      setLoading(false);
      enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
    });
  }, [])

  const handleSubmit = () => {
    console.log(form)
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleConfirm = async () => {
    setState(state => ({...state, loadingButton: true}))
    if (option === 'add') {
      createNeed(form).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false}))
          navigate('/needs');
          enqueueSnackbar(`Success: Need is created`, {variant: 'success'});
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false,}))
        enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
      })
    } else if (option === 'edit') {
      updateNeed(id, form).then(res => {
        if (res.success) {
          setState(state => ({...state, loadingButton: false, submitDialog: false,}))
          navigate('/needs')
          enqueueSnackbar(`Successfully update Need_${id}`, {variant: 'success'})
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false,}))
        enqueueSnackbar(`Fail: ` + e.message, {variant: 'error'});
      })
    }
  }


  const validate = () => {
    const errors = {};
    for (const [label, value] of Object.entries(form)) {
      if (label === 'type' || label === 'changeType' || label === 'characteristic') {
        if (!value) {
          errors[label] = 'This field cannot be empty'
        }
      } else if (label === 'codes' && value.length === 0) {
        // errors[label] = 'This field cannot be empty'
      } else if (label === 'needSatisfiers') {
        if(!Array.isArray(value))
          errors[label] = 'Wrong format'
        if(value.length === 0){
          errors[label] = 'This field cannot be empty'
        }
      }
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOnBlur = (label) => {
    if(!form[label] || (Array.isArray(form[label]) && form[label].length === 0)){
      setErrors({...errors, [label]: 'This field cannot be empty'});
    }else{
      setErrors({...errors, [label]: null});
    }
  }

  const keyPress = e => {
    if(e.key === 'Enter')
      handleSubmit();
  }

  if (loading)
    return <Loading/>

  return (


    <Container maxWidth='md' onKeyPress={keyPress}>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Need </Typography>
        <GeneralField
          key={'type'}
          label={'Type'}
          value={form.type}
          required
          onBlur={() => handleOnBlur( 'type')}
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.type = e.target.value}
          error={!!errors.type}
          helperText={errors.type}
        />
        <GeneralField
          key={'changeType'}
          label={'Change Type'}
          value={form.changeType}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.changeType = e.target.value}
          onBlur={() => handleOnBlur( 'changeType')}
          error={!!errors.changeType}
          helperText={errors.changeType}
        />
        <GeneralField
          key={'description'}
          label={'Description'}
          value={form.description}
          required
          onBlur={() => handleOnBlur('description')}
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          error={!!errors.description}
          helperText={errors.description}
        />
        <SelectField
          key={'characteristic'}
          options={options.characteristics}
          label={'Characteristic'}
          value={form.characteristic}
          onBlur={() => handleOnBlur('characteristic')}
          onChange={e => form.characteristic = e.target.value}
          error={!!errors.characteristic}
          helperText={errors.characteristic}
        />

        <Dropdown
          key={'needSatisfiers'}
          options={options.needSatisfiers}
          label={'Need Satisfiers'}
          value={form.needSatisfiers}
          onBlur={() => handleOnBlur('needSatisfiers')}
          onChange={e => form.needSatisfiers = e.target.value}
          error={!!errors.needSatisfiers}
          helperText={errors.needSatisfiers}
        />

        <Dropdown
          key={'codes'}
          options={[]}
          label={'Codes'}
          value={form.codes}
          onChange={e => form.codes = e.target.value}
          error={!!errors.codes}
          helperText={errors.codes}
        />

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          submit
        </Button>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to create a new need?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'add'}/>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to update the need?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog && option === 'edit'}/>
      </Paper>

    </Container>

  )


}