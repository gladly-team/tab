/* global graphql */

import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import { withTheme } from '@material-ui/core/styles'
import environment from 'js/relay-env'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withUserId from 'js/components/General/withUserId'
import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignContainer'

class CampaignBase extends React.Component {
  render () {
    const { userId, theme } = this.props
    const anchorStyle = {
      color: theme.palette.primary.main,
      textDecoration: 'none'
    }
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
          charityId: '77ee7208-62d7-41ad-a6e1-60f8d1dcfd9a'
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
              campaignTitle={'This Giving Tuesday, Give Directly'}
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
                  We’re very excited to introduce a new charity partner,{' '}
                  <a href='https://www.givedirectly.org/' target='_blank' rel='noopener noreferrer' style={anchorStyle}>GiveDirectly</a>!
                </Typography>
                <Typography
                  variant={'body2'}
                  gutterBottom
                >
                  GiveDirectly offers a simple approach to addressing poverty: cut out{' '}
                  intermediaries and allow poor families to decide for themselves what they{' '}
                  need most. They consistently{' '}
                  <a href='https://www.givedirectly.org/operating-model' target='_blank' rel='noopener noreferrer' style={anchorStyle}>measure their impact</a>,{' '}
                  <a href='https://www.givedirectly.org/research-at-give-directly' target='_blank' rel='noopener noreferrer' style={anchorStyle}>show impressive results</a>,{' '}
                  and are one of only nine top-rated charities on{' '}
                  <a href='https://www.givewell.org/charities/give-directly' target='_blank' rel='noopener noreferrer' style={anchorStyle}>GiveWell</a>.
                </Typography>
                <Typography
                  variant={'body2'}
                  gutterBottom
                >
                  Join us in welcoming GiveDirectly to Tab for a Cause with a cornucopia of Hearts!
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
                  minWidth: 400,
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
                    backgroundColor: theme.palette.secondary.main
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
  showError: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

CampaignBase.defaultProps = {}

export default withTheme()(withUserId(CampaignBase))
