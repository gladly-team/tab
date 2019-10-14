// This is a second entry point to speed up our query
// to fetch search results.
// We've patched react-scripts to add this as another entry
// point. E.g., the Webpack config by running lives at
// web/node_modules/react-scripts/config/webpack.config.js.
// After modifying files in react-scripts, commit the
// patches with:
// `yarn patch-package react-scripts`
// You can view the patch diff in ./web/patches.
// For this to be meaningful, we have to make sure we inject
// this script first, before all other app code.

// Return an empty script when building the newtab app.
// The newtab app will still build this entry point because
// we share Webpack configs.
if (
  process.env.REACT_APP_WHICH_APP === 'search' &&
  process.env.NODE_ENV === 'production'
) {
  const {
    prefetchSearchResults,
  } = require('js/components/Search/fetchBingSearchResults')
  const getSearchResults = () => {
    // If the path is /query, call fetchBingSearchResults.
    // Let it handle the logic of determining the search query, etc
    if (['/search', '/search/'].indexOf(window.location.pathname) > -1) {
      prefetchSearchResults()
    }
  }

  try {
    getSearchResults()
  } catch (e) {
    // This script is an optimization, so it's non-critical if
    // it fails.
    console.error(e)
  }
}
