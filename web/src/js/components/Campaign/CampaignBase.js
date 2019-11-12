import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TreePlantingCampaign from 'js/components/Campaign/TreePlantingCampaignContainer'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

class CampaignBase extends React.Component {
  render() {
    const {
      app,
      user,
      theme,
      onDismiss,
      campaignStartTimeISO,
      campaignEndTimeISO,
    } = this.props
    const anchorStyle = {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    }

    // Hardcode campaign component here when running one.
    const currentCampaign = (
      <TreePlantingCampaign
        app={app}
        user={user}
        campaign={{
          time: {
            start: moment(campaignStartTimeISO),
            end: moment(campaignEndTimeISO),
          },
          treesPlantedGoal: 20000,
          endContent: (
            <div>
              <Typography
                variant={'h6'}
                style={{
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Thank You for Taking Climate Action!
              </Typography>
              <div
                style={{
                  margin: '14px 10px 20px',
                  textAlign: 'left',
                }}
              >
                <Typography variant={'body2'} gutterBottom>
                  With your help, the{' '}
                  <a
                    href="https://www.rainforest-alliance.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={anchorStyle}
                  >
                    Rainforest Alliance
                  </a>{' '}
                  will continue their work protecting Earth’s forests and
                  climate through improving supply chains, advocating for policy
                  change, and spreading sustainable agriculture practices.{' '}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 'bold' }}>
                    Your tabs, more causes:
                  </span>{' '}
                  Throughout 2019, we'll be highlighting the work of different
                  charities in this{' '}
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
          September Spotlight: Rainforest Alliance
        </Typography>
        <div
          style={{
            margin: '14px 10px 20px',
            textAlign: 'left',
          }}
        >
          <Typography variant={'body2'} gutterBottom>
            This month, Tabbers selected the{' '}
            <a
              href="https://www.rainforest-alliance.org"
              target="_blank"
              rel="noopener noreferrer"
              style={anchorStyle}
            >
              Rainforest Alliance
            </a>{' '}
            for our{' '}
            <a
              href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/"
              target="_blank"
              rel="noopener noreferrer"
              style={anchorStyle}
            >
              Charity Spotlight
            </a>
            , a group of companies, farmers, foresters, and consumers committed
            to creating a world where people and nature thrive in harmony.
          </Typography>
          <Typography variant={'body2'} gutterBottom>
            Want to do more against the climate crisis? On Sept 20 and 27,
            people are walking out of their schools and workplaces to join a
            youth-led{' '}
            <a
              href="https://globalclimatestrike.net"
              target="_blank"
              rel="noopener noreferrer"
              style={anchorStyle}
            >
              #ClimateStrike
            </a>{' '}
            demanding that leaders respond to this emergency.
          </Typography>
          <Typography variant={'body2'} gutterBottom>
            Join us in supporting the Rainforest Alliance and action against
            climate change!
          </Typography>
        </div>
      </TreePlantingCampaign>
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
  }
}

CampaignBase.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  campaignStartTimeISO: PropTypes.string.isRequired,
  campaignEndTimeISO: PropTypes.string.isRequired,
}

CampaignBase.defaultProps = {
  onDismiss: () => {},
}

export default withTheme()(CampaignBase)
