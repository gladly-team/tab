/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import { get, has } from 'lodash/object'
import { isNil } from 'lodash/lang'
import moment from 'moment'
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
  setBackgroundSettings,
  setExtensionBackgroundSettings
} from 'utils/local-bkg-settings'
import SetBackgroundDailyImageMutation from 'mutations/SetBackgroundDailyImageMutation'
import FadeBackgroundAnimation from '../Background/FadeBackgroundAnimation'

/*
 * We want to load the background as quickly as possible,
 * so this component interacts with local storage and the
 * parent frame (the browser extension's local new tab page).
 * On mount, it tries to load background settings from
 * local storage; if settings exist in local storage, it posts
 * a message to the parent frame to make sure the background
 * settings used by the extension new tab page are up to date.
 * When the user data returns from the server, if the user's
 * background settings are different from those in local
 * storage, it updates the component state and messages the parent
 * frame. If the user's settings from the server are identical,
 * it should not update state or message the parent frame.
*/
class UserBackgroundImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // The image we are currently showing (or fading in to show).
      currentlyDisplayedImgURL: null,
      // Whether the user's image has preloaded successfully.
      nextImgPreloaded: false,
      // Whether there was a problem preloading the user's image.
      imgPreloadError: false,
      // The user's background settings. They might not reflect what
      // background is currently displayed because we want to fully
      // preload images before displaying them.
      backgroundOption: getUserBackgroundOption(),
      customImage: getUserBackgroundCustomImage(),
      backgroundColor: getUserBackgroundColor(),
      backgroundImageURL: getUserBackgroundImageURL()
    }
  }

  componentDidMount () {
    // If the props contain valid settings for the background,
    // and they are different from what's already in state,
    // update the background settings values.
    if (this.arePropsReady(this.props) &&
      this.arePropsDifferentFromState(this.props)) {
      this.updateBackgroundSettings(this.props)
      this.getNewDailyImageIfNeeded(this.props)
    }

    // If there's background settings in local storage,
    // call the parent frame to update the extension's
    // background settings.
    if (this.stateHasBackgroundSettings()) {
      setExtensionBackgroundSettings(
        this.state.backgroundOption,
        this.state.customImage,
        this.state.backgroundColor,
        this.state.backgroundImageURL)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only update state and saved background settings if the
    // props contain different values.
    if (this.arePropsReady(nextProps) &&
      this.arePropsDifferentFromState(nextProps)) {
      this.updateBackgroundSettings(nextProps)
      this.getNewDailyImageIfNeeded(nextProps)
    }
  }

  // Determine if the state has values to render the background.
  stateHasBackgroundSettings (props) {
    return !isNil(this.state.backgroundOption)
  }

  // Determine if the props have the values we need to render
  // the background.
  arePropsReady (props) {
    return (
      has(props, ['user', 'backgroundOption']) &&
      has(props, ['user', 'customImage']) &&
      has(props, ['user', 'backgroundColor']) &&
      has(props, ['user', 'backgroundImage', 'imageURL']) &&
      has(props, ['user', 'backgroundImage', 'timestamp'])
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

  updateBackgroundSettings (props) {
    let backgroundOption = get(props, ['user', 'backgroundOption'])
    let customImage = get(props, ['user', 'customImage'])
    let backgroundColor = get(props, ['user', 'backgroundColor'])
    let backgroundImageURL = get(props, ['user', 'backgroundImage', 'imageURL'])
    this.setState({
      nextImgPreloaded: false, // reset because of new image
      backgroundOption: backgroundOption,
      customImage: customImage,
      backgroundColor: backgroundColor,
      backgroundImageURL: backgroundImageURL
    })
    setBackgroundSettings(backgroundOption,
      customImage, backgroundColor, backgroundImageURL)
  }

  getNewDailyImageIfNeeded (props) {
    if (props.user.backgroundOption !== USER_BACKGROUND_OPTION_DAILY) {
      return
    }

    const shouldChangeBackgroundImg = (
      // FIXME: daily
      moment().utc().diff(
        moment(props.user.backgroundImage.timestamp), 'seconds') > 2
    )

    // Fetch a new background image for today.
    if (shouldChangeBackgroundImg) {
      SetBackgroundDailyImageMutation(
        props.relay.environment,
        props.user.id
      )
    }
  }

  onImgLoad (e) {
    this.setState({
      nextImgPreloaded: true,
      currentlyDisplayedImgURL: this.getImgURL()
    })
  }

  onImgError (e) {
    this.setState({
      imgPreloadError: true
    })
    this.props.showError('We could not load your background image.')
  }

  /**
   * Get the image URL if the user has an image background.
   * @return {String|null} The image URL if one exists, or null
   *   if the user does not have an image background.
   */
  getImgURL () {
    const backgroundOption = this.state.backgroundOption
    switch (backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        return this.state.customImage
      case USER_BACKGROUND_OPTION_PHOTO:
        return this.state.backgroundImageURL
      case USER_BACKGROUND_OPTION_DAILY:
        return this.state.backgroundImageURL
      default:
        return null
    }
  }

  isImgBackground () {
    return [
      USER_BACKGROUND_OPTION_CUSTOM,
      USER_BACKGROUND_OPTION_DAILY,
      USER_BACKGROUND_OPTION_PHOTO
    ].indexOf(this.state.backgroundOption) > -1
  }

  getBackgroundStyle () {
    const defaultStyle = {
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 120px inset',
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
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      zIndex: 'auto'
    }

    var backgroundStyle = {}

    // What we use if a property is missing.
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const backgroundOption = this.state.backgroundOption
    switch (backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        if (this.state.customImage) {
          backgroundStyle = {
            backgroundImage: 'url(' + this.state.customImage + ')'
          }
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
        } else {
          backgroundStyle = styleOnError
        }
        break
      case USER_BACKGROUND_OPTION_DAILY:
        if (this.state.backgroundImageURL) {
          backgroundStyle = {
            backgroundImage: 'url(' + this.state.backgroundImageURL + ')'
          }
        } else {
          backgroundStyle = styleOnError
        }
        break
      default:
        backgroundStyle = {
          backgroundImage: 'none',
          backgroundColor: 'transparent'
        }
        break
    }
    if (this.state.imgPreloadError) {
      backgroundStyle = styleOnError
    }
    return Object.assign({}, defaultStyle, backgroundStyle)
  }

  render () {
    const backgroundStyle = this.getBackgroundStyle()
    const isImgBackground = this.isImgBackground()
    const imgUrl = this.getImgURL()

    // FIXME: React key should not be img URL (need keys for non-img backgrounds too)
    // FIXME: first image can sometimes show before it's rendered; e.g. on a hard
    //   refresh. Need to wait for img load before running animation.
    // FIXME: image fade out delay does not work properly when changing background
    //   settings from a photo to color. Replace with new image fade in delay?

    // For image backgrounds, we use an img element to "preload"
    // the image before displaying the background.
    return (
      <div>
        <FadeBackgroundAnimation>
          <div key={this.state.currentlyDisplayedImgURL} style={backgroundStyle}>
            <div
              data-test-id={'background-tint-overlay'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                zIndex: 'auto',
                // Needs to match shading in extension new tab page.
                backgroundColor: `rgba(0, 0, 0, ${isImgBackground ? 0.15 : 0.03})`
              }} />
          </div>
        </FadeBackgroundAnimation>
        { (isImgBackground && !this.state.nextImgPreloaded)
          ? <img
            style={{display: 'none'}}
            src={imgUrl}
            alt={''}
            onLoad={this.onImgLoad.bind(this)}
            onError={this.onImgError.bind(this)} />
          : null
        }
      </div>
    )
  }
}

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    backgroundOption: PropTypes.string,
    customImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string,
      timestamp: PropTypes.string
    })
  }),
  showError: PropTypes.func,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired
  })
}

UserBackgroundImage.defaultProps = {
  showError: () => {}
}

export default UserBackgroundImage
