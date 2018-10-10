import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'material-ui/Toggle'
import WidgetConfig from 'js/components/Settings/Widgets/WidgetConfigComponent'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import {
  cardHeaderTitleStyle
} from 'js/theme/default'
import { getWidgetIconFromWidgetType } from 'js/components/Widget/widget-utils'

import UpdateWidgetEnabledMutation from 'js/mutations/UpdateWidgetEnabledMutation'
import UpdateWidgetConfigMutation from 'js/mutations/UpdateWidgetConfigMutation'

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

  onSettingsSave () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your settings right now :(')
  }

  onWidgetEnableChange (event, checked) {
    // Call mutation to update widget enabled status.
    const { appWidget, user } = this.props
    UpdateWidgetEnabledMutation.commit(
      this.props.relay.environment,
      user,
      appWidget,
      checked,
      this.onSettingsSave.bind(this),
      this.onSaveError.bind(this)
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
      strConfig,
      this.onSettingsSave.bind(this),
      this.onSaveError.bind(this)
    )
  }

  render () {
    const { appWidget, widget } = this.props
    const enabled = widget && widget.enabled
    const settings = this.state.settings || []

    const cardStyle = {
      marginBottom: 10
    }
    const enableToggleStyle = {
      width: 'initial',
      marginRight: 10
    }
    const cardHeaderStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
    const cardTitleStyle = Object.assign({}, cardHeaderTitleStyle, {
      fontSize: 16
    })
    const settingsContainerStyle = {
      display: 'flex',
      flexDirection: 'column'
    }
    var settingsComponent
    if (settings && settings.length) {
      settingsComponent = (
        <CardText>
          <div style={settingsContainerStyle}>
            {settings.map((setting, index) => {
              return (
                <WidgetConfig
                  key={index}
                  setting={setting}
                  onConfigUpdated={this.onWidgetConfigUpdated.bind(this)}
                />
              )
            })}
          </div>
        </CardText>
      )
    }

    const WidgetIcon = getWidgetIconFromWidgetType(appWidget.type)

    return (
      <Card style={cardStyle}>
        <CardHeader
          style={cardHeaderStyle}
          title={
            <span
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <WidgetIcon
                style={{
                  height: 18,
                  width: 18,
                  marginRight: 8
                }}
              />
              {appWidget.name}
            </span>
          }
          titleStyle={cardTitleStyle}
          actAsExpander={false}
          showExpandableButton={false}>
          <Toggle
            style={enableToggleStyle}
            defaultToggled={enabled}
            onToggle={this.onWidgetEnableChange.bind(this)} />
        </CardHeader>
        {settingsComponent}
      </Card>
    )
  }
}

WidgetSettings.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    config: PropTypes.string,
    settings: PropTypes.string
  }),
  appWidget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    settings: PropTypes.string
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  showError: PropTypes.func.isRequired
}

export default WidgetSettings
