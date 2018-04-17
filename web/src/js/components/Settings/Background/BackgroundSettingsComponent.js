import React from 'react'
import PropTypes from 'prop-types'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import Divider from 'material-ui/Divider'
import {Card, CardHeader} from 'material-ui/Card'

import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import BackgroundImagePicker from '../../Background/BackgroundImagePickerContainer'
import BackgroundColorPicker from '../../Background/BackgroundColorPickerContainer'
import BackgroundCustomImagePicker from '../../Background/BackgroundCustomImagePickerContainer'
import BackgroundDailyImage from '../../Background/BackgroundDailyImageContainer'
import {
  cardHeaderTitleStyle,
  cardHeaderSubtitleStyle
} from 'theme/default'

class BackgroundSettings extends React.Component {
  constructor (props) {
    super(props)

    this.defaultSelection = 'photo'

    this.state = {
      selected: null
    }
  }

  componentWillMount () {
    const { user } = this.props
    this.setState({
      selected: user.backgroundOption || this.defaultSelection
    })
  }

  onChange (event, value) {
    if (!value) { return }

    this.setState({
      selected: value
    })
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
    switch (this.state.selected) {
      case 'daily':
        dividerCmp = null
        selectedOption = (
          <BackgroundDailyImage
            user={user}
            updateOnMount={user.backgroundOption !== 'daily'}
            showError={showError} />
        )
        break
      case 'custom':
        selectedOption = (
          <BackgroundCustomImagePicker user={user} showError={showError} />)
        break
      case 'color':
        selectedOption = (
          <BackgroundColorPicker user={user} showError={showError} />)
        break
      case 'photo':
        selectedOption = (
          <BackgroundImagePicker
            app={app} user={user} showError={showError} />
        )
        break
      default:
        break
    }

    return (
      <SettingsChildWrapper>
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
                value='photo'
                label='Selected photo' />
              <RadioButton
                style={radioBtnStyle}
                value='custom'
                label='Custom photo' />
              <RadioButton
                style={radioBtnStyle}
                value='color'
                label='Color' />
            </RadioButtonGroup>
            {dividerCmp}
            {selectedOption}
          </div>
        </Card>
      </SettingsChildWrapper>
    )
  }
}

BackgroundSettings.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default BackgroundSettings
