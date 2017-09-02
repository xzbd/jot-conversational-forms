import React, {Component} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  inputValueString : ''
};

class AnswerArea extends Component {

  tryAnswer = (inputElement) => {
    if (this.state.inputValueString) { // TODO this check should move into validation..
      this.props.answerQuestion(this.state.inputValueString);
      this.setState(initialState);
    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.tryAnswer();
    }
  };

  handleChange = (event) => {
    this.setState({
      inputValueString : event.target.value
    });
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  decideInput = () => {
    const questionType = this.props.currentQuestion ? this.props.currentQuestion.type : null;
    switch (questionType) {
      case 'name':
        return <input value={this.state.inputValueString} onChange={this.handleChange} onKeyPress={this.handleKeyPress} className="message_input"
                      placeholder="Your name comes here.."/>;
      default:
        return <div>Non-answerable</div>
    }
  };

  render() {
    const inputElement = this.decideInput();
    return (
      <div className="bottom_wrapper clearfix">
        <div className={this.props.answerAwaiting ? 'appeared' : 'blocked'}>
          <div className={this.props.answerAwaiting ? 'notVisible' : 'appeared'}> JotBot typing...</div>
          <div className="input_and_send">
            {this.props.currentQuestion ?
             <div>
               <div className="message_input_wrapper">
                 {inputElement}
               </div>
               <div className="send_message" onClick={this.tryAnswer.bind(this, inputElement)}>
                 <div className="text">Send</div>
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