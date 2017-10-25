import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardHeader} from 'material-ui/Card'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'

class ProfileStats extends React.Component {
  render () {
    const { user } = this.props
    const containerStyle = {
      padding: 10
    }
    const cardBody = {
      padding: 10
    }

    return (
      <SettingsChildWrapper>
        <Card
          style={containerStyle}>
          <CardHeader
            title={'Your Stats'}
            subtitle={'Your Tabbing stats'}
            actAsExpander={false}
            showExpandableButton={false} />
          <div style={cardBody}>
            Stats go here: user ID {user.id}
            <div>User joined: {user.joined}</div>
            <div>User tabs all time: {user.tabs}</div>
          </div>
        </Card>
      </SettingsChildWrapper>
    )
  }
}

ProfileStats.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    joined: PropTypes.string.isRequired,
    tabs: PropTypes.number.isRequired
  }).isRequired
}

export default ProfileStats
