import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardHeader} from 'material-ui/Card'

import FadeInAnimation from 'general/FadeInAnimation'

class ProfileDonateHearts extends React.Component {
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
              title={'Donate Hearts'}
              actAsExpander={false}
              showExpandableButton={false} />
            <div style={cardBody}>
              Donate Hearts goes here: user ID {user.id}
            </div>
          </Card>
        </div>
      </FadeInAnimation>
    )
  }
}

ProfileDonateHearts.propTypes = {
  user: PropTypes.object.isRequired
}

export default ProfileDonateHearts
