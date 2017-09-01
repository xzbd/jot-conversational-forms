import React, {Component} from 'react';
import PropTypes from 'prop-types';

class InputArea extends Component {

  tryAnswer = () => {
    console.log('InputArea.tryAnswer');

    this.props.answerQuestion();
  };

  render() {
    console.log('InputArea render');
    return (
      <div className="bottom_wrapper clearfix">
        <div className="message_input_wrapper"><input className="message_input" placeholder="Type your message here..."/></div>
        <div className="send_message">
          <div className="icon"/>
          <div className="text" onClick={this.tryAnswer}>Send</div>
        </div>
      </div>
    );
  }
}

InputArea.propTypes = {
  answerQuestion : PropTypes.func.isRequired
};

export default InputArea;