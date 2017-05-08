/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';

class UserBackgroundImage extends React.Component {
  
  render() {

    const {user} = this.props;

    const defaultStyle = {
      opacity: 1,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      WebkitBackgroundSize: 'cover',
      MozBackgroundSize: 'cover',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto'
    }

    var backgroundImage;
    if(user.backgroundOption === 'custom'){
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundImage: 'url(' + user.customImage + ')',
      });
    } else if(user.backgroundOption === 'color') {
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundColor: user.backgroundColor,
      });
    } else {
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundImage: 'url(' + user.backgroundImage.url + ')',
      });
    }

    return (
      <div style={backgroundImage}></div>
    );
  }
}

UserBackgroundImage.propTypes = {
    user: React.PropTypes.object.isRequired
  };

export default UserBackgroundImage;
