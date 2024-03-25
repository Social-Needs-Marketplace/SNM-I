import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "../programProvision/ProgramAndOccurrenceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {getInstancesInClass} from '../../api/dynamicFormApi';
import {fetchSingleGeneric} from '../../api/genericDataApi';
import {Box, Fade} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';

export default function ProgramOccurrenceAndStatusField({handleChange, fields, serviceOrProgramId, formType}) {
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';
  const [characteristics, setCharacteristics] = useState(null);
  const [internalTypes, setInternalTypes] = useState(null);
  const [allStatusOptions, setAllStatusOptions] = useState(null);
  const [programOccurrenceFieldId, setProgramOccurrenceFieldId] = useState(null);
  const [programOccKey, setProgramOccKey] = useState(null);
  const statusFieldKey = `characteristic_${characteristics?.['Registration Status']._id}`;
  const [selectedProgramOcc, setSelectedProgramOcc] = useState(null);
  const [statusOptions, setstatusOptions] = useState(null);

  useEffect(() => {
    fetchCharacteristics().then(characteristics => {
      const data = {};
      for (const {implementation, name, _id} of characteristics.data) {
        data[name] = {implementation, _id}
      }
      setCharacteristics(data);
    });
  }, []);

  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
    });
  }, []);

  useEffect(() => {
    getInstancesInClass(':RegistrationStatus')
      .then(options => setAllStatusOptions(options));
  }, []);

  useEffect(() => {
    setProgramOccurrenceFieldId(internalTypes?.programOccurrenceForProgramRegistration._id);
  }, [internalTypes]);

  useEffect(() => {
    setProgramOccKey(`internalType_${programOccurrenceFieldId}`);
  }, [programOccurrenceFieldId]);

  useEffect(() => {
    setSelectedProgramOcc(fields[programOccKey]);
  }, [programOccKey]);

  useEffect(() => {
    if (!selectedProgramOcc || !allStatusOptions || !characteristics) return;
    fetchSingleGeneric('programOccurrence', selectedProgramOcc.split('_')[1])
      .then(occ => {
        const occupancy = occ.data[`characteristic_${characteristics['Occupancy']._id}`];
        const capacity = occ.data[`characteristic_${characteristics['Capacity']._id}`];
        const hasCapacity = (capacity == null) || (occupancy < capacity);

        const registeredUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Registered');
        const notRegisteredUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Not Registered');
        const waitlistedUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Waitlisted');

        let options = {};
        if (mode === 'new') {
          if (hasCapacity) {
            options[registeredUri] = 'Register';
            options[notRegisteredUri] = 'Save without registering';
          } else {
            options[waitlistedUri] = 'Waitlist';
            options[notRegisteredUri] = 'Save without waitlisting';
          }
          setstatusOptions(options);
        } else {
          fetchSingleGeneric('programRegistration', id)
            .then(reg => {
              const status = allStatusOptions[reg.data[`characteristic_${characteristics['Registration Status']._id}`]];
              if (status === 'Registered') {
                options[registeredUri] = 'Remain registered';
                options[notRegisteredUri] = 'Unregister';
              } else if (status === 'Waitlisted') {
                options[waitlistedUri] = 'Stay on waitlist';
                options[notRegisteredUri] = 'Withdraw from waitlist';
              } else {
                // If updating a not-registered registration, options are the same as when creating a new registration
                if (hasCapacity) {
                  options[registeredUri] = 'Register';
                  options[notRegisteredUri] = 'Save without registering';
                } else {
                  options[waitlistedUri] = 'Waitlist';
                  options[notRegisteredUri] = 'Save without waitlisting';
                }
              }
              setstatusOptions(options);
            });
        }
      });
  }, [selectedProgramOcc, allStatusOptions, characteristics]);

  if (!characteristics || !internalTypes) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }

  return <>
    {/* Render Program & Program Occurrence & Need Satisfier */}
    <ProgramAndOccurrenceAndNeedSatisfierField
      handleChange={handleChange} fields={fields}
      programOccurrenceFieldId={programOccurrenceFieldId}
      fixedProgramId={serviceOrProgramId}
      changeProgramOcc={value => setSelectedProgramOcc(value)} disabled={mode === 'edit'}/>
    {!!selectedProgramOcc && !!statusOptions ?
      <Fade in={!!selectedProgramOcc && !!statusOptions}>
        <div>
          <SelectField key={statusFieldKey} label="Registration Status" required value={fields[statusFieldKey]}
            options={statusOptions} onChange={handleChange(statusFieldKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}