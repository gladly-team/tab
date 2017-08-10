/* eslint-env jest */

import getFullWidget from '../getFullWidget'
import BaseWidgetModel from '../widget/BaseWidgetModel'
import UserWidgetModel from '../userWidget/UserWidgetModel'

describe('getFullWidget', () => {
  it('works as expected', () => {
    const baseWidget = new BaseWidgetModel({
      id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Bookmarks',
      position: 1
    })
    const userWidget = new UserWidgetModel({
      userId: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      data: {
        foo: 'bar'
      },
      enabled: true
    })
    const fullWidget = getFullWidget(userWidget, baseWidget)
    expect(fullWidget).toEqual({
      id: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      userId: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Bookmarks',
      position: 1,
      data: JSON.stringify({
        foo: 'bar'
      }),
      config: JSON.stringify({}),
      settings: JSON.stringify({}),
      enabled: true,
      visible: false
    })
  })
})
