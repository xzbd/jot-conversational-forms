import React, {Component} from 'react';
import './App.css';

import Header from "./components/Header";
import Body from "./components/Body/Body";

//Integrate JotForm JS SDK
const jf = window.JF || null;

const guestUser = {
  name : 'Guest',
  isGenuine : false
};

class App extends Component {
  _setUser = (jfUser) => {
    Object.assign(jfUser, {isGenuine : true});
    this.setState({user : jfUser});
  };

  handleLogin = () => {
    jf.login(() => {
      jf.getUser((jfUser) => {
        this._setUser(jfUser);
      });
    }, (error) => {
      alert('An error occured while logging in via JotForm. Please check console if you\'d like..');
      console.error(error);
    });
  };

  handleLogout = () => {
    alert('Sadly, logout is not working properly due to a deprecated cookie name in JotForm JS SDK. Please delete your cookies manually and refresh..');
    this.setState({user : guestUser});
  };

  constructor() {
    super();

    this.state = {
      user : guestUser
    };
  }

  render() {
    const isJFIntegrated = jf !== null;

    return (
      isJFIntegrated ? (
        <div className="App">
          <Header user={this.state.user} login={this.handleLogin} logout={this.handleLogout}/>
          <Body user={this.state.user}/>
        </div>
      ) : <div className="App">JotForm integration failed. Are you really connected to internet?</div>
    );
  }
}

export default App;
