/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';

class UserBackgroundImage extends React.Component {
  
  static propTypes = {
    user: React.PropTypes.object.isRequired
  };

  render() {

    const { user } = this.props;

    const backgroundImage = {
      backgroundImage: 'url(' + user.backgroundImage.url + ')',
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
    };

    return (
      <div style={backgroundImage}></div>
    );
  }
}

export default UserBackgroundImage;
