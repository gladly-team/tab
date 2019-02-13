import React from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import Divider from 'material-ui/Divider'
import { dividerColor, dashboardIconActiveColor } from 'js/theme/default'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { goToInviteFriends, goToDonate } from 'js/navigation/navigation'

const HeartsDropdownComponent = props => {
  const { anchorElement, app, onClose, open, user } = props

  // Hearts popover style
  const heartsPopoverStyle = {
    textAlign: 'center',
    width: 210,
  }
  const heartsPopoverSectionStyle = {}
  const dividerStyle = {
    marginTop: 16,
    marginBottom: 12,
  }
  const statTextStyle = {
    fontSize: 14,
    display: 'block',
    marginTop: 4,
    marginBottom: 4,
  }
  const smallHeartIconStyle = {
    height: 16,
    marginLeft: -3,
  }
  const statNumberStyle = {
    fontSize: 24,
    display: 'block',
  }
  const popoverButtonStyle = {
    marginTop: 6,
    marginBottom: 0,
  }
  const popoverButtonLabelStyle = {
    fontSize: 13,
  }

  // Popover section on how to earn Hearts.
  const rewardMethodContainerStyle = Object.assign({}, statTextStyle, {
    display: 'flex',
    textAlign: 'left',
    color: dividerColor,
    marginTop: 1,
    marginBottom: 1,
  })
  const rewardAmountsSectionStyle = Object.assign(
    {},
    heartsPopoverSectionStyle,
    {
      paddingLeft: 22,
      paddingRight: 22,
    }
  )
  const rewardTextStyle = {
    textAlign: 'left',
    flex: 6,
  }
  const rewardValueStyle = {
    flex: 3,
    textAlign: 'right',
  }

  return (
    <DashboardPopover
      open={open}
      anchorEl={anchorElement}
      onRequestClose={onClose}
      style={heartsPopoverStyle}
    >
      <div style={{ paddingTop: 10, paddingBottom: 10 }}>
        <div style={heartsPopoverSectionStyle}>
          <span style={statTextStyle}>
            <span style={statNumberStyle}>Level {user.level}</span>
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span>{user.heartsUntilNextLevel}</span>
            <HeartBorderIcon
              style={smallHeartIconStyle}
              color={dashboardIconActiveColor}
            />
            <span> until next level</span>
          </div>
        </div>
        <Divider style={dividerStyle} />
        <div style={heartsPopoverSectionStyle}>
          <span style={statTextStyle}>
            <span
              style={Object.assign({}, statNumberStyle, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <span>{user.vcDonatedAllTime}</span>
              <HeartBorderIcon
                style={{
                  marginLeft: 2,
                  height: 24,
                  width: 24,
                  paddingBottom: 1,
                }}
                color={dashboardIconActiveColor}
              />
            </span>
            <span>Donated</span>
          </span>
          <div>
            <RaisedButton
              label="Donate Hearts"
              style={popoverButtonStyle}
              labelStyle={popoverButtonLabelStyle}
              primary
              onClick={goToDonate}
            />
          </div>
        </div>
        <Divider style={dividerStyle} />
        <div style={heartsPopoverSectionStyle}>
          <span style={statTextStyle}>
            <span style={statNumberStyle}>{user.numUsersRecruited}</span>{' '}
            Tabbers Recruited
          </span>
          <div>
            <RaisedButton
              label="Invite A Friend"
              labelPosition="before"
              style={popoverButtonStyle}
              labelStyle={popoverButtonLabelStyle}
              primary
              onClick={goToInviteFriends}
            />
          </div>
        </div>
        <Divider style={dividerStyle} />
        <div style={rewardAmountsSectionStyle}>
          <span style={rewardMethodContainerStyle}>
            <span style={rewardTextStyle}>Open a tab</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={rewardValueStyle}>1</span>
              <HeartBorderIcon
                style={Object.assign({}, smallHeartIconStyle, {
                  marginRight: -4,
                })}
                color={dividerColor}
              />
            </span>
          </span>
          <span style={rewardMethodContainerStyle}>
            <span style={rewardTextStyle}>Recruit a friend</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={rewardValueStyle}>{app.referralVcReward}</span>
              <HeartBorderIcon
                style={Object.assign({}, smallHeartIconStyle, {
                  marginRight: -4,
                })}
                color={dividerColor}
              />
            </span>
          </span>
        </div>
      </div>
    </DashboardPopover>
  )
}

HeartsDropdownComponent.displayNamae = 'HeartsDropdownComponent'

HeartsDropdownComponent.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired,
  }),
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
    numUsersRecruited: PropTypes.number.isRequired,
    tabsToday: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

HeartsDropdownComponent.defaultProps = {
  open: false,
}

export default HeartsDropdownComponent
