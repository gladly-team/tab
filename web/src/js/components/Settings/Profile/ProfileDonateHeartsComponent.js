import React from 'react'
import PropTypes from 'prop-types'
import Charity from 'js/components/Donate/CharityContainer'
import Paper from '@material-ui/core/Paper'
import InfoIcon from '@material-ui/icons/InfoOutlined'

// TODO: new MUI components
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
          <InfoIcon
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
  app: PropTypes.shape({
    charities: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            // Passes field defined in CharityContainer
          }),
        })
      ),
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    // Passes field defined in CharityContainer
  }).isRequired,
  showError: PropTypes.func.isRequired,
}

ProfileDonateHearts.defaultProps = {}

export default ProfileDonateHearts
