/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import {
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_DAILY
} from '../../constants'
import {
  getUserBackgroundOption,
  getUserBackgroundCustomImage,
  getUserBackgroundColor,
  getUserBackgroundImageURL,
  setBackgroundSettings
} from 'utils/local-bkg-settings'

class UserBackgroundImage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      // TODO: test
      backgroundOption: getUserBackgroundOption(),
      customImage: getUserBackgroundCustomImage(),
      backgroundColor: getUserBackgroundColor(),
      backgroundImageURL: getUserBackgroundImageURL()
    }
  }

  componentWillMount () {
    this.updateBackgroundSettings(this.props)
  }

  // TODO: test
  componentWillReceiveProps (nextProps) {
    // TODO: check for changes here versus state.
    if (this.hasBackgroundChanged(this.props, nextProps)) {
      this.updateBackgroundSettings(nextProps)
    }
  }

  hasBackgroundChanged (oldProps, newProps) {
    const oldUser = oldProps.user
    const newUser = newProps.user
    if (!oldUser && !newUser) {
      return false
    } else if (!oldUser && newUser) {
      return true
    } else if (oldUser && !newUser) {
      return true
    }
    return (
      oldUser.backgroundOption !== newUser.backgroundOption ||
      oldUser.customImage !== newUser.customImage ||
      oldUser.backgroundColor !== newUser.backgroundColor ||
      oldUser.backgroundImage.imageURL !== newUser.backgroundImage.imageURL
    )
  }

  updateBackgroundSettings (props) {
    let backgroundOption = props.user.backgroundOption
    let customImage = props.user.customImage
    let backgroundColor = props.user.backgroundColor
    let backgroundImageURL = props.user.backgroundImage.imageURL
    this.setState({
      backgroundOption: backgroundOption,
      customImage: customImage,
      backgroundColor: backgroundColor,
      backgroundImageURL: backgroundImageURL
    })
    setBackgroundSettings(backgroundOption,
      customImage, backgroundColor, backgroundImageURL)
  }

  render () {
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

    var backgroundStyle = {}
    const backgroundOption = this.state.backgroundOption
    switch (backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        backgroundStyle = {
          backgroundImage: 'url(' + this.state.customImage + ')'
        }
        break
      case USER_BACKGROUND_OPTION_COLOR:
        backgroundStyle = {
          backgroundColor: this.state.backgroundColor
        }
        break
      case USER_BACKGROUND_OPTION_PHOTO:
        backgroundStyle = {
          backgroundImage: 'url(' + this.state.backgroundImageURL + ')'
        }
        break
      case USER_BACKGROUND_OPTION_DAILY:
        backgroundStyle = {
          backgroundImage: 'url(' + this.state.backgroundImageURL + ')'
        }
        break
      default:
        break
    }
    const finalBackgroundStyle = Object.assign({}, defaultStyle, backgroundStyle)
    return (
      <div style={finalBackgroundStyle} />
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
