/* eslint-env jest */

import Joi from 'joi'
import Cause from '../CauseModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

const getMockCauseObject = () => ({
  id: 'CA6A5C2uj',
  about: 'paw',
  name: 'Cats',
  isAvailableToSelect: true,
  icon: 'paw',
  backgroundImageCategory: 'cats',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
  impactType: 'individual',
  impactVisits: 14,
  landingPagePath: '/cats/',
  landingPagePhrase: 'This tab helps shelter cats',
  slug: 'cats',
  impact: {
    claimImpactSubtitle: 'paw',
    confirmImpactSubtitle: 'paw',
    impactCounterText: 'paw',
    impactIcon: 'paw',
    impactWalkthroughText: 'paw',
    newlyReferredImpactWalkthroughText: 'paw',
    referralRewardNotification: 'paw',
    referralRewardSubtitle: 'paw',
    referralRewardTitle: 'paw',
    walkMeGif: 'cats/tickle.gif',
  },
  onboarding: {
    steps: [
      {
        title: 'onboardingTitle1',
        subtitle: 'onboardingSubtitle1',
        imgName: 'cats/cattabs.svg',
      },
      {
        title: 'onboardingTitle2',
        subtitle: 'onboardingSubtitle2',
        imgName: 'cats/squadcat.svg',
      },
      {
        title: 'onboardingTitle3',
        subtitle: 'onboardingSubtitle3',
        imgName: 'cats/adcat.svg',
      },
    ],
  },
  sharing: {
    facebookButtonTitle:
      "I just found, purr-haps, the most claw-ver browser extension ever! With Tab for Cats, I'm helping shelter cats get adopted every time I open a new tab. Check it out - it's free!",
    imgCategory: 'cats',
    shareImage: 'cats/shareCats.png',
    sentImage: 'cats/catsSent.png',
    redditButtonTitle:
      'The purr-fect way to help shelter cats get adopted, for free',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/cats/emailCats.png',
      title:
        "Life is better with friends... and cats!  That's why {{name}} thinks you should join them on Tab for Cats.",
      about: 'paw',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq: 'paw',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: 'socialSubtitle',
    title: 'socialTitle',
    tumblrCaption:
      "The purr-fect new way to help shelter cats get adopted: open a new browser tab (with super cute cat pictures!) and raise money to support shelter cats. Check it out - it's free!",
    tumblrTitle:
      'Want to make a paw-sitive impact? Help give shelter cats a new chance for a forever home!',
    twitterButtonTitle:
      "The purr-fect new way to help shelter cats get adopted: open a new browser tab (with super cute cat pictures!) and raise money to support shelter cats. Check it out - it's free!",
  },
  // TODO
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
    squadInviteTemplateId: 'd-cc8834e9b4694194b575ea60f5ea8230',
  },
  theme: {
    primaryColor: '#9d4ba3', // purple
    secondaryColor: '#29BEBA',
  },
})

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('CauseModel', () => {
  it('implements the name property', () => {
    expect(Cause.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Cause.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Cause.tableName).toBe('UNUSED_Causes')
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new Cause({
        id: '123456789',
        about: '### Something something',
        charityId: 'abcdefghijklmnop',
        landingPagePath: '/test',
        impactType: 'individual',
        impactVisits: 10,
        impact: {
          impactCounterText: 'impactCounterText',
          referralRewardTitle: 'referralRewardTitle',
          referralRewardSubtitle: 'referralRewardSubtitle',
          claimImpactTitle: 'claimImpactTitle',
          claimImpactSubtitle: 'claimImpactSubtitle',
          newlyReferredTitle: 'newlyReferredTitle',
          impactWalkthroughText: 'impactWalkthroughText',
          confirmImpactText: 'confirmImpactText',
        },
        theme: {
          primaryColor: '#5094FB',
          secondayColor: '#29BEBA',
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
        onboarding: {
          steps: [],
          firstTabIntroDescription: 'firstTabIntroDescription',
        },
      })
    )
    expect(item).toEqual({
      id: '123456789',
      about: '### Something something',
      charityId: 'abcdefghijklmnop',
      landingPagePath: '/test',
      impactType: 'individual',
      impactVisits: 10,
      isAvailableToSelect: false,
      impact: {
        impactCounterText: 'impactCounterText',
        referralRewardTitle: 'referralRewardTitle',
        referralRewardSubtitle: 'referralRewardSubtitle',
        claimImpactTitle: 'claimImpactTitle',
        claimImpactSubtitle: 'claimImpactSubtitle',
        newlyReferredTitle: 'newlyReferredTitle',
        impactWalkthroughText: 'impactWalkthroughText',
        confirmImpactText: 'confirmImpactText',
      },
      theme: {
        primaryColor: '#5094FB',
        secondayColor: '#29BEBA',
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
      onboarding: {
        steps: [],
        firstTabIntroDescription: 'firstTabIntroDescription',
      },
    })
  })

  // todo: @jtan fix test
  it('causeModel works when impactType is "none"', () => {
    const mockCause = getMockCauseObject()
    const item = Object.assign(
      {},
      new Cause({
        ...mockCause,
        impactType: 'none',
      })
    )

    const causeSchema = Joi.object(Cause.schema)
    const validation = causeSchema.validate(item, { abortEarly: false })
    expect(validation.error).toBeNull()

    delete item.squads
    delete item.impact
    delete item.impactVisits

    const validationAfterDelete = causeSchema.validate(item, {
      abortEarly: false,
    })
    expect(validationAfterDelete.error).toBeNull()
  })

  it('causeModel excepts provided fields', () => {
    const mockCause = getMockCauseObject()
    const item = Object.assign(
      {},
      new Cause({
        ...mockCause,
        impactType: 'group',
      })
    )

    const causeSchema = Joi.object(Cause.schema)
    const validation = causeSchema.validate(item, { abortEarly: false })
    expect(validation.error).toBeNull()

    delete item.impact.walkMeGif

    const validationAfterDelete = causeSchema.validate(item, {
      abortEarly: false,
    })
    expect(validationAfterDelete.error).toBeNull()
  })
})
