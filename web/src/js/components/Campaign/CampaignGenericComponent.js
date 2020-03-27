import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import { abbreviateNumber } from 'js/utils/utils'
import Markdown from 'js/components/General/Markdown'

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
      endContent,
      goal,
      showCountdownTimer,
      showHeartsDonationButton,
      showProgressBar,
    } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    const {
      targetNumber,
      currentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
    } = goal || {}
    const progress =
      targetNumber && currentNumber ? (100 * currentNumber) / targetNumber : 0

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
                {!hasCampaignEnded ? (
                  <>
                    <div className={classes.title}>
                      <Markdown children={content.titleMarkdown} />
                    </div>
                    <div className={classes.description}>
                      <Markdown children={content.descriptionMarkdown} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={classes.title}>
                      <Markdown children={endContent.titleMarkdown} />
                    </div>
                    <div className={classes.description}>
                      <Markdown children={endContent.descriptionMarkdown} />
                    </div>
                  </>
                )}
              </div>
              {showHeartsDonationButton && !hasCampaignEnded ? (
                <DonateHeartsControls
                  charity={charity}
                  user={user}
                  CampaignGenericComponent={{
                    time: {
                      start: time.start,
                      end: time.end,
                    },
                  }}
                  showError={showError}
                />
              ) : null}
              <div className={classes.bottomContent}>
                {showProgressBar ? (
                  <div className={classes.progressBarSection}>
                    {hasCampaignEnded ? (
                      <Typography variant={'caption'} gutterBottom>
                        Great job! Together, we {impactVerbPastTense}{' '}
                        {abbreviateNumber(currentNumber)}{' '}
                        {currentNumber === 1
                          ? impactUnitSingular
                          : impactUnitPlural}{' '}
                        of our {abbreviateNumber(targetNumber)} goal.
                      </Typography>
                    ) : null}
                    {!hasCampaignEnded ? (
                      <div className={classes.progressBarLabelsContainer}>
                        <Typography variant={'caption'}>
                          {abbreviateNumber(currentNumber)}{' '}
                          {currentNumber === 1
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
                {showCountdownTimer && !hasCampaignEnded ? (
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

CampaignGenericComponent.propTypes = {
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
      endContent: PropTypes.shape({
        titleMarkdown: PropTypes.string.isRequired,
        descriptionMarkdown: PropTypes.string.isRequired,
      }),
      goal: PropTypes.shape({
        targetNumber: PropTypes.number.isRequired,
        currentNumber: PropTypes.number.isRequired,
        impactUnitSingular: PropTypes.string.isRequired,
        impactUnitPlural: PropTypes.string.isRequired,
        impactVerbPastTense: PropTypes.string.isRequired,
      }),
      numNewUsers: PropTypes.number,
      showCountdownTimer: PropTypes.bool.isRequired,
      showHeartsDonationButton: PropTypes.bool.isRequired,
      showProgressBar: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number,
  }),
  onDismiss: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
}

export default withStyles(styles)(CampaignGenericComponent)
