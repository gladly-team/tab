import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import { commaFormatted, currencyFormatted } from 'js/utils/utils'

const Sparkle = lazy(() => import('react-sparkle'))

const styles = {
  buttonBase: {
    borderRadius: 2,
  },
  moneyRaisedText: {
    fontWeight: 'normal',
    transition: 'color 300ms ease-in',
    cursor: 'pointer',
  },
  dropdownText: {},
}

class MoneyRaised extends React.Component {
  constructor(props) {
    super(props)
    this.timer = 0
    this.state = {
      moneyRaised: 0,
      isPopoverOpen: false,
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
    const { app, classes, dropdown, launchFireworks, theme } = this.props
    const { moneyRaised, isPopoverOpen } = this.state
    if (!app) {
      return null
    }
    const celebrateMilestone = this.celebratingMilestone()
    const milestoneMoneyRaisedColor = '#FFEBA2'
    const moneyRaisedFormatted = `$${commaFormatted(
      currencyFormatted(moneyRaised)
    )}`

    return (
      <div style={{ position: 'relative' }}>
        <ButtonBase className={classes.buttonBase}>
          <div
            data-test-id={'money-raised-button'}
            ref={anchorEl => (this.anchorEl = anchorEl)}
            onClick={() => {
              if (this.celebratingMilestone() && launchFireworks) {
                launchFireworks(true)
              } else {
                this.setState({
                  isPopoverOpen: !this.state.open,
                })
              }
            }}
            style={{
              userSelect: 'none',
              cursor: 'default',
            }}
          >
            <Typography
              variant={'h2'}
              className={classes.moneyRaisedText}
              style={{
                // TODO: milestone color when celebrating a milestone
                ...(isPopoverOpen && {
                  color: get(
                    theme,
                    'overrides.MuiTypography.h2.&:hover.color',
                    'inherit'
                  ),
                }),
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
          </div>
        </ButtonBase>
        {dropdown({
          open: isPopoverOpen,
          onClose: () => {
            this.setState({
              isPopoverOpen: false,
            })
          },
          anchorElement: this.anchorEl,
        })}
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
  dropdown: PropTypes.func.isRequired,
  launchFireworks: PropTypes.func,
  theme: PropTypes.object.isRequired,
}

MoneyRaised.defaultProps = {}

export default withStyles(styles, { withTheme: true })(MoneyRaised)
