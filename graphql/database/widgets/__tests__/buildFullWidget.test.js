/* eslint-env jest */

import buildFullWidget from '../buildFullWidget'
import Widget from '../Widget'
import BaseWidgetModel from '../baseWidget/BaseWidgetModel'
import UserWidgetModel from '../userWidget/UserWidgetModel'

describe('buildFullWidget', () => {
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
    const fullWidget = buildFullWidget(userWidget, baseWidget)
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
    expect(fullWidget instanceof Widget).toBe(true)
  })
})
