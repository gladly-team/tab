import React from 'react'

class App extends React.Component {
  render () {
    const root = {
      width: '100vw',
      height: '100vh',
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

export default App
