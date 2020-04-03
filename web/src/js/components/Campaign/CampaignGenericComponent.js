import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import { abbreviateNumber } from 'js/utils/utils'
import Markdown from 'js/components/General/Markdown'
import theme from 'js/theme/defaultV1'

const defaultTheme = createMuiTheme(theme)

const styles = theme => ({
  root: {
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    pointerEvents: 'none',
  },
  paper: {
    position: 'relative',
    pointerEvents: 'all',
    minWidth: 400,
    margin: 0,
    marginBottom: 100,
    padding: 0,
    background: '#FFF',
    border: 'none',
  },
  borderTop: {
    width: '100%',
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: theme.palette.secondary.main,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 2,
  },
  campaignContent: {
    width: 480,
    padding: 12,
  },
  mainTextContainer: {},
  title: {
    textAlign: 'center',
  },
  description: {
    margin: 14,
    textAlign: 'left',
  },
  bottomContent: {
    textAlign: 'center',
  },
  progressBarSection: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  progressBarLabelsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

class CampaignGenericComponent extends React.Component {
  render() {
    const {
      app: { campaign = {} } = {},
      user,
      onDismiss,
      showError,
      classes,
    } = this.props
    const {
      charity,
      time,
      content,
      goal,
      showCountdownTimer,
      showHeartsDonationButton,
      showProgressBar,
    } = campaign
    const {
      targetNumber,
      currentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      limitProgressToTargetMax,
    } = goal || {}

    // If limitProgressToTargetMax is true, don't display a current
    // number that's greater than the target number.
    const currentGoalNumber =
      limitProgressToTargetMax && currentNumber > targetNumber
        ? targetNumber
        : currentNumber
    let progress =
      targetNumber && currentNumber ? (100 * currentNumber) / targetNumber : 0
    if (progress > 100 && limitProgressToTargetMax) {
      progress = 100.0
    }

    // TODO: add these fields to the API
    const showProgressBarLabel = true
    const showProgressBarEndText = false

    return (
      <div className={classes.root}>
        <FadeInDashboardAnimation>
          <Paper elevation={1} className={classes.paper}>
            <div className={classes.borderTop} />
            <IconButton
              onClick={() => {
                setCampaignDismissTime()
                onDismiss()
              }}
              className={classes.closeButton}
            >
              <CloseIcon />
            </IconButton>
            <div className={classes.campaignContent}>
              <div className={classes.mainTextContainer}>
                <div className={classes.title}>
                  <Markdown children={content.titleMarkdown} />
                </div>
                <div className={classes.description}>
                  <Markdown children={content.descriptionMarkdown} />
                </div>
              </div>
              {showHeartsDonationButton ? (
                <DonateHeartsControls
                  charity={charity}
                  user={user}
                  showError={showError}
                />
              ) : null}
              <div className={classes.bottomContent}>
                {showProgressBar ? (
                  <div className={classes.progressBarSection}>
                    {showProgressBarEndText ? (
                      <Typography variant={'caption'} gutterBottom>
                        Great job! Together, we {impactVerbPastTense}{' '}
                        {abbreviateNumber(currentGoalNumber)}{' '}
                        {currentGoalNumber === 1
                          ? impactUnitSingular
                          : impactUnitPlural}{' '}
                        of our {abbreviateNumber(targetNumber)} goal.
                      </Typography>
                    ) : null}
                    {showProgressBarLabel ? (
                      <div className={classes.progressBarLabelsContainer}>
                        <Typography variant={'caption'}>
                          {abbreviateNumber(currentGoalNumber)}{' '}
                          {currentGoalNumber === 1
                            ? impactUnitSingular
                            : impactUnitPlural}{' '}
                          {impactVerbPastTense}
                        </Typography>
                        <Typography variant={'caption'}>
                          Goal: {abbreviateNumber(targetNumber)}
                        </Typography>
                      </div>
                    ) : null}
                    <LinearProgress variant="determinate" value={progress} />
                  </div>
                ) : null}
                {showCountdownTimer ? (
                  <Typography variant={'caption'}>
                    <CountdownClock
                      campaignStartDatetime={moment(time.start)}
                      campaignEndDatetime={moment(time.end)}
                    />{' '}
                    remaining
                  </Typography>
                ) : null}
              </div>
            </div>
          </Paper>
        </FadeInDashboardAnimation>
      </div>
    )
  }
}

const propTypesCampaign = {
  app: PropTypes.shape({
    campaign: PropTypes.shape({
      time: PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.shape({
        titleMarkdown: PropTypes.string.isRequired,
        descriptionMarkdown: PropTypes.string.isRequired,
      }),
      goal: PropTypes.shape({
        targetNumber: PropTypes.number.isRequired,
        currentNumber: PropTypes.number.isRequired,
        impactUnitSingular: PropTypes.string.isRequired,
        impactUnitPlural: PropTypes.string.isRequired,
        impactVerbPastTense: PropTypes.string.isRequired,
        limitProgressToTargetMax: PropTypes.bool.isRequired,
      }),
      numNewUsers: PropTypes.number,
      showCountdownTimer: PropTypes.bool.isRequired,
      showHeartsDonationButton: PropTypes.bool.isRequired,
      showProgressBar: PropTypes.bool.isRequired,
      theme: PropTypes.shape({
        color: PropTypes.shape({
          main: PropTypes.string.isRequired,
          light: PropTypes.string.isRequired,
        }),
      }),
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number,
  }),
  onDismiss: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
}
const defaultPropsCampaign = {}

CampaignGenericComponent.propTypes = propTypesCampaign
CampaignGenericComponent.defaultProps = defaultPropsCampaign

const CampaignGenericWithStyles = withStyles(styles, { withTheme: true })(
  CampaignGenericComponent
)

// Separate component for theming logic.
const CampaignGenericThemeWrapperComponent = props => {
  const mainColor = get(props, 'app.campaign.theme.color.main', null)
  const lightColor = get(props, 'app.campaign.theme.color.light', null)
  return (
    <MuiThemeProvider
      theme={{
        ...defaultTheme,
        palette: {
          ...defaultTheme.palette,
          primary: {
            ...defaultTheme.palette.primary,
            ...(mainColor && { main: mainColor }),
            ...(lightColor && { light: lightColor }),
          },
          secondary: {
            ...defaultTheme.palette.secondary,
            ...(mainColor && { main: mainColor }),
            ...(lightColor && { light: lightColor }),
          },
        },
      }}
    >
      <CampaignGenericWithStyles {...props} />
    </MuiThemeProvider>
  )
}

CampaignGenericThemeWrapperComponent.propTypes = propTypesCampaign
CampaignGenericThemeWrapperComponent.defaultProps = defaultPropsCampaign

export default CampaignGenericThemeWrapperComponent
