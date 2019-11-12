import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import TreePlantingCampaign from 'js/components/Campaign/TreePlantingCampaignContainer'
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
      }}
      showError={props.showError}
    />
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
      palette: {
        ...defaultTheme.palette,
        primary: {
          ...defaultTheme.palette.primary,
          // TODO
          main: '#FF0000',
          light: '#FF0000',
        },
        secondary: {
          ...defaultTheme.palette.secondary,
          // TODO
          main: '#FF0000',
          light: '#FF0000',
        },
      },
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
