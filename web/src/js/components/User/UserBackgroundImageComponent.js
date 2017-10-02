/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
// import localBkgStorageMgr from 'utils/local-bkg-settings'

class UserBackgroundImage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: this.props.user
    }

    // FIXME
    // this.state = {
    //   user: localBkgStorageMgr.getLocalBkgSettings()
    // }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user && nextProps.user) {
      this.setState({
        user: nextProps.user
      })
    }

    // FIXME
    // if (nextProps.user) {
    //   if (localBkgStorageMgr.shouldUpdateLocalBkgSettings(nextProps.user)) {
    //     localBkgStorageMgr.setLocalBkgSettings(nextProps.user)
    //   }
    // }
  }

  render () {
    const user = this.state.user

    const defaultStyle = {
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 120px inset',
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

    var backgroundImage
    if (user.backgroundOption === 'custom') {
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundImage: 'url(' + user.customImage + ')'
      })
    } else if (user.backgroundOption === 'color') {
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundColor: user.backgroundColor
      })
    } else {
      backgroundImage = Object.assign({}, defaultStyle, {
        backgroundImage: 'url(' + user.backgroundImage.imageURL + ')'
      })
    }

    return (
      <div style={backgroundImage} />
    )
  }
}

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    backgroundOption: PropTypes.string.isRequired,
    customImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string.isRequired
    })
  }).isRequired
}

export default UserBackgroundImage
