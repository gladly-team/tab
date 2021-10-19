// Cause: teamseas

import { fileGetter } from '../../utils'

const SLUG = 'teamseas'
const getContents = fileGetter(SLUG)

const data = {
  id: 'SGa6zohkY',
  charityId: 'TODO',
  impactVisits: 10,
  landingPagePath: '/teamseas/',
  slug: SLUG,
  impact: {
    claimImpactSubtitle:
      '##### You did it! You just turned your tabs into removing trash from rivers and oceans.  Keep it up, and do good with every new tab!',
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping restore the environment and fight climate change by [removing trash from our oceans and rivers](https://teamseas.org/).  Ready to get started?",
    impactCounterText: getContents('./impact.impactCounterText.md'),
    impactIcon: 'jellyfish',
    impactWalkthroughText:
      "##### When you do, you'll donate enough to remove a plastic water bottle from a river or ocean.  We'll track how many water bottles you've helped clean up on the top of the page",
    newlyReferredImpactWalkthroughText:
      "##### Your friend started you off giving you credit for removing  5 plastic water bottles from our rivers and oceans, which is crucial to cleaning up our environment and fighting climate change. Open a new tab now to clean up your 6th waterbottle! We'll track how many water bottles you've helped clean up on the top of the page",
    referralRewardNotification:
      "##### #teamseas.  To celebrate, we'll remove an extra ${pendingUserReferralImpact} water bottle${isPlural(pendingUserReferralImpact)} from our oceans and rivers",
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact on our oceans and rivers. Want to help our seas even more? Invite a few more friends!",
    referralRewardTitle:
      '##### **You just cleaned up ${pendingUserReferralImpact} waterbottle${isPlural(pendingUserReferralImpact)} from our oceans and rivers**',
    walkMeGif: 'dolphin.gif',
  },
  onboarding: {
    firstTabIntroDescription: 'firstTabIntroDescription',
    steps: [
      {
        title: 'TODO',
        subtitle: 'TODO',
        imgName: 'TODO',
      },
    ],
  },
  sharing: {
    facebookButtonTitle: 'TODO',
    imgCategory: 'TODO',
    redditButtonTitle: 'TODO',
    sendgridEmailTemplateId: 'TODO',
    subtitle: 'TODO',
    title: 'TODO',
    tumblrCaption: 'TODO',
    tumblrTitle: 'TODO',
    twitterButtonTitle: 'TODO',
  },
  squads: {
    currentMissionAlert: 'TODO',
    currentMissionDetails: 'TODO',
    currentMissionStep2: 'TODO',
    currentMissionStep3: 'TODO',
    currentMissionSummary: 'TODO',
    impactCounterText: 'TODO',
    missionCompleteAlert: 'TODO',
    missionCompleteDescription: 'TODO',
    missionCompleteSubtitle: 'TODO',
    squadCounterText: 'TODO',
  },
  theme: {
    primaryColor: '#9d4ba3', // purple
    secondaryColor: '#29BEBA',
  },
}

export default data
