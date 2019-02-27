import React from 'react'
import PropTypes from 'prop-types'
// import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import theme from 'js/theme/defaultV1'
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

const SearchMenuComponent = props => {
  const { app, classes, style, user } = props
  const userExists = !!user
  return (
    <MuiThemeProvider
      theme={{
        ...defaultTheme,
        // palette: {
        //   ...defaultTheme.palette,
        //   background: {
        //     ...defaultTheme.palette.background,
        //     paper: 'rgba(0, 0, 0, 0.36)',
        //   },
        //   divider: 'rgba(255, 255, 255, 0.20)',
        // },
        // typography: {
        //   ...defaultTheme.typography,
        //   h2: {
        //     ...defaultTheme.typography.h2,
        //     color: 'rgba(255, 255, 255, 0.8)',
        //   },
        //   h3: {
        //     ...defaultTheme.typography.h3,
        //     color: '#fff',
        //   },
        //   h4: {
        //     ...defaultTheme.typography.h4,
        //     color: '#fff',
        //   },
        //   h5: {
        //     ...defaultTheme.typography.h5,
        //     color: '#fff',
        //   },
        //   body2: {
        //     ...defaultTheme.typography.body2,
        //     color: '#fff',
        //   },
        // },
        // overrides: {
        //   ...defaultTheme.overrides,
        //   MuiListItemIcon: {
        //     ...get(defaultTheme, 'overrides.MuiListItemIcon', {}),
        //     root: {
        //       ...get(defaultTheme, 'overrides.MuiListItemIcon.root', {}),
        //       color: '#fff',
        //     },
        //   },
        //   MuiButtonBase: {
        //     ...get(defaultTheme, 'overrides.MuiButtonBase', {}),
        //     root: {
        //       ...get(defaultTheme, 'overrides.MuiButtonBase.root', {}),
        //       color: '#fff',
        //     },
        //   },
        //   MuiSvgIcon: {
        //     root: {
        //       color: '#fff',
        //     },
        //   },
        //   MuiTypography: {
        //     ...get(defaultTheme, 'overrides.MuiTypography', {}),
        //     h2: {
        //       ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
        //       '&:hover': {
        //         color: '#fff',
        //       },
        //     },
        //   },
        // },
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
                // color: 'rgba(255, 255, 255, 0.8)',
                color: 'inherit',
              }}
              classes={{
                root: classes.circleIcon,
              }}
            />
            <Hearts app={app} user={user} />
          </div>
        ) : null}
        <SettingsButton isUserAnonymous={!userExists} />
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
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
}

SearchMenuComponent.defaultProps = {
  style: {},
}

export default withStyles(styles)(SearchMenuComponent)
