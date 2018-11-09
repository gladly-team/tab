
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Logo from 'js/components/Logo/Logo'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'

// TODO: use Typography

class HeartDonationCampaign extends React.Component {
  render () {
    const { user, campaignStartDatetime, campaignEndDatetime } = this.props
    // const anchorStyle = {
    //   textDecoration: 'none'
    //   // color: alternateAccentColor
    // }

    return (
      <div
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12
          // fontFamily: appTheme.fontFamily,
          // color: appTheme.textColor
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 20,
            marginTop: 4,
            lineHeight: '140%'
          }}
        >
          <span style={{
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <Logo style={{ height: 30, marginRight: 8 }} />
            <span>Lorem ipsum dolor sit amet!</span>
          </span>
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </span>
        <div>Donate your {user.vcCurrent} Hearts!</div>
        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            lineHeight: '120%'
          }}
        >
          <span
            style={{
              fontSize: 12,
              // color: lighterTextColor,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 4
            }}
          >
            <span>
              <CountdownClock
                campaignStartDatetime={campaignStartDatetime}
                campaignEndDatetime={campaignEndDatetime}
              />{' '}
              remaining
            </span>
          </span>
        </div>
      </div>
    )
  }
}

HeartDonationCampaign.propTypes = {
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired
  }),
  campaignStartDatetime: PropTypes.instanceOf(moment),
  campaignEndDatetime: PropTypes.instanceOf(moment).isRequired
}

export default HeartDonationCampaign
