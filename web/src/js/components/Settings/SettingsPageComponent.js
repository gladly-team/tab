import React from 'react'
import PropTypes from 'prop-types'
import FadeInAnimation from 'general/FadeInAnimation'
import ErrorMessage from 'general/ErrorMessage'
import {
  goToDashboard
} from 'navigation/navigation'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'

class SettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: null
    }
  }

  goToHome () {
    goToDashboard()
  }

  showError (msg) {
    this.setState({
      errorMessage: msg
    })
  }

  clearError () {
    this.showError(null)
  }

  render () {
    const containerStyle = {
      backgroundColor: '#F2F2F2',
      width: '100%',
      height: '100%'
    }
    const childContainerStyle = {
      backgroundColor: '#F2F2F2',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center'
    }
    const menuItemBottomStyle = {
      position: 'absolute',
      bottom: 0,
      left: 0
    }
    const showError = this.showError
    const errorMessage = this.state.errorMessage

    return (
      <FadeInAnimation>
        <div
          data-test-id={'app-settings-id'}
          key={'settings-view-key'}
          style={containerStyle}>
          <AppBar
            title='Settings'
            iconClassNameLeft='fa fa-arrow-left'
            onLeftIconButtonTouchTap={this.goToHome.bind(this)} />
          <Drawer>
            <AppBar
              title={this.props.title}
              iconClassNameLeft='fa fa-arrow-left'
              onLeftIconButtonTouchTap={this.goToHome.bind(this)} />
            { this.props.menuItems }
            { this.props.menuItemBottom
              ? (
                <div style={menuItemBottomStyle}>
                  {this.props.menuItemBottom}
                </div>
                )
              : null
            }
          </Drawer>
          <div style={childContainerStyle}>
            {React.Children.map(
              this.props.children,
              (child) => React.cloneElement(child, {
                showError: showError.bind(this)
              })
            )}
          </div>
          { errorMessage
            ? <ErrorMessage message={errorMessage}
              onRequestClose={this.clearError.bind(this)} />
            : null }
        </div>
      </FadeInAnimation>
    )
  }
}

SettingsPage.propTypes = {
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.element).isRequired,
  menuItemBottom: PropTypes.element
}

export default SettingsPage
