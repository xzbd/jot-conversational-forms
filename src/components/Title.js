import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Title extends Component {
  render() {
    return (
      <div className="top_menu">
        <div className="title">{this.props.chatTitle}</div>
      </div>
    );
  }
}

Title.PropTypes = {
  chatTitle : PropTypes.string.isRequired
};

export default Title;