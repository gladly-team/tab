
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import { abbreviateNumber } from 'js/utils/utils'

class HeartDonationCampaign extends React.Component {
  render () {
    const {
      app,
      user,
      campaign,
      children,
      showError
    } = this.props
    const {
      time,
      heartsGoal,
      endContent
    } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    const heartsDonatedAbbreviated = abbreviateNumber(app.charity.vcReceived)
    const heartsGoalAbbreviated = abbreviateNumber(heartsGoal)
    const progress = 100 * app.charity.vcReceived / heartsGoal
    return (
      <div
        style={{
          width: 480,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12
        }}
      > {
          (hasCampaignEnded && endContent)
            ? endContent
            : children
        }
        {
          hasCampaignEnded
            ? null : (
              <DonateHeartsControls
                charity={app.charity}
                user={user}
                heartDonationCampaign={{
                  time: {
                    start: time.start,
                    end: time.end
                  }
                }}
                showError={showError}
              />
            )
        }
        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              marginLeft: 10,
              marginRight: 10
            }}
          >
            { hasCampaignEnded ? (
              <Typography variant={'caption'} gutterBottom>
                Great job! Together, we donated {heartsDonatedAbbreviated} Hearts of our{' '}
                {heartsGoalAbbreviated} goal.
              </Typography>
            ) : null
            }
            { hasCampaignEnded
              ? null : (
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant={'caption'}>
                    {heartsDonatedAbbreviated} Hearts donated
                  </Typography>
                  <Typography variant={'caption'}>
                    Goal: {heartsGoalAbbreviated}
                  </Typography>
                </span>
              )
            }
            <LinearProgress variant='determinate' value={progress} />
          </div>
          <Typography variant={'caption'}>
            <CountdownClock
              campaignStartDatetime={time.start}
              campaignEndDatetime={time.end}
            />{' '}
            remaining
          </Typography>
        </div>
      </div>
    )
  }
}

HeartDonationCampaign.propTypes = {
  app: PropTypes.shape({
    charity: PropTypes.shape({
      vcReceived: PropTypes.number.isRequired
    }).isRequired
  }),
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired
  }).isRequired,
  campaign: PropTypes.shape({
    time: PropTypes.shape({
      start: PropTypes.instanceOf(moment).isRequired,
      end: PropTypes.instanceOf(moment).isRequired
    }),
    heartsGoal: PropTypes.number.isRequired,
    endContent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  showError: PropTypes.func.isRequired
}

export default HeartDonationCampaign
