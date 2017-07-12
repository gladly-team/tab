import React from 'react'
import PropTypes from 'prop-types'
import { commaFormatted, currencyFormatted } from 'utils/utils'

class MoneyRaised extends React.Component {
  constructor (props) {
    super(props)
    this.timer = 0
    this.state = {
      amountDonated: 0
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

  render () {
    if (!this.props.app) { return null }

    const { app } = this.props

    const container = {
      textAlign: 'center',
      position: 'absolute',
      top: 100,
      right: 20
    }

    const text = {
      color: 'white',
      fontSize: '2em',
      fontWeight: 'normal',
      fontFamily: "'Helvetica Neue', Roboto, 'Segoe UI', Calibri, sans-serif",
      marginTop: 10,
      marginBottom: 10
    }

    const moneyRaised = this.state.amountDonated
    var amountDonated = '$' + commaFormatted(currencyFormatted(moneyRaised))

    return (
      <div style={container}>
        <span style={text}>{amountDonated}</span>
      </div>
    )
  }
}

MoneyRaised.propTypes = {
  app: PropTypes.object
}

export default MoneyRaised
