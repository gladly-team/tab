import React from 'react'
import PropTypes from 'prop-types'
import Charity from 'js/components/Donate/CharityContainer'
import Paper from 'material-ui/Paper'
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline'
import { lighterTextColor } from 'js/theme/default'

class ProfileDonateHearts extends React.Component {
  render() {
    const { app, user } = this.props
    const containerStyle = {}
    const spacingPx = 6
    return (
      <div key={'charities-container-key'} style={containerStyle}>
        <Paper
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 2 * spacingPx,
            color: lighterTextColor,
          }}
        >
          <InfoOutlineIcon
            style={{
              marginRight: 8,
              color: lighterTextColor,
              minHeight: 24,
              minWidth: 24,
            }}
          />
          <p>
            When you donate Hearts, you're telling us to give more of the money
            we raise to that charity.
          </p>
        </Paper>
        <span
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 34,
          }}
        >
          {app.charities.edges.map(edge => {
            return (
              <Charity
                key={edge.node.id}
                charity={edge.node}
                user={user}
                showError={this.props.showError}
                style={{
                  margin: spacingPx,
                }}
              />
            )
          })}
        </span>
      </div>
    )
  }
}

ProfileDonateHearts.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired,
}

export default ProfileDonateHearts
