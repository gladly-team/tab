import React from 'react'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import localStorageMgr from 'js/utils/localstorage-mgr'
import logger from 'js/utils/logger'
import { STORAGE_YAHOO_SEARCH_DEMO, YAHOO_USER_ID } from 'js/constants'
import LogTabMutation from 'js/mutations/LogTabMutation'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import appTheme, {
  dashboardIconInactiveColor,
  dashboardIconActiveColor,
} from 'js/theme/default'
import { getWidgetConfig } from 'js/utils/widgets-utils'

// I've temporarily added some hacky code for a yahoo demo and there is
// user specific code in this file
class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      focused: false,
      hasSeenYahooDemo: true,
      isYahooUser: false,
      showYahooDemoPopover: false,
      config: {},
    }
    this.anchorElement = React.createRef()
  }
  componentDidMount() {
    if (this.props.user.id === YAHOO_USER_ID) {
      this.setState({ isYahooUser: true })
      const yahooHasAcknowledged = localStorageMgr.getItem(
        STORAGE_YAHOO_SEARCH_DEMO
      )
      console.log(
        yahooHasAcknowledged,
        this.props.user.id,
        YAHOO_USER_ID,
        'what'
      )
      if (yahooHasAcknowledged === null) {
        this.setState({ hasSeenYahooDemo: false })
      }
    }
    const { widget } = this.props

    // TODO: have server send these as objects
    const config = JSON.parse(widget.config)
    const settings = JSON.parse(widget.settings)
    const configuration = getWidgetConfig(config, settings)
    this.setState({
      config: configuration,
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.executeSearch()
    }
  }

  async executeSearch() {
    const engine = this.state.config.engine || 'Google'
    const searchApi = this.getSearchApi(engine)
    const searchTerm = this.searchInput.input.value
    //refetch latest local storage
    const yahooHasAcknowledged = localStorageMgr.getItem(
      STORAGE_YAHOO_SEARCH_DEMO
    )
    if (yahooHasAcknowledged === 'true') {
      LogTabMutation({
        userId: this.props.user.id,
        tabId: this.props.tabId,
        isV4: false,
      }).catch(e => {
        logger.error(e)
      })
    }
    // The page might be iframed, so opening in _top is critical.
    window.open(searchApi + searchTerm, '_top')
  }

  onSearchHover(hover) {
    this.setState({
      hover: hover,
    })
  }

  onSearchClick() {
    const { isYahooUser, hasSeenYahooDemo } = this.state
    if (isYahooUser && !hasSeenYahooDemo) {
      this.setState({ showYahooDemoPopover: true })
    }
    this.searchInput.focus()
  }
  onClickYahooYes() {
    localStorageMgr.setItem(STORAGE_YAHOO_SEARCH_DEMO, 'true')
    this.setState({ showYahooDemoPopover: false, hasSeenYahooDemo: true })
  }
  onClickYahooNo() {
    localStorageMgr.setItem(STORAGE_YAHOO_SEARCH_DEMO, 'false')
    this.setState({ showYahooDemoPopover: false, hasSeenYahooDemo: true })
  }

  onInputFocusChanged(focused) {
    this.setState({
      focused: focused,
    })
  }

  getSearchApi(engine) {
    switch (engine) {
      case 'Google':
        return 'https://www.google.com/search?q='
      case 'Bing':
        return 'https://www.bing.com/search?q='
      case 'DuckDuckGo':
        return 'https://duckduckgo.com/?q='
      case 'Ecosia':
        return 'https://www.ecosia.org/search?q='
      case 'Yahoo':
        return 'https://search.yahoo.com/search;?q='
      default:
        return 'https://www.google.com/search?q='
    }
  }
  onClose() {
    this.setState({ showYahooDemoPopover: false })
  }
  render() {
    const searchContainerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      zIndex: 1,
      marginLeft: 14,
      height: 56,
    }
    const iconStyle = {
      marginRight: 14,
    }
    const underlineStyle = {
      borderColor: appTheme.palette.borderColor,
      opacity: this.state.hover || this.state.focused ? 100 : 0,
      transition: 'opacity 150ms ease-in',
    }
    const underlineFocusStyle = {
      borderColor: dashboardIconActiveColor,
    }
    const inputContainerStyle = {
      width: 220,
    }
    const inputStyle = {
      textAlign: 'left',
      color: dashboardIconActiveColor,
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily,
    }
    const { showYahooDemoPopover } = this.state
    const anchorElement = this.anchorElement
    return (
      <>
        <span
          style={searchContainerStyle}
          onClick={this.onSearchClick.bind(this)}
          onMouseEnter={this.onSearchHover.bind(this, true)}
          onMouseLeave={this.onSearchHover.bind(this, false)}
          ref={this.anchorElement}
        >
          <SearchIcon
            color={
              this.state.hover || this.state.focused
                ? dashboardIconActiveColor
                : dashboardIconInactiveColor
            }
            hoverColor={dashboardIconActiveColor}
            style={iconStyle}
          />
          <TextField
            id={'tab-search-id'}
            onFocus={this.onInputFocusChanged.bind(this, true)}
            onBlur={this.onInputFocusChanged.bind(this, false)}
            ref={input => {
              this.searchInput = input
            }}
            onKeyPress={this.handleKeyPress.bind(this)}
            style={inputContainerStyle}
            inputStyle={inputStyle}
            underlineStyle={underlineStyle}
            underlineFocusStyle={underlineFocusStyle}
          />
        </span>
        <DashboardPopover
          open={showYahooDemoPopover}
          anchorEl={anchorElement.current}
          onClose={this.onClose.bind(this)}
        >
          <div style={{ maxWidth: '444px', padding: '12px' }}>
            <Typography variant={'body1'}>
              Would you like to earn a Heart for each search, so your searches
              count toward your money raised for charity?
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '8px',
              }}
            >
              <Button
                color={'primary'}
                onClick={this.onClickYahooNo.bind(this)}
              >
                No
              </Button>
              <Button
                color={'primary'}
                variant={'contained'}
                onClick={this.onClickYahooYes.bind(this)}
              >
                Yes
              </Button>
            </div>
          </div>
        </DashboardPopover>
      </>
    )
  }
}

Search.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    data: PropTypes.string.isRequired,
    config: PropTypes.string.isRequired,
    settings: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  tabId: PropTypes.string,
}

export default Search
