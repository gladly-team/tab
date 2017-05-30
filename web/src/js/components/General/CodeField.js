import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import {validateCode} from 'web-utils';

class CodeField extends React.Component {
  
  constructor(props) {
    super(props);
    this.code = null;
    this.state = {
      error: null,
    }

    this.errorMsg = 'Invalid code. Only numbers are allowed.'
  }

  hasValue() {
      return this.code.input && 
      this.code.input.value && 
      this.code.input.value.trim();
  }

  getValue() {
    if(this.hasValue){
      return this.code.input.value.trim();
    }
    return null;
  }

  validate() {
    const code = this.getValue();
    if(code) {
      const isValid = validateCode(code);
      if(!isValid) {
        this.setState({
          error: this.errorMsg,
        });
      } else {
        this.setState({
          error: null,
        })
      }
      return isValid;
    }

    this.setState({
      error: null,
    });
    return false;
  }

  render() {
    return (
    		<TextField
    		  ref={(input) => { this.code = input; }}
          {...this.props}
          errorText={this.state.error}/>
    );
  }
}

export default CodeField;