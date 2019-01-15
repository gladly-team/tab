import React from 'react'

class BaseContainer extends React.Component {
  render() {
    const root = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
      border: 'none',
    }

    return <div style={root}>{this.props.children}</div>
  }
}

export default BaseContainer
