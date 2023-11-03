import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "../serviceProvision/ServiceAndOccurrenceAndNeedSatisfierField";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "../programProvision/ProgramAndOccurrenceAndNeedSatisfierField";

export default function ReferralForm() {
  const formType = 'referral';

  const [internalTypes, setInternalTypes] = useState({});
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
    });
  }, []);

  const handleRenderField = ({required, id, type, implementation, content, serviceOrProgramId}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass?.endsWith("Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForReferral._id}
                                           needOccFieldId={internalTypes.needOccurrenceForReferral._id}/>
    } else if (implementation.optionsFromClass?.endsWith("Service")) {
      const serviceFieldId = internalTypes.serviceForReferral._id;
      const serviceOccurrenceFieldId = internalTypes.serviceOccurrenceForReferral._id;

      if (!serviceFieldId || !serviceOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceFieldId={serviceFieldId}
        serviceOccurrenceFieldId={serviceOccurrenceFieldId}
        fixedService={'http://snmi#service_' + serviceOrProgramId}/>
    } else if (implementation.optionsFromClass?.endsWith("Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForReferral._id}
                                           needOccFieldId={internalTypes.needOccurrenceForReferral._id}/>
    } else if (implementation.optionsFromClass?.endsWith("Program")) {
      const programFieldId = internalTypes.programForReferral._id;
      const programOccurrenceFieldId = internalTypes.programOccurrenceForReferral._id;

      if (!programFieldId || !programOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={programFieldId}
        programOccurrenceFieldId={programOccurrenceFieldId}
        fixedProgram={'http://snmi#program_' + serviceOrProgramId}/>
    } else if (implementation.optionsFromClass?.endsWith("NeedOccurrence")) {
      return "";
    } else if (implementation.optionsFromClass?.endsWith("ServiceOccurrence")) {
      return "";
    } else if (implementation.optionsFromClass?.endsWith("ProgramOccurrence")) {
      return "";
    }
  }
  return (
    <GenericForm name={'referral'} mainPage={'/referrals'} onRenderField={handleRenderField}/>
  );
};