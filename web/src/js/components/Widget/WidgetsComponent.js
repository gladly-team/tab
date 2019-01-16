import React from 'react'
import WidgetIcon from 'js/components/Widget/WidgetIconContainer'
import Widget from 'js/components/Widget/WidgetContainer'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import { WIDGET_TYPE_CLOCK, WIDGET_TYPE_SEARCH } from 'js/constants'
import CenteredWidgetsContainer from 'js/components/General/CenteredWidgetsContainer'
import SetUserActiveWidgetMutation from 'js/mutations/SetUserActiveWidgetMutation'
import ActiveWidgetAnimation from 'js/components/Widget/ActiveWidgetAnimation'

class Widgets extends React.Component {
  onWidgetIconClicked(widget) {
    const { user } = this.props

    if (user.activeWidget === widget.id) {
      widget = {
        id: 'no-active-widget',
      }
    }

    SetUserActiveWidgetMutation.commit(
      this.props.relay.environment,
      user,
      widget
    )
  }

  render() {
    const { user, isCampaignLive } = this.props
    if (!user) {
      return null
    }

    const widgetsContainer = {
      position: 'absolute',
      zIndex: 2,
      top: 5,
      display: 'flex',
      justifyContent: 'flex-start',
    }

    const separator = {
      width: 5,
    }

    return (
      <FadeInDashboardAnimation>
        <span>
          <div style={widgetsContainer} data-tour-id={'widgets'}>
            <div style={separator} />
            {user.widgets.edges.map((edge, index) => {
              if (edge.node.type === WIDGET_TYPE_SEARCH) {
                return (
                  <Widget
                    key={index}
                    user={user}
                    widget={edge.node}
                    showError={this.props.showError}
                  />
                )
              } else {
                return (
                  <WidgetIcon
                    key={index}
                    widget={edge.node}
                    active={
                      user.activeWidget && edge.node.id === user.activeWidget
                    }
                    onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}
                  />
                )
              }
            })}
          </div>
          {isCampaignLive ? null : (
            <CenteredWidgetsContainer>
              {// eslint-disable-next-line array-callback-return
              user.widgets.edges.map((edge, index) => {
                if (edge.node.type === WIDGET_TYPE_CLOCK) {
                  return (
                    <Widget
                      key={index}
                      user={user}
                      widget={edge.node}
                      data-test-id={'widget-clock'}
                      showError={this.props.showError}
                    />
                  )
                }
              })}
            </CenteredWidgetsContainer>
          )}
          <FadeInDashboardAnimation>
            <ActiveWidgetAnimation>
              {// eslint-disable-next-line array-callback-return
              user.widgets.edges.map((edge, index) => {
                if (user.activeWidget && edge.node.id === user.activeWidget) {
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
          </FadeInDashboardAnimation>
        </span>
      </FadeInDashboardAnimation>
    )
  }
}

Widgets.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    widgets: PropTypes.shape({
      edges: PropTypes.array.isRequired,
    }).isRequired,
    activeWidget: PropTypes.string,
  }),
  isCampaignLive: PropTypes.bool,
  showError: PropTypes.func.isRequired,
}

Widgets.defaultProps = {
  isCampaignLive: false,
}

export default Widgets
