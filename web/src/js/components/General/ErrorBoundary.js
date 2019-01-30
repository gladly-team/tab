import React from 'react'
import logger from 'js/utils/logger'

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
      // TODO: fallback UI for an error.
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
