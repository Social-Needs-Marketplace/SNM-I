import React, {useEffect, useState, useContext} from 'react';
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Container, Typography} from "@mui/material";
import {userProfileFields} from "../../constants/userProfileFields";
import {getProfile, updatePrimaryEmail, updateProfile} from "../../api/userApi";
import {isFieldEmpty} from "../../helpers";
import {
  DUPLICATE_HELPER_TEXT,
  REQUIRED_HELPER_TEXT
} from "../../constants";
import {AlertDialog} from "../shared/Dialogs";
import {Loading} from "../shared";
import LoadingButton from "../shared/LoadingButton";
import {UserContext} from "../../context";


const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
    marginRight: 12,
  }
}));

/**
 * This page allows user edit their profile information.
 * @returns {JSX.Element}
 * @constructor
 */
export default function EditProfile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({...userProfileFields});
  const [errors, setErrors] = useState({});
  const [dialogSubmit, setDialogSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dialogEmail, setDialogEmail] = useState(false);
  const [dialogQuitEdit, setDialogQuitEdit] = useState(false);
  const [dialogExistEmail, setDialogExistEmail] = useState(false);

  const profileForm = {
    givenName: userContext.givenName,
    familyName: userContext.familyName,
    telephone: userContext.countryCode && (userContext.countryCode.toString() +
      userContext.areaCode.toString() + userContext.phoneNumber.toString()),
    email: userContext.email,
    altEmail: userContext.altEmail,
  }

  useEffect(() => {
    getProfile(id).then(user => {
      setForm(profileForm);
      setLoading(false);
    });
  }, [id]);

  /**
   * This is frontend validation for any new input information.
   * @returns {boolean}
   */
  const validate = () => {
    const newErrors = {};
    for (const [field, option] of Object.entries(userProfileFields)) {
      const isEmpty = isFieldEmpty(form[field]);

      if (option.required && isEmpty) {
        newErrors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && option.validator && (msg = option.validator(form[field]))) {
        newErrors[field] = msg;
      }

      if (option.label === 'Secondary Email') {
        if (form.email === form.altEmail) {
          newErrors[field] = DUPLICATE_HELPER_TEXT;
        }
      }

    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return false
    }
    return true;
  };

  // cancel change button handler
  const handleDialogCancel = () => {
    setDialogQuitEdit(false);
    navigate('/profile/' + id);
  }

  // email-sent dialog confirm button handler
  const handleDialogEmail = () => {
    setDialogEmail(false);
    setDialogSubmit(true);
  }

  // submit button handler
  const handleSubmitChanges = async () => {
    if (validate()) {
      if (form.email !== userContext.email) {
        console.log('reach before send verification')
        const {sentEmailConfirm} = await updatePrimaryEmail(id, form.email);
        console.log(sentEmailConfirm)
        if (sentEmailConfirm) {
          setDialogEmail(true);
          console.log('email verification link sent');
        } else {
          setDialogExistEmail(true);
          console.log('email verification is not sent.');
        }
      } else {
        setDialogSubmit(true);
      }
    }
  }

  // confirmation dialog confirm button handler
  const handleDialogConfirm = async () => {
    try {
      let phoneUnchanged;
      if (!userContext.phoneNumber) {
        phoneUnchanged = null;
      } else {
        phoneUnchanged = userContext.countryCode.toString() +
          userContext.areaCode.toString() + userContext.phoneNumber.toString()
      }
      const updateForm = {
        givenName: form.givenName,
        familyName: form.familyName,
        countryCode: null,
        areaCode: null,
        phoneNumber: null,
        altEmail: form.altEmail,
      }
      if (form.telephone === phoneUnchanged) {
        updateForm.countryCode = parseInt(form.telephone.slice(0, 1));
        console.log(updateForm.countryCode)
        updateForm.areaCode = parseInt(form.telephone.slice(1, 4));
        updateForm.phoneNumber = parseInt(form.telephone.slice(4, 11));
      } else {
        const phone = form.telephone.split(' ');
        updateForm.countryCode = parseInt(phone[0]);
        updateForm.areaCode = parseInt(phone[1].slice(1, 4));
        updateForm.phoneNumber = parseInt(phone[2].slice(0, 3) + phone[2].slice(4, 8));
      }

      setLoadingButton(true);
      const {success} = await updateProfile(id, updateForm);
      if (success) {
        for (const [key, value] of Object.entries(updateForm)) {
          userContext[key] = value;
        }
        userContext.updateUser({
          altEmail: userContext.altEmail,
          givenName: userContext.givenName,
          familyName: userContext.familyName,
          countryCode: userContext.countryCode,
          areaCode: userContext.areaCode,
          phoneNumber: userContext.phoneNumber,
        });
      }
      setLoadingButton(false);
      setDialogSubmit(false);
      navigate('/profile/' + id + '/');
    } catch (e) {
      setLoadingButton(false);
      console.log('catch e');
      console.log(e);
    }
  };


  /**
   * handler of onBlur.
   * @param e
   * @param field
   * @param option
   */
  const handleOnBlur = (e, field, option) => {
    if (!isFieldEmpty(form[field]) && option.validator && !!option.validator(form[field])) {
      setErrors({...errors, [field]: option.validator(form[field])});
    } else {
      setErrors({...errors, [field]: undefined});
    }
  };

  if (loading)
    return <Loading message={`Loading...`}/>;


  return (
    <Container className={classes.root}>
      <Typography variant="h4">
        {'User Profile'}
      </Typography>

      <div>
        {/* Fields for account information */}
        {Object.entries(userProfileFields).map(([field, option]) => {
          return (
            <option.component
              key={field}
              label={option.label}
              type={option.type}
              options={option.options}
              value={form[field]}
              required={option.required}
              onChange={value => form[field] = value.target.value}
              onBlur={e => handleOnBlur(e, field, option)}
              error={!!errors[field]}
              helperText={errors[field]}
            />)
        })}

        {/* Button for cancelling account info changes */}
        <Button variant="contained" color="primary" className={classes.button}
                onClick={() => setDialogQuitEdit(true)} key={'Cancel Changes'}>
          Cancel Changes
        </Button>

        {/* Button for submitting account info changes */}
        <Button variant="contained" color="primary" className={classes.button}
                onClick={handleSubmitChanges} key={'Submit Changes'}>
          Submit Changes
        </Button>


        {/* Alert prompt for submitting changes */}
        <AlertDialog
          dialogContentText={"Note that if you want to change your primary email, you will receive a " +
            "confirmation link in your input email. Changes of primary email will only be made" +
            " after you click the confirm link in the email."}
          dialogTitle={'Are you sure you want to submit?'}
          buttons={[
            <Button onClick={() => setDialogSubmit(false)} key={'cancel'}>{'cancel'}</Button>,
            //<Button onClick={handleDialogConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
            <LoadingButton noDefaultStyle variant="text" color="primary" loading={loadingButton} key={'confirm'}
                           onClick={handleDialogConfirm} children='confirm' autoFocus/>]}
          open={dialogSubmit}/>

        {/* Alert prompt after email was sent */}
        <AlertDialog
          dialogContentText={"A confirmation link has been sent to the new primary email address."}
          dialogTitle={'Congratulations!'}
          buttons={<Button onClick={handleDialogEmail} key={'confirm'} autoFocus> {'confirm'}</Button>}
          open={dialogEmail}/>

        <AlertDialog
          dialogContentText={"All the changes you made will not be saved."}
          dialogTitle={'Notice!'}
          buttons={<Button onClick={handleDialogCancel} key={'confirm'} autoFocus> {'confirm'}</Button>}
          open={dialogQuitEdit}/>

        <AlertDialog
          dialogContentText={"Your input new primary email already registered as the primary email for another account."}
          dialogTitle={'Notice!'}
          buttons={<Button onClick={() => setDialogExistEmail(false)}
                           key={'Got it'} autoFocus> {'Got it'}</Button>}
          open={dialogExistEmail}/>

      </div>


    </Container>
  )
}