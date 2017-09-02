import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from "react-dom";

class Conversation extends Component {

  /*questionIndexToAsk = 0;
  getNextQuestion = () => {
    return this.props.questions[this.questionIndexToAsk++];
  };

  askQuestion = (question) => {
    console.log('question to ask', question);

    const message = <Message message={question.text} side='left'/>;

    function xx(prevState, props) {
      return {showForm : !prevState.showForm}
    }


    this.setState((prevState, props) => ({
      messages : prevState.messages.push(message)
    }));

    console.log();
  };



  /!**
   * User Answer is acceptable going to ask a new question (if any)
   * or submit the form..
   *!/
  proceedConversation = () => {

  };*/

  /*

    componentWillMount() {
      /!*this.initiateConversation();*!/
    }
  */

  scrollToBottom = () => {
    const lastLiNode = ReactDOM.findDOMNode(this.messagesEnd);
    lastLiNode.scrollIntoView();
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <ul className="messages">
        {this.props.messages}
        <li style={{float : "left", clear : "both", marginTop : '10px'}}
            ref={(el) => {
              this.messagesEnd = el;
            }}/>
      </ul>
    );
  }
}

Conversation.PropTypes = {
  messages : PropTypes.array.required
};

export default Conversation;