/* global graphql */

import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import environment from 'js/relay-env'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withUserId from 'js/components/General/withUserId'
import {
  alternateAccentColor
} from 'js/theme/default'
import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignContainer'

class CampaignBase extends React.Component {
  render () {
    const { userId } = this.props
    return (
      <QueryRenderer
        environment={environment}
        // Hardcode campaign-specific data requirements here, and remove
        // after the campaign is no longer live.
        query={graphql`
            query CampaignBaseQuery($userId: String!, $charityId: String!) {
              app {
                ...HeartDonationCampaignContainer_app
              }
              user(userId: $userId) {
                ...HeartDonationCampaignContainer_user
              }
            }
          `}
        variables={{
          userId: userId,
          charityId: 'fb5082cc-151a-4a9a-9289-06906670fd4e'
        }}
        render={({ error, props, retry }) => {
          if (error) {
            console.error(error)
          }
          if (!props) {
            return null
          }
          const { app, user } = props

          // Hardcode campaign component here when running one.
          const CAMPAIGN_START_TIME_ISO = '2018-11-09T23:00:00.000Z'
          const CAMPAIGN_END_TIME_ISO = '2018-11-23T20:00:00.000Z'
          const currentCampaign = (
            <HeartDonationCampaign
              app={app}
              user={user}
              campaignTitle={'An example title here'}
              campaignStartDatetime={moment(CAMPAIGN_START_TIME_ISO)}
              campaignEndDatetime={moment(CAMPAIGN_END_TIME_ISO)}
              showError={this.props.showError}
            >
              <div
                style={{
                  margin: '14px 4px 20px 4px'
                }}
              >
                <Typography
                  variant={'body2'}
                  gutterBottom
                >
                Hey! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
                <Typography
                  variant={'body2'}
                  gutterBottom
                >
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
                </Typography>
              </div>
            </HeartDonationCampaign>
          )

          return (
            <div
              style={{
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                pointerEvents: 'none'
              }}
            >
              <Paper
                elevation={1}
                style={{
                  pointerEvents: 'all',
                  width: 400,
                  margin: 0,
                  marginBottom: 100,
                  padding: 0,
                  background: '#FFF',
                  border: 'none'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 3,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    backgroundColor: alternateAccentColor
                  }} />
                {currentCampaign}
              </Paper>
            </div>
          )
        }}
      />
    )
  }
}

CampaignBase.propTypes = {
  userId: PropTypes.string.isRequired,
  showError: PropTypes.func.isRequired
}

CampaignBase.defaultProps = {}

export default withUserId(CampaignBase)
