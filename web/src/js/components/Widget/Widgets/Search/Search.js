import React from 'react'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'
import appTheme, {
  dashboardIconInactiveColor,
  dashboardIconActiveColor,
} from 'js/theme/default'
import { getWidgetConfig } from 'js/utils/widgets-utils'
import { searchExecuted } from 'js/analytics/logEvent'

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      focused: false,
      config: {},
    }
  }

  componentDidMount() {
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
    await searchExecuted()

    const engine = this.state.config.engine || 'Google'
    const searchApi = this.getSearchApi(engine)
    const searchTerm = this.searchInput.input.value

    // The page might be iframed, so opening in _top is critical.
    window.open(searchApi + searchTerm, '_top')
  }

  onSearchHover(hover) {
    this.setState({
      hover: hover,
    })
  }

  onSearchClick() {
    this.searchInput.focus()
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
      case 'Ecosia':
        return 'https://www.ecosia.org/search?q='
      default:
        return 'https://www.google.com/search?q='
    }
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

    return (
      <span
        style={searchContainerStyle}
        onClick={this.onSearchClick.bind(this)}
        onMouseEnter={this.onSearchHover.bind(this, true)}
        onMouseLeave={this.onSearchHover.bind(this, false)}
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
}

export default Search
