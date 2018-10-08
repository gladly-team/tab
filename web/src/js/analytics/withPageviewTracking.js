
import React from 'react'
import { newTabView, pageview } from 'js/analytics/logEvent'
import { dashboardURL } from 'js/navigation/navigation'

// A higher-order component that logs a pageview analytics
// event when the React Router location changes.
// https://github.com/react-ga/react-ga/issues/122#issuecomment-299692833
const withPageviewTracking = (WrappedComponent, options = {}) => {
  const trackPageview = (pathname) => {
    // Do not track a regular pageview for the new tab page.
    // This prevents us from going over our Google Analytics
    // event limit.
    if (pathname === dashboardURL) {
      newTabView()
    } else {
      pageview()
    }
  }

  const Wrapper = class extends React.Component {
    componentDidMount () {
      const pathname = this.props.location.pathname
      trackPageview(pathname)
    }

    componentWillReceiveProps (nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPageview(nextPage)
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  return Wrapper
}

export default withPageviewTracking
