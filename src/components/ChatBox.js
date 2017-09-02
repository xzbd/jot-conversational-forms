import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './ChatBox.css';
import Conversation from "./Conversation";
import AnswerArea from "./AnswerArea";
import Message from "./Message";
import Title from "./Title";
import lodash from "lodash";

const initialState = {
  messages : [],
  answerAwaiting : false,
  currentQuestion : null
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
    const charsPerMin = 330 * 10; // Let JotBot types 10 times faster
    /*return Math.floor(text.length * 60000 / charsPerMin);*/
    return 1;
  };

  prepareToAsk = () => {
    this.setState({answerAwaiting : false});
  };

  waitAnswer = () => {
    this.setState({answerAwaiting : true});
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

  sendMultipleMessages = (messages, finalCallback = noop) => {
    if (messages.length > 0) {
      // Need to pass the finalCallback until the final message..
      const callback = messages.length === 1 ? finalCallback : () => {
        this.sendMultipleMessages(messages, finalCallback)
      };
      this.sendMessage(messages.shift(), undefined, callback);
    }
  };

  /**
   * Shows answerer's message on chat area and responds it and passes to next question
   * @param answerText
   */
  receiveAnswer = (answerText) => {
    this.sendMessage(this.createAnswerMessage(answerText), 0,
      () => {
        this.meetAnswer(answerText);
      });
  };

  /**
   * Produces message for incoming answer like greeting after name question or
   * responsing the answer for a proper conversation
   */
  meetAnswer = (answerText) => {
    //special treatment for nameQuestion
    if (this.state.currentQuestion.type === 'name') {
      this.answererName = answerText;
      this.greetAnswerer();
    } else {
      this.respondAnswer();
    }
  };

  greetAnswerer = () => {
    const greetings = [
      'Nice to meet you',
      'Glad to know you',
      'Hmm, it\'s a good name'
    ];
    const greetingText = lodash.sample(greetings)+', ' + this.answererName + '!';
    this.sendMessage(this.createMessage(greetingText), undefined, this.prepareNextQuestion);
  };

  respondAnswer = () => {
    const responses = [
      'Adding right into my notes',
      'mmm hmm..',
      'I see..',
      'Great!',
      'Wonderful',
      'Understood'
    ];
    this.sendMessage(this.createMessage(lodash.sample(responses)), undefined, this.prepareNextQuestion);
  };

  prepareNextQuestion = () => {

  };

  createAnswerMessage = (answerText) => {
    return this.createMessage(answerText, 'right');
  };

  createMessage = (messageText, side = 'left') => {
    return <Message key={this.messageCounter++} message={messageText} side={side}/>
  };

  askQuestion = (question, callback = this.waitAnswer) => {
    this.prepareToAsk();
    const questionMessage = this.createMessage(question.text);
    this.sendMessage(questionMessage, undefined, () => {
      this.setState({
        currentQuestion : question
      });
      callback();
    });
  };

  askName = () => {
    const questionText = 'We can start as soon as you show a sign of vitality :) Go ahead type your name so I can address you';
    const nameQuestion = {
      qId : "0",
      type : "name",
      text : questionText
    };
    this.askQuestion(nameQuestion);
  };

  initiateConversation = () => {
    this.prepareToAsk();
    const initialMessages = [
      this.createMessage('Hey there! :) My name\'s JotBot'),
      this.createMessage('I\'m a super NSI Form Bot, representing ' + this.props.formOwnerName),
      this.createMessage('And here to ask you a few questions..'),
      this.createMessage('By the way, NSI stands for "Not So Intelligent".. So please bear with me :)')
    ];

    this.sendMultipleMessages(initialMessages, this.askName);
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
    this.answererName = '';

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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.form.id !== nextProps.form.id) {
      // A different form should have been selected
      // Everyting should be cleared
      this.resetComponent();
    }
  }

  render() {
    return (
      <div className="chat_area">
        <div className="chat_window">
          <Title chatTitle={this.props.form.title}/>
          <Conversation messages={this.state.messages}/>
          <AnswerArea currentQuestion={this.state.currentQuestion} answerAwaiting={this.state.answerAwaiting} answerQuestion={this.receiveAnswer}/>
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