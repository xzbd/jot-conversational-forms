import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Col, Grid} from "react-bootstrap";
import Forms from "./Forms";
import ChatBox from "./ChatBox";
import * as _ from "lodash";

const jf = window.JF;

class Body extends Component {

  handleFormSelection = (form) => {
    if (this.state.selectedForm && (this.state.selectedForm.id === form.id)) {
      return;
    }

    jf.getFormQuestions(form.id, (jfQuestions) => {

      const questions = _(jfQuestions)
        .values()
        .sortBy(function(question) {
          // Thanks to the API which returns question orders as a string...
          return question.order / 1;
        })
        .value();

      // TODO convert all setStates to this!
      this.setState((prevState, props) => ({
        questions : questions,
        selectedForm : form
      }));

    });

  };

  // TODO this may move into Forms
  getUserForms = () => {
    jf.getForms((forms) => {
      this.setState({
        forms : forms,
        formsAreLoaded : true,
      });
    });
  };

  constructor() {
    super();

    this.state = {
      forms : [],
      formsAreLoaded : false
    };

    this.getUserForms();
  }

  render() {
    return (
      <div className="Body">
        <Grid>
          <Col xs={12} md={4}>
            <Forms forms={this.state.forms} loaded={this.state.formsAreLoaded} selectForm={this.handleFormSelection}/>
          </Col>
          <Col xs={12} md={8}>
            {this.state.selectedForm ? <ChatBox form={this.state.selectedForm} questions={this.state.questions}/> :
             <div>Go ahead pick a form and lets <strong>talk</strong>..</div>}
          </Col>
        </Grid>
      </div>
    );
  }
}

Body.propTypes = {
  login : PropTypes.func.isRequired,
};

export default Body;