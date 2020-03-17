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
        heartsGoal: 10e6,
        endContent: (
          <div>
            <Typography
              variant={'h6'}
              style={{
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Thank You for Supporting the WHO
            </Typography>
            <div
              style={{
                margin: '14px 10px 20px',
                textAlign: 'left',
              }}
            >
              <Typography variant={'body2'} gutterBottom>
                With your help, the World Health Organization will continue to
                provide COVID-19 relief, prevention, and detection.
              </Typography>
              {/* <Typography> */}
              {/*   <span style={{ fontWeight: 'bold' }}> */}
              {/*     Your tabs, more causes: */}
              {/*   </span>{' '} */}
              {/*   Throughout 2020, we'll be highlighting the work of different */}
              {/*   charities in this{' '} */}
              {/*   <a */}
              {/*     href="https://www.reddit.com/r/TabForACause/comments/ewsx5p/2020_tab_for_a_cause_charity_spotlight_nomination/" */}
              {/*     target="_blank" */}
              {/*     rel="noopener noreferrer" */}
              {/*     style={anchorStyle} */}
              {/*   > */}
              {/*     Charity Spotlight */}
              {/*   </a> */}
              {/*   . Learn more and nominate your favorite charity{' '} */}
              {/*   <a */}
              {/*     href="https://www.reddit.com/r/TabForACause/comments/ewsx5p/2020_tab_for_a_cause_charity_spotlight_nomination/" */}
              {/*     target="_blank" */}
              {/*     rel="noopener noreferrer" */}
              {/*     style={anchorStyle} */}
              {/*   > */}
              {/*     here */}
              {/*   </a> */}
              {/*   . */}
              {/* </Typography> */}
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
        COVID-19 Solidarity
      </Typography>
      <div
        style={{
          margin: '14px 10px 20px',
          textAlign: 'left',
        }}
      >
        <Typography variant={'body2'} gutterBottom>
          The spread of COVID-19 has been swift and destructive. We need a
          global response to support the health systems working to keep us all
          safe. As a free, simple, and at-home way to raise money for important
          causes, we will be running a special campaign for the foreseeable
          future to raise funds for the response efforts.
        </Typography>
        <Typography variant={'body2'} gutterBottom>
          Donate your hearts to the COVID-19 solidarity fund and support the{' '}
          <a
            href="https://www.who.int/"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            World Health Organization
          </a>{' '}
          and their partners in a massive effort to help countries prevent,
          detect, and manage the novel coronavirus—particularly where the needs
          are the greatest.
        </Typography>
        <Typography variant={'body2'} gutterBottom>
          Join us in supporting the{' '}
          <a
            href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            COVID-19 Solidarity Response Fund
          </a>
          .
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
