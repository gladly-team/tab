jest.mock('../tfac');
import tfacMgr from '../tfac';

class mockUser {
  constructor(id) {
    this.id = id;
  }
}

mockUser.BACKGROUND_OPTION_DAILY = 'daily';
mockUser.BACKGROUND_OPTION_CUSTOM = 'custom';
mockUser.BACKGROUND_OPTION_COLOR = 'color';
mockUser.BACKGROUND_OPTION_PHOTO = 'photo';

var mockCreateUser = jest.fn((user) => {
  return Promise.resolve(true);
});

jest.mock('database/users/user', () => {
  return {
    createUser: mockCreateUser,
    User: mockUser
  };
});

jest.mock('database/backgroundImages/backgroundImage', () => {
  return {
    getBackgroundImages: jest.fn((user) => {
      return Promise.resolve([
        {
          id: "fb5082cc-151a-4a9a-9289-06906670fd4e",
          name: "Mountain Lake",
          fileName: "lake.jpg"
        },
        {
          id: "90bfe202-54a9-4eea-9003-5e91572387dd",
          name: "Puppy Eyes",
          fileName: "puppy.jpg"
        }
      ]);
    })
  };
});

var mockUpdateWidgetEnabled = jest.fn((userId, widgetId, enabled) => {
  return Promise.resolve(true);
});

var mockUpdateWidgetData = jest.fn((userId, widgetId, data) => {
  return Promise.resolve(true);
});

jest.mock('database/widgets/userWidget/userWidget', () => {
  return {
    updateWidgetEnabled: mockUpdateWidgetEnabled,
    updateWidgetData: mockUpdateWidgetData
  };
});

const migrate = require('../migrate');

describe('Migrate Data Tests', function() {
  
  it('migrate returns 400 when no id specified', () => {
    return migrate.handler({ queryStringParameters: {}})
      .then( response => expect(response.statusCode).toBe(400));
  });

  it('migrate returns 200 when migration finish', () => {
    return migrate.handler({ queryStringParameters: { id: 'abc123' }})
      .then( response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBe(JSON.stringify({
              "message": "Migration successful."
          }));
      });
  });

  it('creates the user profile correctly', () => {
    const createUserCalls = mockCreateUser.mock.calls.length;

    return migrate.handler({ queryStringParameters: { id: 'abc123' }})
      .then( response => {
          expect(mockCreateUser.mock.calls.length - createUserCalls).toBe(1);
          const user = mockCreateUser.mock.calls[mockCreateUser.mock.calls.length - 1][0];

          tfacMgr.fetchUserProfile('some-id')
            .then((userProfile) => {
              expect(user.id).toBe(userProfile.id);
              expect(user.email).toBe(userProfile.email);
              expect(user.username).toBe(userProfile.username);
              expect(user.vcCurrent).toBe(userProfile.vcCurrent);
              expect(user.vcAllTime).toBe(userProfile.vcAllTime);
              expect(user.level).toBe(userProfile.level);
              expect(user.heartsUntilNextLevel).toBe(userProfile.heartsUntilNextLevel);
              expect(user.backgroundColor).toBe(userProfile.backgroundColor);
              expect(user.customImage).toBe(userProfile.customImage);
              expect(user.backgroundOption).toBe(mockUser.BACKGROUND_OPTION_PHOTO);
              
              expect(user.backgroundImage.id).toBe("90bfe202-54a9-4eea-9003-5e91572387dd");
              expect(user.backgroundImage.name).toBe("Puppy Eyes");
              expect(user.backgroundImage.fileName).toBe("puppy.jpg");
            });
      });
  });

  it('creates the bookmarks correctly', () => {
    const updateWidgetEnabledCalls = mockUpdateWidgetEnabled.mock.calls.length;
    const updateWidgetDataCalls = mockUpdateWidgetData.mock.calls.length;

    return migrate.handler({ queryStringParameters: { id: 'abc123' }})
      .then( response => {
          expect(mockUpdateWidgetEnabled.mock.calls.length - 
            updateWidgetEnabledCalls).toBe(2);

          expect(mockUpdateWidgetData.mock.calls.length - 
            updateWidgetDataCalls).toBe(2);

          const updateBookmarksEnabled = mockUpdateWidgetEnabled.mock.
                  calls[mockUpdateWidgetEnabled.mock.calls.length - 2];

          const updateBookmarksData = mockUpdateWidgetData.mock.
                  calls[mockUpdateWidgetData.mock.calls.length - 2];


          const userId = updateBookmarksEnabled[0];
          const bookmarkWidgetId = updateBookmarksEnabled[1];
          const widgetData = updateBookmarksData[2];

          expect(updateBookmarksData[0]).toBe(userId);
          expect(updateBookmarksData[1]).toBe(bookmarkWidgetId);

          const enabled = updateBookmarksEnabled[2];

          tfacMgr.fetchUserProfile('some-id')
            .then((userProfile) => {
              expect(userId).toBe(userProfile.id);
            });
          expect(bookmarkWidgetId).toBe('4162cc79-d192-4435-91bd-5fda9b6f7c08');
          expect(enabled).toBe(true);

          expect(widgetData).not.toBe(null);
          
          tfacMgr.fetchBookmarks('some-id')
            .then((bookmarks) => {
              expect(bookmarks.length).toBe(widgetData.bookmarks.length);
              for(var index in bookmarks) {
                expect(bookmarks[index].name).toBe(
                  widgetData.bookmarks[index].name);
                expect(bookmarks[index].link).toBe(
                  widgetData.bookmarks[index].link);
              }
            });
      });
  });

  it('creates the notes correctly', () => {
    const updateWidgetEnabledCalls = mockUpdateWidgetEnabled.mock.calls.length;
    const updateWidgetDataCalls = mockUpdateWidgetData.mock.calls.length;

    return migrate.handler({ queryStringParameters: { id: 'abc123' }})
      .then( response => {
          expect(mockUpdateWidgetEnabled.mock.calls.length - 
            updateWidgetEnabledCalls).toBe(2);

          expect(mockUpdateWidgetData.mock.calls.length - 
            updateWidgetDataCalls).toBe(2);

          const updateNotesEnabled = mockUpdateWidgetEnabled.mock.
                  calls[mockUpdateWidgetEnabled.mock.calls.length - 1];

          const updateNotesData = mockUpdateWidgetData.mock.
                  calls[mockUpdateWidgetData.mock.calls.length - 1];


          const userId = updateNotesEnabled[0];
          const notesWidgetId = updateNotesEnabled[1];
          const widgetData = updateNotesData[2];

          expect(updateNotesData[0]).toBe(userId);
          expect(updateNotesData[1]).toBe(notesWidgetId);

          const enabled = updateNotesEnabled[2];

          tfacMgr.fetchUserProfile('some-id')
            .then((userProfile) => {
              expect(userId).toBe(userProfile.id);
            });
          expect(notesWidgetId).toBe('4262cc79-d192-4435-91bd-5fda9b6f7c08');
          expect(enabled).toBe(true);

          expect(widgetData).not.toBe(null);
          
          tfacMgr.fetchNotes('some-id')
            .then((notes) => {
              expect(notes.length).toBe(widgetData.notes.length);
              for(var index in notes) {
                expect(notes[index].content).toBe(
                  widgetData.notes[index].content);
                expect(notes[index].color).toBe(
                  widgetData.notes[index].color);
              }
            });
      });
  });

});
