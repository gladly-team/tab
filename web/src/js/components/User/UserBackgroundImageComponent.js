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

    const backgroundOption = getUserBackgroundOption()
    this.state = {
      // Only show the background when any image has
      // fully loaded. Show a color background immediately.
      show: (backgroundOption === USER_BACKGROUND_OPTION_COLOR),
      imgLoaded: false,
      backgroundOption: backgroundOption,
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

    // Keep showing the background if we already are, or
    // show it immediately if the background is a color.
    let show = this.state.show || (backgroundOption === USER_BACKGROUND_OPTION_COLOR)

    this.setState({
      show: show,
      backgroundOption: backgroundOption,
      customImage: customImage,
      backgroundColor: backgroundColor,
      backgroundImageURL: backgroundImageURL
    })
    setBackgroundSettings(backgroundOption,
      customImage, backgroundColor, backgroundImageURL)
  }

  onImgLoad (e) {
    this.setState({
      imgLoaded: true,
      show: true
    })
  }

  render () {
    const defaultStyle = {
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 120px inset',
      opacity: this.state.show ? 1 : 0,
      transition: 'opacity 0.5s ease-in',
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

    // What we use if a property is missing.
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const backgroundOption = this.state.backgroundOption
    var isImgBackground = false
    var imgUrl = null
    switch (backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        if (this.state.customImage) {
          backgroundStyle = {
            backgroundImage: 'url(' + this.state.customImage + ')'
          }
          isImgBackground = true
          imgUrl = this.state.customImage
        } else {
          backgroundStyle = styleOnError
        }
        break
      case USER_BACKGROUND_OPTION_COLOR:
        if (this.state.backgroundColor) {
          backgroundStyle = {
            backgroundColor: this.state.backgroundColor
          }
        } else {
          backgroundStyle = styleOnError
        }
        break
      case USER_BACKGROUND_OPTION_PHOTO:
        if (this.state.backgroundImageURL) {
          backgroundStyle = {
            backgroundImage: 'url(' + this.state.backgroundImageURL + ')'
          }
          isImgBackground = true
          imgUrl = this.state.backgroundImageURL
        } else {
          backgroundStyle = styleOnError
        }
        break
      case USER_BACKGROUND_OPTION_DAILY:
        if (this.state.backgroundImageURL) {
          backgroundStyle = {
            backgroundImage: 'url(' + this.state.backgroundImageURL + ')'
          }
          isImgBackground = true
          imgUrl = this.state.backgroundImageURL
        } else {
          backgroundStyle = styleOnError
        }
        break
      default:
        backgroundStyle = {
          background: 'none'
        }
        isImgBackground = false
        break
    }
    const finalBackgroundStyle = Object.assign({}, defaultStyle, backgroundStyle)

    const tintElemStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      // Needs to match shading in extension new tab page.
      // TODO: probably less tint if using a color background.
      backgroundColor: 'rgba(0,0,0,.2)'
    }

    // For image backgrounds, we use an img element to "preload"
    // the image before displaying the background.
    return (
      <div style={finalBackgroundStyle}>
        { (isImgBackground && !this.state.imgLoaded)
          ? <img
            style={{display: 'none'}}
            src={imgUrl}
            onLoad={this.onImgLoad.bind(this)} />
          : null
        }
        <div style={tintElemStyle} />
      </div>
    )
  }
}

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    backgroundOption: PropTypes.string.isRequired,
    customImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string
    })
  })
}

export default UserBackgroundImage
