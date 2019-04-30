import React from 'react'
import logger from 'js/utils/logger'
import { getUrlParameters } from 'js/utils/utils'
import SearchResultErrorMessage from 'js/components/Search/SearchResultErrorMessage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logger.error(error)
  }

  render() {
    if (this.state.hasError) {
      const query = getUrlParameters().q || null
      return <SearchResultErrorMessage query={query} />
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {}
ErrorBoundary.defaultProps = {}

export default ErrorBoundary
