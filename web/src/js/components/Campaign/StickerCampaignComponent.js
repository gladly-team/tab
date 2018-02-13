
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui-next/TextField'
import { withStyles } from 'material-ui-next/styles'
import appTheme, {
  alternateAccentColor,
  lighterTextColor
} from 'theme/default'

const styles = theme => ({
  inputInkbar: {
    '&:after': {
      backgroundColor: alternateAccentColor
    }
  },
  inputLabelFocused: {
    color: alternateAccentColor
  }
})

// Note: also hardcoded in StickerCampaignContainer
export const CAMPAIGN_START_TIME_ISO = '2018-02-13T21:00:00.000Z'
export const CAMPAIGN_END_TIME_ISO = '2018-02-22T20:00:00.000Z'

class CountdownClock extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      countdownClock: this.getCountdownClockText()
    }
  }

  getCountdownClockText () {
    const campaignEndDatetime = moment(CAMPAIGN_END_TIME_ISO)
    var timeRemaining = campaignEndDatetime.diff(moment.utc(), 'milliseconds')
    if (timeRemaining < 0) {
      timeRemaining = 0
    }
    const duration = moment.duration(timeRemaining, 'milliseconds')
    return `${duration.days()}d ${duration.hours()}h
      ${duration.minutes()}m ${duration.seconds()}s`
  }

  componentWillMount () {
    const self = this

    // Every second, update the countdown clock
    this.timeRemainingInterval = setInterval(() => {
      self.setState({
        countdownClock: self.getCountdownClockText()
      })
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timeRemainingInterval)
  }

  render () {
    return <span>{this.state.countdownClock}</span>
  }
}

class StickerCampaign extends React.Component {
  onTextFieldClicked () {
    this.input.select()
  }

  getReferralUrl () {
    return `https://tab.gladly.io/?u=${this.props.user.username}`
  }

  render () {
    const { user, classes } = this.props
    const recruitsActiveForLessThanOneDay = (user.recruits.totalRecruits -
      user.recruits.recruitsActiveForAtLeastOneDay)
    const referralUrl = this.getReferralUrl()
    const anchorStyle = {
      textDecoration: 'none',
      color: alternateAccentColor
    }
    return (
      <div
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          fontFamily: appTheme.fontFamily,
          color: appTheme.textColor
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 20,
            marginTop: 4,
            lineHeight: '140%'
          }}
        >
          Spread the love, get some love!
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8
          }}
        >
          Get 2 friends using Tab for a Cause for at least 1 day,
          and <a style={anchorStyle} href='https://business.facebook.com/notes/tab-for-a-cause/love-and-stickers-for-all/1718875268155553/' target='_blank'>
          we'll send you some laptop stickers</a>. Be one of the top recruiters and
          <a style={anchorStyle} href='https://shop.spreadshirt.com/tab-for-a-cause/' target='_blank'> have your pick of Tab gear!</a>
        </span>
        <div
          style={{
            marginTop: 20,
            marginBottom: 8,
            lineHeight: '120%'
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: alternateAccentColor
            }}
          >
            {user.recruits.recruitsActiveForAtLeastOneDay}/2 Tabbers recruited
          </div>
          <div
            style={{
              fontSize: 12,
              color: lighterTextColor
            }}
          >
            {recruitsActiveForLessThanOneDay} friends active for &lt;1 day
          </div>
        </div>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              width: 280,
              marginTop: 12,
              marginBottom: 12
            }}
          > {
            (user.recruits.recruitsActiveForAtLeastOneDay >= 2)
            ? (
              <span
                data-test-id={'sticker-campaign-success'}
              >
                <span
                  style={{
                    fontSize: 14
                  }}
                >
                  Congrats, you did it! (And thanks!) Tell us where we should send your prize:
                </span>
                <a href='https://docs.google.com/forms/d/e/1FAIpQLScVcV3EkYpkhqUG7hDGULUMJM_h57-3GnaRSg95p_UheP44dw/viewform' target='_blank'>
                  <RaisedButton
                    label='Claim Your Stickers'
                    style={{
                      display: 'block',
                      marginTop: 8
                    }}
                    primary
                  />
                </a>
              </span>
            )
            : (
              <span data-test-id={'sticker-campaign-still-working'}>
                <TextField
                  id={'sticker-campaign-refer-friend-input'}
                  inputRef={(input) => { this.input = input }}
                  onClick={this.onTextFieldClicked.bind(this)}
                  value={referralUrl}
                  label={'Send this to a few friends:'}
                  fullWidth
                  InputProps={{
                    classes: {
                      inkbar: classes.inputInkbar
                    }
                  }}
                  inputProps={{
                    style: {
                      fontSize: 14,
                      textAlign: 'left'
                    }
                  }}
                  InputLabelProps={{
                    FormControlClasses: {
                      focused: classes.inputLabelFocused
                    }
                  }}
                />
              </span>
            )
          }
          </span>
          <span
            style={{
              fontSize: 12,
              color: lighterTextColor,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 4
            }}
          >
            <span><CountdownClock /> remaining</span>
          </span>
        </span>
      </div>
    )
  }
}

StickerCampaign.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    recruits: PropTypes.shape({
      totalRecruits: PropTypes.number,
      recruitsActiveForAtLeastOneDay: PropTypes.number
    }).isRequired
  }),
  isCampaignLive: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

StickerCampaign.defautProps = {
  isCampaignLive: false
}

export default withStyles(styles)(StickerCampaign)
