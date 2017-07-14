import React from 'react'
import SignUp from './SignUp'
import SignIn from './SignIn'
import { getCurrentUser, login } from '../../utils/cognito-auth'
import { goToDashboard } from 'navigation/navigation'
import SlideFromRightAnimation from 'general/SlideFromRightAnimation'
import SlideFromLeftAnimation from 'general/SlideFromLeftAnimation'
import { getUserCredentials } from '../../utils/tfac-mgr'
import appTheme from 'theme/default'
import FlatButton from 'material-ui/FlatButton'
import logoHeader from 'assets/logos/tfc-title-white.png'

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
    var backgroundColor = '#7C4DFF'
    var goToViewName = 'REGISTER'
    var goToView = 'signUp'
    var currentState
    if (this.state.view === 'signIn') {
      goToViewName = 'REGISTER'
      goToView = 'signUp'
      currentState = (
        <SlideFromLeftAnimation
          enterAnimationTimeout={0}
          leaveAnimationTimeout={0}
          enter={this.state.enter}>
          <SignIn />
        </SlideFromLeftAnimation>)
    }

    if (this.state.view === 'signUp') {
      goToViewName = 'LOGIN'
      goToView = 'signIn'
      currentState = (
        <SlideFromRightAnimation
          enterAnimationTimeout={0}
          leaveAnimationTimeout={0}
          enter={this.state.enter}>
          <SignUp />
        </SlideFromRightAnimation>)
    }

    const root = {
      height: '100%',
      width: '100%',
      backgroundColor: backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }

    const header = {
      position: 'absolute',
      top: 100
    }

    const main = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const navigation = {
      position: 'absolute',
      top: 10,
      right: 10,
      color: appTheme.palette.alternateTextColor
    }

    return (
      <div
        style={root}>
        <img style={header} src={logoHeader} />
        <FlatButton
          style={navigation}
          label={goToViewName}
          onClick={this.navigateTo.bind(this, goToView)} />
        <div style={main}>
          {currentState}
        </div>
      </div>
    )
  }
}

export default Authentication
