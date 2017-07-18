import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Forward from 'material-ui/svg-icons/content/forward'

class AuthActionButtom extends React.Component {
  onClicked () {
    if (!this.props.loading) {
      this.props.onClicked()
    }
  }

  render () {
    const iconStyles = {
      color: '#FFF',
      position: 'relative',
      top: -3
    }

    const labelStyle = {
      position: 'relative',
      top: -3
    }

    const loginBtn = {
      color: '#FFF',
      border: '1px solid #FFF'
    }

    var loginIcon = (<Forward style={iconStyles} />)
    if (this.props.loading) {
      loginIcon = (<FontIcon
        className='fa fa-spinner fa-pulse fa-3x fa-fw'
        style={iconStyles} />)
    }

    return (
      <div style={this.props.containerStyle}>
        <FlatButton
          id={this.props.btnId}
          label={this.props.label}
          style={loginBtn}
          labelPosition='before'
          labelStyle={labelStyle}
          icon={loginIcon}
          onClick={this.onClicked.bind(this)} />
      </div>
    )
  }
}

AuthActionButtom.propTypes = {
  containerStyle: PropTypes.object,
  btnId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onClicked: PropTypes.func.isRequired
}

AuthActionButtom.defaultProps = {
  containerStyle: {}
}

export default AuthActionButtom
