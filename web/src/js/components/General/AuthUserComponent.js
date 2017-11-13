import React from 'react'
import PropTypes from 'prop-types'
import { getCurrentUser } from 'authentication/user'
import {
  replaceUrl,
  verifyEmailURL,
  enterUsernameURL,
  goToLogin
} from 'navigation/navigation'

class AuthUserComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null
    }
  }

  componentWillMount () {
    this.checkUserAuth()
  }

  async checkUserAuth () {
    const user = await getCurrentUser()
    // User is not logged in.
    if (!user || !user.id) {
      goToLogin()
    // User is logged in but their email is not verified.
    } else if (!user.emailVerified) {
      replaceUrl(verifyEmailURL)
    // User is logged in but has not set a username.
    } else if (!user.username) {
      replaceUrl(enterUsernameURL)
    // User is fully logged in.
    } else {
      this.setState({
        userId: user.id
      })
    }
  }

  render () {
    if (!this.state.userId) {
      return null
    }

    const root = {
      height: '100%',
      width: '100%'
    }

    const childrenWithProps = React.Children.map(this.props.children,
       (child) => React.cloneElement(child, {
         variables: Object.assign({}, this.props.variables, {
           userId: this.state.userId
         })
       })
    )

    return (
      <div style={root}>
        {childrenWithProps}
      </div>
    )
  }
}

AuthUserComponent.propTypes = {
  variables: PropTypes.object
}

AuthUserComponent.defaultProps = {
  variables: {}
}

export default AuthUserComponent
