import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Glyphicon, ListGroup, ListGroupItem} from "react-bootstrap";

const jf = window.JF;

class Forms extends Component {

  prepareForms = () => {
    if (!this.state.formsAreLoaded) {
      return [<ListGroupItem key={-1}>
        <div className="loading"><Glyphicon glyph="refresh"/></div>
      </ListGroupItem>];
    }

    let listItems = [], forms = this.state.forms;

    if (forms.length === 0) {
      listItems.push(<ListGroupItem key={-1}>You don't seem to have any form. You should consider creating one..</ListGroupItem>);
    } else {
      for (let form of forms) {
        listItems.push(<ListGroupItem key={form.id} onClick={this.props.selectForm.bind(this, form)}>{form.title}</ListGroupItem>);
      }
    }
    return listItems;
  };

  getUserForms = () => {
    jf.getForms({}, (jfForms) => {
      this.setState({
        forms : jfForms,
        formsAreLoaded : true
      });
    }, (error) => {
      alert('An error occured while getting forms. Please check console if you\'d like..');
      console.error(error);
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      formsAreLoaded : false
    }
  }

  componentDidMount() {
    this.getUserForms();
  }

  render() {

    return (
      <ListGroup>
        {this.prepareForms()}
      </ListGroup>
    );
  }
}

Forms.propTypes = {
  selectForm : PropTypes.func.isRequired
};

export default Forms;
