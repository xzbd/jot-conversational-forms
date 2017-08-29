import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './Body.css';
import {Alert} from "react-bootstrap";

class Body extends Component {
  render() {

    const loginWarning = (
      <Alert bsStyle="warning">
        Please login from the user menu in order to <strong>talk</strong> with your forms.
      </Alert>
    );

    return (
      <div className="Body">
        {this.props.user.isGenuine ? <div>Coming soon with forms and conversation area</div> : loginWarning}
      </div>
    );
  }
}

Body.propTypes = {
  user : PropTypes.any.isRequired
};

export default Body;