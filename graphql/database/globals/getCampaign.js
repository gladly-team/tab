import { isNil } from 'lodash/lang'
import { getCurrentCampaignHardcodedData } from './hardcodedCampaignData'

const createCampaignData = async campaignConfig => {
  const {
    campaignId,
    content,
    endContent,
    getCharityData,
    goal,
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  } = campaignConfig

  // Fetch the charity.
  const charity = await getCharityData()

  // If there is a goal, fetch the current goal number.
  let goalWithData
  if (!isNil(goal)) {
    const {
      getCurrentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      targetNumber,
    } = goal
    const currentNumber = await getCurrentNumber()
    goalWithData = {
      currentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      targetNumber,
    }
  }

  return {
    campaignId,
    ...(charity && { charity }),
    content,
    ...(endContent && { endContent }),
    ...(goalWithData && { goal: goalWithData }),
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  }
}

const getCampaign = () => {
  return createCampaignData(getCurrentCampaignHardcodedData())
}

// const campaignTitle = '## COVID-19 Solidarity'
//
// const campaignDescription = `
// #### The spread of COVID-19 has been swift and destructive. We need a global response to support the health systems working to keep us all safe. As a free, simple, and at-home way to raise money for important causes, we will be running a special campaign for the foreseeable future to raise funds for the response efforts.
//
// #### Donate your hearts to the COVID-19 solidarity fund and support the [World Health Organization](https://www.who.int/) and their partners in a massive effort to help countries prevent, detect, and manage the novel coronavirus—particularly where the needs are the greatest.
//
// #### Join us in supporting the [COVID-19 Solidarity Response Fund](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate).
// `
//
// const campaignEndTitle = '## Thank You for Supporting the WHO'
//
// const campaignEndDescription = `
// #### With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.
// `
//
// const getCampaignTemporary = () => ({
//   isLive: true,
//   campaignId: 'covid19March2020',
//   time: {
//     start: '2020-03-25T18:00:00.000Z',
//     end: '2020-05-01T18:00:00.000Z',
//     // end: '2020-03-26T00:00:00.000Z',
//   },
//   content: {
//     titleMarkdown: campaignTitle,
//     descriptionMarkdown: campaignDescription,
//   },
//   endContent: {
//     titleMarkdown: campaignEndTitle,
//     descriptionMarkdown: campaignEndDescription,
//   },
//   goal: {
//     targetNumber: 10e6,
//     currentNumber: 16.6e6,
//     impactUnitSingular: 'Heart',
//     impactUnitPlural: 'Hearts',
//     impactVerbPastTense: 'donated',
//   },
//   // numNewUsers: undefined, // probably want to roll into generic goal
//   showCountdownTimer: false,
//   showHeartsDonationButton: true,
//   showProgressBar: true,
//   charity: {
//     id: '6667eb86-ea37-4d3d-9259-910bea0b5e38',
//     image:
//       'https://prod-tab2017-media.gladly.io/img/charities/charity-post-donation-images/covid-19-solidarity.jpg',
//     imageCaption: null,
//     impact:
//       'With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.',
//     name: 'COVID-19 Solidarity Response Fund',
//     vcReceived: 16474011,
//     website:
//       'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate',
//   },
// })

export default getCampaign
