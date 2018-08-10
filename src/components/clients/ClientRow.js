import React, { Component } from 'react';
import { formatLocation } from '../../helpers/location_helpers'
import { formatPhoneNumber } from '../../helpers/phone_number_helpers'
import DropdownMenu from '../shared/DropdownMenu'


class ClientRow extends Component {
  render() {
    const client = this.props.client;

    return (
      <tr>
        <td>{client.first_name}</td>
        <td>{client.last_name}</td>
        <td>
          {client.primary_phone_number ? formatPhoneNumber(client.primary_phone_number) : "None provided"}
        </td>
        <td>{client.email}</td>
        <td>
          {client.address ? formatLocation(client.address) : "None provided"}
        </td>
        <td>
          <DropdownMenu
            urlPrefix="clients"
            objectId={client.id}
            handleShow={this.props.handleShow}
          />
        </td>
      </tr>
    )
  }
}

export default ClientRow;
