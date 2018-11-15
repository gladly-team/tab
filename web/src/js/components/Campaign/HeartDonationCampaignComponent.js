
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'

class HeartDonationCampaign extends React.Component {
  render () {
    const { app, user, campaignStartDatetime, campaignEndDatetime, showError } = this.props

    return (
      <div
        style={{
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
          <Typography variant={'h6'}>Lorem ipsum dolor sit amet!</Typography>
        </span>
        <Typography
          variant={'body2'}
          style={{
            display: 'block',
            marginTop: 8,
            marginBottom: 8
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
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
          <Typography variant={'caption'}>
            <CountdownClock
              campaignStartDatetime={campaignStartDatetime}
              campaignEndDatetime={campaignEndDatetime}
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
    }).isRequired
  }),
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired
  }),
  campaignStartDatetime: PropTypes.instanceOf(moment),
  campaignEndDatetime: PropTypes.instanceOf(moment).isRequired,
  showError: PropTypes.func.isRequired
}

export default HeartDonationCampaign
