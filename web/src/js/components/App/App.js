import React from 'react'
import AppView from './AppView'

class App extends React.Component {
  render () {
    const root = {
      height: '100vh'
    }

    const style = {
      height: 0,
      width: 0,
      display: 'none'
    }

    return (
      <div style={root}>
        {this.props.children}
        <div style={style}>
          <AppView />
        </div>
      </div>
    )
  }
}

export default App
