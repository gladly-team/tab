import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { filter } from 'lodash/collection'
import { get } from 'lodash/object'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'js/navigation/navigation'
import BaseContainer from 'js/components/General/BaseContainer'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import { initializeFirebase } from 'js/authentication/firebaseConfig'
import logger from 'js/utils/logger'

// This is a hack to generate separate apps for the new tab
// page and search. We do this because create-react-app does
// not currently support more than one entry point. See:
// https://github.com/facebook/create-react-app/issues/1084#issuecomment-365495580
// Our goal is to use load only the necessary assets for the
// root new tab and search pages without downloading any
// critical JS asynchronously, while not switching away from
// CRA, ejecting from CRA, or dealing with the overhead of
// managing distinct codebases. In the future, it would be
// better for us to have a monorepo structure of some kind
// (see: https://github.com/facebook/create-react-app/issues/1492),
// use the built-in multiple entry points (if CRA supports
// it down the line), or switching to another framework.
// See this pull request for details:
// https://github.com/gladly-team/tab/pull/466
var TheApp
var appPath
if (process.env.REACT_APP_WHICH_APP === 'newtab') {
  TheApp = require('js/components/App/App').default
  appPath = '/newtab/'
} else if (process.env.REACT_APP_WHICH_APP === 'search') {
  TheApp = require('js/components/Search/SearchApp').default
  appPath = '/search/'
} else {
  throw new Error(
    `Env var "REACT_APP_WHICH_APP" should be set to "newtab" or "search". Received: "${
      process.env.REACT_APP_WHICH_APP
    }"`
  )
}

class Root extends React.Component {
  constructor(props) {
    super(props)

    // Initialize Firebase.
    try {
      initializeFirebase()
    } catch (e) {
      logger.error(e)
    }
  }

  componentDidMount() {
    // Measure time to interactive (TTI):
    // https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#time_to_interactive
    // https://github.com/GoogleChromeLabs/tti-polyfill
    try {
      if (process.env.REACT_APP_MEASURE_TIME_TO_INTERACTIVE === 'true') {
        import('tti-polyfill').then(ttiPolyfill => {
          ttiPolyfill.getFirstConsistentlyInteractive().then(tti => {
            console.log(`Time to interactive: ${tti}`)
          })
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    // TODO: Show 404 page
    return (
      <ErrorBoundary>
        <BaseContainer>
          <Helmet
            // Handle a react-helmet bug that doesn't replace or remove
            // existing favicon <link /> elements when a new favicon is set.
            // https://github.com/nfl/react-helmet/issues/430
            // If we adde a new favicon link element, remove all other favicon
            // link elements and re-add the new favicon link element.
            onChangeClientState={(newState, addedTags) => {
              // TODO: add tests
              try {
                // Check if we added any new link[rel="icon"] elements.
                const newFaviconElems = filter(get(addedTags, 'linkTags', []), {
                  rel: 'icon',
                })
                if (!newFaviconElems.length) {
                  return
                }

                // Get the href of the last link element we just added, which
                // we assume is the most recently-added favicon.
                const newFaviconHref =
                  newFaviconElems[newFaviconElems.length - 1].href

                // Remove all react-helmet link elements with rel="icon" that
                // do not have the href of our recently-added favicon.
                // If no other favicon elements exist, we don't have to do
                // anything.
                const existingFavicons = document.querySelectorAll(
                  `link[rel="icon"][data-react-helmet]:not([href="${newFaviconHref}"])`
                )
                if (!existingFavicons.length) {
                  return
                }
                existingFavicons.forEach(e => e.parentNode.removeChild(e))

                // Remove and re-add the latest link element to make sure
                // the browser uses it.
                const newFaviconElem = document.querySelector(
                  `link[rel="icon"][data-react-helmet][href="${newFaviconHref}"]`
                )
                if (newFaviconElem) {
                  const parentElem = newFaviconElem.parentNode
                  parentElem.removeChild(newFaviconElem)
                  parentElem.appendChild(newFaviconElem)
                }
              } catch (e) {
                console.error(e)
              }
            }}
          />
          <Router history={browserHistory}>
            <Switch>
              <Route path={appPath} component={TheApp} />
            </Switch>
          </Router>
        </BaseContainer>
      </ErrorBoundary>
    )
  }
}

export default Root
