import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardHeader} from 'material-ui/Card'

import FadeInAnimation from 'general/FadeInAnimation'

class ProfileStats extends React.Component {
  render () {
    const { user } = this.props
    const mainStyle = {
      marginLeft: 256,
      marginRight: 'auto',
      padding: 20
    }
    const containerStyle = {
      padding: 10
    }
    const cardBody = {
      padding: 10
    }

    return (
      <FadeInAnimation>
        <div style={mainStyle}>
          <Card
            style={containerStyle}>
            <CardHeader
              title={'Your Stats'}
              subtitle={'Your Tabbing stats'}
              actAsExpander={false}
              showExpandableButton={false} />
            <div style={cardBody}>
              Stats go here: user ID {user.id}
            </div>
          </Card>
        </div>
      </FadeInAnimation>
    )
  }
}

ProfileStats.propTypes = {
  user: PropTypes.object.isRequired
}

export default ProfileStats
