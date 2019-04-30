/* eslint-env jest */

// Only mock some specific functions.
const searchUtilsActual = require.requireActual('js/utils/search-utils')
searchUtilsActual.isReactSnapClient = jest.fn(() => false)
searchUtilsActual.getSearchProvider = jest.fn(() => 'yahoo')
searchUtilsActual.showBingPagination = jest.fn(() => false)
searchUtilsActual.getSearchResultCountPerPage = jest.fn(() => 10)
module.exports = searchUtilsActual
