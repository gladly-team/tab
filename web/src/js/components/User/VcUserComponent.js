import React, {Component} from 'react'
import PropTypes from 'prop-types'

class VcUser extends Component {
  render () {
    const { user } = this.props

    const progressContainer = {
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const text = {
      color: 'white',
      textAlign: 'center',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif"
    }

    return (
      <div style={progressContainer}>
        <div style={text}>{user.vcCurrent} <i className='fa fa-heart-o' /> Level {user.level}</div>
      </div>
    )
  }
}

VcUser.propTypes = {
  user: PropTypes.object.isRequired
}

VcUser.defaultProps = {

}

export default VcUser
