/* eslint-env jest */

export const mockCampaign = {
  addMoneyRaised: jest.fn(),
  campaignId: 'myCoolCampaign',
  charity: {
    id: 'some-charity-id',
    image: 'https://cdn.example.com/some-image.jpg',
    imageCaption: null,
    impact: 'This is what we show after a user donates hearts.',
    name: 'Some Charity',
    vcReceived: 9876543,
    website: 'https://foo.com',
  },
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  goal: {
    currentNumber: 112358,
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'raised',
    targetNumber: 10e6,
  },
  incrementNewUserCount: jest.fn(),
  incrementTabCount: jest.fn(),
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
}

export default jest.fn(() => Promise.resolve(mockCampaign))
