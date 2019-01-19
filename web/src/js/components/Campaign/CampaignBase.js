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
  render() {
    const { userId, theme } = this.props
    const anchorStyle = {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    }
    // TODO: update before launching.
    const CAMPAIGN_START_TIME_ISO = '2019-01-18T12:00:00.000Z'
    const CAMPAIGN_END_TIME_ISO = '2019-01-29T22:00:00.000Z'
    const heartsGoal = 8e6

    return (
      <QueryRenderer
        environment={environment}
        // Hardcode campaign-specific data requirements here, and remove
        // after the campaign is no longer live.
        query={graphql`
          query CampaignBaseQuery(
            $userId: String!
            $charityId: String!
            $startTime: String!
            $endTime: String!
          ) {
            app {
              ...HeartDonationCampaignContainer_app
                @arguments(startTime: $startTime, endTime: $endTime)
            }
            user(userId: $userId) {
              ...HeartDonationCampaignContainer_user
            }
          }
        `}
        variables={{
          userId: userId,
          charityId: 'c2571424-c610-4af6-b5e5-1227b9b09692',
          startTime: CAMPAIGN_START_TIME_ISO,
          endTime: CAMPAIGN_END_TIME_ISO,
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
                  end: moment(CAMPAIGN_END_TIME_ISO),
                },
                heartsGoal: heartsGoal,
              }}
              showError={this.props.showError}
            >
              <Typography
                variant={'h6'}
                style={{
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                January Spotlight: Help End Slavery
              </Typography>
              <div
                style={{
                  margin: '14px 10px 20px',
                  textAlign: 'left',
                }}
              >
                <Typography variant={'body2'} gutterBottom>
                  The final votes are in: Tabbers have selected{' '}
                  <a
                    href="https://www.a21.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={anchorStyle}
                  >
                    The A21 Campaign
                  </a>{' '}
                  for our January{' '}
                  <a
                    href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={anchorStyle}
                  >
                    Charity Spotlight
                  </a>
                  . A21 is a leading non-profit in the fight against slavery and
                  human trafficking. There are millions of people in slavery,
                  and A21 works tirelessly to shine a light on the problem,
                  identify victims, and support survivors.
                </Typography>
                <Typography variant={'body2'} gutterBottom>
                  Join us in supporting A21! (Then,{' '}
                  <a
                    href="https://en.wikipedia.org/wiki/Human_trafficking"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={anchorStyle}
                  >
                    learn more
                  </a>
                  .)
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
                pointerEvents: 'none',
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
                    border: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 3,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      backgroundColor: theme.palette.secondary.main,
                    }}
                  />
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
  theme: PropTypes.object.isRequired,
}

CampaignBase.defaultProps = {}

export default withTheme()(withUserId()(CampaignBase))
