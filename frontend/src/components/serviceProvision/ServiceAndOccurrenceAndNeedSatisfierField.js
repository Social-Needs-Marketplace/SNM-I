import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByServiceOcc,
  getServiceOccurrencesByService
} from "../../api/serviceProvision";

export function ServiceAndOccurrenceAndNeedSatisfierField({
                                            fields,
                                            serviceFieldId,
                                            serviceOccurrenceFieldId,
                                            needSatisfierFieldId,
                                            handleChange,
                                            fixedService // full URI of the service which all shown occurrences must be of, if given
                                          }) {
  const serviceKey = serviceFieldId ? `internalType_${serviceFieldId}` : null;
  const serviceOccKey = `internalType_${serviceOccurrenceFieldId}`;
  const needSatisfierKey = needSatisfierFieldId ? `internalType_${needSatisfierFieldId}` : null;

  const [selectedService, setSelectedService] = useState(fixedService ? fixedService : fields[serviceKey]);
  const [selectedServiceOcc, setSelectedServiceOcc] = useState(fields[serviceOccKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleChangeService = key => (e) => {
    const value = e.target.value;
    setSelectedService(value);
    // handleChange(key)(e);
  }

  const handleChangeServiceOcc = key => (e) => {
    const value = e.target.value;
    setSelectedServiceOcc(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Service")
      .then(options => setDynamicOptions(prev => ({...prev, ":Service": options})));
  }, []);

  useEffect(() => {
    if (selectedService) {
      getServiceOccurrencesByService(selectedService).then(options => {
        setDynamicOptions(prev => ({...prev, ":ServiceOccurrence": options}));
      });
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedServiceOcc) {
      getNeedSatisfiersByServiceOcc(selectedServiceOcc).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedServiceOcc]);

  const showService = !!serviceKey;
  const showServiceOcc = !!selectedService || (!serviceKey && !!serviceOccKey);
  const showNeedSatisfier = showServiceOcc && !!selectedServiceOcc && !!needSatisfierKey;

  return <>
    {showService ?
      <SelectField key={serviceKey} label="Service" required value={fields[serviceKey]}
                   options={dynamicOptions[":Service"] || {}} onChange={handleChangeService(serviceKey)}/>
      : null
    }
    {showServiceOcc ?
      <Fade in={showServiceOcc}>
        <div>
          <SelectField key={serviceOccKey} label="Service Occurrence" required value={fields[serviceOccKey]}
                       options={dynamicOptions[":ServiceOccurrence"] || {}}
                       onChange={handleChangeServiceOcc(serviceOccKey)}/>
        </div>
      </Fade>
      : null
    }
    {showNeedSatisfier ?
      <Fade in={showNeedSatisfier}>
        <div>
          <SelectField key={needSatisfierKey} label="Service Need Satisfier" required value={fields[needSatisfierKey]}
                       options={dynamicOptions[":NeedSatisfier"] || {}}
                       onChange={handleChange(needSatisfierKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}