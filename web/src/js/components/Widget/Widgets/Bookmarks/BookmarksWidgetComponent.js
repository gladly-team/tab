import React from 'react';
import ReactDOM from 'react-dom';

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

  componentDidMount() {
    this.setState({
      open: this.props.widget.visible,
      anchorEl: ReactDOM.findDOMNode(this.bIcon),
    });
  }

  handleRequestOpen(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, true);
  }

  handleRequestClose() {
    this.setState({
      open: false,
      addForm: false,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, false);
  }

  openLink(link) {
    window.open(link, '_self'); 
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
    console.log(widget);
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

    const popoverStyle = {
      backgroundColor: 'rgba(0,0,0,.54)',
    }

    const addBookmarkContainer = {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
    }

    const addBookmarkToggler = {
      position: 'absolute',
      right: 5,
    }

    const bookmarkListItemStyle = {
      color: '#FFF',
    }

    const togglerIcon = {
      fontSize: 14,
    };

    const header = {
      color: '#FFF',
    }

    const floatingLabelStyle = {
      color: '#FFF',
    }

    const floatingLabelFocusStyle = {
      color: '#FFF',
    }

    const underlineStyle = {
      borderColor: 'transparent',
    }

    const underlineFocusStyle = {
      borderColor: '#FFF',
    }

    const addBookmarkTextField = {
      color: '#FFF',
    }

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
                floatingLabelText="Name"
                inputStyle={addBookmarkTextField}
                hintStyle={floatingLabelFocusStyle}
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFocusStyle={floatingLabelFocusStyle}
                underlineStyle={underlineStyle}
                underlineFocusStyle={underlineFocusStyle}/>

              <TextField
                ref={(input) => { this.bLink = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                hintText="Ex: https://www.google.com/"
                floatingLabelText="Link"
                inputStyle={addBookmarkTextField}
                hintStyle={floatingLabelFocusStyle}
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFocusStyle={floatingLabelFocusStyle}
                underlineStyle={underlineStyle}
                underlineFocusStyle={underlineFocusStyle}/>
          </div>
        );
    }

    return (
        <div>
          <IconButton 
              ref={(bIcon) => { this.bIcon = bIcon; }}
              tooltip={widget.name}
              onClick={this.handleRequestOpen.bind(this)}>
                <FontIcon
                  color={grey300}
                  hoverColor={'#FFF'}
                  className="fa fa-bookmark-o"/>
          </IconButton>
          <Popover
            style={popoverStyle}
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}>
              {addBookmarkForm}
              <List>
                <Subheader style={header}>Bookmarks
                  <IconButton 
                      style={addBookmarkToggler}
                      onClick={this.toggleAddBookmarkForm.bind(this)}>
                        <FontIcon
                          style={togglerIcon}
                          color={grey300}
                          hoverColor={'#FFF'}
                          className={togglerIconClass}/>
                  </IconButton>
                </Subheader>
                
                {
                  bookmarks.map((bookmark, index) => {
                    return (<ListItem 
                              key={index}
                              style={bookmarkListItemStyle}
                              onClick={this.openLink.bind(this, bookmark.link)}
                              primaryText={bookmark.name}
                              rightIconButton={
                                (<IconButton
                                    onClick={this.removeBookmark.bind(this, index)}>
                                      <FontIcon
                                        color={grey300}
                                        hoverColor={'#FFF'}
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
  popoverWidgetVisibilityChanged: React.PropTypes.func.isRequired,
};

export default BookmarksWidget;
