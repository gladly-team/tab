import database from '../../database';
import array from 'lodash/array';

import { 
  getUserWidget,
  updateWidgetData as updateUserWidgetData
} from '../userWidget/userWidget';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

import { logger } from '../../../utils/dev-tools';

/*
 * Helper Class to manage the BookmarkWidget.
 */
class BookmarkWidget {

  /**
   * Creates a BookmarkWidget instance from the userId and the 
   * widgetId.
   * @param {string} userId - The user id.
   * @param {string} widgetId - The widget id.
   */
  constructor(userId, widgetId, widget) {
    this.widget = widget;
    this.userId = userId;
    this.widgetId = widgetId;
    this.bookmarks = widget.data.bookmarks || [];

    /**
    * Updates the bookmarks of the current UserWidget.
    * @return {Promise<UserWidget>}  Returns the UserWidget with 
    * the updated data.
    */
    this.updateWidgetData = Async (function() {
        const data = {
          bookmarks: this.bookmarks,
        };

        const userWidget = Await (updateUserWidgetData(
          this.userId, 
          this.widgetId, 
          data));

        this.widget = userWidget;
        return userWidget;
    });

    /**
    * Updates the position of a bookmark.
    * @param {int} oldPos - The bookmark's old position. 
    * @param {int} newPos - The bookmark's new position. 
    * @return {Promise<UserWidget>}  Returns a UserWidget with the updated data.
    */
    this.updateBookmarkPosition = Async (function(oldPos, newPos) {
        const bookmark = this.getBookmark(oldPos);

        if(!bookmark)
          return this.widget;

        array.pullAt(this.bookmarks, oldPos);

        if(newPos >= 0 && newPos < this.bookmarks.length){
          this.bookmarks.splice(newPos, 0, bookmark);
        } else {
          this.bookmarks.push(bookmark);
        }

        return Await (this.updateWidgetData());
    });

    /**
    * Adds a new bookmark.
    * @param {string} name - The bookmark's name. 
    * @param {string} link - The bookmark's link. 
    * @return {Promise<UserWidget>}  Returns a UserWidget with the updated data.
    */
    this.addBookmark = Async (function(name, link) {
        const bookmark = {
          name: name,
          link: link
        };

        this.bookmarks.push(bookmark);
        
        return Await (this.updateWidgetData());
    });

    /**
    * Deletes a bookmark at a given position.
    * @param {int} position - The bookmark's position.
    * @return {Promise<UserWidget>}  Returns a UserWidget with the updated data.
    */
    this.deleteBookmark = Async (function(position) {
        if(position >= 0 && position < this.bookmarks.length){
          array.pullAt(this.bookmarks, position);
          return Await (this.updateWidgetData());
        } 

        return this.widget;
    });
  }

  /**
  * Gets a bookmark by position from the bookmarks list.
  * @param {int} position - The bookmark's position. 
  * @return {Object<UserWidget> | null}  Returns the bookmark
  * at position or null if position is out of range.
  */
  getBookmark(position) {
    if(position >= 0 && 
       position < this.bookmarks.length){
      return this.bookmarks[position]
    }

    return null;
  
  }
}

/**
* Gets the userWidget from the user and widget ids.
* Builds and return a BookmarkWidgetManager instance with the 
* fetched widget.
* @param {string} userId - The user id.
* @param {string} widgetId - The widget id.
* @return {Object<BookmarkWidget>}  Returns a BookmarkWidget instance.
*/
var getBookmarkWidgetManager =  Async (function(userId, widgetId) {
  const userWidget = Await (getUserWidget(userId, widgetId));
  return new BookmarkWidget(userId, widgetId, userWidget);
});


/**
* Updates the position of a bookmark.
* @param {string} userId - The user id.
* @param {string} widgetId - The widget id.
* @param {int} oldPos - The bookmark's old position. 
* @param {int} newPos - The bookmark's new position. 
* @return {Object<UserWidget>}  Returns a UserWidget with the updated data.
*/
var updateBookmarkPosition =  Async (function(userId, 
  widgetId, oldPos, newPos) {
  const manager = Await (getBookmarkWidgetManager(userId, widgetId));
  return Await (manager.updateBookmarkPosition(oldPos, newPos));
});

/**
* Adds a new bookmark.
* @param {string} userId - The user id.
* @param {string} widgetId - The widget id.
* @param {string} name - The bookmark's name. 
* @param {string} link - The bookmark's link. 
* @return {Object<UserWidget>}  Returns a UserWidget with the updated data.
*/
var addBookmark =  Async (function(userId, widgetId, name, link) {
  const manager = Await (getBookmarkWidgetManager(userId, widgetId));
  return Await (manager.addBookmark(name, link));
});

/**
* Deletes a bookmark at a given position.
* @param {string} userId - The user id.
* @param {string} widgetId - The widget id.
* @param {int} position - The bookmark's position.
* @return {Object<UserWidget>}  Returns a UserWidget with the updated data.
*/
var deleteBookmark =  Async (function(userId, widgetId, position) {
  const manager = Await (getBookmarkWidgetManager(userId, widgetId));
  return Await (manager.deleteBookmark(position));
});

export {
  BookmarkWidget,
  getBookmarkWidgetManager,
  updateBookmarkPosition,
  addBookmark,
  deleteBookmark
};


