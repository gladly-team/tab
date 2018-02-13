
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
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

export const CAMPAIGN_END_TIME_ISO = '2018-02-22T20:00:00.000Z'

class StickerCampaign extends React.Component {
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
          Get 2 friends using Tab for a Cause for at least 1 day, and we'll send
          you some laptop stickers. Be one of the top recruiters and have your
          pick of Tab gear!
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
          >
            <TextField
              id={'refer-friend-input'}
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
          <span
            style={{
              fontSize: 12,
              color: lighterTextColor,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 4
            }}
          >
            {this.state.countdownClock} remaining
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
      edges: PropTypes.array.isRequired,
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
