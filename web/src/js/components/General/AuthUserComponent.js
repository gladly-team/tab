import React from 'react'
import PropTypes from 'prop-types'
import { getCurrentUser } from 'authentication/user'
import { goToLogin } from 'navigation/navigation'

class AuthUserComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null
    }
  }

  componentWillMount () {
    this.getUser()
  }

  async getUser () {
    const user = await getCurrentUser()
    if (!user || !user.id) {
      goToLogin()
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
