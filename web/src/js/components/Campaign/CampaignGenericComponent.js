import React from 'react'
import PropTypes from 'prop-types'
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

class CampaignGenericComponent extends React.Component {
  render() {
    const { campaign = {}, user, onDismiss } = this.props
    const {
      isLive,
      campaignId,
      time,
      content,
      endContent,
      goal,
      numNewUsers,
      showCountdownTimer,
      showHeartsDonationButton,
    } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    // const heartsDonatedAbbreviated = abbreviateNumber(app.charity.vcReceived)
    // const heartsGoalAbbreviated = abbreviateNumber(heartsGoal)
    // const progress = (100 * app.charity.vcReceived) / heartsGoal
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
                backgroundColor: '#4a90e2',
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
            <div
              style={{
                width: 480,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              {!hasCampaignEnded ? (
                <>
                  <div>{content.title}</div>
                  <div>{content.description}</div>
                </>
              ) : (
                <>
                  <div>{endContent.title}</div>
                  <div>{endContent.description}</div>
                </>
              )}
              {/* {hasCampaignEnded ? null : ( */}
              {/*   <DonateHeartsControls */}
              {/*     charity={app.charity} */}
              {/*     user={user} */}
              {/*     CampaignGenericComponent={{ */}
              {/*       time: { */}
              {/*         start: time.start, */}
              {/*         end: time.end, */}
              {/*       }, */}
              {/*     }} */}
              {/*     showError={showError} */}
              {/*   /> */}
              {/* )} */}
              {/* <div */}
              {/*   style={{ */}
              {/*     marginTop: 8, */}
              {/*     marginBottom: 8, */}
              {/*     textAlign: 'center', */}
              {/*   }} */}
              {/* > */}
              {/*   <div */}
              {/*     style={{ */}
              {/*       marginLeft: 10, */}
              {/*       marginRight: 10, */}
              {/*     }} */}
              {/*   > */}
              {/*     {hasCampaignEnded ? ( */}
              {/*       <Typography variant={'caption'} gutterBottom> */}
              {/*         Great job! Together, we donated {heartsDonatedAbbreviated}{' '} */}
              {/*         Hearts of our {heartsGoalAbbreviated} goal. */}
              {/*       </Typography> */}
              {/*     ) : null} */}
              {/*     {hasCampaignEnded ? null : ( */}
              {/*       <span */}
              {/*         style={{ */}
              {/*           display: 'flex', */}
              {/*           flexDirection: 'row', */}
              {/*           justifyContent: 'space-between', */}
              {/*         }} */}
              {/*       > */}
              {/*         <Typography variant={'caption'}> */}
              {/*           {heartsDonatedAbbreviated} Hearts donated */}
              {/*         </Typography> */}
              {/*         <Typography variant={'caption'}> */}
              {/*           Goal: {heartsGoalAbbreviated} */}
              {/*         </Typography> */}
              {/*       </span> */}
              {/*     )} */}
              {/*     <LinearProgress variant="determinate" value={progress} /> */}
              {/*   </div> */}
              {/*   <Typography variant={'caption'} style={{ display: 'none' }}> */}
              {/*     <CountdownClock */}
              {/*       campaignStartDatetime={time.start} */}
              {/*       campaignEndDatetime={time.end} */}
              {/*     />{' '} */}
              {/*     remaining */}
              {/*   </Typography> */}
              {/* </div> */}
            </div>
          </Paper>
        </FadeInDashboardAnimation>
      </div>
    )
  }
}

CampaignGenericComponent.propTypes = {
  campaign: PropTypes.shape({
    isLive: PropTypes.bool.isRequired,
    campaignId: PropTypes.string.isRequired,
    time: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
    content: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    endContent: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    goal: PropTypes.shape({
      showProgressBar: PropTypes.bool,
      goalNumber: PropTypes.number,
      currentNumber: PropTypes.number,
      goalWordSingular: PropTypes.string,
      goalWordPlural: PropTypes.string,
    }),
    numNewUsers: PropTypes.number,
    showCountdownTimer: PropTypes.bool,
    showHeartsDonationButton: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number,
  }),
  onDismiss: PropTypes.func.isRequired,
}

export default CampaignGenericComponent
