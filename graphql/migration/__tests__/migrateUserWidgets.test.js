/* eslint-env jest */

import { cloneDeep } from 'lodash/lang'
import updateUserWidgetData from '../../database/widgets/userWidget/updateUserWidgetData'
import {
  getPermissionsOverride,
  MIGRATION_OVERRIDE
} from '../../utils/permissions-overrides'
const migrationOverride = getPermissionsOverride(MIGRATION_OVERRIDE)

jest.mock('../../database/databaseClient')
jest.mock('../../database/widgets/userWidget/updateUserWidgetData')

afterEach(() => {
  jest.clearAllMocks()
})

const exampleBody = {
  userId: 'abc123',
  widgets: [
    // Bookmark 1
    {
      resizable: 'true',
      height: 1,
      movableBetweenPanes: 'true',
      deletable: 'true',
      pane: 0,
      data: {
        url: 'youtube.com',
        color: '#cd1616',
        textcolor: '#e89191',
        name: 'YouTube',
        textColor: '#2B2B2B'
      },
      widget_id: '26a72807b8124f34b17dcf03250b9fa4',
      settings: [],
      modified_at: 1512327521000,
      id: 'bad88ea7ad9746e9af1341cc8e8a3203',
      width: 1,
      permanent: false,
      y: 1,
      x: 2
    },
    // Note
    {
      resizable: 'true',
      height: 2,
      movableBetweenPanes: 'true',
      deletable: 'true',
      pane: 0,
      data: { color: '#FAFAD2', text: 'blah blah', textColor: 'black' },
      widget_id: 'd84447e23fee40b98982241513e3005b',
      settings:
      [ { display_text: 'Text Color',
        default: 'black',
        type: 'text-color-toggle',
        name: 'textcolor' },
      { display_text: 'Background color',
        default: 'LightGoldenRodYellow',
        type: 'color',
        name: 'color' } ],
      modified_at: 1512327540000,
      id: '5832b96bd5f54a69a43d90432a128c95',
      width: 2,
      permanent: false,
      y: 1,
      x: 3
    },
    // Bookmark 2
    {
      resizable: 'true',
      height: 1,
      movableBetweenPanes: 'true',
      deletable: 'true',
      pane: 0,
      data: {
        url: 'www.google.com',
        color: '#cd1616',
        textcolor: '#e89191',
        name: 'The Google',
        textColor: '#2B2B2B'
      },
      widget_id: '26a72807b8124f34b17dcf03250b9fa4',
      settings: [],
      modified_at: 1512327521000,
      id: 'abcdef',
      width: 1,
      permanent: false,
      y: 1,
      x: 2
    }
  ]
}

describe('createUserHandler migration', () => {
  it('calls updateUserWidgetData as expected', async () => {
    const body = cloneDeep(exampleBody)
    const migrateWidgets = require('../migrateUserWidgets').migrateWidgets
    await migrateWidgets(body.userId, body.widgets)
    const calls = updateUserWidgetData.mock.calls

    // Verify call to set up bookmarks
    expect(calls[0][0]).toEqual(migrationOverride)
    expect(calls[0][1]).toEqual('abc123')
    expect(calls[0][2]).toEqual('a8cfd733-639b-49d4-a822-116cc7e5c2e2')
    expect(calls[0][3]).toEqual({
      bookmarks: [
        {
          link: 'youtube.com',
          name: 'YouTube'
        },
        {
          link: 'www.google.com',
          name: 'The Google'
        }
      ]
    })

    // Verify call to set up notes
    expect(calls[1][0]).toEqual(migrationOverride)
    expect(calls[1][1]).toEqual('abc123')
    expect(calls[1][2]).toEqual('63859963-f691-42f6-bc80-ac83eddc4104')

    // Check notes data
    expect(['#A5D6A7', '#FFF59D', '#FFF', '#FF4081', '#2196F3', '#757575', '#FF3D00'])
      .toContain(calls[1][3].notes[0].color)

    expect(calls[1][3].notes[0].content).toBe('blah blah')
    expect(calls[1][3].notes[0].created).toBe('2017-12-03T18:59:00.000Z')
    expect(calls[1][3].notes[0].id).not.toBeUndefined()
  })
})
