import React, { Component } from 'react'
import _ from 'lodash'

// styles
import { Button, Row, Form, FormGroup, Col, ControlLabel, FormControl} from 'react-bootstrap'
import { connect } from 'react-redux'
import { updateProvider, fetchProvider } from '../../store/actions/providerActions.js'
import { Link } from 'react-router-dom';


class EditProvider extends Component {
  constructor(props) {
    super(props);

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];

    this.state= {
      form : {
        provider_type: provider.provider_type,
        id: id,
        company: provider.company,
        first_name: provider.first_name,
        last_name: provider.last_name,
        gender: provider.gender.toString(),
        email: provider.email,
        primary_phone_number: provider.primary_phone_number,
        primary_phone_extension: provider.primary_phone_extension,
        alt_phone_number: provider.alt_phone_number,
        alt_phone_extension: provider.alt_phone_extension,
        address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
          }, provider.address),
        phone_extension: provider.phone_extension,
        referrer: provider.referrer,
        location: 'Canada',
        visibility: provider.visibility.toString(),
        status: provider.status
        }
      } 
    }

  componentWillMount() {
    const id = this.props.match.params.id
    this.props.dispatch(fetchProvider(id));
  }

  formValChange(e) {
    let next = {...this.state.form, [e.target.id] : e.target.value};
    this.setState({ form : next });
  }

  addressChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['address'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  submit(e) {
    e.preventDefault();
    const id = this.props.match.params.id
    this.props.dispatch(updateProvider(this.state.form.id, this.state.form));
    this.props.history.push('/provider/' + id);
  }

  render() {
    const id = this.props.match.params.id;
    const provider = this.props.providersById[id];
    const isEnabled = 
      this.state.form.primary_phone_number.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0 && 
      this.state.form.visibility !== 'select';

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>Edit Provider Profile</h3>
          <hr/>
        </Col>

        { provider && provider.loaded &&
        <div>
          <Form horizontal>
            {provider.provider_type === "Organization" &&
              <FormGroup controlId="company">
                <Col componentClass={ControlLabel} sm={3}>
                  Company (required)
                </Col>
                <Col sm={9}>
                  <FormControl type="text"
                    placeholder="Company name" defaultValue={provider.company} onChange={this.formValChange}/>
                </Col>
              </FormGroup>
            }

            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text"
                  placeholder="Aravind" defaultValue={provider.first_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.last_name}
                  placeholder="Adiga" onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            {provider.provider_type === "Individual" &&
            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.preferred_name} onChange={this.formValChange}/>
              </Col>
            </FormGroup>
            }

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue=""
                  placeholder="youremail@gmail.com" defaultValue={provider.email} onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="primary_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Telephone
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  defaultValue={provider.primary_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="primary_phone_extension">
              <Col componentClass={ControlLabel} sm={3}>
                Extension
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative Phone Number
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  defualtValue={provider.alt_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_extension">
              <Col componentClass={ControlLabel} sm={3}>
                Extension for Alternative Phone Number
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue="" onChange={this.formValChange}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="street_address">
              <Col componentClass={ControlLabel} sm={3}>
                Street Address
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  defaultValue={provider.address.street_address}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            {provider.provider_type === 'Individual' &&
              <FormGroup controlId="apt_number">
                <Col componentClass={ControlLabel} sm={3}>
                  Apt. #
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="text"
                    defaultValue={provider.address.apt_number}
                    onChange={this.addressChange}
                  />
                </Col>
              </FormGroup>
            }

            <FormGroup controlId="city">
              <Col componentClass={ControlLabel} sm={3}>
                City
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  defaultValue={provider.address.city}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="province">
              <Col componentClass={ControlLabel} sm={3}>
                Province
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  defaultValue={provider.address.province}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="postal_code">
              <Col componentClass={ControlLabel} sm={3}>
                Postal Code
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  defaultValue={provider.address.postal_code}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>
          
            {provider.provider_type === "Individual" &&
            <FormGroup controlId="referrer">
              <Col componentClass={ControlLabel} sm={3}>
                Referrer
              </Col>
              <Col sm={9}>
                <FormControl type="text" defaultValue={provider.referrer} onChange={this.formValChange}/>
              </Col>
            </FormGroup>
            }

            <FormGroup controlId="status">
              <Col componentClass={ControlLabel} sm={3}>
                Status
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.status}
                  onChange={this.formValChange}
                >
                  <option value="select">--- Not Set ---</option>
                  <option value="External">External</option>
                  <option value="Internal">Internal</option>
                  <option value="Home Agency">Home Agency</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="visibility">
              <Col componentClass={ControlLabel} sm={3}>
                Allow other agencies to see this provider?
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" onChange={this.formValChange}>
                  <option value="select">-- Not Set --</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button disabled={!isEnabled} type="submit" onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
        }
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded
  } 
}

export default connect(
  mapStateToProps  
)(EditProvider);