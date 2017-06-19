import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import WidgetSharedSpace from 'general/WidgetSharedSpace';
import BookmarkChip from './BookmarkChip';
import AddBookmarkForm from './AddBookmarkForm';

import AddBookmarkMutation from 'mutations/AddBookmarkMutation';
import RemoveBookmarkMutation from 'mutations/RemoveBookmarkMutation';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';

import appTheme from 'theme/default';

class BookmarksWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    }
  }

  componentWillUnmount() {
  }

  getFavicon(link) {
    return "https://www.google.com/s2/favicons?domain_url=" + encodeURI(link);
  }

  addBookmark(name, link) {
    const { widget } = this.props; 
    AddBookmarkMutation.commit(
      this.props.relay.environment,
      this.props.user,
      widget,
      name,
      link
    );
  }

  removeBookmark(position) {
    const { widget } = this.props; 
      
    RemoveBookmarkMutation.commit(
      this.props.relay.environment,
      this.props.user,
      widget,
      position
    );
  }

  onToggleEditMode() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  render() {
    const { widget } = this.props; 

    const data = JSON.parse(widget.data);
    const bookmarks = data.bookmarks || [];

    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible',
    }

    const wrapper = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    };

    const container = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '70vh',
    };

    const bookmarksContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27,
    }

    return (<WidgetSharedSpace
              containerStyle={sharedSpaceStyle}>
              <div style={bookmarksContainer}>
                 <AddBookmarkForm
                  addBookmark={this.addBookmark.bind(this)}
                  onEditModeClicked={this.onToggleEditMode.bind(this)}/>
                 <div style={container}>
                     <div style={wrapper}>
                        {
                          bookmarks.map((bookmark, index) => {
                            return (<BookmarkChip
                                      key={index}
                                      index={index}
                                      editMode={this.state.editMode}
                                      bookmark={bookmark}
                                      removeChip={this.removeBookmark.bind(this, index)}/>
                            );
                          })
                        }
                    </div>
                 </div>
            </div>
          <Snackbar
            open={this.state.editMode}
            message="Click on a bookmark while in edit mode to delete it."/>
          </WidgetSharedSpace>);
  }
}

BookmarksWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired,
};

export default BookmarksWidget;
