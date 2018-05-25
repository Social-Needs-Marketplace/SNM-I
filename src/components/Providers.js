import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CrupdateModal from './shared/CrupdateModal.js'
import ProviderForm from './providers/ProviderForm.js'

// redux
import { connect } from 'react-redux'
import { fetchProviders, createProvider, updateProvider, deleteProvider } from '../store/actions.js'

// styles
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';


class Providers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const p = this.props, s = this.state;
    return(
      <div className='providers content'>
        <h3 className='title'>Providers</h3>
          <div>
          <Link to={`/providers/new`}>
            <Button bsStyle="default">
            Add new provider
            </Button>
          </Link>
          </div>

        { p.providersLoaded &&
          <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider }
                      delete={this.deleteProvider} />
            })
          }</ProvidersIndex>
        }
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  updateProvider = (params) => {
    const id = params.id;
    delete params.id;
    this.props.dispatch(updateProvider(id, params));
  }

  deleteProvider = (id) => {
    this.props.dispatch(deleteProvider(id));
    }
  }

const mapStateToProps = (state) => {
  return {
    providers: state.providers.index,
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Providers);