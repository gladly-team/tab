import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { commaFormatted } from 'js/utils/utils'
import { MAX_DAILY_HEARTS_FROM_TABS } from 'js/constants'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import CheckmarkIcon from '@material-ui/icons/Done'
import Typography from '@material-ui/core/Typography'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'
import MaxHeartsDropdownMessageComponent from 'js/components/Dashboard/MaxHeartsDropdownMessageComponent'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const fontColor = 'rgba(255, 255, 255, 0.8)'
const fontColorActive = 'white'
const styles = {
  heartCount: {
    color: fontColor,
    transition: 'color 300ms ease-in',
    fontSize: 24,
    fontWeight: 'normal',
    userSelect: 'none',
    cursor: 'pointer',
  },
  heartIcon: {
    color: fontColor,
    transition: 'color 300ms ease-in',
    cursor: 'pointer',
    marginLeft: 2,
    height: 24,
    width: 24,
    paddingBottom: 0,
  },
  checkmarkIcon: {
    color: fontColor,
    transition: 'color 300ms ease-in',
    cursor: 'pointer',
    height: 16,
    width: 16,
    position: 'absolute',
    paddingLeft: 4,
    paddingBottom: 2,
  },
}

class HeartsComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      isPopoverOpen: false,
    }
    this.anchorElement = null
  }

  render() {
    const { app, classes, user } = this.props
    const { isHovering, isPopoverOpen } = this.state
    const anchorElement = this.anchorElement

    // Used to let the user know they aren't earning any more
    // Hearts from tabs today.
    const reachedMaxDailyHeartsFromTabs =
      user.tabsToday >= MAX_DAILY_HEARTS_FROM_TABS

    return (
      <div>
        <div
          data-tour-id={'hearts'}
          ref={anchorElement => (this.anchorElement = anchorElement)}
          onMouseEnter={event => {
            this.setState({
              isHovering: true,
            })
          }}
          onMouseLeave={event => {
            this.setState({
              isHovering: false,
            })
          }}
          onClick={event => {
            this.setState({
              isPopoverOpen: true,
            })
          }}
          style={{ marginRight: 0, display: 'flex', alignItems: 'center' }}
        >
          <Typography
            style={{
              ...((isHovering || isPopoverOpen) && { color: fontColorActive }),
            }}
            className={classes.heartCount}
          >
            {commaFormatted(user.vcCurrent)}
          </Typography>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HeartBorderIcon
              style={{
                ...((isHovering || isPopoverOpen) && {
                  color: fontColorActive,
                }),
              }}
              className={classes.heartIcon}
            />
            {reachedMaxDailyHeartsFromTabs ? (
              <CheckmarkIcon
                style={{
                  ...((isHovering || isPopoverOpen) && {
                    color: fontColorActive,
                  }),
                }}
                className={classes.checkmarkIcon}
              />
            ) : null}
          </div>
        </div>
        <HeartsDropdown
          app={app}
          user={user}
          open={isPopoverOpen}
          onClose={() => {
            this.setState({
              isPopoverOpen: false,
            })
          }}
          anchorElement={anchorElement}
        />
        <MaxHeartsDropdownMessageComponent
          open={reachedMaxDailyHeartsFromTabs && isHovering && !isPopoverOpen}
          anchorElement={anchorElement}
        />
      </div>
    )
  }
}

HeartsComponent.displayName = 'HeartsComponent'

HeartsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    tabsToday: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }),
}

HeartsComponent.defaultProps = {
  classes: {},
}

export default withStyles(styles)(HeartsComponent)
