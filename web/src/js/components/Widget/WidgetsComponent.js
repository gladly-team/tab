import React from 'react'
import WidgetIcon from './WidgetIconContainer'
import Widget from './WidgetContainer'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import {
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_SEARCH
} from '../../constants'
import CenteredWidgetsContainer from 'general/CenteredWidgetsContainer'
import SetUserActiveWidgetMutation from 'mutations/SetUserActiveWidgetMutation'
import ActiveWidgetAnimation from './ActiveWidgetAnimation'

class Widgets extends React.Component {
  onWidgetIconClicked (widget) {
    const { user } = this.props

    if (user.activeWidget === widget.id) {
      widget = {
        id: 'no-active-widget'
      }
    }

    SetUserActiveWidgetMutation.commit(
      this.props.relay.environment,
      user,
      widget
    )
  }

  render () {
    const { user } = this.props
    if (!user) {
      return null
    }

    const widgetsContainer = {
      position: 'absolute',
      zIndex: 2,
      top: 5,
      display: 'flex',
      justifyContent: 'flex-start'
    }

    const separator = {
      width: 5
    }

    return (
      <FadeInDashboardAnimation>
        <span>
          <div style={widgetsContainer}>
            <div style={separator} />
            {user.widgets.edges.map((edge, index) => {
              if (edge.node.type === WIDGET_TYPE_SEARCH) {
                return (
                  <Widget
                    key={index}
                    user={user}
                    widget={edge.node}
                    showError={this.props.showError} />
                )
              } else {
                return (<WidgetIcon
                  key={index}
                  widget={edge.node}
                  active={user.activeWidget && edge.node.id === user.activeWidget}
                  onWidgetIconClicked={this.onWidgetIconClicked.bind(this)} />)
              }
            })}
          </div>
          <CenteredWidgetsContainer>
            {user.widgets.edges.map((edge, index) => {
              if (
                edge.node.type === WIDGET_TYPE_CLOCK
              ) {
                return (
                  <Widget
                    key={index}
                    user={user}
                    widget={edge.node}
                    showError={this.props.showError} />
                )
              }
            })}
          </CenteredWidgetsContainer>
          <ActiveWidgetAnimation>
            {user.widgets.edges.map((edge, index) => {
              if (user.activeWidget &&
                  edge.node.id === user.activeWidget) {
                return (
                  <Widget
                    key={index}
                    user={user}
                    widget={edge.node}
                    showError={this.props.showError}
                    />
                )
              }
            })}
          </ActiveWidgetAnimation>
        </span>
      </FadeInDashboardAnimation>
    )
  }
}

Widgets.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    widgets: PropTypes.shape({
      edges: PropTypes.array.isRequired
    }).isRequired,
    activeWidget: PropTypes.string
  }),
  showError: PropTypes.func.isRequired
}

export default Widgets
