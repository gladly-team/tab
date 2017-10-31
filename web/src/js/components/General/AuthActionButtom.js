import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Forward from 'material-ui/svg-icons/content/forward'

class AuthActionButtom extends React.Component {
  onClicked () {
    if (!this.props.loading) {
      this.props.onClicked()
    }
  }

  render () {
    var loginIcon = (
      <Forward
        style={{
          marginTop: -3,
          marginRight: 8,
          width: 30
        }}
      />
    )
    if (this.props.loading) {
      loginIcon = (
        <CircularProgress
          color={'#FFF'}
          size={18}
          style={{
            width: 30,
            height: 30,
            marginTop: -3,
            marginRight: 8
          }}
          innerStyle={{
            width: 30,
            height: 30
          }}
        />
      )
    }

    return (
      <div style={this.props.containerStyle}>
        <FlatButton
          id={this.props.btnId}
          label={this.props.label}
          style={{
            color: '#FFF',
            border: '1px solid #FFF',
            display: 'flex',
            alignItems: 'center'
          }}
          labelPosition='before'
          labelStyle={{
            display: 'inline-block',
            marginTop: -3
          }}
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
