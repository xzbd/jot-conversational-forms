import React, {Component} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  inputValueString : ''
};

class InputArea extends Component {

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


  render() {
    const inputElement = <input value={this.state.inputValueString} onChange={this.handleChange} onKeyPress={this.handleKeyPress} className="message_input"
                                placeholder="Type your message here..."/>;
    return (
      <div className="bottom_wrapper clearfix">
        <div className="message_input_wrapper">
          {inputElement}
        </div>
        <div className="send_message" onClick={this.tryAnswer.bind(this, inputElement)}>
          <div className="text">Send</div>
        </div>
      </div>
    );
  }
}

InputArea.propTypes = {
  answerQuestion : PropTypes.func.isRequired
};

export default InputArea;