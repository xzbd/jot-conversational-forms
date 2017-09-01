import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ChatBox.css';
import Conversation from "./Conversation";
import InputArea from "./InputArea";
import Message from "./Message";

const initialState = {
  messages : []
};

class ChatBox extends Component {

  counter = 1;
  answerQuestion = () => {
    const newMessage = <Message key={this.counter} message={this.counter} side={this.counter++ % 2 === 0 ? 'right' : 'left'}/>;
    this.setState((prevState) => ({
      messages : [...prevState.messages, newMessage]
    }));
  };

  constructor() {
    super();

    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.form.id !== nextProps.form.id) {
      // A different form should have been selected
      // Everyting should be cleared
      this.setState(initialState);
    }
  }


  render() {
    return (
      <div className="chat_area">
        <div className="chat_window">
          <div className="top_menu">
            <div className="title">{this.props.form.title}</div>
          </div>
          <Conversation messages={this.state.messages}/>
          <InputArea answerQuestion={this.answerQuestion}/>
        </div>
      </div>
    );
  }
}

ChatBox.PropTypes = {
  form : PropTypes.any.isRequired,
  questions : PropTypes.array.isRequired
};

export default ChatBox;