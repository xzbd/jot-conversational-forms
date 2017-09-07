import React, {Component} from 'react';
import './App.css';

import Header from "./components/Header";
import Body from "./components/Body";
import {Alert} from "react-bootstrap";

//Integrate JotForm JS SDK
const jf = window.JF || null;

const guestUser = {
  name : 'Guest',
  isGenuine : false
};

class App extends Component {
  setUser = (jfUser) => {
    this.setState({
      user : {
        name : jfUser.name || 'John Doe', // name may be an empty string
        isGenuine : true
      }
    });
  };

  handleLogin = () => {
    jf.login(() => {
      jf.getUser((jfUser) => {
        this.setUser(jfUser);
      }, (error) => {
        alert('An error occured while retrieving user informaion. Please check console if you\'d like..');
        console.error(error);
      });
    }, (error) => {
      alert('An error occured while logging in via JotForm. Please check console if you\'d like..');
      console.error(error);
    });
  };

  handleLogout = () => {
    alert(`Sadly, logout is not working properly due to a deprecated cookie name in JotForm JS SDK.
    Please delete your cookies manually and refresh..`);
    this.setState({user : guestUser});
  };

  constructor(props) {
    super(props);

    this.state = {
      user : guestUser
    };
  }

  render() {
    const isJFIntegrated = jf !== null;

    const loginWarning = (
      <Alert bsStyle="info">
        Please <a href="#" onClick={this.handleLogin}>login</a> and give necessary permission(s)
        in order to <strong>talk</strong> with your forms.
      </Alert>
    );

    const body = <Body login={this.handleLogin}/>;

    return (
      isJFIntegrated ? (
        <div className="App">
          <Header user={this.state.user} login={this.handleLogin} logout={this.handleLogout}/>
          {
            this.state.user.isGenuine ? body : loginWarning
          }
        </div>
      ) : <div className="App">JotForm integration failed. Are you really connected to the internet?</div>
    );
  }
}

export default App;
