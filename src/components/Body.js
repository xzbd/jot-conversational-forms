import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Col, Grid} from "react-bootstrap";
import Forms from "./Forms";

const jf = window.JF || null;

class Body extends Component {

  getUserForms = () => {
    this.setState({formsAreLoaded : false});
    jf.getForms((response) => {
      this.setState({
        forms : response,
        formsAreLoaded : true
      });
    });
  };

  constructor() {
    super();

    this.state = {
      forms : [],
      formsAreLoaded : false
    };
  }

  componentWillMount() {
    this.getUserForms();
  }

  render() {
    return (
      <div className="Body">
        <Grid>
          <Col xs={12} md={4}>
            <Forms forms={this.state.forms} loaded={this.state.formsAreLoaded}/>
          </Col>
          <Col xs={12} md={8}> There will be a conversation area according to selected form..</Col>
        </Grid>
      </div>
    );
  }
}

Body.propTypes = {
  login : PropTypes.func.isRequired,
};

export default Body;