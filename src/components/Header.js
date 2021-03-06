import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {MenuItem, Nav, Navbar, NavDropdown} from 'react-bootstrap';

class Header extends Component {

  render() {
    let menuItem = <MenuItem onSelect={this.props.login}>Login</MenuItem>;
    if (this.props.user.isGenuine) {
      menuItem = <MenuItem onSelect={this.props.logout}>Logout</MenuItem>;
    }

    return (
      <Navbar inverse fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">JotForm Conversational Forms</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavDropdown title={this.props.user.name} id="user-dropdown">
            {menuItem}
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

Header.propTypes = {
  user : PropTypes.any.isRequired,
  login : PropTypes.func.isRequired,
  logout : PropTypes.func.isRequired
};

export default Header;