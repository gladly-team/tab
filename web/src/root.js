import React from 'react'
import { browserHistory, Router } from 'react-router'
import Routes from './js/routes/Route'

import { IntlProvider, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Our translated strings
import localeData from './js/assets/locales/data.json'

import defaultTheme from './js/theme/default'

addLocaleData([...en, ...es])

const muiTheme = getMuiTheme(defaultTheme)

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

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const Root = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <IntlProvider locale={language} messages={messages}>
      <Router
        history={browserHistory}
        routes={Routes} />
    </IntlProvider>
  </MuiThemeProvider>
)

export default Root
