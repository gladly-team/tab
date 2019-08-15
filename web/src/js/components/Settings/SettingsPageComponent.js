import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'

import ErrorMessage from 'js/components/General/ErrorMessage'
import Logo from 'js/components/Logo/Logo'
import { goToDashboard } from 'js/navigation/navigation'

const styles = theme => ({
  // TODO
})

class SettingsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorOpen: false,
      errorMessage: null,
    }
  }

  goToHome() {
    goToDashboard()
  }

  showError(msg) {
    this.setState({
      errorOpen: true,
      errorMessage: msg,
    })
  }

  clearError() {
    this.setState({
      errorOpen: false,
    })
  }

  render() {
    const { classes, mainContent, sidebarContent } = this.props
    const { errorMessage, errorOpen } = this.state

    // TODO: maybe pass via render props
    // const showError = this.showError

    const sidebarWidth = 240
    return (
      <div
        data-test-id={'app-settings-id'}
        key={'settings-view-key'}
        style={{
          color: '#fff',
          backgroundColor: '#F2F2F2',
          minWidth: '100vw',
          minHeight: '100vh',
        }}
      >
        <AppBar color={'primary'} position={'sticky'}>
          <Toolbar>
            <div style={{ flex: 1 }}>
              <Logo color={'white'} />
            </div>
            <IconButton onClick={this.goToHome.bind(this)}>
              <CloseIcon
                style={{
                  color: '#fff',
                  width: 28,
                  height: 28,
                }}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ width: sidebarWidth, position: 'fixed' }}>
          {sidebarContent}
        </div>
        <div
          style={{
            marginLeft: sidebarWidth,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {mainContent}
        </div>
        <ErrorMessage
          message={errorMessage}
          onClose={this.clearError.bind(this)}
          open={errorOpen}
        />
      </div>
    )
  }
}

SettingsPage.propTypes = {
  mainContent: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SettingsPage)
