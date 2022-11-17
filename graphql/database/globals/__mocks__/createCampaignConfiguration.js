/* eslint-env jest */

const actualCreateCampConf = require.requireActual(
  '../createCampaignConfiguration'
).default

// Use the real createCampaignConfiguration, but allow us to
// mock it or inspect the input.
export default jest.fn((input) => actualCreateCampConf(input))
