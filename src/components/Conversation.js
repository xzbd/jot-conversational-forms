import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from "react-dom";

class Conversation extends Component {

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
            ref={(element) => {
              this.messagesEnd = element;
            }}/>
      </ul>
    );
  }
}

Conversation.PropTypes = {
  messages : PropTypes.array.required
};

export default Conversation;