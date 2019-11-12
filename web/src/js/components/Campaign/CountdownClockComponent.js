import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class CountdownClock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      countdownClock: this.getCountdownClockText(),
    }
  }

  getCountdownClockText() {
    const campaignEndDatetime = moment(this.props.campaignEndDatetime)
    var timeRemaining = campaignEndDatetime.diff(moment.utc(), 'milliseconds')
    if (timeRemaining < 0) {
      timeRemaining = 0
    }
    const duration = moment.duration(timeRemaining, 'milliseconds')
    return `${parseInt(
      duration.asDays(),
      10
    )}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
  }

  componentDidMount() {
    const self = this

    // Every second, update the countdown clock
    this.timeRemainingInterval = setInterval(() => {
      self.setState({
        countdownClock: self.getCountdownClockText(),
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timeRemainingInterval)
  }

  render() {
    return <span>{this.state.countdownClock}</span>
  }
}

CountdownClock.propTypes = {
  campaignStartDatetime: PropTypes.instanceOf(moment),
  campaignEndDatetime: PropTypes.instanceOf(moment).isRequired,
}

export default CountdownClock
