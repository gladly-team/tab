import React from 'react'
import PropTypes from 'prop-types'
import Charity from '../../Donate/CharityContainer'
import { Paper } from 'material-ui'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline'
import { lighterTextColor } from 'theme/default'

class ProfileDonateHearts extends React.Component {
  render () {
    const { app, user } = this.props
    const containerStyle = {
    }
    const spacingPx = 6
    return (
      <SettingsChildWrapper>
        <div
          key={'charities-container-key'}
          style={containerStyle}>
          <Paper
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 2 * spacingPx,
              color: lighterTextColor
            }}
          >
            <InfoOutlineIcon
              style={{
                marginRight: 8,
                color: lighterTextColor,
                minHeight: 24,
                minWidth: 24
              }}
            />
            <p>When you donate Hearts, you're telling us to give
             more of the money we raise to that charity.
            </p>
          </Paper>
          <span
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              margin: -spacingPx
            }}
          >
            {app.charities.edges.map((edge) => {
              return (
                <Charity
                  key={edge.node.id}
                  charity={edge.node}
                  user={user}
                  showError={this.props.showError}
                  style={{
                    flex: 1,
                    flexBasis: '20%',
                    margin: spacingPx
                  }}
                />
              )
            })}
          </span>
        </div>
      </SettingsChildWrapper>
    )
  }
}

ProfileDonateHearts.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default ProfileDonateHearts
