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
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  bottomContent: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'left',
  },
  progressBarSection: {
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
    const { campaign = {}, user, onDismiss, showError, classes } = this.props
    const {
      campaignId,
      charity,
      time,
      content,
      endContent,
      goal = {},
      showCountdownTimer,
      showHeartsDonationButton,
      showProgressBar,
    } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    const { goalNumber, currentNumber, goalWordSingular, goalWordPlural } = goal
    const progress = (100 * currentNumber) / goalNumber

    return (
      <div className={classes.root} data-test-id={`campaign-${campaignId}`}>
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
              {!hasCampaignEnded ? (
                <>
                  <div className={classes.title}>
                    <Markdown children={content.title} />
                  </div>
                  <div className={classes.description}>
                    <Markdown children={content.description} />
                  </div>
                </>
              ) : (
                <>
                  <div className={classes.title}>
                    <Markdown children={endContent.title} />
                  </div>
                  <div className={classes.description}>
                    <Markdown children={endContent.description} />
                  </div>
                </>
              )}
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
                        Great job! Together, we raised{' '}
                        {abbreviateNumber(currentNumber)}{' '}
                        {currentNumber === 1
                          ? goalWordSingular
                          : goalWordPlural}{' '}
                        of our {abbreviateNumber(goalNumber)} goal.
                      </Typography>
                    ) : null}
                    {!hasCampaignEnded ? (
                      <span className={classes.progressBarLabelsContainer}>
                        <Typography variant={'caption'}>
                          {abbreviateNumber(currentNumber)}{' '}
                          {currentNumber === 1
                            ? goalWordSingular
                            : goalWordPlural}{' '}
                          raised
                        </Typography>
                        <Typography variant={'caption'}>
                          Goal: {abbreviateNumber(goalNumber)}
                        </Typography>
                      </span>
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
  campaign: PropTypes.shape({
    campaignId: PropTypes.string.isRequired,
    time: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    endContent: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    goal: PropTypes.shape({
      goalNumber: PropTypes.number,
      currentNumber: PropTypes.number,
      goalWordSingular: PropTypes.string,
      goalWordPlural: PropTypes.string,
    }),
    numNewUsers: PropTypes.number,
    showCountdownTimer: PropTypes.bool.isRequired,
    showHeartsDonationButton: PropTypes.bool.isRequired,
    showProgressBar: PropTypes.bool.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number,
  }),
  onDismiss: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
}

export default withStyles(styles)(CampaignGenericComponent)
