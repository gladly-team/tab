import React from 'react';
import PropTypes from 'prop-types';
import { getWidgetConfig } from '../../../../utils/widgets-utils';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';

import appTheme from 'theme/default';

class CenteredSearch extends React.Component {

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
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // width: '100vw',
      // height: '100%',
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
    }

    const floatingLabelStyle = {
      color: '#FFF',
      textAlign: 'center',
    }

    const floatingLabelFocusStyle = {
      color: '#FFF',
    }

    const underlineStyle = {
      borderColor: appTheme.palette.borderColor,
    }

    const underlineFocusStyle = {
      borderColor: '#FFF',
    }

    const inputStyle = {
      textAlign: 'center',
      color: '#FFF',
      fontSize: 22,
      fontFamily: appTheme.fontFamily,
    }

    const errorStyle = {
      color: '#FFF',
    }

    const header = {
      textAlign: 'center',
      color: '#FFF',
      fontSize: 16,
      fontFamily: appTheme.fontFamily,
    }


    return (
        <div style={searchContainer}>
          <TextField
                id={'tab-search-id'}
                onFocus={this.onInputFocusChanged.bind(this, true)}
                onBlur={this.onInputFocusChanged.bind(this, false)}
                ref={(input) => { this.searchInput = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                inputStyle={inputStyle}
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFocusStyle={floatingLabelFocusStyle}
                underlineStyle={underlineStyle}
                underlineFocusStyle={underlineFocusStyle}
                errorText={engine}
                errorStyle={errorStyle}>
          </TextField>
        </div>);
  }
}

CenteredSearch.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default CenteredSearch;
