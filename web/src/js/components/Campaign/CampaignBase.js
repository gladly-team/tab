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
              Thank You for Supporting Australia
            </Typography>
            <div
              style={{
                margin: '14px 10px 20px',
                textAlign: 'left',
              }}
            >
              <Typography variant={'body2'} gutterBottom>
                Thank you for helping provide some relief from the Australian
                bushfires.
              </Typography>
              <Typography variant={'body2'} gutterBottom>
                With your help, the Australian Red Cross and the World Wildlife
                Foundation will work tirelessly to support the people, animals,
                and environment affected by these catastrophic megafires.
              </Typography>
              {/* <Typography> */}
              {/*   <span style={{ fontWeight: 'bold' }}> */}
              {/*     Your tabs, more causes: */}
              {/*   </span>{' '} */}
              {/*   Throughout 2019, we'll be highlighting the work of different */}
              {/*   charities in this{' '} */}
              {/*   <a */}
              {/*     href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/" */}
              {/*     target="_blank" */}
              {/*     rel="noopener noreferrer" */}
              {/*     style={anchorStyle} */}
              {/*   > */}
              {/*     Charity Spotlight */}
              {/*   </a> */}
              {/*   . Learn more and nominate your favorite charity{' '} */}
              {/*   <a */}
              {/*     href="https://www.facebook.com/notes/tab-for-a-cause/introducing-monthly-charity-spotlight/2071986076177802/" */}
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
        Australian Bushfire Emergency
      </Typography>
      <div
        style={{
          margin: '14px 10px 20px',
          textAlign: 'left',
        }}
      >
        <Typography variant={'body2'} gutterBottom>
          The fires in Australia are devastating – and the crisis is still
          ongoing.
        </Typography>
        <Typography variant={'body2'} gutterBottom>
          More than 10 million hectares have been burnt, and this number
          continues to climb. That’s the equivalent of 40% of the entire United
          Kingdom. Lives, homes, and up to one billion animals have been
          affected.
        </Typography>
        <Typography variant={'body2'} gutterBottom>
          To help, we will be supporting the efforts of the{' '}
          <a
            href="https://www.redcross.org.au/news-and-media/news/bushfire-response-10-jan-2020"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            Australian Red Cross
          </a>{' '}
          and the{' '}
          <a
            href="https://support.wwf.org.uk/australia-bushfires"
            target="_blank"
            rel="noopener noreferrer"
            style={anchorStyle}
          >
            World Wildlife Foundation
          </a>
          . All hearts donated will be split between the two organizations.
          Thanks!
        </Typography>
        <Typography variant={'body2'} gutterBottom>
          <span style={{ fontWeight: 'bold' }}>Update:</span> We quickly
          surpassed our initial goal (great job!), but heart donations are still
          welcome.
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
