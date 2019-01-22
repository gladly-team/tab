import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import environment from 'js/relay-env'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withUserId from 'js/components/General/withUserId'
import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignContainer'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

class CampaignBase extends React.Component {
  render() {
    const { userId, theme, onDismiss } = this.props
    const anchorStyle = {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    }
    // TODO: update before launching.
    const CAMPAIGN_START_TIME_ISO = '2019-01-18T12:00:00.000Z'
    // const CAMPAIGN_START_TIME_ISO = '2019-01-22T22:00:00.000Z'
    const CAMPAIGN_END_TIME_ISO = '2019-01-25T22:00:00.000Z'
    const heartsGoal = 6e6

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
                endContent: (
                  <div>
                    <Typography
                      variant={'h6'}
                      style={{
                        textAlign: 'center',
                        marginTop: 4,
                      }}
                    >
                      Thank You for Supporting A21!
                    </Typography>
                    <div
                      style={{
                        margin: '14px 10px 20px',
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant={'body2'} gutterBottom>
                        Thanks for supporting{' '}
                        <a
                          href="https://www.a21.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={anchorStyle}
                        >
                          The A21 Campaign
                        </a>
                        ! With your help, they are working to eradicate human
                        trafficking through awareness, intervention, and
                        aftercare.{' '}
                      </Typography>
                      <Typography>
                        <span style={{ fontWeight: 'bold' }}>
                          Your tabs, more causes:
                        </span>{' '}
                        Throughout 2019, we'll be highlighting the work of
                        different charities in this{' '}
                        <a
                          href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={anchorStyle}
                        >
                          Charity Spotlight
                        </a>
                        . Learn more and nominate your favorite charity{' '}
                        <a
                          href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={anchorStyle}
                        >
                          here
                        </a>
                        .
                      </Typography>
                    </div>
                  </div>
                ),
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
                    position: 'relative',
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
                  <IconButton
                    onClick={() => {
                      setCampaignDismissTime()
                      onDismiss()
                    }}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 2,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
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
  onDismiss: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
}

CampaignBase.defaultProps = {
  onDismiss: () => {},
}

export default withTheme()(withUserId()(CampaignBase))
