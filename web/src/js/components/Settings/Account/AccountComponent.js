import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

const AccountItem = (props) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: 20
  }}
  >
    <Typography variant={'body2'} style={{ flex: 1 }}>{props.name}</Typography>
    <Typography variant={'body1'} style={{ flex: 2 }}>{props.value}</Typography>
  </div>
)

AccountItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

class Account extends React.Component {
  render () {
    const { user } = this.props
    return (
      <Paper>
        <Typography variant={'headline'} style={{ padding: 20 }}>
          Account
        </Typography>
        <Divider />
        <AccountItem name={'Username'} value={user.username} />
        <Divider />
        <AccountItem name={'Email'} value={user.email} />
      </Paper>
    )
  }
}

Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  })
}

export default Account
