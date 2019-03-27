import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import theme from 'js/theme/searchTheme'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'

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

const menuFontSize = 22

const SearchMenuComponent = props => {
  const { app, classes, style, user } = props
  const userExists = !!user
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
        <MoneyRaised app={app} />
        {userExists ? (
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
            <Hearts app={app} user={user} showMaxHeartsFromSearchesMessage />
            <SettingsButton isUserAnonymous={false} />
          </div>
        ) : null}
      </div>
    </MuiThemeProvider>
  )
}

SearchMenuComponent.displayName = 'SearchMenuComponent'

SearchMenuComponent.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
  // May not exist if the user is not signed in.
  user: PropTypes.shape({}),
}

SearchMenuComponent.defaultProps = {
  style: {},
}

export default withStyles(styles)(SearchMenuComponent)
