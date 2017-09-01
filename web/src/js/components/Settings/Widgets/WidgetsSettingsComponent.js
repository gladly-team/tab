import React from 'react'
import PropTypes from 'prop-types'
import WidgetSettings from './WidgetSettingsContainer'

import FadeInAnimation from 'general/FadeInAnimation'

import {List} from 'material-ui/List'
import FullScreenProgress from 'general/FullScreenProgress'

class WidgetsSettings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userWidgets: null
    }
  }

  componentDidMount () {
    const { user } = this.props

    const userWidgets = {}
    var node

    for (var index in user.widgets.edges) {
      node = user.widgets.edges[index].node
      userWidgets[node.name] = node
    }

    this.setState({
      userWidgets: userWidgets
    })
  }

  render () {
    const { user, app, showError } = this.props

    const container = {
      marginLeft: 256,
      marginRight: 'auto',
      padding: 20
    }

    // We need to wait for the
    // userWidgetsMap to be created before
    // mounting the WidgetSettings.
    if (!this.state.userWidgets) {
      return (<FullScreenProgress />)
    }

    const self = this
    return (
      <FadeInAnimation>
        <div
          key={'widgets-settings-container-key'}
          style={container}>
          <List>
            {app.widgets.edges.map((edge, index) => {
              return (<WidgetSettings
                key={index}
                user={user}
                appWidget={edge.node}
                widget={self.state.userWidgets[edge.node.name]}
                showError={showError} />)
            })}
          </List>
        </div>
      </FadeInAnimation>
    )
  }
}

WidgetsSettings.propTypes = {
  user: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default WidgetsSettings
