import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ChatBox.css';
import Conversation from "./Conversation";
import InputArea from "./InputArea";
import Message from "./Message";
import Title from "./Title";

const initialState = {
  messages : [],
};

const noop = () => {
};

class ChatBox extends Component {

  /**
   * To give a realistic effect calculate message sending delay by the length of the message.
   * @param text
   */
  calculateDelay = (text) => {
    // A professional or good typist hits around 325 to 335 CPM source: http://smallbusiness.chron.com/good-typing-speed-per-minute-71789.html
    const charsPerMin = 330 * 10; // Let our super NSI bot types 10 times faster
    return Math.floor(text.length * 60000 / charsPerMin);
  };

  sendMessage = (message, delay = undefined, callback = noop) => {
    delay = (delay !== undefined ) ? delay : this.calculateDelay(message.props.message);
    this.timers.push(setTimeout(() => {
      this.setState((prevState) => ({
        messages : [...prevState.messages, message]
      }), () => {
        callback();
      });
    }, delay));
  };

  sendMessages = (messages) => {
    if (messages.length > 0) {
      this.sendMessage(messages.shift(), undefined, () => {
        this.sendMessages(messages)
      });
    }
  };

  answerQuestion = (answerText) => {
    this.sendMessage(this.createAnswer(answerText), 0);
  };

  createAnswer = (answerText) => {
    return this.createMessage(answerText, 'right');
  };

  createMessage = (messageText, side = 'left') => {
    return <Message key={this.messageCounter++} message={messageText} side={side}/>
  };


  initiateConversation = () => {
    console.log('Conversation is initializing');
    var initialMessages = [
      this.createMessage("Hey there! :)"),
      this.createMessage("I'm a super NSI Bot, representing " + this.props.formOwnerName),
      this.createMessage("And here to ask you a few questions.."),
      this.createMessage("By the way, NSI stands for \"Not So Intelligent\".. So please bear with me :)"),
      this.createMessage("We can start as soon as you show a sign of vitality. Go ahead type something!"),
    ];
    this.sendMessages(initialMessages);
  };


  invalidateTimers = () => {
    if (this.timers) {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
    }
    this.timers = [];
  };

  /**
   * resets the component with timers, variables and state..
   */
  resetComponent = () => {
    this.invalidateTimers();
    this.messageCounter = 0;
    this.state = initialState;

    this.timers.push(setTimeout(() => {
      this.initiateConversation();
    }, 250));
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.resetComponent();
    console.log(this.props.form);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.form.id !== nextProps.form.id) {
      // A different form should have been selected
      // Everyting should be cleared
      this.resetComponent();
    }
  }


  render() {
    console.log('chatbox Render');
    return (
      <div className="chat_area">
        <div className="chat_window">
          <Title chatTitle={this.props.form.title}/>
          <Conversation messages={this.state.messages}/>
          <InputArea answerQuestion={this.answerQuestion}/>
        </div>
      </div>
    );
  }
}

ChatBox.PropTypes = {
  form : PropTypes.any.isRequired,
  questions : PropTypes.array.isRequired,
  formOwnerName : PropTypes.string.isRequired
};

export default ChatBox;