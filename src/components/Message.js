import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Message extends Component {

  constructor(props) {
    super(props);

    this.state = {
      appeared : false
    }
  }

  componentDidMount() {
    //For transition effect..
    requestAnimationFrame(() => {
      this.setState({appeared : true});
    });

  }

  render() {
    return (
      <li className={'message ' + this.props.side + (this.state.appeared ? ' appeared' : '')}>
        <div className="avatar"/>
        <div className="text_wrapper">
          <div className="text">
            {this.props.message}
          </div>
        </div>
      </li>
    );
  }

}

Message.propTypes = {
  message : PropTypes.string.isRequired,
  side : PropTypes.oneOf(['left', 'right']).isRequired
};

export default Message;