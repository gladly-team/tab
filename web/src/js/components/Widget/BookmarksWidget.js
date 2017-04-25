import React from 'react';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';

import {
  grey300,
} from 'material-ui/styles/colors';

class BookmarksWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
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

  render() {
    const { widget } = this.props; 

    const data = JSON.parse(widget.data);
    const bookmarks = data.bookmarks;

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
              <Menu>
                <Subheader>Bookmarks</Subheader>
                {
                  bookmarks.map((bookmark) => {
                    return (<MenuItem 
                              key={bookmark.id}
                              onClick={this.openLink.bind(this, bookmark.link)}
                              primaryText={bookmark.display}
                              leftIcon={
                                (<img 
                                  style={{width: 16, height: 16, top: 4}}
                                  src={this.getFavicon(bookmark.link)} />)
                              }/>);
                  })
                }
              </Menu>
          </Popover>
        </div>);
  }
}

BookmarksWidget.propTypes = {
  widget: React.PropTypes.object.isRequired
};

export default BookmarksWidget;
