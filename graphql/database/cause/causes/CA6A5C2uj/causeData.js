// Cause: cats
import { fileGetter } from '../../utils'

const ID = 'CA6A5C2uj'
const getContents = fileGetter(ID)

const data = {
  id: ID,
  charityId: 'TODO',
  landingPagePath: '/cats/',
  impactVisits: 10,
  impact: {
    impactCounterText: getContents('./impact.impactCounterText.md'),
    claimImpactSubtitle:
      '##### You did it! You just turned your tabs into removing trash from rivers and oceans.  Keep it up, and do good with every new tab!',
    referralRewardNotification:
      "##### #teamseas.  To celebrate, we'll remove an extra ${pendingUserReferralImpact} water bottle${isPlural(pendingUserReferralImpact)} from our oceans and rivers",
    impactIcon: 'jellyfish',
    walkMeGif: 'dolphin.gif',
    referralRewardTitle:
      '##### **You just cleaned up ${pendingUserReferralImpact} waterbottle${isPlural(pendingUserReferralImpact)} from our oceans and rivers**',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact on our oceans and rivers. Want to help our seas even more? Invite a few more friends!",
    newlyReferredImpactWalkthroughText:
      "##### Your friend started you off giving you credit for removing  5 plastic water bottles from our rivers and oceans, which is crucial to cleaning up our environment and fighting climate change. Open a new tab now to clean up your 6th waterbottle! We'll track how many water bottles you've helped clean up on the top of the page",
    impactWalkthroughText:
      "##### When you do, you'll donate enough to remove a plastic water bottle from a river or ocean.  We'll track how many water bottles you've helped clean up on the top of the page",
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping restore the environment and fight climate change by [removing trash from our oceans and rivers](https://teamseas.org/).  Ready to get started?",
  },
  theme: {
    primaryColor: '#5094FB',
    secondaryColor: '#29BEBA',
  },
  squads: {
    squadCounterText: 'squadCounterText',
    currentMissionSummary: 'currentMissionSummary',
    currentMissionDetails: 'currentMissionDetails',
    currentMissionAlert: 'currentMissionAlert',
    currentMissionStep2: 'currentMissionStep2',
    currentMissionStep3: 'currentMissionStep3',
    missionCompleteAlert: 'missionCompleteAlert',
    missionCompleteDescription: 'missionCompleteDescription',
    missionCompleteSubtitle: 'missionCompleteSubtitle',
    impactCounterText: 'impactCounterText',
  },
  sharing: {
    title: 'sharingTitle',
    subtitle: 'sharingSubtitle',
    imgCategory: 'currentMissionDetails',
    redditButtonTitle: 'redditButtonTitle',
    facebookButtonTitle: 'facebookButtonTitle',
    twitterButtonTitle: 'twitterButtonTitle',
    tumblrTitle: 'tumblrTitle',
    tumblrCaption: 'tumblrCaption',
    sendgridEmailTemplateId: 'TODO',
  },
  onboarding: {
    steps: [
      {
        title: 'onboarding-title-1',
        subtitle: 'onboarding-subtitle-1',
        imgName: 'onboarding-imgName-1',
      },
    ],
    firstTabIntroDescription: 'firstTabIntroDescription',
  },
}

export default data
