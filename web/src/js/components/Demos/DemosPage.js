import React from 'react'
import { replaceUrl, dashboardURL } from 'js/navigation/navigation'

const DemosView = () => {
  // This is an internal page for our team only.
  const shouldShowPage = process.env.REACT_APP_SHOW_DEMOS_PAGE === 'true'
  if (!shouldShowPage) {
    replaceUrl(dashboardURL)
    return null
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      TODO
    </div>
  )
}

export default DemosView
