import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignContainer'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import theme from 'js/theme/defaultV1'

const defaultTheme = createMuiTheme(theme)

const CampaignBaseContent = props => {
  const {
    app,
    user,
    theme,
    onDismiss,
    campaignStartTimeISO,
    campaignEndTimeISO,
  } = props

  const anchorStyle = {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  }

  // Hardcode campaign component here when running one.
  const currentCampaign = (
    <HeartDonationCampaign
      app={app}
      user={user}
      campaign={{
        time: {
          start: moment(campaignStartTimeISO),
          end: moment(campaignEndTimeISO),
        },
        heartsGoal: 6e6,
        endContent: (
          <div>
            <Typography
              variant={'h6'}
              style={{
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Thank You for Supporting Earthjustice!
            </Typography>
            <div
              style={{
                margin: '14px 10px 20px',
                textAlign: 'left',
              }}
            >
              <Typography variant={'body2'} gutterBottom>
                With your help, Earthjustice will continue their work preserving
                land and wildlife, advancing clean energy, and fighting climate
                change.
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold' }}>
                  Your tabs, more causes:
                </span>{' '}
                Throughout 2020, we'll be highlighting the work of different
                charities in this{' '}
                <a
                  href="https://www.reddit.com/r/TabForACause/comments/ewsx5p/2020_tab_for_a_cause_charity_spotlight_nomination/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={anchorStyle}
                >
                  Charity Spotlight
                </a>
                . Learn more and nominate your favorite charity{' '}
                <a
                  href="https://www.reddit.com/r/TabForACause/comments/ewsx5p/2020_tab_for_a_cause_charity_spotlight_nomination/"
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
      showError={props.showError}
    >
      <Typography
        variant={'h6'}
        style={{
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        February Spotlight: Earthjustice
      </Typography>
      <div
        style={{
          margin: '14px 10px 20px',
          textAlign: 'left',
        }}
      >
        <Typography variant={'body2'} gutterBottom>
          This month, Tabbers selected{' '}
          <a
            href="https://earthjustice.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            Earthjustice
          </a>{' '}
          for our{' '}
          <a
            href="https://www.reddit.com/r/TabForACause/comments/ewsx5p/2020_tab_for_a_cause_charity_spotlight_nomination/"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            Charity Spotlight
          </a>
          . Earthjustice wields the power of law and the strength of partnership
          to protect people's health, to preserve magnificent places and
          wildlife, to advance clean energy, and to combat climate change.
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
}
CampaignBaseContent.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  campaignStartTimeISO: PropTypes.string.isRequired,
  campaignEndTimeISO: PropTypes.string.isRequired,
}
const CampaignBaseContentWithTheme = withTheme()(CampaignBaseContent)

// Separate component for theming logic.
const CampaignBase = props => (
  // Modify this for any campaign-specific theming.
  <MuiThemeProvider
    theme={{
      ...defaultTheme,
      // E.g., this is themed green.
      // palette: {
      //   ...defaultTheme.palette,
      //   primary: {
      //     ...defaultTheme.palette.primary,
      //     main: '#028502',
      //     light: '#0aac0a',
      //   },
      //   secondary: {
      //     ...defaultTheme.palette.secondary,
      //     main: '#028502',
      //     light: '#0aac0a',
      //   },
      // },
    }}
  >
    <CampaignBaseContentWithTheme {...props} />
  </MuiThemeProvider>
)
CampaignBase.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  campaignStartTimeISO: PropTypes.string.isRequired,
  campaignEndTimeISO: PropTypes.string.isRequired,
}
CampaignBase.defaultProps = {
  onDismiss: () => {},
}

export default CampaignBase
