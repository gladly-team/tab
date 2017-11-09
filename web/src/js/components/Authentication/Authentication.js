import React from 'react'
import SignUp from './SignUp'
import SignIn from './SignIn'
import { getCurrentUser, login } from '../../utils/cognito-auth'
import { goToDashboard } from 'navigation/navigation'
import SlideFromRightAnimation from 'general/SlideFromRightAnimation'
import SlideFromLeftAnimation from 'general/SlideFromLeftAnimation'
import { getUserCredentials } from '../../utils/tfac-mgr'
import FlatButton from 'material-ui/FlatButton'
import AppBarWithLogo from '../Logo/AppBarWithLogo'
import {
  primaryColor
} from 'theme/default'

class Authentication extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      view: 'signIn',
      enter: true
    }
  }

  componentDidMount () {
    getCurrentUser((user) => {
      if (user && user.sub) {
        goToDashboard()
      }

      // Auto login from migration.
      // this.tryToLoginWithTfac();
    })
  }

  // Auto login from migration.
  tryToLoginWithTfac () {
    getUserCredentials()
      .then(user => {
        login(user.email, user.password, (res) => {
          goToDashboard()
        }, (err) => {
          console.log(err)
        })
      })
  }

  navigateTo (view) {
    this.setState({
      view: this.state.view,
      enter: false
    })
    setTimeout(() => {
      this.setState({
        view: view,
        enter: true
      })
    }, 500)
  }

  render () {
    var goToViewName = 'SIGN UP'
    var goToView = 'signUp'
    var currentState
    if (this.state.view === 'signIn') {
      goToViewName = 'SIGN UP'
      goToView = 'signUp'
      currentState = (
        <SlideFromLeftAnimation
          enterAnimationTimeout={0}
          leaveAnimationTimeout={0}
          enter={this.state.enter}>
          <SignIn />
        </SlideFromLeftAnimation>
      )
    }

    if (this.state.view === 'signUp') {
      goToViewName = 'LOG IN'
      goToView = 'signIn'
      currentState = (
        <SlideFromRightAnimation
          enterAnimationTimeout={0}
          leaveAnimationTimeout={0}
          enter={this.state.enter}>
          <SignUp />
        </SlideFromRightAnimation>
      )
    }

    const rootStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      width: '100%',
      backgroundColor: primaryColor
    }
    const contentStyle = {
      display: 'flex',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100
    }

    return (
      <span style={rootStyle}>
        <AppBarWithLogo
          iconElementRight={
            <FlatButton
              id={'toggle-auth-views-btn-id'}
              style={{
                color: primaryColor
              }}
              label={goToViewName}
              onClick={this.navigateTo.bind(this, goToView)}
            />
          }
        />
        <div style={contentStyle}>
          {currentState}
        </div>
      </span>
    )
  }
}

export default Authentication
