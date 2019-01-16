/* eslint-env jest */

import getAllBaseWidgets from '../getAllBaseWidgets'
import BaseWidgetModel from '../BaseWidgetModel'
import { getMockUserContext } from '../../../test-utils'

jest.mock('../../../databaseClient')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getAllBaseWidgets', () => {
  it('works as expected', async () => {
    // Set mock query responses.
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: 'abc',
        position: 2,
      }),
      new BaseWidgetModel({
        id: 'def',
        position: 1,
      }),
    ]

    const baseWidgetGetAllMethod = jest
      .spyOn(BaseWidgetModel, 'getAll')
      .mockImplementation(() => baseWidgetsToGet)

    const baseWidgetsReturned = await getAllBaseWidgets(userContext)
    expect(baseWidgetGetAllMethod).toHaveBeenCalledWith(userContext)
    const expectedSortedWidgets = [baseWidgetsToGet[1], baseWidgetsToGet[0]]
    expect(baseWidgetsReturned).toEqual(expectedSortedWidgets)
  })
})
