
const mockBookmarks = [
	{
		name: "Google",
		link: "https://www.google.com/" 
	},
	{
		name: "Netflix",
		link: "https://www.netflix.com/" 
	},
	{
		name: "Beyond the Summit",
		link: "https://www.twitch.tv/beyondthesummit" 
	},
    {
        name: "Hulu",
        link: "https://www.hulu.com/" 
    },
    {
        name: "CNN",
        link: "https://www.cnn.com/" 
    }
];

jest.mock('../../userWidget/userWidget', () => {
	return {
		getUserWidget: jest.fn((userId, widgetId) => {
			return Promise.resolve({
				userId: userId,
				widgetId: widgetId,
				enabled: true,
				data: { bookmarks: mockBookmarks.concat([])}
			});
		}),

		updateWidgetData: jest.fn((userId, widgetId, data) => {
			return Promise.resolve({
				userId: userId,
				widgetId: widgetId,
				enabled: true,
				data: data
			});
		})
	};
});

import { 
	BookmarkWidget, 
	getBookmarkWidgetManager,
	updateBookmarkPosition,
	addBookmark,
	deleteBookmark 
} from '../bookmarkWidget';

function expectBookmarksToBeEqual(bookmark1, bookmark2){
	expect(bookmark1.name).toBe(bookmark2.name);
	expect(bookmark1.link).toBe(bookmark2.link);
}

function expectListOfBookmarksToBeEqual(listBookmark1, listBookmark2){
	expect(listBookmark1.length).toBe(listBookmark2.length);
	for(var index in listBookmark1){
		expectBookmarksToBeEqual(
			listBookmark1[index], listBookmark2[index]);
	}
}

test('init bookmarkWidget manager', () => {

	const userId = 'userId';
	const widgetId = 'widgetId';

	return getBookmarkWidgetManager(userId, widgetId)
			    .then(manager => {
			        expect(manager.userId).toBe(userId);
					expect(manager.widgetId).toBe(widgetId);

					for(var index in manager.bookmarks) {

						expect(manager.bookmarks[index].name)
							.toBe(mockBookmarks[index].name);

						expect(manager.bookmarks[index].link)
							.toBe(mockBookmarks[index].link);
					}
			    });
});

test('update bookmark position', () => {
	
	const userId = 'userId';
	const widgetId = 'widgetId';

	const oldPos = 3; // Hulu
	const newPos = 1; // Netflix

	return updateBookmarkPosition(userId, widgetId, oldPos, newPos)
			    .then(userWidget => {
			    	
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(mockBookmarks.length);

			    	const updatedBookmark = userWidget.data.bookmarks[newPos];
			    	const expectedBookmark = mockBookmarks[oldPos];
			    	expectBookmarksToBeEqual(updatedBookmark,
			    		expectedBookmark);
			    });
});

test('update bookmark position - update to the begining of the list', () => {
	
	const userId = 'userId';
	const widgetId = 'widgetId';

	const oldPos = 3; // Hulu
	const newPos = 0;

	return updateBookmarkPosition(userId, widgetId, oldPos, newPos)
			    .then(userWidget => {
			    	
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(mockBookmarks.length);

			    	const updatedBookmark = userWidget.data.bookmarks[newPos];
			    	const expectedBookmark = mockBookmarks[oldPos];
			    	expectBookmarksToBeEqual(updatedBookmark,
			    		expectedBookmark);
			    });
});

test('update bookmark position - update to the end of the list', () => {
	
	const userId = 'userId';
	const widgetId = 'widgetId';

	const oldPos = 0; // Google
	const newPos = mockBookmarks.length - 1;

	return updateBookmarkPosition(userId, widgetId, oldPos, newPos)
			    .then(userWidget => {
			    	
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(mockBookmarks.length);

			    	const updatedBookmark = userWidget.data.bookmarks[newPos];
			    	const expectedBookmark = mockBookmarks[oldPos];
			    	expectBookmarksToBeEqual(updatedBookmark,
			    		expectedBookmark);
			    });
});

test('update bookmark position - wrong position should add at the end', () => {
	
	const userId = 'userId';
	const widgetId = 'widgetId';

	const oldPos = 2; // Hulu
	const newPos = mockBookmarks.length; // last position

	return updateBookmarkPosition(userId, widgetId, oldPos, newPos)
			    .then(userWidget => {
			    	
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(mockBookmarks.length);

			    	const expectedPosition = mockBookmarks.length - 1;
			    	const updatedBookmark = userWidget.data.bookmarks[expectedPosition];
			    	const expectedBookmark = mockBookmarks[oldPos];
			    	expectBookmarksToBeEqual(updatedBookmark,
			    		expectedBookmark);
			    });
});

test('add bookmark', () => {
	const userId = 'userId';
	const widgetId = 'widgetId';

	const name = 'TFAC';
	const link = 'https://www.tab.com/';

	return addBookmark(userId, widgetId, name, link)
			    .then(userWidget => {
			    	
			    	const expectedLength = mockBookmarks.length + 1;
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(expectedLength);

			    	const newBookmark = userWidget.data.bookmarks[expectedLength - 1];
			    	
			    	expect(newBookmark.name).toBe(name);
			    	expect(newBookmark.link).toBe(link);
			    });
});

test('delete bookmark', () => {
	const userId = 'userId';
	const widgetId = 'widgetId';

	const position = 3;

	return deleteBookmark(userId, widgetId, position)
			    .then(userWidget => {
			    	
			    	const expectedLength = mockBookmarks.length - 1;
			    	expect(userWidget.data.bookmarks.length)
			    			.toBe(expectedLength);

			    	const deletedBookmark = mockBookmarks[position];

			    	for(var index in userWidget.data.bookmarks) {
			    		expect(userWidget.data.bookmarks[index].name)
			    				.not.toBe(deletedBookmark.name);
			    		expect(userWidget.data.bookmarks[index].link)
			    				.not.toBe(deletedBookmark.link);
			    	}
			    });
});

test('delete bookmark - position out of range should return the original widget', () => {
	const userId = 'userId';
	const widgetId = 'widgetId';

	const position = mockBookmarks.length;

	return deleteBookmark(userId, widgetId, position)
			    .then(userWidget => {
			    	expectListOfBookmarksToBeEqual(
			    		userWidget.data.bookmarks,
			    		mockBookmarks);
			    });
});
