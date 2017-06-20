import React from 'react';
import appTheme from 'theme/default';

import FontIcon from 'material-ui/FontIcon';

class LoadingPage extends React.Component {

  

  render() {
    const root = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      backgroundColor: appTheme.palette.primary1Color,
      color: '#FFF',
    };

    const iconStyles = {
      color: '#FFF',
    };

    const textStyle = {
      fontFamily: appTheme.fontFamily,
      color: '#FFF',
      marginLeft: 10,
    };

    return (
          <div 
            style={root}>
            <FontIcon
              className="fa fa-spinner fa-pulse fa-3x fa-fw"
              style={iconStyles}/>
            <span style={textStyle}>{this.props.msg}</span>
          </div>
    );
  }
}

export default LoadingPage;

