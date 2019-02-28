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
  USER_BACKGROUND_OPTION_DAILY,
} from 'js/constants'
import {
  getUserBackgroundOption,
  getUserBackgroundCustomImage,
  getUserBackgroundColor,
  getUserBackgroundImageURL,
  setBackgroundSettings,
} from 'js/utils/local-bkg-settings'
import SetBackgroundDailyImageMutation from 'js/mutations/SetBackgroundDailyImageMutation'
import FadeBackgroundAnimation from 'js/components/Background/FadeBackgroundAnimation'

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
  constructor(props) {
    super(props)
    this.state = {
      // The image we are currently showing (or fading in to show).
      currentlyDisplayedImgURL: null,
      // Whether there was a problem preloading the user's image.
      imgPreloadError: false,
      // Whether we are currently waiting on a response for a
      // request to get a new daily background image.
      currentlyFetchingNewBackgroundImage: false,
      // The user's background settings. They might not reflect what
      // background is currently displayed because we want to fully
      // preload images before displaying them.
      backgroundOption: getUserBackgroundOption(),
      customImage: getUserBackgroundCustomImage(),
      backgroundColor: getUserBackgroundColor(),
      backgroundImageURL: getUserBackgroundImageURL(),
    }
  }

  componentDidMount() {
    this.handlePropChanges(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.handlePropChanges(nextProps)
  }

  handlePropChanges(props) {
    // Update the state, localStorage, and extension
    // background settings if we have all prop data from
    // the server and the props differ from current state.
    if (this.arePropsReady(props)) {
      if (this.arePropsDifferentFromState(props)) {
        this.updateBackgroundSettings(props)
      }

      // See if we should fetch a new daily background image.
      this.getNewDailyImageIfNeeded(props)
    }
  }

  /**
   * Determine if all background data has returned from
   * the server.
   * @return {Boolean} Whether all necessary props are defined
   */
  arePropsReady(props) {
    return (
      has(props, ['user', 'backgroundOption']) &&
      has(props, ['user', 'customImage']) &&
      has(props, ['user', 'backgroundColor']) &&
      has(props, ['user', 'backgroundImage', 'imageURL']) &&
      has(props, ['user', 'backgroundImage', 'timestamp'])
    )
  }

  /**
   * Determine if the props hold background settings that are
   * different from the background settings currently in this
   * component's state.
   * @param {Object} props - The component props, either `this.props`
   *   or the next `this.props` from componentWillReceiveProps
   * @return {Boolean} Whether prop values differ from state values
   */
  arePropsDifferentFromState(props) {
    return (
      get(props, ['user', 'backgroundOption']) !==
        this.state.backgroundOption ||
      get(props, ['user', 'customImage']) !== this.state.customImage ||
      get(props, ['user', 'backgroundColor']) !== this.state.backgroundColor ||
      get(props, ['user', 'backgroundImage', 'imageURL']) !==
        this.state.backgroundImageURL
    )
  }

  /**
   * Update component state and make sure localStorage and the extension's
   * storage are in sync with the latest state. We can't just rely on when the
   * user changes their settings on this device, because the user might
   * change their background on another device or we might otherwise update
   * the values in the database.
   * @param {Object} props - The component props, either `this.props`
   *   or the next `this.props` from componentWillReceiveProps
   * @return {undefined}
   */
  updateBackgroundSettings(props) {
    let backgroundOption = get(props, ['user', 'backgroundOption'])
    let customImage = get(props, ['user', 'customImage'])
    let backgroundColor = get(props, ['user', 'backgroundColor'])
    let backgroundImageURL = get(props, ['user', 'backgroundImage', 'imageURL'])
    this.setState({
      backgroundOption: backgroundOption,
      customImage: customImage,
      backgroundColor: backgroundColor,
      backgroundImageURL: backgroundImageURL,
    })

    // Update in localStorage and extension storage.
    setBackgroundSettings(
      backgroundOption,
      customImage,
      backgroundColor,
      backgroundImageURL
    )
  }

  /**
   * If the user's background settings are to show a new photo daily,
   * determine if it's a new day and the photo needs to be updated.
   * If so, fetch a new background photo.
   * @param {Object} props - The component props, either `this.props`
   *   or the next `this.props` from componentWillReceiveProps. We
   *   can't assume that `props.user` will be defined.
   * @return {undefined}
   */
  getNewDailyImageIfNeeded(props) {
    if (
      get(props, ['user', 'backgroundOption']) !== USER_BACKGROUND_OPTION_DAILY
    ) {
      return
    }
    const lastTimeBackgroundImgChanged = get(props, [
      'user',
      'backgroundImage',
      'timestamp',
    ])
    if (isNil(lastTimeBackgroundImgChanged)) {
      return
    }

    const shouldChangeBackgroundImg =
      !this.state.currentlyFetchingNewBackgroundImage &&
      // Check if today is a different day (in local time) than
      // the last time the background image changed.
      !moment()
        .local()
        .startOf('day')
        .isSame(
          moment(lastTimeBackgroundImgChanged)
            .local()
            .startOf('day')
        )

    this.setState({
      currentlyFetchingNewBackgroundImage: true,
    })

    // Fetch a new background image for today.
    if (shouldChangeBackgroundImg) {
      SetBackgroundDailyImageMutation(
        props.relay.environment,
        props.user.id,
        // When the request returns, unmark that a request
        // is outstanding.
        () => {
          this.setState({
            currentlyFetchingNewBackgroundImage: false,
          })
        },
        () => {
          this.setState({
            currentlyFetchingNewBackgroundImage: false,
          })
        }
      )
    }
  }

  /**
   * Handler for when the preloaded background image has loaded.
   * @return {undefined}
   */
  onImgLoad() {
    this.setState({
      currentlyDisplayedImgURL: this.getImgURL(),
    })
  }

  /**
   * Handler for when the preloaded background image fails to
   * load and throws an error.
   * @return {undefined}
   */
  onImgError() {
    this.setState({
      imgPreloadError: true,
    })
    this.props.showError('We could not load your background image.')
  }

  /**
   * Get the image URL if the user has an image background. Note:
   * this is the user's current setting but not necessarily the image
   * we are currently displaying, because we'll wait to preload the
   * image first.
   * @return {String|null} The image URL if one exists, or null
   *   if the user does not have an image background.
   */
  getImgURL() {
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

  /**
   * Return whether the user has a photo/image background (e.g.
   * not a color background).
   * @return {Boolean} Whether the user's background setting is
   *   for a photo background.
   */
  isImgBackground() {
    return (
      [
        USER_BACKGROUND_OPTION_CUSTOM,
        USER_BACKGROUND_OPTION_DAILY,
        USER_BACKGROUND_OPTION_PHOTO,
      ].indexOf(this.state.backgroundOption) > -1
    )
  }

  render() {
    const isImgBackground = this.isImgBackground()
    const newestImgURL = this.getImgURL()

    // Construct the style for the background element.
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
      zIndex: 'auto',
    }
    var backgroundStyle = {}
    var invalidBackgroundSettings = false
    const backgroundOption = this.state.backgroundOption
    const currentlyDisplayedImgURL = this.state.currentlyDisplayedImgURL
    switch (backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        if (this.state.customImage) {
          backgroundStyle = {
            backgroundImage: `url(${currentlyDisplayedImgURL})`,
          }
        } else {
          invalidBackgroundSettings = true
        }
        break
      case USER_BACKGROUND_OPTION_COLOR:
        if (this.state.backgroundColor) {
          backgroundStyle = {
            backgroundColor: this.state.backgroundColor,
          }
        } else {
          invalidBackgroundSettings = true
        }
        break
      case USER_BACKGROUND_OPTION_PHOTO:
        if (this.state.backgroundImageURL) {
          backgroundStyle = {
            backgroundImage: `url(${currentlyDisplayedImgURL})`,
          }
        } else {
          invalidBackgroundSettings = true
        }
        break
      case USER_BACKGROUND_OPTION_DAILY:
        if (this.state.backgroundImageURL) {
          backgroundStyle = {
            backgroundImage: `url(${currentlyDisplayedImgURL})`,
          }
        } else {
          invalidBackgroundSettings = true
        }
        break
      default:
        backgroundStyle = {
          backgroundImage: 'none',
          backgroundColor: 'transparent',
        }
        break
    }

    // The fallback style if there's an error.
    if (this.state.imgPreloadError || invalidBackgroundSettings) {
      backgroundStyle = {
        backgroundColor: '#4a90e2',
      }
    }
    const finalBackgroundStyle = Object.assign(
      {},
      defaultStyle,
      backgroundStyle
    )

    // React key for the background element
    var backgroundKey = ``
    if (isImgBackground) {
      backgroundKey = `img-${this.state.currentlyDisplayedImgURL}`
    } else {
      backgroundKey = `color-${this.state.backgroundColor}`
    }

    // Only show image backgrounds if the image has already loaded.
    // Immediately show color backgrounds and the fallback background for
    // when images fail to load.
    var showBackground
    if (invalidBackgroundSettings || this.state.imgPreloadError) {
      showBackground = true
    } else if (isImgBackground && !this.state.currentlyDisplayedImgURL) {
      showBackground = false
    } else {
      showBackground = true
    }

    // For image backgrounds, we use an img element to "preload"
    // the image before displaying the background.
    // Note: if the props return a different image URL than what's
    // in localStorage, it's possible for the old and new images to
    // fade in at the same time (which doesn't look good). We should
    // handle this with a callback from the animated components
    // when they're done animating to prevent two at the same time,
    // but react-transition-group only supports this in v2. For now,
    // we've slightly delayed the CSS "enter" transition for new
    // images.
    return (
      <div>
        {showBackground ? (
          <FadeBackgroundAnimation>
            <div
              key={backgroundKey}
              style={finalBackgroundStyle}
              data-test-id={'dashboard-background-img'}
            >
              <div
                data-test-id={'background-tint-overlay'}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  zIndex: 'auto',
                  // Needs to match shading in extension new tab page.
                  backgroundColor: `rgba(0, 0, 0, ${
                    isImgBackground ? 0.15 : 0.03
                  })`,
                }}
              />
            </div>
          </FadeBackgroundAnimation>
        ) : null}
        {isImgBackground ? (
          <img
            style={{ display: 'none' }}
            src={newestImgURL}
            alt={''}
            onLoad={this.onImgLoad.bind(this)}
            onError={this.onImgError.bind(this)}
          />
        ) : null}
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
      timestamp: PropTypes.string,
    }),
  }),
  showError: PropTypes.func,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired,
  }),
}

UserBackgroundImage.defaultProps = {
  showError: () => {},
}

export default UserBackgroundImage
