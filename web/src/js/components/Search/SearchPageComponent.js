import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Helmet } from 'react-helmet'
import {
  isSearchPageEnabled,
  shouldRedirectSearchToThirdParty,
} from 'js/utils/feature-flags'
import {
  adblockerWhitelistingForSearchURL,
  dashboardURL,
  modifyURLParams,
  searchBetaFeedback,
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import Logo from 'js/components/Logo/Logo'
import { makePromiseCancelable, parseUrlSearchString } from 'js/utils/utils'
import SearchResults from 'js/components/Search/SearchResults'
import SearchResultsQueryBing from 'js/components/Search/SearchResultsQueryBing'
import {
  getSearchProvider,
  isReactSnapClient,
  isSearchExtensionInstalled,
} from 'js/utils/search-utils'
import SearchMenuQuery from 'js/components/Search/SearchMenuQuery'
import WikipediaQuery from 'js/components/Search/WikipediaQuery'
import detectAdblocker from 'js/utils/detectAdblocker'
import Link from 'js/components/General/Link'
import {
  hasUserDismissedSearchIntro,
  setUserDismissedSearchIntro,
} from 'js/utils/local-user-data-mgr'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import ErrorBoundarySearchResults from 'js/components/Search/ErrorBoundarySearchResults'
import {
  SEARCH_PROVIDER_BING,
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  SEARCH_APP,
} from 'js/constants'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import Footer from 'js/components/General/Footer'
import logger from 'js/utils/logger'

const searchBoxBorderColor = '#ced4da'
const searchBoxBorderColorFocused = '#bdbdbd'

const styles = theme => ({
  inputRootStyle: {
    padding: 0,
    borderRadius: 28,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${searchBoxBorderColor}`,
    fontSize: 16,
    boxShadow: '0rem 0rem 0.02rem 0.02rem rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: searchBoxBorderColorFocused,
      boxShadow: '0rem 0.05rem 0.2rem 0.05rem rgba(0, 0, 0, 0.1)',
    },
  },
  inputRootFocused: {
    borderColor: searchBoxBorderColorFocused,
    boxShadow: '0rem 0.05rem 0.2rem 0.05rem rgba(0, 0, 0, 0.1)',
  },
  inputStyle: {
    padding: '12px 16px',
  },
  tabsContainerRootStyle: {
    minHeight: 0,
  },
  tabRootStyle: {
    color: '#505050', // Same as search result description
    minHeight: 34,
    minWidth: 10,
  },
})

class SearchPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Important: set all client-specific state in componentDidMount,
      // because we do HTML prerendering with these values.
      browser: null,
      defaultSearchProvider: getSearchProvider(),
      isAdBlockerEnabled: false,
      isSearchExtensionInstalled: true, // assume installed until confirmed
      mounted: false, // i.e. we've mounted to a real user, not pre-rendering
      searchFeatureEnabled: isSearchPageEnabled(),
      searchRedirectToThirdParty: shouldRedirectSearchToThirdParty(),
      searchText: '',
      showIntroMessage: false,
    }

    this.isExtInstalledCancelablePromise = null
    this.detectAdblockerCancelablePromise = null
  }

  componentDidMount() {
    // Don't change state on mount when prerendering with React Snap.
    if (isReactSnapClient()) {
      return
    }
    if (!this.state.searchFeatureEnabled) {
      // Cannot use pushState now that the apps are separate.
      externalRedirect(dashboardURL)
    }
    const query = this.getSearchQueryFromURL()

    // Redirect to Google if enabled.
    if (this.state.searchRedirectToThirdParty) {
      externalRedirect(`https://www.google.com/search?q=${encodeURI(query)}`)
    }

    this.setState({
      // We always derive the query and page values URL parameter
      // values.
      mounted: true, // in other words, this is not React Snap prerendering
      browser: detectSupportedBrowser(),
      searchText: query,
      showIntroMessage: !hasUserDismissedSearchIntro(),
    })

    // AdBlockerDetection
    this.detectAdblockerCancelablePromise = makePromiseCancelable(
      detectAdblocker()
    )
    this.detectAdblockerCancelablePromise.promise
      .then(isEnabled => {
        this.setState({
          isAdBlockerEnabled: isEnabled,
        })
      })
      .catch(e => {
        if (e && e.isCanceled) {
          return
        }
        console.error(e)
      })

    // Check if the Search extension is installed.
    this.isExtInstalledCancelablePromise = makePromiseCancelable(
      isSearchExtensionInstalled()
    )
    this.isExtInstalledCancelablePromise.promise
      .then(isInstalled => {
        this.setState({
          isSearchExtensionInstalled: isInstalled,
        })
      })
      .catch(e => {
        if (e && e.isCanceled) {
          return
        }
        logger.error(e)
      })
  }

  componentWillUnmount() {
    // Cancel any pending promises.
    if (
      this.isExtInstalledCancelablePromise &&
      this.isExtInstalledCancelablePromise.cancel
    ) {
      this.isExtInstalledCancelablePromise.cancel()
    }
    if (
      this.detectAdblockerCancelablePromise &&
      this.detectAdblockerCancelablePromise.cancel
    ) {
      this.detectAdblockerCancelablePromise.cancel()
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { search: previousSearchStr = '' } = {} } = prevProps
    const previousQuery = this.getSearchQueryFromURL(previousSearchStr)
    const currentQuery = this.getSearchQueryFromURL()
    if (currentQuery !== previousQuery) {
      this.setState({
        searchText: currentQuery,
      })
    }
  }

  // TODO: documentation
  /**
   * @return {Number} The search results page inded
   */
  getPageNumberFromURL() {
    if (isReactSnapClient()) {
      return 1
    }
    const { location: { search = '' } = {} } = this.props
    return parseInt(parseUrlSearchString(search).page, 10) || 1
  }

  // TODO: documentation
  /**
   * @return {String} The decoded search query
   */
  getSearchQueryFromURL(searchStr) {
    if (isReactSnapClient()) {
      return ''
    }
    const { location: { search = '' } = {} } = this.props
    const searchStrToParse = searchStr ? searchStr : search
    return parseUrlSearchString(searchStrToParse).q || ''
  }

  // TODO: documentation
  getSearchSourceFromURL() {
    if (isReactSnapClient()) {
      return null
    }
    const { location: { search = '' } = {} } = this.props
    return parseUrlSearchString(search).src || null
  }

  search() {
    const newQuery = this.state.searchText
    if (newQuery) {
      modifyURLParams({
        page: 1,
        q: newQuery,
        src: 'self',
      })
    }
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value,
    })
  }

  render() {
    const { classes, searchProvider } = this.props
    const {
      browser,
      isSearchExtensionInstalled,
      isAdBlockerEnabled,
      mounted,
      showIntroMessage,
      defaultSearchProvider,
      searchText,
    } = this.state

    const page = this.getPageNumberFromURL()
    const query = this.getSearchQueryFromURL()
    const queryEncoded = query ? encodeURI(query) : ''
    const searchSource = this.getSearchSourceFromURL()

    const searchResultsPaddingLeft = 150
    if (!this.state.searchFeatureEnabled) {
      return null
    }

    // If redirecting to Google, don't render our page at all.
    if (this.state.searchRedirectToThirdParty) {
      return null
    }

    const showExtensionInstallCTA =
      !isSearchExtensionInstalled &&
      [CHROME_BROWSER, FIREFOX_BROWSER].indexOf(browser) > -1

    return (
      <div
        data-test-id={'search-page'}
        style={{
          backgroundColor: '#fff',
          minWidth: 1100,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Helmet>{query ? <title>{query}</title> : null}</Helmet>
        <div
          style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #e4e4e4',
          }}
        >
          <div
            style={{
              padding: '20px 18px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                // Just so the "beta" text doesn't modify layout
                height: 40,
              }}
            >
              <Logo
                brand={SEARCH_APP}
                includeText
                style={{
                  width: 116,
                }}
              />
              <Typography
                color={'primary'}
                variant={'overline'}
                style={{
                  lineHeight: '60%',
                  fontWeight: 'bold',
                }}
              >
                beta
              </Typography>
            </div>
            <div
              style={{
                maxWidth: 600,
                marginLeft: 30,
                flex: 1,
              }}
            >
              <Input
                data-test-id={'search-input'}
                type={'text'}
                value={searchText}
                onChange={this.onSearchTextChange.bind(this)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.search()
                  }
                }}
                placeholder={
                  // Don't immediately render the placeholder text because
                  // we may rapidly replace it with the query on first render.
                  mounted ? 'Search to raise money for charity...' : ''
                }
                disableUnderline
                fullWidth
                classes={{
                  root: classes.inputRootStyle,
                  input: classes.inputStyle,
                  focused: classes.inputRootFocused,
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search button"
                      onClick={this.search.bind(this)}
                    >
                      <SearchIcon
                        style={{ color: searchBoxBorderColorFocused }}
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
            {mounted && showExtensionInstallCTA ? (
              <div
                data-test-id={'search-add-extension-cta'}
                style={{ marginLeft: 30, marginRight: 10 }}
              >
                {browser === CHROME_BROWSER ? (
                  <Link to={searchChromeExtensionPage}>
                    <Button color={'primary'} variant={'contained'}>
                      Add to Chrome
                    </Button>
                  </Link>
                ) : browser === FIREFOX_BROWSER ? (
                  <Link to={searchFirefoxExtensionPage}>
                    <Button color={'primary'} variant={'contained'}>
                      Add to Firefox
                    </Button>
                  </Link>
                ) : null}
              </div>
            ) : null}
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Link
                data-test-id={'search-feedback'}
                to={searchBetaFeedback}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginRight: 14,
                }}
              >
                <Button color={'primary'}>Feedback</Button>
              </Link>
              <SearchMenuQuery
                isSearchExtensionInstalled={isSearchExtensionInstalled}
              />
            </div>
          </div>
          <Tabs
            value={0}
            indicatorColor={'primary'}
            style={{
              marginTop: 8,
              marginLeft: 150,
            }}
            classes={{
              root: classes.tabsContainerRootStyle,
            }}
          >
            <Tab
              label="Web"
              classes={{
                root: classes.tabRootStyle,
              }}
            />
            <Tab
              label="Images"
              target="_top"
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=isch`
                  : 'https://images.google.com'
              }
              classes={{
                root: classes.tabRootStyle,
              }}
            />
            <Tab
              label="News"
              target="_top"
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=nws`
                  : 'https://www.google.com'
              }
              classes={{
                root: classes.tabRootStyle,
              }}
            />
            <Tab
              label="Videos"
              target="_top"
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=vid`
                  : 'https://www.google.com'
              }
              classes={{
                root: classes.tabRootStyle,
              }}
            />
            <Tab
              label="Maps"
              target="_top"
              href={
                queryEncoded
                  ? `https://www.google.com/maps/?q=${queryEncoded}`
                  : 'https://www.google.com/maps'
              }
              classes={{
                root: classes.tabRootStyle,
              }}
            />
          </Tabs>
        </div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            data-test-id={'search-primary-results-column'}
            style={{
              marginLeft: searchResultsPaddingLeft,
              marginTop: 0,
              width: 620,
            }}
          >
            {isAdBlockerEnabled ? (
              <div
                data-test-id={'search-prevented-warning'}
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  width: '100%',
                }}
              >
                <Paper
                  elevation={1}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgb(242, 222, 222)',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      style={{
                        color: 'rgb(169, 68, 66)',
                        fontWeight: 'bold',
                        marginBottom: 8,
                        marginTop: 8,
                      }}
                      variant={'h6'}
                    >
                      Please disable your ad blocker
                    </Typography>
                    <Typography variant={'body2'}>
                      We use search ads to raise money for charity! You'll
                      likely need to whitelist Search for a Cause in your ad
                      blocker to start doing good.
                    </Typography>
                    <div
                      style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                        marginTop: 10,
                      }}
                    >
                      <Link
                        to={adblockerWhitelistingForSearchURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button color={'default'}>Show me how</Button>
                      </Link>
                    </div>
                  </span>
                </Paper>
              </div>
            ) : null}
            {(searchProvider || defaultSearchProvider) ===
            SEARCH_PROVIDER_BING ? (
              <ErrorBoundarySearchResults>
                <SearchResultsQueryBing
                  query={query}
                  page={page}
                  onPageChange={newPageIndex => {
                    modifyURLParams({
                      page: newPageIndex,
                    })
                  }}
                  searchSource={searchSource}
                  style={{
                    maxWidth: 600,
                    marginBottom: 40,
                  }}
                />
              </ErrorBoundarySearchResults>
            ) : (
              <SearchResults
                query={query}
                page={page}
                onPageChange={newPageIndex => {
                  modifyURLParams({
                    page: newPageIndex,
                  })
                }}
                isAdBlockerEnabled={isAdBlockerEnabled}
                searchSource={searchSource}
                style={{
                  maxWidth: 600,
                  marginBottom: 40,
                }}
              />
            )}
          </div>
          <div
            data-test-id={'search-sidebar'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '20px 40px',
              width: '100%',
              boxSizing: 'border-box',
              maxWidth: 410,
              minWidth: 300,
            }}
          >
            {' '}
            {mounted && showIntroMessage ? (
              <Paper
                data-test-id={'search-intro-msg'}
                elevation={1}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 18px',
                  marginTop: -50, // for more prominence
                  backgroundColor: '#ebfffc',
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    variant={'h6'}
                    style={{ marginTop: 8, marginBottom: 8 }}
                  >
                    Your searches do good!
                  </Typography>
                  <Typography variant={'body2'} gutterBottom>
                    When you search, you're raising money for charity! Choose
                    your cause, from protecting the rainforest to giving cash to
                    people who need it most.
                  </Typography>
                  {showExtensionInstallCTA ? (
                    <Typography variant={'body2'} gutterBottom>
                      Make Search for a Cause your default search engine to
                      change lives with{' '}
                      <span style={{ fontStyle: 'italic' }}>every</span> search.
                    </Typography>
                  ) : null}
                  <div
                    style={{
                      display: 'flex',
                      alignSelf: 'flex-end',
                      marginTop: 10,
                    }}
                  >
                    <Button
                      color={'primary'}
                      variant={
                        showExtensionInstallCTA ? 'outlined' : 'contained'
                      }
                      onClick={() => {
                        setUserDismissedSearchIntro()
                        this.setState({
                          showIntroMessage: false,
                        })
                      }}
                    >
                      Great!
                    </Button>
                    {showExtensionInstallCTA ? (
                      <div
                        data-test-id={'search-intro-add-extension-cta'}
                        style={{ marginLeft: 10 }}
                      >
                        {browser === CHROME_BROWSER ? (
                          <Link to={searchChromeExtensionPage}>
                            <Button color={'primary'} variant={'contained'}>
                              Add to Chrome
                            </Button>
                          </Link>
                        ) : browser === FIREFOX_BROWSER ? (
                          <Link to={searchFirefoxExtensionPage}>
                            <Button color={'primary'} variant={'contained'}>
                              Add to Firefox
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </span>
              </Paper>
            ) : null}
            <ErrorBoundary brand={SEARCH_APP} ignoreErrors>
              {query ? (
                <WikipediaQuery
                  query={query}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    marginBottom: 20,
                  }}
                />
              ) : null}
            </ErrorBoundary>
          </div>
        </div>
        <Footer
          style={{
            marginTop: 'auto',
          }}
        />
      </div>
    )
  }
}

SearchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  searchProvider: PropTypes.string,
  theme: PropTypes.object.isRequired,
}

SearchPage.defaultProps = {}

export default withStyles(styles, { withTheme: true })(SearchPage)
