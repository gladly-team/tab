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
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import HeartIcon from '@material-ui/icons/Favorite'
import HelpIcon from '@material-ui/icons/Help'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { commaFormatted } from 'js/utils/utils'
import theme from 'js/theme/searchTheme'
import Link from 'js/components/General/Link'
import LogSearchAccountCreation from 'js/components/Search/LogSearchAccountCreationComponent'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Search/SearchHeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import {
  goTo,
  searchAuthURL,
  searchDonateHeartsURL,
  searchExternalHelpURL,
  searchInviteFriendsURL,
} from 'js/navigation/navigation'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { logout } from 'js/authentication/user'
import logger from 'js/utils/logger'

const defaultTheme = createMuiTheme(theme)

const styles = theme => ({
  circleIcon: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
  heartsDropdownContainer: {
    paddingTop: 22,
    paddingBottom: 22,
    width: 210,
    textAlign: 'center',
  },
  heartsDropdownDonateHeartsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartsDropdownHeartIcon: {
    color: theme.typography.h5.color,
    marginLeft: 2,
    height: 24,
    width: 24,
    paddingBottom: 1,
  },
  heartsDropdownDonateHeartsButton: {
    marginTop: 12,
    marginBottom: 0,
  },
})

const menuFontSize = 22

const SearchMenuComponent = props => {
  const { app, classes, isSearchExtensionInstalled, style, user } = props
  const userExists = !!user

  // We only want to show the sign in button if the user is
  // not signed in and has already installed the extension.
  // Adding the extension is a higher priority.
  const showSignInButton = !userExists && isSearchExtensionInstalled

  // TODO:
  // Log a Search account creation if this is the user's
  // first search. Put it here as a convenient place to use
  // fetched user data.
  return (
    <MuiThemeProvider
      theme={{
        ...defaultTheme,
        typography: {
          ...defaultTheme.typography,
          h2: {
            ...defaultTheme.typography.h2,
            color: 'rgba(0, 0, 0, 0.66)',
            fontSize: menuFontSize,
          },
        },
        overrides: {
          MuiSvgIcon: {
            ...get(defaultTheme, 'overrides.MuiSvgIcon', {}),
            root: {
              ...get(defaultTheme, 'overrides.MuiSvgIcon.root', {}),
              color: 'rgba(0, 0, 0, 0.66)',
              fontSize: menuFontSize,
            },
          },
          MuiTypography: {
            ...get(defaultTheme, 'overrides.MuiTypography', {}),
            h2: {
              ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
              '&:hover': {
                color: 'rgba(0, 0, 0, 0.87)',
              },
            },
          },
        },
      }}
    >
      <div
        style={Object.assign(
          {
            display: 'flex',
            alignItems: 'center',
          },
          style
        )}
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
                {userExists ? (
                  <>
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
                      <Link to={searchInviteFriendsURL}>
                        <Button variant={'contained'} color={'primary'}>
                          Invite Friends
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : null}
              </div>
            </DashboardPopover>
          )}
        />
        {userExists || showSignInButton ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CircleIcon
              style={{
                color: 'rgba(0, 0, 0, 0.66)',
              }}
              classes={{
                root: classes.circleIcon,
              }}
            />
            {userExists ? (
              <>
                <Hearts
                  app={app}
                  user={user}
                  showMaxHeartsFromSearchesMessage
                  dropdown={({ open, onClose, anchorElement }) => (
                    <DashboardPopover
                      open={open}
                      anchorEl={anchorElement}
                      onClose={onClose}
                      style={{
                        marginTop: 6,
                      }}
                    >
                      <div className={classes.heartsDropdownContainer}>
                        <span>
                          <span
                            className={
                              classes.heartsDropdownDonateHeartsContainer
                            }
                          >
                            <Typography variant={'h5'}>
                              {commaFormatted(user.vcDonatedAllTime)}
                            </Typography>
                            <HeartBorderIcon
                              className={classes.heartsDropdownHeartIcon}
                            />
                          </span>
                          <Typography variant={'body2'}>donated</Typography>
                        </span>
                        <Link to={searchDonateHeartsURL}>
                          <Button
                            variant={'contained'}
                            color={'primary'}
                            className={classes.heartsDropdownDonateHeartsButton}
                          >
                            Donate Hearts
                          </Button>
                        </Link>
                      </div>
                    </DashboardPopover>
                  )}
                />
                <SettingsButton
                  dropdown={({ open, onClose, anchorElement }) => (
                    <DashboardPopover
                      open={open}
                      anchorEl={anchorElement}
                      onClose={onClose}
                    >
                      <MenuList style={{ width: 200 }}>
                        <Link to={searchDonateHeartsURL}>
                          <MenuItem>
                            <ListItemIcon>
                              <HeartIcon className={classes.icon} />
                            </ListItemIcon>
                            <ListItemText
                              classes={{ primary: classes.listItemTextPrimary }}
                              primaryTypographyProps={{ variant: 'body2' }}
                            >
                              Donate Hearts
                            </ListItemText>
                          </MenuItem>
                        </Link>
                        <Link to={searchInviteFriendsURL}>
                          <MenuItem>
                            <ListItemIcon>
                              <PersonAddIcon className={classes.icon} />
                            </ListItemIcon>
                            <ListItemText
                              classes={{ primary: classes.listItemTextPrimary }}
                              primaryTypographyProps={{ variant: 'body2' }}
                            >
                              Invite Friends
                            </ListItemText>
                          </MenuItem>
                        </Link>
                        <Divider />
                        <Link to={searchExternalHelpURL} target="_blank">
                          <MenuItem>
                            <ListItemIcon>
                              <HelpIcon className={classes.icon} />
                            </ListItemIcon>
                            <ListItemText
                              classes={{ primary: classes.listItemTextPrimary }}
                              primaryTypographyProps={{ variant: 'body2' }}
                            >
                              Help
                            </ListItemText>
                          </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem
                          onClick={async () => {
                            var logoutSuccess = false
                            try {
                              logoutSuccess = await logout()
                            } catch (e) {
                              logger.error(e)
                            }
                            if (logoutSuccess) {
                              goTo(searchAuthURL)
                            }
                          }}
                        >
                          <ListItemIcon>
                            <ExitToAppIcon className={classes.icon} />
                          </ListItemIcon>
                          <ListItemText
                            classes={{ primary: classes.listItemTextPrimary }}
                            primaryTypographyProps={{ variant: 'body2' }}
                          >
                            Sign Out
                          </ListItemText>
                        </MenuItem>
                      </MenuList>
                    </DashboardPopover>
                  )}
                />
              </>
            ) : showSignInButton ? (
              <Link to={searchAuthURL} data-test-id={'search-sign-in-link'}>
                <Button color={'primary'} variant={'contained'}>
                  Sign in
                </Button>
              </Link>
            ) : null}
          </div>
        ) : null}
        {userExists ? <LogSearchAccountCreation user={user} /> : null}
      </div>
    </MuiThemeProvider>
  )
}

SearchMenuComponent.displayName = 'SearchMenuComponent'

SearchMenuComponent.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  isSearchExtensionInstalled: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // May not exist if the user is not signed in.
  user: PropTypes.shape({
    searches: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
  }),
}

SearchMenuComponent.defaultProps = {
  isSearchExtensionInstalled: true,
  style: {},
}

export default withStyles(styles)(SearchMenuComponent)
