import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Col, Grid} from "react-bootstrap";
import Forms from "./Forms";
import ChatBox from "./ChatBox";
import lodash from "lodash";

const jf = window.JF;

class Body extends Component {

  handleFormSelection = (form) => {
    if (this.state.selectedForm && (this.state.selectedForm.id === form.id)) {
      console.log('nothing to do');
      return;
    }

    jf.getFormQuestions(form.id, (jfQuestions) => {

      const questions = lodash(jfQuestions)
        .values()
        .sortBy(function(question) {
          // Thanks to the API which returns question orders as a string...
          return question.order / 1;
        })
        .value();

      this.setState({
        questions : questions,
        selectedForm : form
      });

    }, (error) => {
      alert('An error occured while getting questions. Please check console if you\'d like..');
      console.error(error);
    });

  };

  constructor(props) {
    super(props);

    this.state = {
      selectedForm : null
    }
  }

  render() {
    return (
      <div className="Body">
        <Grid>
          <Col xs={12} md={4}>
            <Forms selectForm={this.handleFormSelection}/>
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
  login : PropTypes.func.isRequired
};

export default Body;