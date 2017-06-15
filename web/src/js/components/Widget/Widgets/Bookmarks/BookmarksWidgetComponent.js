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

import appTheme from 'theme/default';

class BookmarksWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    this.setState({
      open: this.props.widget.visible,
    });
  }

  toggleWidgetContent() {
    const open = !this.state.open;

    this.setState({
      open: open,
    });

    this.props.widgetVisibilityChanged(
      this.props.user, this.props.widget, open);
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

  render() {
    const { widget } = this.props; 

    const data = JSON.parse(widget.data);
    const bookmarks = data.bookmarks || [];

    const wrapper = {
      display: 'flex',
      flexWrap: 'wrap',
    }

    var widgetContent;
    if(this.state.open){
      widgetContent = (
          <WidgetSharedSpace>
            <AddBookmarkForm
              addBookmark={this.addBookmark.bind(this)}/>
            <div style={wrapper}>
              {
                bookmarks.map((bookmark, index) => {
                  return (<BookmarkChip
                            key={index}
                            index={index}
                            bookmark={bookmark}
                            removeChip={this.removeBookmark.bind(this, index)}/>
                  );
                })
              }
            </div>
          </WidgetSharedSpace>
      );
    }

    return (
        <div>
          <IconButton 
              onClick={this.toggleWidgetContent.bind(this)}>
                <FontIcon
                  color={appTheme.fontIcon.color}
                  hoverColor={appTheme.fontIcon.hoverColor}
                  className="fa fa-bookmark-o"/>
          </IconButton>
          {widgetContent}
        </div>);
  }
}

BookmarksWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired,
};

export default BookmarksWidget;
