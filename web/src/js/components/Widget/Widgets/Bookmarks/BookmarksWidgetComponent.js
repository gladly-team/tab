import React from 'react';

import AddBookmarkMutation from 'mutations/AddBookmarkMutation';
import RemoveBookmarkMutation from 'mutations/RemoveBookmarkMutation';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {
  grey300,
} from 'material-ui/styles/colors';

class BookmarksWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      addForm: false,
    };
  }

  handleRequestOpen(event) {

    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
      addForm: false,
    });
  }

  openLink(link) {
    window.open(link); 
    this.setState({
      open: false,
    });
  }

  getFavicon(link) {
    return "https://www.google.com/s2/favicons?domain_url=" + encodeURI(link);
  }

  addBookmark() {
    const { widget } = this.props; 

    const name = this.bName.input.value;
    const link = this.bLink.input.value;

    if(!name || !link)
      return;

    this._addBookmark(widget, name, link);
    this.bName.input.value = '';
    this.bLink.input.value = '';
  }

  _addBookmark(widget, name, link) {
    AddBookmarkMutation.commit(
      this.props.relay.environment,
      this.props.user,
      widget,
      name,
      link
    );
  }

  removeBookmark(position, event) {
    // This prevents ghost click.
    event.stopPropagation();

    const { widget } = this.props; 
      
    RemoveBookmarkMutation.commit(
      this.props.relay.environment,
      this.props.user,
      widget,
      position
    );
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.addBookmark();
    }
  }

  toggleAddBookmarkForm() {
    if(this.bName && this.bLink) {
      this.bName.input.value = '';
      this.bLink.input.value = '';
    }

    this.setState({
      addForm: !this.state.addForm
    });

  }

  render() {
    const { widget } = this.props; 

    const data = JSON.parse(widget.data);
    const bookmarks = data.bookmarks;

    const addBookmarkContainer = {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
    }

    const addBookmarkToggler = {
      position: 'absolute',
      right: 5,
    }

    const togglerIconColor = 'rgba(0, 0, 0, 0.541176)';
    const togglerIcon = {
      fontSize: 14,
    };

    var addBookmarkForm;
    var togglerIconClass = 'fa fa-plus';
    if(this.state.addForm){
        togglerIconClass = 'fa fa-minus';
        addBookmarkForm = (
          <div style={addBookmarkContainer}>
              <TextField
                ref={(input) => { this.bName = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                hintText="Ex: Google"
                floatingLabelText="Name"/>

              <TextField
                ref={(input) => { this.bLink = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                hintText="Ex: https://www.google.com/"
                floatingLabelText="Link"/>
          </div>
        );
    }

    return (
        <div>
          <IconButton 
              tooltip={widget.name}
              onClick={this.handleRequestOpen.bind(this)}>
                <FontIcon
                  color={grey300}
                  hoverColor={'#FFF'}
                  className="fa fa-bookmark-o"/>
          </IconButton>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}>
              {addBookmarkForm}
              <List>
                <Subheader>Bookmarks
                  <IconButton 
                      style={addBookmarkToggler}
                      onClick={this.toggleAddBookmarkForm.bind(this)}>
                        <FontIcon
                          style={togglerIcon}
                          color={togglerIconColor}
                          hoverColor={'#000'}
                          className={togglerIconClass}/>
                  </IconButton>
                </Subheader>
                
                {
                  bookmarks.map((bookmark, index) => {
                    return (<ListItem 
                              key={index}
                              onClick={this.openLink.bind(this, bookmark.link)}
                              primaryText={bookmark.name}
                              rightIconButton={
                                (<IconButton
                                    onClick={this.removeBookmark.bind(this, index)}>
                                      <FontIcon
                                        color={grey300}
                                        hoverColor={'#000'}
                                        className="fa fa-times"/>
                                </IconButton>)
                              }
                              leftIcon={
                                (<img 
                                  style={{width: 16, height: 16, top: 4}}
                                  src={this.getFavicon(bookmark.link)} />)
                              }/>);
                  })
                }
              </List>
          </Popover>
        </div>);
  }
}

BookmarksWidget.propTypes = {
  widget: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default BookmarksWidget;
