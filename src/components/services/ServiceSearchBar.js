import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';
import { searchServices, fetchServices, createService, updateService, deleteService } from '../../store/actions/serviceActions.js'
import { connect } from 'react-redux';


class ServiceSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleInput=this.handleInput.bind(this);
    this.handleTypeChange=this.handleTypeChange.bind(this);
    this.state = {
      searchText: '',
      searchType: 'name'
    }
  }
  
  handleInput(event) {
    const value = event.target.value;
    this.setState({ searchText: value});
    this.props.dispatch(searchServices(value, this.state.searchType));
  }

  handleTypeChange(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({searchType: value});
    this.props.dispatch(searchServices(this.state.searchText, value));
  }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="searchBar">
          <FormControl 
            type='text' 
            placeholder="Search..." 
            value={this.state.value}
            onChange={this.handleInput}
          />
        </FormGroup> {' '}
        <FormGroup controlId="searchBy">
          <ControlLabel> Search by: </ControlLabel>{' '}
          <FormControl componentClass="select" placeholder="select" onChange={this.handleTypeChange}>
            <option value="name"> Name </option>
            <option value="email"> Email </option>
          </FormControl>
        </FormGroup>{' '}
      </Form>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    services: state.services.index, //array of json 
    servicesLoaded: state.services.servicesLoaded
  }
}

export default connect(
  mapStateToProps
)(ServiceSearchBar);