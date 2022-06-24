/* Page for User Profile, functionalities including:
*   - Display and Edit account information
*   - Display and Edit primary/secondary email
*   - Reset password
* */

import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import {userProfileFields} from "../constants/userProfileFields";
import {fetchUser, updateUser} from "../api/userApi";
import {defaultUserFields} from "../constants/default_fields";
import {isFieldEmpty} from "../helpers";
import {
    DUPLICATE_HELPER_TEXT,
    DUPLICATE_PHONE_HELPER_TEXT,
    PASSWORD_NOT_MATCH_TEXT,
    REQUIRED_HELPER_TEXT
} from "../constants";
import {AlertDialog} from "./shared/Dialogs";
import {value} from "lodash/seq";
import {Edit} from "@mui/icons-material";
import {Link} from "./shared";
import {RepeatPasswordFields} from "../constants/updatePasswordFields";

function NavButton({to, text}) {
    return (
        <Link to={to}>
            <Button
                variant="contained"
                color="primary"
                style={{display: 'block', width: 'inherit', marginTop: '10px', marginBottom: '20px'}}>
                {text}
            </Button>
        </Link>
    );
}


export default function Profile() {
    const useStyles = makeStyles(() => ({
        root: {
            width: '80%'
        },
        button: {
            marginTop: 12,
            marginBottom: 12,
        }
    }));

    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams();
    const mode = id == null ? 'new' : 'edit';
    const [isEdit, setIsEdit] = useState(false);
    const [state, setState] = useState({
        // hardcoded value for testing purpose
        form: {
            ...defaultUserFields,
            first_name: 'Emolee',
            last_name: 'Cheng',
            primary_email: 'primaryEmail@gmail.com',
            secondary_email: 'secondaryEmail@gmail.com',
            telephone: "+1 (444) 444-4445",
            altTelephone: '+1 (623) 434-4444',
        },
        // form for restoring account info after cancelling changes
        form_backup: {
            ...defaultUserFields,
            first_name: 'Emolee',
            last_name: 'Cheng',
            primary_email: 'primaryEmail@gmail.com',
            secondary_email: 'secondaryEmail@gmail.com',
            telephone: "+1 (444) 444-4445",
            altTelephone: '+1 (623) 434-4444',
        },
        errors: {},
        dialog_submit_changes: false, // submit changes alert dialog
        dialog_cancel_changes: false  // cancel changes alert dialog
        //loading: true,
    });


    /* deleted loading state*/
    useEffect(() => {
        if (mode === 'edit') {
            fetchUser(id).then(user => {
                setState(state => ({
                    ...state,
                    form: {
                        ...state.form,
                        ...user
                    }
                }))
            })
        } else
            setState(state => ({...state}));
    }, [mode, id]);

    // Helper function for checking the validity of information in the fields. (frontend check)
    const validate = () => {
        const errors = {};
        const telephone = state.form.telephone;
        const altTelephone = state.form.altTelephone;
        const primaryEmail = state.form.primary_email;
        const secondaryEmail = state.form.secondary_email;
        for (const [field, option] of Object.entries(userProfileFields)) {
            const isEmpty = isFieldEmpty(state.form[field]);

            if (option.required && isEmpty) {
                errors[field] = REQUIRED_HELPER_TEXT;
            }
            let msg;
            if (!isEmpty && option.validator && (msg = option.validator(state.form[field]))) {
                errors[field] = msg;
            }

            if (option.label === 'AltTelephone') {
                console.log('reach correct label.')
                if (telephone === altTelephone) {
                    errors[field] = DUPLICATE_PHONE_HELPER_TEXT;
                } else {
                    console.log('different');
                }
            }

            if (option.label ==='Secondary Email') {
                if (primaryEmail === secondaryEmail) {
                    console.log("same");
                    errors[field] = DUPLICATE_HELPER_TEXT;
                } else {
                    console.log('different');
                }
            }
        }

        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }

        return true;
    };

    // Helper function for checking if the phone number and alternative
    // phone number are the same. (frontend check)
    const validate_duplicate_phone = () => {
        const errors = {};
        const telephone = state.form.telephone;
        const altTelephone = state.form.altTelephone;

        console.log(state.form.telephone);
        console.log(state.form.altTelephone);
        console.log('reach dup phone check. congrats!');
        for (const [field, option] of Object.entries(userProfileFields)) {
            if (option.label === 'AltTelephone') {
                console.log('reach correct label.')
                if (telephone === altTelephone) {
                    console.log("same");
                    errors[field] = DUPLICATE_PHONE_HELPER_TEXT;
                } else {
                    console.log('different');
                }
            }
        }

        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }

        return true;
    }

    // Helper function for checking if the primary and secondary
    // emails are the same. (frontend check)
    const validate_duplicate = () => {
        const errors = {};
        const primaryEmail = state.form.primary_email;
        const secondaryEmail = state.form.secondary_email;

        console.log(state.form.primary_email);
        console.log(state.form.secondary_email);
        console.log('reach here. congrats!');
        for (const [field, option] of Object.entries(userProfileFields)) {
            if (option.label ==='Secondary Email') {
                if (primaryEmail === secondaryEmail) {
                    console.log("same");
                    errors[field] = DUPLICATE_HELPER_TEXT;
                } else {
                    console.log('different');
                }
            }
        }

        if (Object.keys(errors).length !== 0) {
            setState(state => ({...state, errors}));
            return false
        }

        return true;
    }

    // Profile information submit button handler
    const handleSubmit = () => {
        console.log(state.form)
        if (validate()) {
            setState(state => ({...state, dialog_submit_changes: true}))
        }
    }

    // submit change button handler
    const handleSubmitEdit = () => {
        console.log(state.form)
        if (validate() && validate_duplicate_phone() && validate_duplicate()) {
            setState(state => ({...state, dialog_submit_changes: true}))
        }
    }

    // cancel change button handler
    const handleCancelEdit = () => {
        console.log(state.form)
        setState(state => ({...state, dialog_cancel_changes: true}))
    }

    // Edit button handler
    const handleEdit = () => {
        alert('You are about to edit the profile!');
        setIsEdit(true);
    }

    // Submit Alert prompt button handlers
    const handleCancelSubmitAlert = () => {
        setState(state => ({...state, dialog_submit_changes: false}))
        console.log("cancel")
    }

    const handleConfirmSubmitAlert = async () => {
        console.log('valid')
        try {
            await updateUser(id, state.form);
            history.push('/users/' + id);
            setIsEdit(false)
        } catch (e) {
            if (e.json) {
                setState(state => ({...state, errors: e.json}));
            }
        }
    };

    // Cancel Alert prompt button handlers
    const handleCancelCancelAlert = () => {
        setState(state => ({...state, dialog_cancel_changes: false}))
        console.log("cancel")
    }

    const handleConfirmCancelAlert = async () => {
        console.log('valid')
        setIsEdit(false);
        setState(state => ({...state, form: state.form_backup}))
        setState(state => ({...state, dialog_cancel_changes: false}))
    };

    // OnBlur handler, called when user's focus moves from a field.
    const handleOnBlur = (e, field, option) => {
        if (!isFieldEmpty(state.form[field])
            && option.validator && !!option.validator(state.form[field]))
            // state.errors.field = option.validator(e.target.value)
            setState(state => ({...state,
                errors: {...state.errors, [field]: option.validator(state.form[field])}}))
        //console.log(state.errors)
        else
            setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    };


    return (
        <Container className={classes.root}>
            <Typography variant="h4">
                {'User Profile'}
            </Typography>

            {isEdit ? (
                <div>
                    {/* Fields for account information */}
                    {Object.entries(userProfileFields).map(([field, option]) => {
                        if (option.type === 'email') {
                            return (
                                <option.component
                                    key={field}
                                    label={option.label}
                                    type={option.type}
                                    options={option.options}
                                    value={state.form[field]}
                                    required={option.required}
                                    //onChange={value => state.form[field] = value}
                                    onChange={e => state.form[field] = e.target.value}
                                    onBlur={e => handleOnBlur(e, field, option)}
                                    error={!!state.errors[field]}
                                    helperText={state.errors[field]}
                                />)
                        } else {
                            return (
                                <option.component
                                    key={field}
                                    label={option.label}
                                    type={option.type}
                                    options={option.options}
                                    value={state.form[field]}
                                    required={option.required}
                                    onChange={value => state.form[field] = value}
                                    //onChange={e => state.form[field] = e.target.value}
                                    onBlur={e => handleOnBlur(e, field, option)}
                                    error={!!state.errors[field]}
                                    helperText={state.errors[field]}
                                />)
                        }
                            })}

                    {/* Button for cancelling account info changes */}
                    <Button variant="contained" color="primary" className={classes.button}
                            onClick={handleCancelEdit}>
                        Cancel Changes
                    </Button>

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    {/* Button for submitting account info changes */}
                    <Button variant="contained" color="primary" className={classes.button}
                            onClick={handleSubmitEdit}>
                        Submit Changes
                    </Button>


                    {/* Alert prompt for submitting changes */}
                    <AlertDialog
                        dialogContentText={"Note that you won't be able to edit the information after clicking CONFIRM."}
                        dialogTitle={'Are you sure to submit?'}
                        buttons={[<Button onClick={handleCancelSubmitAlert} key={'cancel'}>{'cancel'}</Button>,
                            <Button onClick={handleConfirmSubmitAlert} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                        // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                        open={state.dialog_submit_changes}/>

                    {/* Alert prompt for cancelling changes */}
                    <AlertDialog
                        dialogContentText={"Note that all changes will be discarded after clicking CONFIRM."}
                        dialogTitle={'Are you sure to cancel all the changes?'}
                        buttons={[<Button onClick={handleCancelCancelAlert} key={'cancel'}>{'cancel'}</Button>,
                            <Button onClick={handleConfirmCancelAlert} key={'confirm'} autoFocus> {'confirm'}</Button>]}
                        // buttons={{'cancel': handleCancel, 'confirm': handleConfirm}}
                        open={state.dialog_cancel_changes}/>
                </div>
            ) : (
                <div>
                    <Box sx={{
                        backgroundColor: 'transparent',
                        width: 'max-content',
                        paddingTop: 3,
                        borderBlockColor: 'grey',
                        borderRadius: 2
                    }}>
                    {Object.entries(userProfileFields).map(([field, option]) => {
                            return (
                                <div>
                                    <Typography
                                        style={{padding: 10, fontSize: 'large'}}>
                                        {option.label} : {state.form[field]}
                                    </Typography>
                                </div>
                            )})}
                    </Box>
                    <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                        Edit Profile
                    </Button>

                    <Box sx={{
                        backgroundColor: 'transparent',
                        width: 'max-content',
                        paddingTop: 3,
                        borderBlockColor: 'grey',
                        borderRadius: 2
                    }}>
                        <Typography variant="h6"
                                    style={{marginTop: '10px'}}>
                            {'Want to change your password? Click below:'}
                        </Typography>

                        {/* Button for password reset */}
                        <NavButton to={'/users/reset-password'}
                                   text={'Reset Password'}/>
                    </Box>
                </div>
            )}

        </Container>
    )
}