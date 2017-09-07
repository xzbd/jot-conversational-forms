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
  currentQuestion : null,
};

const noop = () => {
};

const greetings = [
  'Nice to meet you',
  'Glad to know you',
  'Hmm, it\'s a good name'
];

const submitConfirmations = [
  'It seems we\'re done.. Are you ready to submit your answers?',
  'Yes, we\'ve finally reached to the end of never-ending questions. Do you want me to deliver them?',
  'Done! Wanna submit?'
];

const responses = [
  'Adding right into my notes',
  'mmm hmm..',
  'I see..',
  'OK, I\'m putting this one down, too.',
  'Great!',
  'Allright, duly noted',
  'Wonderful',
  'Alright, I\'ll write this down.',
  'Understood'
];

const noComments = [
  'You don\'t need to know',
  'No comment..',
  '42',
  'I don\'t wanna share..',
  'Next question please..'
];

const controlMatrixPrefaces = [
  'Do you find ',
  'What would be your answer considering '
];

const submitOrders = [
  'Yes please..',
  'Hit it!',
  'Wait no more..',
  'ASAP'
];

const farewells = [
  'Well.. It\'s been a pleasure',
  'Thanks for your contribution',
  'So long and thanks for all the answers'
];

class ChatBox extends Component {

  /**
   * To give a realistic effect calculate message sending delay by the length of the message.
   * Not sure if it gives the desired effect but why not?
   * @param questionText
   */
  calculateDelay = (questionText) => {
    // A professional or good typist hits around 325 to 335 CPM source: http://smallbusiness.chron.com/good-typing-speed-per-minute-71789.html
    const charsPerMin = 330 * 10; // Let JotBot types 10 times faster
    return 1;
    return Math.floor(questionText.length * 60000 / charsPerMin);
  };

  prepareToAsk = () => {
    this.setState({
      answerAwaiting : false,
      botTyping : true
    });
  };

  waitAnswer = () => {
    this.setState({
      answerAwaiting : true,
      botTyping : false
    });
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

  processAnswer = (answerObject) => {
    // TODO add answer to submission
    const {questionKey, jfAnswer} = answerObject;

    if (questionKey.includes('_')) {
      const [key, subkey] = questionKey.split('_');
      // TODO could've been better with immutability-helper
      if (this.submission.hasOwnProperty(key)) {
        this.submission[key][subkey] = jfAnswer;
      } else {
        this.submission[key] = {};
        this.submission[key][subkey] = jfAnswer;
      }
    } else {
      this.submission[questionKey] = jfAnswer
    }

  };

  // Returns true or error message for AnswerArea to show..
  validateAnswer = (answer) => {
    // TODO do the actual validation according to the question and its' parameters

    return true;
  };

  /**
   * Shows answerer's message on chat area and responds it and finally passes to next question
   * @param answerText
   */
  receiveAnswer = (answerObject) => {
    let {answerText, questionKey} = answerObject;
    if (!(questionKey === 'name' || questionKey === 'submit')) {
      this.processAnswer(answerObject);
    }

    if (questionKey === 'submit') {
      answerText = lodash.sample(submitOrders);
    }

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
    switch (this.state.currentQuestion.type) {

      case 'name' :
        this.answererName = answerText;
        this.greetAnswerer();
        break;

      case 'submit' :
        this.bidFarewell();
        break;

      default:
        this.respondAnswer();
        break;

    }
  };

  submitAnswers = () => {
    // TODO submit answers via API
    console.log(this.submission);
    this.setState({
      currentQuestion : false
    });
  };

  bidFarewell = () => {
    const farewellText = lodash.sample(farewells);
    this.sendMessage(this.createMessage(farewellText), undefined, this.submitAnswers);
  };

  greetAnswerer = () => {
    let greetingText = '';
    if (this.answererName === '') {
      this.answererName = 'Person';
      greetingText = 'OK ' + this.answererName + ', i hope you dont mind that i call you ' + this.answererName;
    } else {
      greetingText = lodash.sample(greetings) + ', ' + this.answererName + '!';
    }
    this.sendMessage(this.createMessage(greetingText), undefined, this.proceedConversation);
  };

  respondAnswer = () => {
    this.sendMessage(this.createMessage(lodash.sample(responses)), undefined, this.proceedConversation);
  };

  createAnswerMessage = (answerText) => {
    if (answerText.length === 0) {
      //Missing answer
      answerText = lodash.sample(noComments);
    }
    return this.createMessage(answerText, 'right');
  };

  createMessage = (messageText, side = 'left') => {
    return <Message key={this.messageCounter++} message={messageText} side={side}/>
  };

  askSubmit = () => {

    const submitQuestion = {
      questionKey : "submit",
      type : "submit",
      questionText : lodash.sample(submitConfirmations)
    };

    this.askQuestion(submitQuestion);
  };

  prepareNextQuestion = () => {
    return this.props.questions[this.questionIndexToAsk++]
  };

  /**
   * Everyting is OK, getting to next question
   */
  proceedConversation = () => {
    this.prepareToAsk();
    const nextQuestion = this.prepareNextQuestion();
    if (!nextQuestion) {
      this.askSubmit();
    } else {
      this.askQuestion(nextQuestion)
    }
  };

  prepareScaleQuestionPreface = (question) => {
    const scaleFrom = question.scaleFrom || 1;
    const {scaleAmount, fromText, toText,} = question;
    return 'On a scale of ' + scaleFrom + ' to ' + scaleAmount + ' with ' +
           scaleFrom + ' being the most "' + fromText + '" and ' + scaleAmount + ' being "' + toText + '"; ';
  };

  prepareMatrixQuestionPreface = () => {
    return lodash.sample(controlMatrixPrefaces);
  };

  askQuestion = (question, callback = this.waitAnswer) => {
    let questionText = '';
    switch (question.type) {
      case 'control_scale':
        questionText = this.prepareScaleQuestionPreface(question) + question.questionText;
        break;

      case 'control_matrix':
        questionText = this.prepareMatrixQuestionPreface() + question.questionText;
        break;

      default:
        questionText = question.questionText;
        break;
    }

    const questionMessage = this.createMessage(questionText);
    this.sendMessage(questionMessage, undefined, () => {
      this.setState({
        currentQuestion : question
      });
      callback();
    });
  };

  askName = () => {
    const nameQuestion = {
      questionKey : "name",
      type : "name",
      questionText : 'We can start as soon as you show a sign of vitality :) Go ahead type your name so I can address you'
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
    this.answererName = '';
    this.questionIndexToAsk = 0;
    this.submission = {};
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
          <AnswerArea currentQuestion={this.state.currentQuestion}
                      botTyping={this.state.botTyping}
                      answerQuestion={this.receiveAnswer}
                      validate={this.validateAnswer}
                      answerAwaiting={this.state.answerAwaiting}/>
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