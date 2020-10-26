import React from 'react'
import Typography from '@material-ui/core/Typography'
import { replaceUrl, dashboardURL } from 'js/navigation/navigation'
import MillionRaisedCampaign from 'js/components/Campaign/MillionRaisedCampaignView'

const DAY_2020_10_29 = '2020-10-29'
const DAY_2020_10_30 = '2020-10-30'
const DAY_2020_10_31 = '2020-10-31'
const DAY_2020_11_01 = '2020-11-01'
const DAY_2020_11_02 = '2020-11-02' // Monday
const DAY_2020_11_03 = '2020-11-03'
const DAY_2020_11_04 = '2020-11-04'
const DAY_2020_11_05 = '2020-11-05'
const DAY_2020_11_06 = '2020-11-06'
const DAY_2020_11_07 = '2020-11-07'
const DAY_2020_11_08 = '2020-11-08'
const DAY_2020_11_09 = '2020-11-09' // Monday
const DAY_2020_11_10 = '2020-11-10'
const DAY_2020_11_11 = '2020-11-11'
const DAY_2020_11_12 = '2020-11-12'
const DAY_2020_11_13 = '2020-11-13'
const DAY_2020_11_14 = '2020-11-14'
const DAY_2020_11_15 = '2020-11-15'
const DAY_2020_11_16 = '2020-11-16' // Monday
const DAY_2020_11_17 = '2020-11-17'
const DAY_2020_11_18 = '2020-11-18'

const getCampaignDates = () => {
  return [
    DAY_2020_10_29,
    DAY_2020_10_30,
    DAY_2020_10_31,
    DAY_2020_11_01,
    DAY_2020_11_02,
    DAY_2020_11_03,
    DAY_2020_11_04,
    DAY_2020_11_05,
    DAY_2020_11_06,
    DAY_2020_11_07,
    DAY_2020_11_08,
    DAY_2020_11_09,
    DAY_2020_11_10,
    DAY_2020_11_11,
    DAY_2020_11_12,
    DAY_2020_11_13,
    DAY_2020_11_14,
    DAY_2020_11_15,
    DAY_2020_11_16,
    DAY_2020_11_17,
    DAY_2020_11_18,
  ]
}

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

  const campaignDates = getCampaignDates()

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
