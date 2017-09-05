import React from 'react'
import PropTypes from 'prop-types'

import FadeInAnimation from 'general/FadeInAnimation'
import ErrorMessage from 'general/ErrorMessage'

import { goToDashboard } from 'navigation/navigation'

import Charities from './CharitiesContainer'
import AppBar from 'material-ui/AppBar'

class DonateVc extends React.Component {
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
    const { user, app } = this.props
    if (user.vcCurrent < 1) {
      return (<p>Not enough hearts to donate. :(</p>)
    }
    const errorMessage = this.state.errorMessage
    const main = {
      width: '100%',
      height: '100%'
    }

    return (
      <FadeInAnimation>
        <div
          key={'donate-view-key'}
          style={main}>
          <AppBar
            title='Donate'
            iconClassNameLeft='fa fa-arrow-left'
            onLeftIconButtonTouchTap={this.goToHome.bind(this)}
          />
          <Charities app={app} user={user} showError={this.showError.bind(this)} />
          { errorMessage
            ? <ErrorMessage message={errorMessage}
              onRequestClose={this.clearError.bind(this)} />
            : null }
        </div>
      </FadeInAnimation>
    )
  }
}

DonateVc.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default DonateVc
