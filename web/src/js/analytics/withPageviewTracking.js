
import React from 'react'
import { pageview } from 'analytics/logEvent'

// A higher-order component that logs a pageview analytics
// event when the React Router location changes.
// https://github.com/react-ga/react-ga/issues/122#issuecomment-299692833
const withPageviewTracking = (WrappedComponent, options = {}) => {
  const trackPageview = () => {
    // TODO
    // Do not track a regular pageview for the new tab page.
    // This prevents us from going over our Google Analytics
    // event limit.

    pageview()
  }

  const Wrapper = class extends React.Component {
    componentDidMount () {
      trackPageview()
    }

    componentWillReceiveProps (nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPageview()
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  return Wrapper
}

export default withPageviewTracking
