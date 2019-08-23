import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import WidgetSettings from 'js/components/Settings/Widgets/WidgetSettingsContainer'

class WidgetsSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userWidgets: null,
    }
  }

  componentDidMount() {
    const { user } = this.props

    const userWidgets = {}
    var node

    for (var index in user.widgets.edges) {
      node = user.widgets.edges[index].node
      userWidgets[node.name] = node
    }

    this.setState({
      userWidgets: userWidgets,
    })
  }

  render() {
    const { user, app, showError } = this.props

    // We need to wait for the
    // userWidgetsMap to be created before
    // mounting the WidgetSettings.
    if (!this.state.userWidgets) {
      return null
    }

    const self = this
    return (
      <div style={{ paddingTop: 0 }}>
        <Helmet>
          <title>Widget Settings</title>
        </Helmet>
        {app.widgets.edges.map((edge, index) => {
          return (
            <WidgetSettings
              key={index}
              user={user}
              appWidget={edge.node}
              widget={self.state.userWidgets[edge.node.name] || null}
              showError={showError}
            />
          )
        })}
      </div>
    )
  }
}

WidgetsSettings.propTypes = {
  user: PropTypes.shape({
    widgets: PropTypes.shape({
      edges: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  app: PropTypes.shape({
    widgets: PropTypes.shape({
      edges: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  showError: PropTypes.func.isRequired,
}

export default WidgetsSettings
