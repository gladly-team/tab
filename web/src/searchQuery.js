// This is a second entry point to speed up our query
// to fetch search results.
// We've patched react-scripts to add this as another entry
// point. After modifying files in react-scripts, commit the
// patches with:
// `yarn patch-package react-scripts`

// Return an empty script when building the newtab app.
// The newtab app will still build this entry point because
// we share Webpack configs.
if (process.env.REACT_APP_WHICH_APP === 'search') {
  // eslint-disable-next-line no-unused-vars
  const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
    .default
  const foo = () => {
    var t = performance.now()
    console.log('searchQuery', t)

    // TODO: call fetchBingSearchResults. Let it handle the
    // logic of determining the query text, etc.
  }

  foo()
}
