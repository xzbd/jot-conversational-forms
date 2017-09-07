import React, {Component} from 'react'
import PropTypes from 'prop-types';

import {ButtonGroup} from 'react-bootstrap'

/**
 * Forked from https://gist.github.com/jonjaques/5a1673e2afd0b8736ebe
 */
class ButtonSelect extends Component {
  getValueLink = (props) => {
    let {onChange, value} = props;
    return props.valueLink || {
      value : value,
      requestChange : onChange
    };
  };

  handleClick = (child) => {
    let {value, requestChange} = this.getValueLink(this.props);
    let keys = this.getChildKeys();
    let key = child.props.value;
    if (this.props.type === 'radio') {
      keys.forEach(k => value[k] = (k === key) ? true : false);
    } else {
      keys.forEach(k => value[k] = (k === key) ? !value[k] : value[k]);
    }
    requestChange(value);
  };

  getChildKeys = () => {
    let keys = [];
    this.props.children.forEach((child) => {
      keys.push(child.props.value);
    });
    return keys
  };

  renderChildren = () => {
    return this.props.children.map((child) => {
      let value = this.getValueLink(this.props).value || {};
      let isActive = value[child.props.value] || false;
      return React.cloneElement(child, {
        active : isActive,
        onClick : this.handleClick.bind(this, child)
      })
    });
  };

  render() {
    return <ButtonGroup className={this.props.className}
                        bsSize={this.props.bsSize}>
      {this.renderChildren()}
    </ButtonGroup>
  }

}

ButtonSelect.PropTypes = {
  children : PropTypes.node,
  type : PropTypes.oneOf(['checkbox', 'radio']),
  value : PropTypes.any,
  onChange : PropTypes.func,
  valueLink : PropTypes.shape({
    value : PropTypes.any,
    requestChange : PropTypes.func.isRequired
  })
};

ButtonSelect.defaultProps = {
  value : {},
  valueLink : null,
  onChange : () => {
  }
};

export default ButtonSelect;

