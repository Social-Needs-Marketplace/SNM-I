import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Loading} from "../shared";
import {Box, Button, Container, Paper, Typography, Divider} from "@mui/material";
import GeneralField from "../shared/fields/GeneralField";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {createQuestion, fetchQuestion, updateQuestion} from "../../api/questionApi";

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


export default function AddEditQuestion() {

  const classes = useStyles();
  const navigate = useNavigate();
  const {id, option} = useParams();

  const [state, setState] = useState({
    success: false,
    submitDialog: false,
    loadingButton: false,
    successDialog: false,
    failDialog: false,
    locked: false
  })
  const [errors, setErrors] = useState(
    {}
  )

  const [form, setForm] = useState({
    description: '',
    content: ''
  })
  const [loading, setLoading] = useState(option === 'edit');

  useEffect(() => {
    if(option === 'edit' && id){
      fetchQuestion(id).then(res => {
        if(res.success){
          setForm({content: res.question.content, description: res.question.description})
          setLoading(false)
          setState(state => ({...state, locked: res.locked}))
        }
      }).catch(e => {
        if(e.json)
          setErrors(e.json)
        setLoading(false)
        setState(state => ({...state, failDialog: true}))
      })
    }
  },[])

  const handleSubmit = () => {
    if(validate()){
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleConfirm = () => {
    setState(state => ({...state, loadingButton: true}))
    if(option === 'add'){
      createQuestion(form).then(() => {
        setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
      }).catch(e => {
        if(e.json){
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    }else if(option === 'edit'){
      updateQuestion(id, form).then(() => {
        setState(state => ({...state, loadingButton: false, submitDialog: false, successDialog: true}))
      }).catch(e => {
        if(e.json){
          setErrors(e.json)
        }
        setState(state => ({...state, loadingButton: false, submitDialog: false, failDialog: true}))
      })
    }

  }

  const validate = () => {
    const error = {}
    if(form.content === ''){
      error.content = 'The field cannot be empty'
    }
    if(form.description === ''){
      error.description = 'The field cannot be empty'
    }
    setErrors(error)
    return Object.keys(error).length === 0
  }

  if (loading)
    return <Loading/>

  return (
    <Container maxWidth='md'>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Question </Typography>
        <GeneralField
          key={'content'}
          label={'Content'}
          value={form.content}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.content = e.target.value}
          error={!!errors.content}
          helperText={errors.content}
          disabled={state.locked}
        />
        <GeneralField
          key={'description'}
          label={'Description'}
          value={form.description}
          required
          multiline
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          error={!!errors.description}
          helperText={errors.description}
          disabled={state.locked}
        />
        {state.locked? <Button variant="contained" color="primary" className={classes.button} onClick={()=>{navigate('/questions')}}>
            back
          </Button>:
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          Submit
        </Button>}

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={option === 'add'?'Are you sure you want to create a new question?':
        'Are you sure you want to update the question?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog}/>
        <AlertDialog dialogContentText={option === 'add'? "You have successfully created a new question":
          'You have successfully update the question'}
                     dialogTitle={'Success'}
                     buttons={[<Button onClick={() => {
                       navigate('/questions')
                     }} key={'success'}> {'ok'}</Button>]}
                     open={state.successDialog}/>
        <AlertDialog dialogContentText={errors.message || "Error occurs"}
                     dialogTitle={'Fail'}
                     buttons={[<Button onClick={() => {
                       navigate('/questions')
                     }} key={'fail'}>{'ok'}</Button>]}
                     open={state.failDialog}/>
      </Paper>
    </Container>)

}