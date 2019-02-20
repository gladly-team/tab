import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { commaFormatted, currencyFormatted } from 'js/utils/utils'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { inviteFriendsURL } from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

const Sparkle = lazy(() => import('react-sparkle'))

const fontColor = 'rgba(255, 255, 255, 0.8)'
const fontColorActive = 'white'
const styles = {
  moneyRaisedText: {
    color: fontColor,
    fontSize: 24,
    fontWeight: 'normal',
    transition: 'color 300ms ease-in',
    cursor: 'pointer',
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
      isHovering: false,
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
    const { moneyRaised } = this.state
    const milestoneStart = 5e5
    const milestoneEnd = 5.03e5
    return moneyRaised >= milestoneStart && moneyRaised < milestoneEnd
  }

  render() {
    const { app, classes, launchFireworks } = this.props
    const { isHovering, moneyRaised } = this.state
    if (!app) {
      return null
    }
    const celebrateMilestone = this.celebratingMilestone()
    const milestoneMoneyRaisedColor = '#FFEBA2'
    const moneyRaisedFormatted = `$${commaFormatted(
      currencyFormatted(moneyRaised)
    )}`

    return (
      <div
        ref={anchorEl => (this.anchorEl = anchorEl)}
        onClick={() => {
          if (this.celebratingMilestone() && launchFireworks) {
            launchFireworks(true)
          } else {
            this.setState({
              open: !this.state.open,
            })
          }
        }}
        onMouseEnter={() => {
          this.setState({
            isHovering: true,
          })
        }}
        onMouseLeave={() => {
          this.setState({
            isHovering: false,
          })
        }}
        style={{
          position: 'relative',
          userSelect: 'none',
          cursor: 'default',
        }}
      >
        <Typography
          className={classes.moneyRaisedText}
          style={{
            color: celebrateMilestone
              ? milestoneMoneyRaisedColor
              : isHovering
              ? fontColorActive
              : fontColor,
          }}
        >
          {moneyRaisedFormatted}
        </Typography>
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
              isHovering: false,
            })
          }}
        >
          <div style={{ padding: 12, width: 160 }}>
            <Typography
              variant={'body2'}
              className={classes.dropdownText}
              gutterBottom
            >
              This is how much money Tabbers have raised for charity.
            </Typography>
            <Typography
              variant={'body2'}
              className={classes.dropdownText}
              gutterBottom
            >
              Recruit your friends to raise more!
            </Typography>
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Link to={inviteFriendsURL}>
                <Button variant={'contained'} color={'primary'}>
                  Invite Friends
                </Button>
              </Link>
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
  launchFireworks: PropTypes.func,
}

MoneyRaised.defaultProps = {}

export default withStyles(styles)(MoneyRaised)
