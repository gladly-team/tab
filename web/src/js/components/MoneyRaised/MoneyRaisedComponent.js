import React from 'react'
import PropTypes from 'prop-types'
import { commaFormatted, currencyFormatted } from 'utils/utils'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import MoneyRaisedPopover from './MoneyRaisedPopover'
import appTheme from 'theme/default'

class MoneyRaised extends React.Component {
  constructor (props) {
    super(props)
    this.timer = 0
    this.state = {
      amountDonated: 0,
      open: false
    }
  }

  incrementAmount () {
    var latestAmountRaised = this.state.amountDonated
    var newAmountRaisedRounded = +(latestAmountRaised + 0.01).toFixed(2)
    this.setState({
      amountDonated: newAmountRaisedRounded
    })
  }

  componentDidMount () {
    this.setCounter(this.props.app)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.app && nextProps.app) {
      this.setCounter(nextProps.app)
    }
  }

  setCounter (app) {
    if (!app) { return }

    const secondsInDay = 864
      // Recalculate based on time that elapsed since the base amount.
    const moneyRaised = app.moneyRaised
    const dollarsPerDayRate = app.dollarsPerDayRate
    const secondsPerPenny = secondsInDay / (dollarsPerDayRate)

    this.setState({
      amountDonated: moneyRaised
    })

    if (!(secondsPerPenny <= 0)) {
      var millisecondsPerPenny = Math.round(Math.abs(secondsPerPenny) * 1000)
      this.timer = setInterval(this.incrementAmount.bind(this), millisecondsPerPenny)
    }
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  handleTouchTap (event) {
    // This prevents ghost click.
    event.preventDefault()
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handlePopoverRequestClose () {
    this.setState({
      open: false
    })
  }

  render () {
    if (!this.props.app) { return null }

    const container = {
      textAlign: 'center',
      userSelect: 'none',
      cursor: 'default'
    }

    const text = {
      color: 'white',
      fontSize: 24,
      fontFamily: appTheme.fontFamily,
      fontWeight: 'normal'
    }

    const moneyRaised = this.state.amountDonated
    var amountDonated = '$' + commaFormatted(currencyFormatted(moneyRaised))

    return (
      <FadeInDashboardAnimation>
        <div
          onMouseEnter={this.handleTouchTap.bind(this)}
          onMouseLeave={this.handlePopoverRequestClose.bind(this)}
          style={container}>
          <span
            style={text}>{amountDonated}</span>
          <MoneyRaisedPopover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            onRequestClose={this.handlePopoverRequestClose.bind(this)} />
        </div>
      </FadeInDashboardAnimation>
    )
  }
}

MoneyRaised.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired
  })
}

export default MoneyRaised
