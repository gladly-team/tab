/* eslint-disable */
/* prettier-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { get } from 'lodash/object'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Divider from 'material-ui/Divider'
import { Card, CardHeader } from 'material-ui/Card'

import BackgroundImagePicker from 'js/components/Background/BackgroundImagePickerContainer'
import BackgroundColorPicker from 'js/components/Background/BackgroundColorPickerContainer'
import BackgroundCustomImagePicker from 'js/components/Background/BackgroundCustomImagePickerContainer'
import { cardHeaderTitleStyle, cardHeaderSubtitleStyle } from 'js/theme/default'
import { setBackgroundSettings } from 'js/utils/local-bkg-settings'
import {
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_DAILY,
} from 'js/constants'
import SetBackgroundImageMutation from 'js/mutations/SetBackgroundImageMutation'
import SetBackgroundColorMutation from 'js/mutations/SetBackgroundColorMutation'
import SetBackgroundCustomImageMutation from 'js/mutations/SetBackgroundCustomImageMutation'
import SetBackgroundDailyImageMutation from 'js/mutations/SetBackgroundDailyImageMutation'

class BackgroundSettings extends React.Component {
  constructor(props) {
    super(props)

    this.defaultSelection = USER_BACKGROUND_OPTION_PHOTO

    this.state = {
      selected: props.user.backgroundOption || this.defaultSelection,
    }
  }

  onChange(event, backgroundOption) {
    if (!backgroundOption) {
      return
    }
    this.setState({
      selected: backgroundOption,
    })
    this.updateLocalStorageBackgroundSettings(backgroundOption)

    // We expect each background selection component to call its
    // data callbacks immediately on mount, which will save the
    // user's selection. The daily photo option does not have a
    // selection component, so we update the user's settings here.
    if (backgroundOption === USER_BACKGROUND_OPTION_DAILY) {
      this.onDailyPhotoOptionSelected()
    }
  }

  /**
   * Update localStorage and extension storage with the chosen background
   * settings. If a value is not provided, we use the current value from
   * props.
   * @param {string} backgroundOption - The value of the user's background
   *   option; one of 'custom', 'photo', 'daily', or 'color'
   * @return {undefined}
   */
  updateLocalStorageBackgroundSettings(
    backgroundOption = null,
    customImage = null,
    backgroundColor = null,
    backgroundImageURL = null
  ) {
    setBackgroundSettings(
      backgroundOption || this.props.user.backgroundOption,
      customImage || this.props.user.customImage,
      backgroundColor || this.props.user.backgroundColor,
      backgroundImageURL || this.props.user.backgroundImage.imageURL
    )
  }

  /**
   * Handler for when the user selects a specific background image.
   * Update database and localStorage.
   * @param {Object} image - The image object
   * @param {string} image.id - The image ID
   * @param {string} image.name - The image's display name
   * @param {string} image.imageURL - The image URL
   * @param {string} image.thumbnailURL - The image's thumbnail URL
   * @return {undefined}
   */
  onBackgroundImageSelection(image) {
    SetBackgroundImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      image,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
    this.updateLocalStorageBackgroundSettings(
      USER_BACKGROUND_OPTION_PHOTO,
      null,
      null,
      image.imageURL
    )
  }

  /**
   * Handler for when the user selects a specific color. Update
   * database and localStorage.
   * @param {string} color - The color hex value
   * @return {undefined}
   */
  onBackgroundColorSelection(color) {
    SetBackgroundColorMutation.commit(
      this.props.relay.environment,
      this.props.user,
      color,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
    this.updateLocalStorageBackgroundSettings(
      USER_BACKGROUND_OPTION_COLOR,
      null,
      color,
      null
    )
  }

  /**
   * Handler for when the user selects a specific custom image.
   * Update database and localStorage.
   * @param {string} imgURL - The custom image's URL
   * @return {undefined}
   */
  onCustomImageSelection(imgURL) {
    SetBackgroundCustomImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      imgURL,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
    this.updateLocalStorageBackgroundSettings(
      USER_BACKGROUND_OPTION_CUSTOM,
      imgURL,
      null,
      null
    )
  }

  /**
   * Handler for when the user selects a new photo daily.
   * Update database and localStorage.
   * @return {undefined}
   */
  onDailyPhotoOptionSelected() {
    SetBackgroundDailyImageMutation(
      this.props.relay.environment,
      this.props.user.id,
      data => {
        // Update the image URL in localStorage when the new daily
        // image returns. However, we need to make sure we don't
        // overwrite the value if the user chooses a custom or
        // selected photo before the server responds.
        if (this.state.selected !== USER_BACKGROUND_OPTION_DAILY) {
          return
        }
        const newImgURL = get(
          data,
          'setUserBkgDailyImage.user.backgroundImage.imageURL'
        )
        this.updateLocalStorageBackgroundSettings(
          USER_BACKGROUND_OPTION_DAILY,
          null,
          null,
          newImgURL
        )
      },
      this.onSaveError.bind(this)
    )

    this.updateLocalStorageBackgroundSettings(
      USER_BACKGROUND_OPTION_DAILY,
      null,
      null,
      null
    )
  }

  onSaveSuccess() {}

  onSaveError() {
    this.props.showError(
      'Oops, we are having trouble saving your settings right now :('
    )
  }

  render() {
    throw new Error('Fake BackgroundSettingsComponent error.')

    const { app, user, showError } = this.props
    if (!this.state.selected) {
      return null
    }

    const optionContainer = {
      padding: 10,
    }
    const divider = {
      marginTop: 24,
      marginBottom: 8,
    }
    const radioBtnGroupStyle = {
      marginLeft: 4,
      width: 220,
    }
    const radioBtnStyle = {
      marginBottom: 6,
      fontSize: 14,
    }
    const cardBody = {
      padding: 10,
    }

    var backgroundPicker
    var dividerCmp = <Divider style={divider} />

    // These components display below the radio buttons when
    // an option is selected.
    switch (this.state.selected) {
      case USER_BACKGROUND_OPTION_DAILY:
        dividerCmp = null
        backgroundPicker = null
        break
      case USER_BACKGROUND_OPTION_CUSTOM:
        // We expect this to call `onCustomImageSelection` on mount.
        backgroundPicker = (
          <BackgroundCustomImagePicker
            user={user}
            onCustomImageSelection={this.onCustomImageSelection.bind(this)}
            showError={showError}
          />
        )
        break
      case USER_BACKGROUND_OPTION_COLOR:
        // We expect this to call `onBackgroundColorSelection` on mount.
        backgroundPicker = (
          <BackgroundColorPicker
            user={user}
            onBackgroundColorSelection={this.onBackgroundColorSelection.bind(
              this
            )}
          />
        )
        break
      case USER_BACKGROUND_OPTION_PHOTO:
        // We expect this to call `onBackgroundImageSelection` on mount.
        backgroundPicker = (
          <BackgroundImagePicker
            app={app}
            user={user}
            onBackgroundImageSelection={this.onBackgroundImageSelection.bind(
              this
            )}
          />
        )
        break
      default:
        // Fall back to selecting the photo option.
        backgroundPicker = (
          <BackgroundImagePicker
            app={app}
            user={user}
            onBackgroundImageSelection={this.onBackgroundImageSelection.bind(
              this
            )}
          />
        )
        break
    }

    return (
      <Card style={optionContainer}>
        <Helmet>
          <title>Background Settings</title>
        </Helmet>
        <CardHeader
          title={'Background'}
          titleStyle={cardHeaderTitleStyle}
          subtitleStyle={cardHeaderSubtitleStyle}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <div style={cardBody}>
          <RadioButtonGroup
            style={radioBtnGroupStyle}
            onChange={this.onChange.bind(this)}
            name="photoModes"
            valueSelected={this.state.selected}
          >
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_DAILY}
              label="New photo daily"
            />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_PHOTO}
              label="Selected photo"
            />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_CUSTOM}
              label="Custom photo"
            />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_COLOR}
              label="Color"
            />
          </RadioButtonGroup>
          {dividerCmp}
          {backgroundPicker}
        </div>
      </Card>
    )
  }
}

BackgroundSettings.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    backgroundOption: PropTypes.string,
    customImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string,
    }),
  }),
  showError: PropTypes.func.isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired,
  }),
}

export default BackgroundSettings
