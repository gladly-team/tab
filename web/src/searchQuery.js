// eslint-disable-next-line no-unused-vars
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'

// This is a second entry point to speed up our query
// to fetch search results.
// We've patched react-scripts to add this as another entry
// point. After modifying files in react-scripts, commit the
// patches with:
// `yarn patch-package react-scripts`

// TODO: return an empty script when building the newtab app.
const foo = () => {
  var t = performance.now()
  console.log('searchQuery', t)

  // TODO: call fetchBingSearchResults. Let it handle the
  // logic of determining the query text, etc.
}

foo()
