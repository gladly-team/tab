import React from 'react'
import Typography from '@material-ui/core/Typography'
import { replaceUrl, dashboardURL } from 'js/navigation/navigation'
import MillionRaisedCampaign from 'js/components/Campaign/MillionRaisedCampaignView'

const CampaignContainer = ({ children }) => {
  return <div style={{ width: 500, margin: 16 }}>{children}</div>
}

const DemosView = () => {
  // This is an internal page for our team only.
  const shouldShowPage = process.env.REACT_APP_SHOW_DEMOS_PAGE === 'true'
  if (!shouldShowPage) {
    replaceUrl(dashboardURL)
    return null
  }

  const campaignOnDismiss = () => {}

  const campaignDates = ['2020-10-29', '2020-10-30', '2020-10-31']

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {campaignDates.map(date => {
          return (
            <div style={{ margin: 16 }} key={date}>
              <Typography variant="body2">{date}</Typography>
              <CampaignContainer>
                <MillionRaisedCampaign
                  currentDateString={date}
                  onDismiss={campaignOnDismiss}
                />
              </CampaignContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DemosView
