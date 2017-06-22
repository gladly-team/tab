import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'material-ui/Toggle'
import WidgetConfig from './WidgetConfigComponent'
import {Card, CardHeader, CardText} from 'material-ui/Card'

import UpdateWidgetEnabledMutation from 'mutations/UpdateWidgetEnabledMutation'
import UpdateWidgetConfigMutation from 'mutations/UpdateWidgetConfigMutation'

class WidgetSettings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      settings: []
    }
  }

  componentDidMount () {
    const { appWidget, widget } = this.props

    var config
    if (widget && widget.config) {
      config = JSON.parse(widget.config)
    }

    const settings = this.getConfig(
      JSON.parse(appWidget.settings),
      config)

    this.setState({
      settings: settings
    })
  }

  getConfig (settings, config) {
    if (!settings.length) { return [] }

    var value
    for (var i = 0; i < settings.length; i++) {
      if (!config || !(settings[i].field in config)) {
        value = settings[i].defaultValue
      } else {
        value = config[settings[i].field]
      }

      settings[i].value = value
    }
    return settings
  }

  onWidgetEnableChange (event, checked) {
    // Call mutation to update widget enabled status.
    const { appWidget, user } = this.props
    UpdateWidgetEnabledMutation.commit(
      this.props.relay.environment,
      user,
      appWidget,
      checked
    )
  }

  onWidgetConfigUpdated (field, value) {
    const { widget, user, appWidget } = this.props
    var widgetConfig = {}
    if (widget) {
      widgetConfig = JSON.parse(widget.config)
    }

    widgetConfig[field] = value

    const strConfig = JSON.stringify(widgetConfig)
    // Call mutation to update widget config.

    UpdateWidgetConfigMutation.commit(
      this.props.relay.environment,
      user,
      appWidget,
      strConfig
    )
  }

  render () {
    const { appWidget, widget } = this.props

    const enabled = widget && widget.enabled
    const settings = this.state.settings || []

    const settingsContainer = {
      display: 'flex',
      flexDirection: 'column'
    }

    const card = {
      marginBottom: 10
    }

    const enableToggle = {
      width: 'initial',
      float: 'right',
      top: 10
    }

    var settingsComponent
    if (settings && settings.length) {
      settingsComponent = (
        <CardText>
          <div style={settingsContainer}>
            {settings.map((setting, index) => {
              return (<WidgetConfig
                key={index}
                setting={setting}
                onConfigUpdated={this.onWidgetConfigUpdated.bind(this)} />)
            })}
          </div>
        </CardText>
      )
    }

    return (
      <Card style={card}>
        <CardHeader
          title={appWidget.name}
          subtitle={appWidget.name}
          actAsExpander={false}
          showExpandableButton={false}>
          <Toggle
            style={enableToggle}
            defaultToggled={enabled}
            onToggle={this.onWidgetEnableChange.bind(this)} />
        </CardHeader>
        {settingsComponent}
      </Card>
    )
  }
}

WidgetSettings.propTypes = {
  widget: PropTypes.object,
  appWidget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default WidgetSettings
