import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';

import FieldGroup from '../shared/FieldGroup';

import { Box, Container, Typography } from '@mui/material';
import { FormStepper, Loading } from "../shared";
import { getDynamicForm, getDynamicFormsByFormType, getInstancesInClass } from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";
import { createSingleGeneric, fetchSingleGeneric, updateSingleGeneric } from "../../api/genericDataApi";
import { createSingleProvider, fetchSingleProvider, updateSingleProvider } from "../../api/providersApi";

const contentStyle = {
  width: '80%',
  margin: 'auto',
  paddingBottom: '10px'
};

export default function GenericForm({name, mainPage, isProvider}) {
  const navigate = useNavigate();
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';

  const [form, setForm] = useState({});
  const [allForms, setAllForms] = useState({});

  const [selectedFormId, setSelectedFormId] = useState('');
  const [dynamicForm, setDynamicForm] = useState({formStructure: []});
  const [dynamicOptions, setDynamicOptions] = useState({});

  const [loading, setLoading] = useState(true);

  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getDynamicFormsByFormType(name).then(({forms}) => {
      const allForms = {};
      forms.forEach(form => allForms[form._id] = form);
      setAllForms(forms);

      if (forms.length > 0) {
        // Preselect the first form
        const firstForm = forms[0];
        setForm({formId: firstForm._id, fields: {}});
        setSelectedFormId(firstForm._id);
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  const formOptions = useMemo(() => {
    const options = {};
    Object.values(allForms).forEach(form => options[form._id] = form.name);
    return options;
  }, [allForms]);


  useEffect(() => {
    // Invoked only after selectedFormId is set
    if (selectedFormId) {

      (async function () {
        setLoading(true);

        // Get the form and dynamic options used in the form
        const {form} = await getDynamicForm(selectedFormId);
        setDynamicForm(form);
        for (const step of form.formStructure) {
          for (const field of step.fields) {
            const className = field?.implementation?.optionsFromClass;
            if (className) {
              await getInstancesInClass(className)
                .then(options => setDynamicOptions(prev => ({...prev, [className]: options})));
            }
          }
        }

        // Get data
        if (id) {
          const {data} = await (isProvider ? fetchSingleProvider : fetchSingleGeneric)(name, id);
          setForm(form => ({...form, fields: data}));
        }

        setLoading(false);
      })();
    }

  }, [selectedFormId]);

  const stepNames = useMemo(() => {
    return dynamicForm.formStructure.map(s => s.stepName);
  }, [dynamicForm]);

  const handleFinish = async () => {
    // TODO: pretty error message

    console.log(form);
    if (mode === 'new') {
      try {
        await (isProvider ? createSingleProvider : createSingleGeneric)(name, form).then(() => navigate(mainPage));
        enqueueSnackbar(name + ' created', {variant: 'success'});
      } catch (e) {
        console.log(e);
        enqueueSnackbar(`Failed to create ${name}: ` + e.message, {variant: 'error'});
      }

    } else {
      try {
        await (isProvider ? updateSingleProvider : updateSingleGeneric)(name, id, form).then(() => navigate(mainPage));
        enqueueSnackbar(`${name} updated`, {variant: 'success'});
      } catch (e) {
        enqueueSnackbar(`Failed to update ${name}: ` + e.message, {variant: 'error'});
      }
    }

  };

  const handleChange = typeAndId => (e) => {
    form.fields[typeAndId] = e?.target?.value || e;
    // console.log(e?.target?.value || e);
  };

  const getStepContent = stepIdx => {
    const step = dynamicForm.formStructure[stepIdx].fields;
    return <Box sx={contentStyle}>
      {step.map(({required, id, type, implementation, content, _id}, index) => {

        if (type === 'question') {
          return <GeneralField key={index} label={content} value={form.fields[`${type}_${id}`]}
                               onChange={handleChange(`${type}_${id}`)}/>;
        } else if (type === 'characteristic' || type === 'internalType') {
          const fieldType = implementation.fieldType.type;
          const {label, optionsFromClass} = implementation;

          let fieldOptions;
          if (optionsFromClass) {
            fieldOptions = dynamicOptions[optionsFromClass] || {};
          } else if (implementation.options) {
            fieldOptions = {};
            implementation.options.forEach(option => fieldOptions[option.iri] = option.label);
          }

          return <FieldGroup component={fieldType} key={id? `${type}_${id}`: `${type}_${_id}`} label={label} required={required}
                             options={fieldOptions}
                             value={form.fields[id? `${type}_${id}`:`${type}_${_id}`]} onChange={handleChange(id? `${type}_${id}`:`${type}_${_id}`)}/>;
        }
      })}
    </Box>;
  };

  if (loading)
    return <Loading message={`Loading...`}/>;

  if (Object.keys(form).length === 0)
    return <Container><Typography variant="h5">No form available</Typography></Container>

  return (
    <Container>
      <SelectField
        label="Select a form"
        value={selectedFormId}
        onChange={e => {
          setForm({formId: e.target.value, fields: {}});
          setSelectedFormId(e.target.value);
        }}
        options={formOptions}
        sx={{mb: 2}}
        noEmpty
      />
      <FormStepper
        getStepContent={getStepContent}
        handleFinish={handleFinish}
        stepNames={stepNames}
      />
    </Container>
  );
}
