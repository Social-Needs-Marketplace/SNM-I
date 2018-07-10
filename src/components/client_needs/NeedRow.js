import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// styles
import { Button, Glyphicon } from 'react-bootstrap';


class NeedRow extends Component {
  render() {
    const need = this.props.need

    return(
      <tr>
        <td>
          {need.is_urgent && (
            <span className='need-urgent'>
              <Glyphicon glyph="exclamation-sign" />
              {' '}
            </span>)
          }
          <Link to={`/needs/${need.id}`}>
            {need.id}
          </Link>
        </td>
        <td>{need.type}</td>
        <td>{need.category}</td>
        <td>{need.description}</td>
        <td>{need.status}</td>
        <td>
          <Link to={`/needs/${need.id}/edit`}>
            <Button bsStyle="primary">
              <Glyphicon glyph="edit" />
            </Button>
          </Link>
        </td>
        <td>
          <Button bsStyle="danger" onClick={() => this.props.handleShow(need.id)}>
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
    )
  }
}

export default NeedRow;
