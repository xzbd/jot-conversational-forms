import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Col, Grid} from "react-bootstrap";
import Forms from "./Forms";
import ChatBox from "./ChatBox";
import lodash from "lodash";

const jf = window.JF;

class Body extends Component {

  prepareQuestion = (questionKey, questionText, question) => {
    return Object.assign({
      questionKey : questionKey,
      questionText : questionText
    }, question);
  };

  prepareQuestions = (questions) => {
    let preparedQuestions = [];
    for (const question of questions) {
      let jbQuestion;
      switch (question.type) {
        case 'control_matrix':
          //There will be multiple questions..
          let rows = question.mrows.split('|');
          for (const [index, row] of rows.entries()) {
            const questionKey = question.qid + "_" + index;
            const questionText = question.text + ", being " + row;
            jbQuestion = this.prepareQuestion(questionKey, questionText, question);
            preparedQuestions.push(jbQuestion);
          }
          break;
        default:
          jbQuestion = this.prepareQuestion(question.qid, question.text, question);
          preparedQuestions.push(jbQuestion);
          break;
      }
    }

    console.log(preparedQuestions);
    return preparedQuestions;
  };

  handleFormSelection = (form) => {
    if (this.state.selectedForm && (this.state.selectedForm.id === form.id)) {
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
        questions : this.prepareQuestions(questions),
        selectedForm : form
      })
      ;

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
            {this.state.selectedForm ? <ChatBox form={this.state.selectedForm} formOwnerName={this.props.user.name} questions={this.state.questions}/> :
             <div>Go ahead pick a form and lets <strong>talk</strong>..</div>}
          </Col>
        </Grid>
      </div>
    );
  }
}

Body.propTypes = {
  login : PropTypes.func.isRequired,
  user : PropTypes.any.isRequired
};

export default Body;