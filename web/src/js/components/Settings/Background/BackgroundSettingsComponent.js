import React from 'react'
import PropTypes from 'prop-types'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import Divider from 'material-ui/Divider'
import {Card, CardHeader} from 'material-ui/Card'

import BackgroundImagePicker from '../../Background/BackgroundImagePickerContainer'
import BackgroundColorPicker from '../../Background/BackgroundColorPickerContainer'
import BackgroundCustomImagePicker from '../../Background/BackgroundCustomImagePickerContainer'
import BackgroundDailyImage from '../../Background/BackgroundDailyImageContainer'
import {
  cardHeaderTitleStyle,
  cardHeaderSubtitleStyle
} from 'theme/default'
import {
  setBackgroundSettings
} from 'utils/local-bkg-settings'
import {
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_PHOTO,
  USER_BACKGROUND_OPTION_DAILY
} from '../../../constants'

class BackgroundSettings extends React.Component {
  constructor (props) {
    super(props)

    this.defaultSelection = USER_BACKGROUND_OPTION_PHOTO

    this.state = {
      selected: props.user.backgroundOption || this.defaultSelection
    }
  }

  onChange (event, value) {
    if (!value) { return }

    this.setState({
      selected: value
    })

    this.updateLocalStorageBackgroundSettings(value)
  }

  updateLocalStorageBackgroundSettings (backgroundOption) {
    // FIXME: this only updates background option locally, but we
    // need to update the rest of the properties
    setBackgroundSettings(
      backgroundOption,
      this.props.user.customImage,
      this.props.user.backgroundColor,
      this.props.user.backgroundImage.imageURL
    )
  }

  render () {
    const { app, user, showError } = this.props
    if (!this.state.selected) { return null }

    const optionContainer = {
      padding: 10
    }
    const divider = {
      marginTop: 24,
      marginBottom: 8
    }
    const radioBtnGroupStyle = {
      marginLeft: 4,
      width: 220
    }
    const radioBtnStyle = {
      marginBottom: 6,
      fontSize: 14
    }
    const cardBody = {
      padding: 10
    }

    var selectedOption
    var dividerCmp = (<Divider style={divider} />)

    // These components display below the radio buttons when
    // an option is selected. They are responsible for
    // calling a mutation to update the user's selection.
    // TODO: cleaner to move the data/mutation logic up to this
    // component and just have children handle presentation.
    switch (this.state.selected) {
      case USER_BACKGROUND_OPTION_DAILY:
        dividerCmp = null
        selectedOption = (
          <BackgroundDailyImage
            user={user}
            updateOnMount={user.backgroundOption !== USER_BACKGROUND_OPTION_DAILY}
            showError={showError} />
        )
        break
      case USER_BACKGROUND_OPTION_CUSTOM:
        selectedOption = (
          <BackgroundCustomImagePicker user={user} showError={showError} />)
        break
      case USER_BACKGROUND_OPTION_COLOR:
        selectedOption = (
          <BackgroundColorPicker user={user} showError={showError} />)
        break
      case USER_BACKGROUND_OPTION_PHOTO:
        selectedOption = (
          <BackgroundImagePicker
            app={app} user={user} showError={showError} />
        )
        break
      default:
        break
    }

    return (
      <Card
        style={optionContainer}>
        <CardHeader
          title={'Background'}
          // subtitle={'Choose the background for your new tab page'}
          titleStyle={cardHeaderTitleStyle}
          subtitleStyle={cardHeaderSubtitleStyle}
          actAsExpander={false}
          showExpandableButton={false} />
        <div style={cardBody}>
          <RadioButtonGroup
            style={radioBtnGroupStyle}
            onChange={this.onChange.bind(this)}
            name='photoModes'
            valueSelected={this.state.selected}>
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_DAILY}
              label='New photo daily' />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_PHOTO}
              label='Selected photo' />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_CUSTOM}
              label='Custom photo' />
            <RadioButton
              style={radioBtnStyle}
              value={USER_BACKGROUND_OPTION_COLOR}
              label='Color' />
          </RadioButtonGroup>
          {dividerCmp}
          {selectedOption}
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
      imageURL: PropTypes.string
    })
  }),
  showError: PropTypes.func.isRequired
}

export default BackgroundSettings
