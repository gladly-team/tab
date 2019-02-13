import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RaisedButton from 'material-ui/RaisedButton'
import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import Divider from 'material-ui/Divider'
import { dividerColor, dashboardIconActiveColor } from 'js/theme/default'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { goToInviteFriends, goToDonate } from 'js/navigation/navigation'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const styles = {
  root: {
    color: 'white',
  },
}

const HeartsDropdownComponent = props => {
  const { anchorElement, app, classes, onClose, open, user } = props

  const dividerStyle = {
    marginTop: 16,
    marginBottom: 12,
  }
  const popoverButtonStyle = {
    marginTop: 6,
    marginBottom: 0,
  }
  const popoverButtonLabelStyle = {
    fontSize: 13,
  }

  return (
    <DashboardPopover open={open} anchorEl={anchorElement} onClose={onClose}>
      <div
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          width: 210,
          textAlign: 'center',
        }}
      >
        <div>
          <Typography
            classes={{
              root: classes.root,
            }}
            variant={'h5'}
            color={'primary'}
          >
            Level {user.level}
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
            >
              {user.heartsUntilNextLevel}
            </Typography>
            <HeartBorderIcon
              style={{
                height: 16, // TODO: use body2 font size
              }}
              color={dashboardIconActiveColor}
            />
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
            >
              {' '}
              until next level
            </Typography>
          </div>
        </div>
        <Divider style={dividerStyle} />
        <div>
          <span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                classes={{
                  root: classes.root,
                }}
                variant={'h5'}
              >
                {user.vcDonatedAllTime}
              </Typography>
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
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
            >
              donated
            </Typography>
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
        <div>
          <div>
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'h5'}
            >
              {user.numUsersRecruited}
            </Typography>
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
            >
              Tabbers Recruited
            </Typography>
          </div>
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
        <div
          style={{
            paddingLeft: 22,
            paddingRight: 22,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex' }}>
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
              style={{
                flex: 6,
              }}
            >
              Open a tab
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                classes={{
                  root: classes.root,
                }}
                variant={'body2'}
                style={{ textAlign: 'right' }}
              >
                1
              </Typography>
              <HeartBorderIcon
                style={{
                  height: 16,
                }}
                color={dividerColor}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <Typography
              classes={{
                root: classes.root,
              }}
              variant={'body2'}
              style={{
                flex: 6,
              }}
            >
              Recruit a friend
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                classes={{
                  root: classes.root,
                }}
                variant={'body2'}
                style={{ textAlign: 'right' }}
              >
                {app.referralVcReward}
              </Typography>
              <HeartBorderIcon
                style={{
                  height: 16,
                }}
                color={dividerColor}
              />
            </div>
          </div>
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
  classes: PropTypes.object.isRequired,
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

export default withStyles(styles)(HeartsDropdownComponent)
