import React from 'react'
import withPageviewTracking from 'analytics/withPageviewTracking'

class App extends React.Component {
  render () {
    const root = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      border: 'none'
    }

    return (
      <div style={root}>
        {this.props.children}
      </div>
    )
  }
}

export default withPageviewTracking(App)
