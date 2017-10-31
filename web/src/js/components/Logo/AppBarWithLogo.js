
import React from 'react'
import AppBar from 'material-ui/AppBar'
import LogoWithText from '../Logo/LogoWithText'
import {
  appBarLightColor
} from 'theme/default'

class AppBarWithLogo extends React.Component {
  render () {
    return (
      <AppBar
        style={{
          background: appBarLightColor
        }}
        iconElementLeft={
          <LogoWithText
            style={{
              height: 34,
              margin: 8
            }}
          />
        }
        {...this.props}
      />
    )
  }
}

export default AppBarWithLogo
