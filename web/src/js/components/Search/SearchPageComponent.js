import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  goTo,
  dashboardURL,
  modifyURLParams
} from 'js/navigation/navigation'
import LogoWithText from 'js/components/Logo/LogoWithText'
import { parseUrlSearchString } from 'js/utils/utils'
import SearchResults from 'js/components/Search/SearchResults'

const searchBoxBorderColor = '#ced4da'
const searchBoxBorderColorFocused = '#bdbdbd'

const styles = theme => ({
  inputRootStyle: {
    padding: 0,
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${searchBoxBorderColor}`,
    fontSize: 16,
    boxShadow: '0rem 0rem 0.02rem 0.02rem rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  },
  inputRootFocused: {
    borderColor: searchBoxBorderColorFocused,
    boxShadow: '0rem 0.05rem 0.2rem 0.05rem rgba(0, 0, 0, 0.1)'
  },
  inputStyle: {
    padding: '10px 12px'
  },
  tabsContainerRootStyle: {
    minHeight: 0
  },
  tabRootStyle: {
    color: '#505050', // Same as search result description
    minHeight: 34,
    minWidth: 10
  }
})

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchFeatureEnabled: isSearchPageEnabled(),
      searchText: ''
    }
  }

  componentDidMount () {
    if (!this.state.searchFeatureEnabled) {
      goTo(dashboardURL)
    }
  }

  getSearchQueryDecoded () {
    const { location } = this.props
    return parseUrlSearchString(location.search).q
  }

  search () {
    const newQuery = this.state.searchText
    if (newQuery) {
      modifyURLParams({
        q: newQuery
      })
    }
  }

  onSearchTextChange (e) {
    this.setState({
      searchText: e.target.value
    })
  }

  render () {
    const { classes } = this.props
    const query = this.getSearchQueryDecoded()
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
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      >
        <div
          style={{
            backgroundColor: '#F2F2F2',
            borderBottom: '1px solid #e4e4e4'
          }}
        >
          <div
            style={{
              padding: '20px 18px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <LogoWithText
              style={{
                width: 100,
                height: 36
              }}
            />
            <div
              style={{
                maxWidth: 600,
                marginLeft: 30,
                flex: 1
              }}
            >
              <Input
                id='search-input'
                type={'text'}
                defaultValue={query}
                onChange={this.onSearchTextChange.bind(this)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    this.search()
                  }
                }}
                placeholder='Search to raise money for charity...'
                disableUnderline
                fullWidth
                classes={{
                  root: classes.inputRootStyle,
                  input: classes.inputStyle,
                  focused: classes.inputRootFocused
                }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Search button'
                      onClick={this.search.bind(this)}
                    >
                      <SearchIcon style={{ color: searchBoxBorderColorFocused }} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </div>
          <Tabs
            value={0}
            indicatorColor={'secondary'}
            style={{
              marginLeft: 149
            }}
            classes={{
              root: classes.tabsContainerRootStyle
            }}
          >
            <Tab label='Web'
              classes={{
                root: classes.tabRootStyle
              }}
            />
            <Tab
              label='Images'
              target='_top'
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=isch`
                  : 'https://images.google.com'
              }
              classes={{
                root: classes.tabRootStyle
              }}
            />
            <Tab
              label='News'
              target='_top'
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=nws`
                  : 'https://www.google.com'
              }
              classes={{
                root: classes.tabRootStyle
              }}
            />
            <Tab
              label='Videos'
              target='_top'
              href={
                queryEncoded
                  ? `https://www.google.com/search?q=${queryEncoded}&tbm=vid`
                  : 'https://www.google.com'
              }
              classes={{
                root: classes.tabRootStyle
              }}
            />
            <Tab
              label='Maps'
              target='_top'
              href={
                queryEncoded
                  ? `https://www.google.com/maps/?q=${queryEncoded}`
                  : 'https://www.google.com/maps'
              }
              classes={{
                root: classes.tabRootStyle
              }}
            />
          </Tabs>
        </div>
        <div>
          <SearchResults
            query={query}
            style={{
              background: 'none',
              marginLeft: searchResultsPaddingLeft,
              maxWidth: 600,
              paddingTop: 20
            }}
          />
        </div>
      </div>
    )
  }
}

SearchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }),
  // May not exist if the user is not signed in.
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  app: PropTypes.shape({
    // TODO: pass these to the MoneyRaised component
    // moneyRaised: PropTypes.number.isRequired
    // dollarsPerDayRate: PropTypes.number.isRequired
  }).isRequired
}

SearchPage.defaultProps = {}

export default withStyles(styles)(SearchPage)
