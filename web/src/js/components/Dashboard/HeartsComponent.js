import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { commaFormatted } from 'js/utils/utils'
import { MAX_DAILY_HEARTS_FROM_TABS } from 'js/constants'

import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import CheckmarkIcon from 'material-ui/svg-icons/action/done'
import appTheme, {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
} from 'js/theme/default'

const styles = {}

const HeartsComponent = props => {
  const { isHovering, onClick, onMouseEnter, onMouseLeave, style, user } = props

  // TODO: if we move this logic to the parent, remove the
  // fetched data from this container.
  // Used to let the user know they aren't earning any more
  // Hearts from tabs today.
  const reachedMaxDailyHeartsFromTabs =
    user.tabsToday >= MAX_DAILY_HEARTS_FROM_TABS

  const heartsPopoverStyle = {
    textAlign: 'center',
    width: 210,
  }
  const textStyle = Object.assign(
    {},
    {
      color: isHovering ? dashboardIconActiveColor : dashboardIconInactiveColor,
      transition: 'color 300ms ease-in',
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily,
      userSelect: 'none',
      cursor: 'pointer',
    },
    style
  )
  const heartsStyle = Object.assign({}, textStyle, {
    marginRight: 0,
    display: 'flex',
    alignItems: 'center',
  })
  return (
    <div
      style={heartsStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      data-tour-id={'hearts'}
    >
      <span>{commaFormatted(user.vcCurrent)}</span>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <HeartBorderIcon
          style={{ marginLeft: 2, height: 24, width: 24, paddingBottom: 0 }}
          color={dashboardIconInactiveColor}
          hoverColor={dashboardIconActiveColor}
        />
        {reachedMaxDailyHeartsFromTabs ? (
          <CheckmarkIcon
            style={{
              height: 16,
              width: 16,
              position: 'absolute',
              paddingLeft: 4,
              paddingBottom: 2,
            }}
            color={dashboardIconInactiveColor}
            hoverColor={dashboardIconActiveColor}
          />
        ) : null}
        {/* FIXME: style; pass this as a prop to the Hearts component */}
        {reachedMaxDailyHeartsFromTabs ? (
          <DashboardPopover
            open={isHovering && !this.state.heartsPopoverOpen}
            anchorEl={this.state.heartsHoverPopoverAnchorElem}
            style={heartsPopoverStyle}
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
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  user: PropTypes.shape({
    tabsToday: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }),
}

HeartsComponent.defaultProps = {
  classes: {},
  isHovering: false,
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default withStyles(styles)(HeartsComponent)
