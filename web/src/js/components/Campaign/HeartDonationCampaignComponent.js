
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'

class HeartDonationCampaign extends React.Component {
  render () {
    const {
      app,
      user,
      campaignTitle,
      children,
      campaignStartDatetime,
      campaignEndDatetime,
      showError
    } = this.props

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
          <Typography variant={'h6'}>{campaignTitle}</Typography>
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
  campaignTitle: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  showError: PropTypes.func.isRequired
}

export default HeartDonationCampaign
