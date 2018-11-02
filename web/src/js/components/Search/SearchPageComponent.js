import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
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

  search () {
    const newQuery = this.state.searchText
    modifyURLParams({
      q: newQuery
    })
  }

  onSearchTextChange (e) {
    this.setState({
      searchText: e.target.value
    })
  }

  render () {
    const { classes, location } = this.props
    const query = parseUrlSearchString(location.search).q
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
            padding: 16,
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
        <div>
          <SearchResults query={query} />
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  app: PropTypes.shape({
    // TODO: pass these to the MoneyRaised component
    // moneyRaised: PropTypes.number.isRequired,
    // dollarsPerDayRate: PropTypes.number.isRequired
  })
}

SearchPage.defaultProps = {}

export default withStyles(styles)(SearchPage)
