import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'material-ui/Toggle'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

class WidgetConfig extends React.Component {
  render() {
    const { setting } = this.props
    switch (setting.type) {
      case 'boolean':
        return (
          <BooleanWidgetConfig
            setting={setting}
            onConfigUpdated={this.props.onConfigUpdated}
          />
        )
      case 'choices':
        return (
          <ChoicesWidgetConfig
            setting={setting}
            onConfigUpdated={this.props.onConfigUpdated}
          />
        )
      default:
        return null
    }
  }
}

WidgetConfig.propTypes = {
  setting: PropTypes.object.isRequired,
  onConfigUpdated: PropTypes.func.isRequired,
}

export default WidgetConfig

class BooleanWidgetConfig extends React.Component {
  onToggle(event, checked) {
    const { setting } = this.props
    this.props.onConfigUpdated(setting.field, checked)
  }

  render() {
    const { setting } = this.props

    const toggleContainerStyle = {
      width: '80%',
      marginLeft: '5%',
      marginRight: '5%',
    }

    return (
      <div style={toggleContainerStyle}>
        <Toggle
          label={setting.display}
          defaultToggled={setting.value}
          onToggle={this.onToggle.bind(this)}
        />
      </div>
    )
  }
}

class ChoicesWidgetConfig extends React.Component {
  onChange(event, value) {
    const { setting } = this.props
    this.props.onConfigUpdated(setting.field, value)
  }

  render() {
    const { setting } = this.props

    const choicesContainerStyle = {
      width: '90%',
      margin: 'auto',
      display: 'flex',
    }
    const settingDisplayStyle = {
      flex: 5,
    }
    const btnGroupStyle = {
      display: 'flex',
      width: 'auto',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    }
    const radioBtnStyle = {
      width: 'auto',
      marginBottom: 6,
      fontSize: 14,
    }

    return (
      <div style={choicesContainerStyle}>
        <span style={settingDisplayStyle}>{setting.display}</span>
        <RadioButtonGroup
          onChange={this.onChange.bind(this)}
          style={btnGroupStyle}
          name={setting.field + '-choices'}
          defaultSelected={setting.value}
        >
          {setting.choices.map((choice, index) => {
            return (
              <RadioButton
                key={index}
                style={radioBtnStyle}
                value={choice}
                label={choice}
              />
            )
          })}
        </RadioButtonGroup>
      </div>
    )
  }
}
