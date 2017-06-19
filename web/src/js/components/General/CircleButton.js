import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import Forward from 'material-ui/svg-icons/content/forward';


class CircleButton extends React.Component {
  
  render() {

    const iconContainer = {
      position: 'relative',
      top: -2,
      left: 1
    };

    const icon = (
      <Forward 
        style={iconContainer}
        color={'#FFF'} />);

    const defaultStyle = {
      width: this.props.size,
      height: this.props.size,
      minWidth: this.props.size,
      borderRadius: '100%',
      border: '1px solid #FFF',
    }

    const finalStyle = Object.assign({}, 
      defaultStyle, this.props.buttonStyle);

    const props = Object.assign({}, this.props);
    delete props['buttonStyle'];
    delete props['size'];

    return (
    		<FlatButton
          {...props}
          style={defaultStyle}
          backgroundColor="transparent"
          hoverColor="rgba(255,255,255,.1)"
          icon={icon}/>
    );
  }
}

CircleButton.propTypes = {
  size: PropTypes.number,
  buttonStyle: PropTypes.object,
}

CircleButton.defaultProps = {
  buttonStyle: {},
  size: 50,
}

export default CircleButton;