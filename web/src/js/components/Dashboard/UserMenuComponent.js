import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircleIcon from '@material-ui/icons/Lens'
import Typography from '@material-ui/core/Typography'
import theme from 'js/theme/defaultV1'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { inviteFriendsURL } from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

const defaultTheme = createMuiTheme(theme)

const styles = {
  circleIcon: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
}

const menuFontSize = 24

class UserMenu extends React.Component {
  async logout() {
    var logoutSuccess = false
    try {
      logoutSuccess = await logout()
    } catch (e) {
      logger.error(e)
    }
    if (logoutSuccess) {
      // FIXME: use goTo
      goToLogin()
    }
  }

  render() {
    const { app, classes, user, isUserAnonymous } = this.props
    return (
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          palette: {
            ...defaultTheme.palette,
            background: {
              ...defaultTheme.palette.background,
              paper: 'rgba(0, 0, 0, 0.36)',
            },
            divider: 'rgba(255, 255, 255, 0.20)',
          },
          typography: {
            ...defaultTheme.typography,
            h2: {
              ...defaultTheme.typography.h2,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: menuFontSize,
            },
            h3: {
              ...defaultTheme.typography.h3,
              color: '#fff',
            },
            h4: {
              ...defaultTheme.typography.h4,
              color: '#fff',
            },
            h5: {
              ...defaultTheme.typography.h5,
              color: '#fff',
            },
            body2: {
              ...defaultTheme.typography.body2,
              color: '#fff',
            },
          },
          overrides: {
            ...defaultTheme.overrides,
            MuiListItemIcon: {
              ...get(defaultTheme, 'overrides.MuiListItemIcon', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiListItemIcon.root', {}),
                color: '#fff',
              },
            },
            MuiButtonBase: {
              ...get(defaultTheme, 'overrides.MuiButtonBase', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiButtonBase.root', {}),
                color: '#fff',
              },
            },
            MuiIconButton: {
              ...get(defaultTheme, 'overrides.MuiIconButton', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiIconButton.root', {}),
                color: '#fff',
              },
            },
            MuiSvgIcon: {
              ...get(defaultTheme, 'overrides.MuiSvgIcon', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiSvgIcon.root', {}),
                color: '#fff',
                fontSize: menuFontSize,
              },
            },
            MuiTypography: {
              ...get(defaultTheme, 'overrides.MuiTypography', {}),
              h2: {
                ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
                '&:hover': {
                  color: '#fff',
                },
              },
            },
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <MoneyRaised
            app={app}
            dropdown={({ open, onClose, anchorElement }) => (
              <DashboardPopover
                open={open}
                anchorEl={anchorElement}
                onClose={onClose}
                style={{
                  marginTop: 6,
                }}
              >
                <div style={{ padding: 12, width: 160 }}>
                  <Typography
                    variant={'body2'}
                    className={classes.dropdownText}
                    gutterBottom
                  >
                    This is how much money our community has raised for charity.
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
            )}
          />
          <CircleIcon
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
            }}
            classes={{
              root: classes.circleIcon,
            }}
          />
          <Hearts
            app={app}
            user={user}
            showMaxHeartsFromTabsMessage
            dropdown={({ open, onClose, anchorElement }) => (
              <HeartsDropdown
                app={app}
                user={user}
                open={open}
                onClose={onClose}
                anchorElement={anchorElement}
                style={{
                  marginTop: 6,
                }}
              />
            )}
          />
          <SettingsButton
            dropdown={({ open, onClose, anchorElement }) => (
              <SettingsDropdown
                open={open}
                anchorElement={anchorElement}
                onClose={onClose}
                onLogoutClick={this.logout.bind(this)}
                isUserAnonymous={isUserAnonymous}
              />
            )}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

UserMenu.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool,
  user: PropTypes.shape({}).isRequired,
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
}

export default withStyles(styles)(UserMenu)
