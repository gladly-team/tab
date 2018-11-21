
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
      title,
      heartsGoal
    } = campaign
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
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 4
          }}
        >
          <Typography variant={'h6'}>{title}</Typography>
        </span>
        {children}
        <DonateHeartsControls
          charity={app.charity}
          user={user}
          showError={showError}
        />
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
    title: PropTypes.string.isRequired,
    heartsGoal: PropTypes.number.isRequired
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  showError: PropTypes.func.isRequired
}

export default HeartDonationCampaign
