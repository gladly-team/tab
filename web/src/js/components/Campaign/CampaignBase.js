
import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withTheme } from '@material-ui/core/styles'
import environment from 'js/relay-env'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
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
    const CAMPAIGN_START_TIME_ISO = '2018-11-26T16:00:00.000Z'
    const CAMPAIGN_END_TIME_ISO = '2018-11-30T22:00:00.000Z'
    const heartsGoal = 18e6

    return (
      <QueryRenderer
        environment={environment}
        // Hardcode campaign-specific data requirements here, and remove
        // after the campaign is no longer live.
        query={graphql`
            query CampaignBaseQuery($userId: String!, $charityId: String!,
              $startTime: String!, $endTime: String!) {
              app {
                ...HeartDonationCampaignContainer_app @arguments(
                  startTime: $startTime,
                  endTime: $endTime
                )
              }
              user(userId: $userId) {
                ...HeartDonationCampaignContainer_user
              }
            }
          `}
        variables={{
          userId: userId,
          charityId: '77ee7208-62d7-41ad-a6e1-60f8d1dcfd9a',
          startTime: CAMPAIGN_START_TIME_ISO,
          endTime: CAMPAIGN_END_TIME_ISO
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
          const currentCampaign = (
            <HeartDonationCampaign
              app={app}
              user={user}
              campaign={{
                time: {
                  start: moment(CAMPAIGN_START_TIME_ISO),
                  end: moment(CAMPAIGN_END_TIME_ISO)
                },
                heartsGoal: heartsGoal,
                endContent: (
                  <div>
                    <Typography
                      variant={'h6'}
                      style={{
                        textAlign: 'center',
                        marginTop: 4
                      }}
                    >
                      Thank You for Giving Directly!
                    </Typography>
                    <div
                      style={{
                        margin: '14px 10px 20px',
                        textAlign: 'left'
                      }}
                    >
                      <Typography
                        variant={'body2'}
                        gutterBottom
                      >
                        Thanks for welcoming{' '}
                        <a href='https://www.givedirectly.org/' target='_blank' rel='noopener noreferrer' style={anchorStyle}>GiveDirectly</a>{' '}
                        to Tab for a Cause this week! Your tabs will put cash into the hands of people{' '}
                        who need it most.
                      </Typography>
                      <Typography
                        variant={'body2'}
                        gutterBottom
                      >
                        <span style={{ fontWeight: 'bold' }}>Your tabs, more causes:</span>{' '}
                        Each month in 2019, we'll be highlighting the work of different charities in a{' '}
                        <a href='https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/' target='_blank' rel='noopener noreferrer' style={anchorStyle}>
                        "Charity Spotlight"</a>. You'll be able to donate Hearts to a wider variety of causes,{' '}
                        and best of all, you'll get to vote for which new non-profits we{' '}
                        should feature! Learn more and nominate your favorite charity{' '}
                        <a href='https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/' target='_blank' rel='noopener noreferrer' style={anchorStyle}>
                        here</a>.
                      </Typography>
                    </div>
                  </div>
                )
              }}
              showError={this.props.showError}
            >
              <Typography
                variant={'h6'}
                style={{
                  textAlign: 'center',
                  marginTop: 4
                }}
              >
                This Giving Tuesday, Give Directly
              </Typography>
              <div
                style={{
                  margin: '14px 10px 20px',
                  textAlign: 'left'
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
                <Typography
                  variant={'body2'}
                  gutterBottom
                >
                  <span style={{ fontWeight: 'bold' }}>Update: </span>congrats, we passed our original{' '}
                  goal of 10M Hearts! Let's see if we can hit 18M!
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
              <FadeInDashboardAnimation>
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
              </FadeInDashboardAnimation>
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

export default withTheme()(withUserId()(CampaignBase))
