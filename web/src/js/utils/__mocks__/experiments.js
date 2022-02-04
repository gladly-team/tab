/* eslint-env jest */

// Only mock some specific functions.
const experimentsActual = jest.requireActual('js/utils/experiments')
experimentsActual.getUserExperimentGroup = jest.fn(() => 'none')
experimentsActual.assignUserToTestGroups = jest.fn()
experimentsActual.getUserTestGroupsForMutation = jest.fn(() => {})
module.exports = experimentsActual
