import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import { Card, CardHeader } from 'material-ui/Card'
import {
  cardHeaderTitleStyle,
  cardHeaderSubtitleStyle
} from 'theme/default'

class Account extends React.Component {
  render () {
    const { user } = this.props
    const dividerStyle = {
      marginTop: 24,
      marginBottom: 8
    }
    return (
      <Card
        style={{ padding: 10 }}>
        <CardHeader
          title={'Account'}
          titleStyle={cardHeaderTitleStyle}
          subtitleStyle={cardHeaderSubtitleStyle}
          actAsExpander={false}
          showExpandableButton={false} />
        <div
          style={{
            padding: 10
          }}>
          <div>{user.email}</div>
          <Divider style={dividerStyle} />
          <div>{user.username}</div>
        </div>
      </Card>
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
