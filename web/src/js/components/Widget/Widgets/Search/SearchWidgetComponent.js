import React from 'react';
import PropTypes from 'prop-types';
import { getWidgetConfig } from '../../../../utils/widgets-utils';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';

import {
  grey300,
} from 'material-ui/styles/colors';

class SearchWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      config: {},
    };
  }

  componentDidMount() {
    const { widget } = this.props; 

    const config = JSON.parse(widget.config);
    const settings = JSON.parse(widget.settings);
    const configuration = getWidgetConfig(config, settings);
    this.setState({
      config: configuration,
    })
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.executeSearch();
    }
  }

  executeSearch() {
    const { widget } = this.props; 
    const data = JSON.parse(widget.data);
    const engine = data.engine;
    
    const searchApi = this.getSearchApi(engine);
    const searchTerm = this.searchInput.input.value;
    window.open(searchApi + searchTerm, '_self'); 

    this.searchInput.input.value = '';
  }

  onInputFocusChanged(focused) {
    this.setState({
      focused: focused,
    })
  }

  getSearchApi(engine) {
    switch(engine) {
      case 'Google':
        return "https://www.google.com/search?q=";
      default:
        return "https://www.google.com/search?q=";
    }
  }

  render() {

    const engine = this.state.config.engine || '';

    const searchContainer = {
      position: 'relative',
      paddingLeft: 12,
      top: -27,
    }

    const floatingLabelStyle = {
      color: '#FFF',
    }

    const floatingLabelFocusStyle = {
      color: '#FFF',
    }

    const underlineStyle = {
      borderColor: 'transparent',
    }

    const underlineFocusStyle = {
      borderColor: '#FFF',
    }

    const inputStyle = {
      color: '#FFF',
    }

    const errorStyle = {
      color: '#FFF',
    }

    var engineText = ''
    if(this.state.focused) {
      engineText = engine;
    }

    return (
        <div style={searchContainer}>
          <TextField
                onFocus={this.onInputFocusChanged.bind(this, true)}
                onBlur={this.onInputFocusChanged.bind(this, false)}
                ref={(input) => { this.searchInput = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                inputStyle={inputStyle}
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFocusStyle={floatingLabelFocusStyle}
                underlineStyle={underlineStyle}
                underlineFocusStyle={underlineFocusStyle}
                errorText={engineText}
                errorStyle={errorStyle}
                floatingLabelText={(<FontIcon
            color={grey300}
            hoverColor={'#FFF'}
            className="fa fa-search"/>)}>
          </TextField>
        </div>);
  }
}

SearchWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default SearchWidget;
