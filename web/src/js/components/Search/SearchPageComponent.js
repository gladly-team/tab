import React, { Suspense, lazy } from 'react'
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
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  adblockerWhitelistingForSearchURL,
  dashboardURL,
  modifyURLParams,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import LogoWithText from 'js/components/Logo/LogoWithText'
import { parseUrlSearchString } from 'js/utils/utils'
import SearchResults from 'js/components/Search/SearchResults'
import { isReactSnapClient } from 'js/utils/search-utils'
import SearchMenuQuery from 'js/components/Search/SearchMenuQuery'
import detectAdblocker from 'js/utils/detectAdblocker'
import Link from 'js/components/General/Link'

const Footer = lazy(() => import('js/components/General/Footer'))

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
      isAdBlockerEnabled: false,
      query: '',
      searchFeatureEnabled: isSearchPageEnabled(),
      searchSource: null,
      searchText: '',
      showPlaceholderText: false,
    }
  }

  componentDidMount() {
    if (!this.state.searchFeatureEnabled) {
      // Cannot use pushState now that the apps are separate.
      externalRedirect(dashboardURL)
    }
    const { location } = this.props

    // Wait until after mount to update prerendered state.
    const query = parseUrlSearchString(location.search).q || ''
    this.setState({
      // We always derive the query and page values URL parameter
      // values. We keep tehse in state so that we update the
      // prerendered components after mount, because at prerender
      // time we do not know the query string. We can remove this
      // from state if we switch to server-side rendering.
      query: query,
      page: this.getPageNumberFromSearchString(location.search),
      showPlaceholderText: !isReactSnapClient(),
      searchSource: parseUrlSearchString(location.search).src || null,
      searchText: query,
    })

    // AdBlockerDetection
    detectAdblocker()
      .then(isEnabled => {
        this.setState({
          isAdBlockerEnabled: isEnabled,
        })
      })
      .catch(e => {
        console.error(e)
      })
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    const currentQuery = parseUrlSearchString(location.search).q
    const prevQuery = parseUrlSearchString(prevProps.location.search).q
    if (currentQuery !== prevQuery) {
      this.setState({
        query: currentQuery,
        searchText: currentQuery,
      })
    }

    // Check if the page number has changed.
    const currentPage = this.getPageNumberFromSearchString(location.search)
    const prevPage = this.getPageNumberFromSearchString(
      prevProps.location.search
    )
    if (currentPage !== prevPage) {
      this.setState({
        page: currentPage,
      })
    }
  }

  /**
   * Take a search string, such as ?abc=hi&p=12, and return the
   * integer value of the "page" URL parameter. If the parameter is
   * not set or is not an integer, return 1.
   * @param {String} searchStr - The URL parameter string,
   *   such as '?myParam=foo&another=bar'
   * @return {Number} The search results page inded
   */
  getPageNumberFromSearchString(searchStr) {
    return parseInt(parseUrlSearchString(searchStr).page, 10) || 1
  }

  search() {
    const newQuery = this.state.searchText
    if (newQuery) {
      modifyURLParams({
        page: 1,
        q: newQuery,
        src: 'self',
      })
      this.setState({
        searchSource: 'self',
      })
    }
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value,
    })
  }

  render() {
    const { classes } = this.props

    // For demonstration only
    let isAdBlockerEnabled = true
    const {
      // isAdBlockerEnabled,
      page,
      query,
      searchSource,
      searchText,
    } = this.state
    const queryEncoded = query ? encodeURI(query) : ''
    const searchResultsPaddingLeft = 170
    if (!this.state.searchFeatureEnabled) {
      return null
    }
    return (
      <div
        data-test-id={'search-page'}
        style={{
          backgroundColor: '#fff',
          // For demonstration only
          minWidth: 1100,
          // minWidth: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            <LogoWithText
              style={{
                width: 100,
                height: 36,
              }}
            />
            <div
              style={{
                maxWidth: 600,
                marginLeft: 30,
                flex: 1,
              }}
            >
              <Input
                id="search-input"
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
                  this.state.showPlaceholderText
                    ? 'Search to raise money for charity...'
                    : ''
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
            <SearchMenuQuery
              style={{
                marginLeft: 'auto',
              }}
            />
          </div>
          <Tabs
            value={0}
            indicatorColor={'secondary'}
            style={{
              marginTop: 8,
              marginLeft: 149,
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
            style={{
              marginLeft: searchResultsPaddingLeft,
              marginTop: 20,
              maxWidth: 600,
            }}
          >
            {isAdBlockerEnabled ? (
              <div
                data-test-id={'search-prevented-warning'}
                style={{
                  marginBottom: 20,
                  width: 600,
                }}
              >
                <Paper
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
                      We use search ads to raise money for charity. You'll
                      likely need to whitelist Search for a Cause for search
                      results to show.
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
            <SearchResults
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
                height: 700,
                // For demonstration only
                backgroundColor: 'aqua',
              }}
            />
          </div>
          <div
            data-test-id={'search-sidebar'}
            style={{
              display: 'flex',
              margin: '20px 40px',
              width: '100%',
              maxWidth: 410,
              minWidth: 300,
              // For demonstration only
              backgroundColor: 'green',
            }}
          >
            <div
              style={{
                // For demonstration only
                height: 500,
                width: '100%',
                backgroundColor: 'purple',
              }}
            >
              some stuff here
            </div>
          </div>
        </div>
        <Suspense fallback={null}>
          <Footer
            style={{
              marginTop: 'auto',
            }}
          />
        </Suspense>
      </div>
    )
  }
}

SearchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  theme: PropTypes.object.isRequired,
}

SearchPage.defaultProps = {}

export default withStyles(styles, { withTheme: true })(SearchPage)
