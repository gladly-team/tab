import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardHeader} from 'material-ui/Card'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'

class ProfileDonateHearts extends React.Component {
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
            title={'Donate Hearts'}
            actAsExpander={false}
            showExpandableButton={false} />
          <div style={cardBody}>
            Donate Hearts goes here: user ID {user.id}
          </div>
        </Card>
      </SettingsChildWrapper>
    )
  }
}

ProfileDonateHearts.propTypes = {
  user: PropTypes.object.isRequired
}

export default ProfileDonateHearts
