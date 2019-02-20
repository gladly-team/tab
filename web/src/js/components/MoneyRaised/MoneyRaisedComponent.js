import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { commaFormatted, currencyFormatted } from 'js/utils/utils'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import RaisedButton from 'material-ui/RaisedButton'
import { goToInviteFriends } from 'js/navigation/navigation'
import appTheme, {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
} from 'js/theme/default'

const Sparkle = lazy(() => import('react-sparkle'))

const fontColor = 'rgba(255, 255, 255, 0.8)'
const fontColorActive = 'white'
const styles = {
  moneyRaisedText: {
    color: fontColor,
  },
  dropdownText: {
    color: fontColorActive,
  },
}

class MoneyRaised extends React.Component {
  constructor(props) {
    super(props)
    this.timer = 0
    this.state = {
      moneyRaised: 0,
      hovering: false,
      open: false,
    }
    this.anchorEl = null
  }

  componentDidMount() {
    this.setCounter()
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  setCounter() {
    const { app } = this.props
    const secondsInDay = 864

    // Recalculate based on time that elapsed since the base amount.
    const moneyRaised = app.moneyRaised
    const dollarsPerDayRate = app.dollarsPerDayRate
    const secondsPerPenny = secondsInDay / dollarsPerDayRate

    this.setState({
      moneyRaised: moneyRaised,
    })

    if (secondsPerPenny > 0) {
      const millisecondsPerPenny = Math.round(Math.abs(secondsPerPenny) * 1000)
      this.timer = setInterval(() => {
        this.setState({
          moneyRaised: +(this.state.moneyRaised + 0.01).toFixed(2),
        })
      }, millisecondsPerPenny)
    }
  }

  // Returns boolean, whether we're drawing attention to the current
  // amount raised
  celebratingMilestone() {
    const milestoneStart = 5e5
    const milestoneEnd = 5.03e5
    return (
      this.state.moneyRaised >= milestoneStart &&
      this.state.moneyRaised < milestoneEnd
    )
  }

  render() {
    if (!this.props.app) {
      return null
    }
    const celebrateMilestone = this.celebratingMilestone()
    const milestoneMoneyRaisedColor = '#FFEBA2'
    const textStyle = Object.assign(
      {},
      {
        color: celebrateMilestone
          ? milestoneMoneyRaisedColor
          : this.state.hover
          ? dashboardIconActiveColor
          : dashboardIconInactiveColor,
        transition: 'color 300ms ease-in',
        cursor: 'pointer',
        fontSize: 18,
        fontFamily: appTheme.fontFamily,
        fontWeight: 'normal',
      },
      this.props.style
    )
    const moneyRaisedFormatted = `$${commaFormatted(
      currencyFormatted(this.state.moneyRaised)
    )}`

    return (
      <div
        ref={anchorEl => (this.anchorEl = anchorEl)}
        onClick={() => {
          if (this.celebratingMilestone() && this.props.launchFireworks) {
            this.props.launchFireworks(true)
          } else {
            this.setState({
              open: !this.state.open,
            })
          }
        }}
        onMouseEnter={() => {
          this.setState({
            hover: true,
          })
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false,
          })
        }}
        style={{
          position: 'relative',
          userSelect: 'none',
          cursor: 'default',
        }}
      >
        <span style={textStyle}>{moneyRaisedFormatted}</span>
        {celebrateMilestone ? (
          <Suspense fallback={null}>
            <Sparkle
              color={milestoneMoneyRaisedColor}
              count={18}
              fadeOutSpeed={40}
              overflowPx={14}
              flicker={false}
            />
          </Suspense>
        ) : null}
        <DashboardPopover
          open={this.state.open}
          anchorEl={this.anchorEl}
          onClose={() => {
            this.setState({
              open: false,
              hover: false,
            })
          }}
        >
          <div style={{ padding: 10, paddingTop: 0, width: 180 }}>
            <p>This is how much money Tabbers have raised for charity.</p>
            <p>Recruit your friends to raise more!</p>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <RaisedButton
                label="Invite Friends"
                primary
                onClick={goToInviteFriends}
                labelStyle={{
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        </DashboardPopover>
      </div>
    )
  }
}

MoneyRaised.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
  launchFireworks: PropTypes.func,
}

MoneyRaised.defaultProps = {
  style: {},
}

export default withStyles(styles)(MoneyRaised)
