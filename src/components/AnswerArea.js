import React, {Component} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import ButtonSelect from './external/ButtonSelect'
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import lodash from "lodash";

const initialState = {
  selectionsRaw : {}, // For selectable answers like control_dropdown, control_scale etc..
  jfAnswer : [], // For submission (can also be a string)
  displayableAnswer : '', // For Message to show on conversation,
  validationError : false, // For possible validation errors (can also be a string)
};

class AnswerArea extends Component {

  tryAnswer = () => {
    const answertext = this.state.displayableAnswer;
    const questionKey = this.props.currentQuestion.questionKey;

    const answerObject = {
      answerText : answertext,
      questionKey : questionKey,
      jfAnswer : this.state.jfAnswer
    };

    const validationResult = this.props.validate(answerObject);
    if (typeof(validationResult) === 'string') {
      // Answer can't be accepted; we should notify answerer..
      this.setState({
        validationError : validationResult
      })

    } else {
      // Answer is acceptable..

      this.props.answerQuestion(answerObject);
      this.setState(initialState);
      this.setState({
        selectionsRaw : update(this.state.selectionsRaw, {$set : {}}) // for resetting older selections TODO fix better!
      });

    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.tryAnswer();
    }
  };

  handleChange = (value) => {
    this.setState({
      jfAnswer : value,
      displayableAnswer : value,
      validationError : false,
    });
  };

  handleSelectionChange = (values) => {
    console.log('selectionsRaw');
    console.log(values);
    var answerArr = [];
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        answerArr.push(key)
      }
    }

    this.setState({
      jfAnswer : answerArr,
      displayableAnswer : answerArr.join(', '),
      selectionsRaw : values
    });
  };

  extractOptionsFromString = (question, optionsString, delimiter = '|') => {
    let options = {};
    optionsString.split(delimiter).forEach((eachOption) => {
        options[eachOption] = !!question.selected && (question.selected === eachOption);
      }
    );
    return options;
  };

  prepareOptionButtons = (question) => {
    let buttonItems = [], options = {}, optionCounter = 0;

    switch (question.type) {
      case 'control_dropdown':
      case 'control_radio':
        options = this.extractOptionsFromString(question, question.options);
        break;

      case 'control_matrix':
        options = this.extractOptionsFromString(question, question.mcolumns);
        break;

      case 'control_scale':
        const scaleFrom = (question.scaleFrom / 1) || 1; // scaleFrom and scaleAmount is a STRING!
        const scaleAmount = (question.scaleAmount / 1);
        lodash.range(scaleFrom, scaleAmount, 1)
          .forEach((eachOption) => {
            options[eachOption] = false;
          });
        break;

      default:
        break;
    }
    for (let option in options) {
      buttonItems.push(<Button key={optionCounter++} value={option}>{option}</Button>);
    }
    return buttonItems;
  };

  createSelectionInput = (label, optionButtons, multipleSelection = false) => {
    return <div>
      <ControlLabel>{label}</ControlLabel>
      <br/>
      <ButtonSelect bootstrap type={multipleSelection ? 'checkbox' : 'radio'} value={this.state.selectionsRaw}
                    onChange={this.handleSelectionChange}>
        {optionButtons}
      </ButtonSelect>
    </div>;
  };

  createTextAreaInput = () => {
    return (
      <FormGroup>
        <FormControl
          type="textarea"
          value={this.state.displayableAnswer}
          onChange={(event) => {
            this.handleChange(event.target.value);
          }}
          componentClass="textarea"
          placeholder="Your answer comes here.."/>
      </FormGroup>);
  };

  decideInput = () => {
    if (!this.props.currentQuestion) {
      return null;
    }

    const currentQuestion = this.props.currentQuestion;
    const questionType = currentQuestion.type;
    let input, label, optionButtons, multipleSelection;
    switch (questionType) {

      case 'name':
        input = <input
          value={this.state.displayableAnswer}
          onChange={(event) => {
            this.handleChange(event.target.value);
          }}
          onKeyPress={this.handleKeyPress} className="message_input"
          placeholder="Your name comes here.. You may 'Enter' to finish"/>;
        break;

      case 'control_scale':
        label = 'Please rate';
        optionButtons = this.prepareOptionButtons(currentQuestion);
        input = this.createSelectionInput(label, optionButtons);
        break;

      case 'control_dropdown':
      case 'control_radio':
        multipleSelection = currentQuestion.hasOwnProperty('multipleSelections') && currentQuestion.multipleSelections !== 'No';
        label = !!currentQuestion.emptyString ? currentQuestion.emptyString :
                'You may pick ' + (multipleSelection ? 'some' : 'one');
        optionButtons = this.prepareOptionButtons(currentQuestion);

        input = this.createSelectionInput(label, optionButtons, multipleSelection);
        break;

      case 'control_matrix':
        multipleSelection = currentQuestion.inputType !== 'Radio Button'; // Check Box and others will be treated as Check Box
        label = 'You may pick ' + (multipleSelection ? 'some' : 'one');
        optionButtons = this.prepareOptionButtons(currentQuestion);
        input = this.createSelectionInput(label, optionButtons, multipleSelection);
        break;

      case 'control_textarea':
        input = this.createTextAreaInput();
        break;
      case 'submit':
        break;
      default:
        input = <input value={this.state.displayableAnswer}
                       onChange={(event) => {
                         this.handleChange(event.target.value);
                       }}
                       onKeyPress={this.handleKeyPress} className="message_input"
                       placeholder="Your answer comes here.. You may 'Enter' to finish"/>;
        break;

    }
    return input;
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    let isSubmitQuestion = this.props.currentQuestion && this.props.currentQuestion.type === 'submit';
    return (
      <div className="bottom_wrapper clearfix">
        <div className={this.props.botTyping ? 'appeared' : 'notVisible'}> JotBot typing...</div>
        <div
          className={'validationError' + this.state.validationError ? 'appeared' : 'notVisible'}>{this.state.validationError}
        </div>
        <div className={this.props.answerAwaiting ? 'appeared' : 'notVisible'}>
          <div className="input_and_send">
            {this.props.currentQuestion ?
             <div>
               <div className="message_input_wrapper">
                 {this.decideInput()}
               </div>
               <div className="send_message" onClick={this.tryAnswer}>
                 <div className="text">{isSubmitQuestion ? 'Submit!' : 'Send'}</div>
               </div>
             </div>
              :
             null
            }
          </div>
        </div>
      </div>
    );
  }
}

AnswerArea.propTypes = {
  answerQuestion : PropTypes.func.isRequired,
  answerAwaiting : PropTypes.bool.isRequired,
  currentQuestion : PropTypes.any
};

export default AnswerArea;