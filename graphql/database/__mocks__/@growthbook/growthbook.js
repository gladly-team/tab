/* eslint-env jest */
const { GrowthBook } = jest.requireActual('@growthbook/growthbook')
const mockGrowthBook = jest.genMockFromModule('@growthbook/growthbook')

mockGrowthBook.GrowthBook = jest.fn(() => new GrowthBook())

module.exports = mockGrowthBook
