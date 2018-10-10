import React from 'react'
import { browserHistory, Router } from 'react-router'
import Routes from 'js/routes/Route'

import { IntlProvider, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

// Our translated strings
import localeData from 'js/assets/locales/data.json'

import defaultThemeLegacy from 'js/theme/default'
import defaultTheme from 'js/theme/defaultV1'
const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)
const muiTheme = createMuiTheme(defaultTheme)

addLocaleData([...en, ...es])

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en

// @material-ui-1-todo: remove legacy theme provider
const Root = () => (
  <MuiThemeProvider theme={muiTheme}>
    <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
      <IntlProvider locale={language} messages={messages}>
        <Router
          history={browserHistory}
          routes={Routes} />
      </IntlProvider>
    </V0MuiThemeProvider>
  </MuiThemeProvider>
)

export default Root
