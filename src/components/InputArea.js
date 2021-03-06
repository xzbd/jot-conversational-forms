import React, {Component} from 'react';
import PropTypes from 'prop-types';

class InputArea extends Component {

  tryAnswer = () => {
    this.props.answerQuestion();
  };

  render() {
    return (
      <div className="bottom_wrapper clearfix">
        <div className="message_input_wrapper"><input className="message_input" placeholder="Type your message here..."/></div>
        <div className="send_message" onClick={this.tryAnswer}>
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