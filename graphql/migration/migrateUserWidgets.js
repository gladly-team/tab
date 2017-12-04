'use strict'

import 'babel-polyfill' // For async/await support.
import { filter } from 'lodash/collection'
import moment from 'moment'
import config from '../config'
import logger from '../utils/logger'
import updateUserWidgetData from '../database/widgets/userWidget/updateUserWidgetData'
import htmlToText from 'html-to-text'

import {
  getPermissionsOverride,
  MIGRATION_OVERRIDE
} from '../utils/permissions-overrides'
const migrationOverride = getPermissionsOverride(MIGRATION_OVERRIDE)

// Note: we need to use Bluebird until at least Node 8. Using
// native promises breaks Sentry/Raven context:
// https://github.com/getsentry/raven-node/issues/265
global.Promise = require('bluebird')
const Promise = require('bluebird')

const createResponse = function (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
}

const legacyBookmarkId = '26a72807b8124f34b17dcf03250b9fa4'
const newBookmarkId = 'a8cfd733-639b-49d4-a822-116cc7e5c2e2'

const legacyNotesId = 'd84447e23fee40b98982241513e3005b'
const newNotesId = '63859963-f691-42f6-bc80-ac83eddc4104'

// Legacy bookmark widget data structure
/*
 {'data': {u'color': u'#ff4141',
           u'name': u'Pinterest',
           u'textcolor': u'#781f1f',
           u'url': u'www.pinterest.com'},
  'deletable': 'true',
  'height': 1,
  'id': '1a0f725c2dfe4fcb89eb56f0a6a1fea6',
  'modified_at': datetime.datetime(2015, 1, 15, 8, 0, tzinfo=<UTC>),
  'movableBetweenPanes': 'true',
  'pane': 0,
  'permanent': False,
  'resizable': 'true',
  'settings': [{u'default': u'Google',
                u'display_text': u'Name',
                u'name': u'name',
                u'type': u'input'},
               {u'default': u'https://google.com',
                u'display_text': u'URL',
                u'name': u'url',
                u'type': u'input'},
               {u'default': u'#9C87BE',
                u'display_text': u'Background color',
                u'name': u'color',
                u'type': u'color'},
               {u'default': u'#2B2B2B',
                u'display_text': u'Text color',
                u'name': u'textColor',
                u'type': u'color'}],
  'widget_id': u'781eabcc1f2449d494ec994a327c330e',
  'width': 1,
  'x': 3,
  'y': 2},
*/

// New bookmark widget data structure
/*
{
  bookmarks: [
    {
      link: 'example.com',
      name: 'Some Example'
    }
  ]
}
*/
export const upgradeBookmarkData = (legacyBookmarks) => {
  const newBookmarks = []
  legacyBookmarks.forEach((legacyBookmark) => {
    if (!legacyBookmark.data || !legacyBookmark.data.name || !legacyBookmark.data.url) {
      return
    }
    newBookmarks.push({
      link: legacyBookmark.data.url,
      name: legacyBookmark.data.name
    })
  })
  return {
    bookmarks: newBookmarks
  }
}

// Legacy note widget data structure
/*
 {'data': {u'color': u'#FAFAD2',
           u'text': u'blah blah',
           u'textColor': u'black'},
  'deletable': 'true',
  'height': 2,
  'id': '5832b96bd5f54a69a43d90432a128c95',
  'modified_at': datetime.datetime(2017, 12, 3, 18, 59, tzinfo=<UTC>),
  'movableBetweenPanes': 'true',
  'pane': 0,
  'permanent': False,
  'resizable': 'true',
  'settings': [{u'default': u'black',
                u'display_text': u'Text Color',
                u'name': u'textcolor',
                u'type': u'text-color-toggle'},
               {u'default': u'LightGoldenRodYellow',
                u'display_text': u'Background color',
                u'name': u'color',
                u'type': u'color'}],
  'widget_id': u'7e8e8c158aea451fa6cd10d9dc905a29',
  'width': 2,
  'x': 3,
  'y': 1}]
*/

// New note widget data structure
/*
{
  notes: [
    {
      color: #FFF
      content: 'Some note here'
      created: 2017-11-07T22:56:32Z
      id: 'icFC37'
    }
  ]
*/
export const upgradeNotesData = (legacyNotes) => {
  function randomString (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  const newNotes = []
  const noteColors = ['#A5D6A7', '#FFF59D', '#FFF', '#FF4081', '#2196F3', '#757575', '#FF3D00']
  legacyNotes.forEach((legacyNote) => {
    if (!legacyNote.data || !legacyNote.data.text) {
      return
    }
    newNotes.push({
      id: randomString(6),
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      created: moment(legacyNote.modified_at).toISOString(),
      content: htmlToText.fromString(legacyNote.data.text)
    })
  })
  return {
    notes: newNotes
  }
}

export const migrateWidgets = async (userId, legacyWidgets) => {
  const legacyBookmarks = filter(legacyWidgets, (o) => {
    return o.widget_id === legacyBookmarkId
  })
  const legacyNotes = filter(legacyWidgets, (o) => {
    return o.widget_id === legacyNotesId
  })
  try {
    // Transfer bookmarks
    const newBookmarksData = upgradeBookmarkData(legacyBookmarks)
    await updateUserWidgetData(migrationOverride, userId, newBookmarkId, newBookmarksData)

    // Transfer notes
    const newNotesData = upgradeNotesData(legacyNotes)
    await updateUserWidgetData(migrationOverride, userId, newNotesId, newNotesData)
  } catch (err) {
    throw err
  }
}

export const handler = function (event) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    logger.error(e)
    return Promise.resolve(createResponse(500, e))
  }

  // Check admin authorization
  const headers = event.headers
  if (!headers || headers['Authorization'] !== config.SENTRY_PRIVATE_KEY) {
    return Promise.resolve(createResponse(403, 'Not authorized.'))
  }

  const userId = body.userId
  const legacyWidgets = body.widgets

  return migrateWidgets(userId, legacyWidgets)
    .then(response => createResponse(200, { status: 'success' }))
    .catch(err => {
      logger.error(err)
      return createResponse(500, err)
    })
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
