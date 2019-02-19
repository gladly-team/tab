import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { commaFormatted } from 'js/utils/utils'
import { MAX_DAILY_HEARTS_FROM_TABS } from 'js/constants'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import CheckmarkIcon from '@material-ui/icons/Done'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'

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

const HeartsComponent = props => {
  const {
    classes,
    isHovering,
    isPopoverOpen,
    onClick,
    onMouseEnter,
    onMouseLeave,
    popoverAnchorElement,
    style,
    user,
  } = props

  // TODO: if we move this logic to the parent, remove the
  // fetched data from this container.
  // Used to let the user know they aren't earning any more
  // Hearts from tabs today.
  const reachedMaxDailyHeartsFromTabs =
    user.tabsToday >= MAX_DAILY_HEARTS_FROM_TABS

  // TODO: define style on parent
  const rootStyle = Object.assign(
    { marginRight: 0, display: 'flex', alignItems: 'center' },
    style
  )

  return (
    <div
      style={rootStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      data-tour-id={'hearts'}
    >
      <Typography
        style={{ ...(isHovering && { color: fontColorActive }) }}
        className={classes.heartCount}
      >
        {commaFormatted(user.vcCurrent)}
      </Typography>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <HeartBorderIcon
          style={{ ...(isHovering && { color: fontColorActive }) }}
          className={classes.heartIcon}
        />
        {reachedMaxDailyHeartsFromTabs ? (
          <CheckmarkIcon
            style={{ ...(isHovering && { color: fontColorActive }) }}
            className={classes.checkmarkIcon}
          />
        ) : null}
        {/* FIXME: style; pass this as a prop to the Hearts component */}
        {reachedMaxDailyHeartsFromTabs ? (
          <DashboardPopover
            open={isHovering && !isPopoverOpen}
            anchorEl={popoverAnchorElement}
            style={{
              textAlign: 'center',
              width: 210,
            }}
          >
            <div style={{ padding: 10 }}>
              You've earned the maximum Hearts from opening tabs today! You'll
              be able to earn more Hearts in a few hours.
            </div>
          </DashboardPopover>
        ) : null}
      </span>
    </div>
  )
}

HeartsComponent.displayName = 'HeartsComponent'

HeartsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  isHovering: PropTypes.bool.isRequired,
  isPopoverOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  popoverAnchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  user: PropTypes.shape({
    tabsToday: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }),
}

HeartsComponent.defaultProps = {
  classes: {},
  isHovering: false,
  isPopoverOpen: false,
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default withStyles(styles)(HeartsComponent)
