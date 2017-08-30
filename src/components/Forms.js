import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Glyphicon, ListGroup, ListGroupItem} from "react-bootstrap";

class Forms extends Component {


  prepareForms = () => {
    if (!this.props.loaded) {
      return [<ListGroupItem key={-1}>
        <div className="loading"><Glyphicon glyph="refresh"/></div>
      </ListGroupItem>];
    }

    let listItems = [], forms = this.props.forms;

    if (forms.length === 0) {
      listItems.push(<ListGroupItem key={-1}>You don't seem to have any form. You should consider creating one..</ListGroupItem>);
    } else {
      for (let form of forms) {
        listItems.push(<ListGroupItem key={form.id}>{form.title}</ListGroupItem>);
      }
    }
    return listItems;
  };

  render() {

    return (
      <ListGroup>
        {this.prepareForms()}
      </ListGroup>
    );
  }
}

Forms.propTypes = {
  forms : PropTypes.array.isRequired,
  loaded : PropTypes.bool.isRequired
};

export default Forms;
