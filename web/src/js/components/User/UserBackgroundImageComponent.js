/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import { get, has } from 'lodash/object'
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
      backgroundOption: getUserBackgroundOption(),
      customImage: getUserBackgroundCustomImage(),
      backgroundColor: getUserBackgroundColor(),
      backgroundImageURL: getUserBackgroundImageURL()
    }
  }

  componentWillMount () {
    // If the props contain valid settings for the background,
    // and they are different from what's already in state,
    // update the background settings values.
    if (this.arePropsReady(this.props) &&
      this.arePropsDifferentFromState(this.props)) {
      this.updateBackgroundSettings(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.arePropsReady(nextProps) &&
      this.hasBackgroundChanged(this.props, nextProps)) {
      this.updateBackgroundSettings(nextProps)
    }
  }

  // Determine if the props have the values we need to render
  // the background.
  arePropsReady (props) {
    return (
      has(props, ['user', 'backgroundOption']) &&
      has(props, ['user', 'customImage']) &&
      has(props, ['user', 'backgroundColor']) &&
      has(props, ['user', 'backgroundImage', 'imageURL'])
    )
  }

  // Determine if the props hold background settings that are
  // different from the background settings currently in state.
  arePropsDifferentFromState (props) {
    return (
      get(props, ['user', 'backgroundOption']) !== this.state.backgroundOption ||
      get(props, ['user', 'customImage']) !== this.state.customImage ||
      get(props, ['user', 'backgroundColor']) !== this.state.backgroundColor ||
      get(props, ['user', 'backgroundImage', 'imageURL']) !== this.state.backgroundImageURL
    )
  }

  // Determine if background settings are different in the new props
  // versus the old props.
  hasBackgroundChanged (oldProps, newProps) {
    const oldUser = get(oldProps, ['user'], {})
    const newUser = get(newProps, ['user'], {})
    return (
      get(oldUser, ['backgroundOption']) !== get(newUser, ['backgroundOption']) ||
      get(oldUser, ['customImage']) !== get(newUser, ['customImage']) ||
      get(oldUser, ['backgroundColor']) !== get(newUser, ['backgroundColor']) ||
      get(oldUser, ['backgroundImage', 'imageURL']) !== get(newUser, ['backgroundImage', 'imageURL'])
    )
  }

  updateBackgroundSettings (props) {
    let backgroundOption = get(props, ['user', 'backgroundOption'])
    let customImage = get(props, ['user', 'customImage'])
    let backgroundColor = get(props, ['user', 'backgroundColor'])
    let backgroundImageURL = get(props, ['user', 'backgroundImage', 'imageURL'])
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
  })
}

export default UserBackgroundImage
